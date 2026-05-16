# Phase 5 - Customer-Artisan Messaging & Pre-Booking Consultation

**Phase reference:** Frontend Phase 5  
**Scope:** Direct messaging between customers and artisans before booking creation  
**Goal:** Allow customers to chat with artisans about price, availability, and job requirements before committing to a booking

---

## Overview

Currently, the booking flow is:
1. Customer finds provider via search
2. Customer creates booking immediately
3. System auto-generates quotation
4. Provider reviews and negotiates

**Desired Phase 5 flow:**
1. Customer finds provider via search
2. **Customer opens chat** with provider
3. **Customer and provider chat** about job, price, timing
4. **Customer confirms and creates booking** after agreement
5. System generates quotation
6. Provider reviews and negotiates

This phase adds a **consultation layer** before booking commitment.

---

## User Stories

### Customer Perspective
- **Browse artisan profile** → See "Message" button alongside "Book Now"
- **Open message thread** → See conversation history (if any)
- **Type and send messages** → Real-time or near-real-time delivery
- **Receive artisan responses** → Notifications for new messages
- **Attach location/photos** → Show job site photos or describe job location
- **Confirm and book** → Create booking from within chat interface

### Artisan Perspective
- **Receive incoming messages** → Notifications in provider dashboard
- **Open message thread** → See customer profile and conversation
- **Type and send responses** → Real-time or near-real-time delivery
- **Share price estimate** → Can give preliminary price before quotation
- **Confirm availability** → Can specify when they're available
- **See booking confirmation** → When customer creates booking from chat

---

## Technical Architecture

### Database Schema Additions

**New table: `Message`**
```sql
CREATE TABLE "Message" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Thread linking
  threadId UUID NOT NULL REFERENCES "MessageThread"(id),
  
  -- Sender info
  senderId UUID NOT NULL REFERENCES "User"(id),
  senderRole "UserRole" NOT NULL,
  senderName STRING NOT NULL,
  
  -- Content
  messageText TEXT NOT NULL,
  messageType ENUM('TEXT', 'IMAGE', 'LOCATION', 'PRICE_ESTIMATE') DEFAULT 'TEXT',
  
  -- Metadata
  isRead BOOLEAN DEFAULT false,
  readAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  -- Reactions
  reactions JSON, -- { emoji: count }
  
  INDEX threadId (threadId),
  INDEX senderId (senderId),
  INDEX createdAt (createdAt)
);

CREATE TABLE "MessageThread" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Participants
  customerId UUID NOT NULL REFERENCES "User"(id),
  artisanId UUID NOT NULL REFERENCES "User"(id),
  
  -- Status
  status ENUM('ACTIVE', 'ARCHIVED', 'CONVERTED_TO_BOOKING') DEFAULT 'ACTIVE',
  
  -- Last message info
  lastMessageAt TIMESTAMP,
  lastMessagePreview STRING(200),
  
  -- Associated booking (if created from chat)
  bookingId UUID REFERENCES "Booking"(id),
  
  -- Metadata
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(customerId, artisanId),
  INDEX customerId (customerId),
  INDEX artisanId (artisanId),
  INDEX lastMessageAt (lastMessageAt)
);
```

**Extend: `User` table**
- Add `lastSeenMessageThreadId` (for priority in inbox)
- Add `mutedThreadIds` (user has muted notifications)

**Extend: `Booking` table**
- Add `originatedFromThreadId` (link back to message thread)

---

## API Endpoints

### Message Endpoints

```
POST /api/messages/threads
  Create a new message thread with an artisan
  Body: { recipientId, initialMessage? }
  Returns: { thread }

GET /api/messages/threads
  List all message threads for logged-in user
  Query: { limit: 20, offset: 0, archived: false }
  Returns: { threads[], totalCount }

GET /api/messages/threads/:threadId
  Get single thread with pagination of messages
  Query: { limit: 50, cursor: "messageId" }
  Returns: { thread, messages[], nextCursor?, prevCursor? }

POST /api/messages/threads/:threadId/messages
  Send a message in a thread
  Body: { text, type: 'TEXT'|'IMAGE'|'LOCATION'|'PRICE_ESTIMATE', metadata? }
  Returns: { message }

PATCH /api/messages/threads/:threadId/messages/:messageId
  Edit or delete a message (owner only)
  Body: { action: 'edit'|'delete', text? }
  Returns: { message }

POST /api/messages/threads/:threadId/markAsRead
  Mark all messages in thread as read
  Returns: { success }

POST /api/messages/threads/:threadId/convertToBooking
  Create a booking from the message thread
  Body: { serviceId, scheduledAt, jobAddress, notes? }
  Returns: { booking, thread updated with bookingId }

POST /api/messages/threads/:threadId/mute
  Mute notifications for thread
  Returns: { thread }
```

---

## Frontend Pages & Components

### New Pages

**`/messages` (Inbox)**
```
- List of message threads
- Thread cards showing:
  - Artisan/customer avatar
  - Last message preview (50 chars)
  - Timestamp ("2 hours ago")
  - Unread indicator (blue dot)
  - Search threads by name
- Mobile: Full-screen list
- Desktop: Split view (threads on left, selected thread on right)
```

**`/messages/[threadId]` (Thread Detail)**
```
- Message list (infinite scroll or pagination)
- Input box at bottom with "Send" button
- Artisan profile card at top (if customer)
  - Name, photo, rating, current tier
  - Quick links: "View profile", "Book now"
- Customer profile card at top (if artisan)
  - Name, photo, location, history with this artisan
- Action buttons:
  - Create booking (customer only, disabled if booking already exists)
  - Mute/archive thread
  - Report/block user
```

### New Components

**`<MessageThread />`**
```tsx
props: {
  thread: MessageThread,
  messages: Message[],
  onSendMessage: (text, type) => Promise,
  isLoading: boolean
}
```

**`<MessageCard />`**
```tsx
props: {
  message: Message,
  isSender: boolean,
  showAvatar: boolean
}
```

**`<MessageInput />`**
```tsx
props: {
  onSend: (text) => Promise,
  isLoading: boolean,
  canAttachImages: boolean
}
```

**`<ConversationHeader />`**
```tsx
props: {
  thread: MessageThread,
  userRole: 'CUSTOMER' | 'PROVIDER'
}
```

### Updated Components

**`<ProviderCard />` (in search results)**
- Add "Message" button alongside "Book Now"
- When clicked: Create thread and navigate to `/messages/[threadId]`

**`<BookingCard />` (in bookings list)**
- Add "Message artisan" link for active bookings
- Link to message thread associated with booking

**`/customer/bookings/[id]`** (Booking detail)
- Add "Message provider" sticky button at bottom
- Shows unread message count

**Navigation**
- Add Messages icon to bottom nav
- Show unread count badge

---

## Polling vs. WebSocket Decision

For Phase 5 MVP, use **polling** (same as Phase 3.5 quotation messages):

**Polling Strategy:**
- Poll thread every 2 seconds when page is active
- Use React Query with `refetchInterval: 2000`
- Deduplicate with `staleTime: 1000` (messages stay fresh for 1 sec)
- Stop polling when user leaves thread
- Mark messages as read automatically when visible in viewport

**Post-MVP (Phase 6):**
- Upgrade to WebSocket for real-time delivery
- Use Socket.io or raw WebSocket
- Keep polling as fallback for network issues

---

## Message Types & Metadata

### TEXT
```json
{
  "type": "TEXT",
  "text": "What's your earliest availability?"
}
```

### LOCATION
```json
{
  "type": "LOCATION",
  "metadata": {
    "address": "14 Admiralty Way, Lekki Phase 1, Lagos",
    "lat": 6.4550,
    "lng": 3.4697,
    "description": "Apartment complex, Ring the bell at main gate"
  }
}
```

### IMAGE
```json
{
  "type": "IMAGE",
  "metadata": {
    "url": "https://cdn.hajo.ng/messages/img-12345.jpg",
    "caption": "The broken pipe we need fixed"
  }
}
```

### PRICE_ESTIMATE
```json
{
  "type": "PRICE_ESTIMATE",
  "metadata": {
    "estimatedPrice": 18000,
    "description": "Based on your description, I'd estimate around ₦18,000 for materials + labour. But I'll need to see the damage in person."
  }
}
```

---

## Notification Strategy

### Browser Notifications
- When artisan receives message from new customer: Show browser notification
- When customer receives message from artisan: Show browser notification
- Allow user to mute notifications for specific thread

### In-App Toast
- "New message from Moshood" (swipe to open)
- Shows message preview

### Badge Count
- Messages icon shows unread count
- Thread shows unread indicator

---

## Moderation & Safety

### Automated Detection
- Detect inappropriate language
- Block phone numbers / external links from message text
- Flag prices outside provider's service range

### User Actions
- Block/report user option on thread
- Artisan can block customers
- Customer can block artisans
- Once blocked: Thread hidden, messages not sent to blocked user

---

## Phase 5 Implementation Phases

| Phase | Name | Effort | Files |
|-------|------|--------|-------|
| A | Database migrations | 1h | `backend/prisma/migrations/add-messages.sql` |
| B | Message API endpoints | 2h | `backend/routes/messages.routes.js`, `backend/modules/messages/messages.service.js` |
| C | Message polling service | 1h | `frontend/app/services/messages.api.ts`, `frontend/app/hooks/useMessages.ts` |
| D | Inbox page | 1.5h | `frontend/app/(dashboard)/messages/page.tsx` |
| E | Thread detail page | 2h | `frontend/app/(dashboard)/messages/[threadId]/page.tsx` |
| F | Message components | 1.5h | `MessageCard.tsx`, `MessageInput.tsx`, `ConversationHeader.tsx` |
| G | Integrate with existing pages | 1h | Update search, booking cards, navigation |
| H | Notifications & badge | 1h | Real-time unread count |
| I | Tests & validation | 1.5h | Unit + integration tests |

**Total effort:** ~12 hours  
**Dependencies:** Phase 3.5 must be complete (auth, user roles, notifications infrastructure)

---

## Key Design Principles

1. **Opt-in:** Users choose to message; no forced messaging
2. **Privacy:** Phone numbers/emails never shown until off-platform
3. **Safety:** Moderation tools for both parties
4. **Simplicity:** Messages are plain text + optional media
5. **Performance:** Polling keeps it lightweight; no server complexity
6. **Mobile-first:** Thread list and detail must work seamlessly on phones

---

## Demo Flow (After Phase 5)

1. Customer searches and finds Moshood
2. **Customer taps "Message"** (new button)
3. Message thread opens with empty chat
4. Customer: *"Hi, can you fix my kitchen pipe? How much would it cost?"*
5. Moshood (on his phone): *Receives notification, opens thread*
6. Moshood: *"Yes, I can help. Can you send me a photo or location?"*
7. Customer: *Shares location and photo of broken pipe*
8. Moshood: *"Looks like a standard replacement. Around ₦18,000 for materials and labour. Are you available tomorrow morning?"*
9. Customer: *"Perfect! Yes, 9 AM works. Let me create a booking."*
10. Customer: *Taps "Create Booking" button within thread*
11. Booking created → System auto-generates quotation based on their discussion
12. Moshood sees quotation review notification
13. Moshood: *Reviews, minor adjustment to price (₦17,500), approves and sends*
14. Customer: *Accepts and pays from wallet*
15. Booking moves to ACCEPTED status

**Total flow time:** 5-10 minutes instead of current 1-2 minutes, but with **much higher confidence** on both sides.

---

**Next Phase:** Phase 6 - WebSocket Real-time & Advanced Features (typing indicators, reactions, typing awareness)
