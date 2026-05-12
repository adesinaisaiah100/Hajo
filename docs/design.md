Design System & UI/UX Specification — Hajo

This is the deep, component-level Frontend Engineering UI/UX Specification for Hajo.

---

## 1. Global Layout Architecture (Next.js App Router)

The application is structurally divided into three distinct layout zones, managed by Next.js nested layouts (`layout.tsx`).

### A. Marketing Layout (`(marketing)/layout.tsx`)

* **Anatomy:** Sticky header (72px height, glassmorphism `backdrop-blur-md bg-white/80`), full-width main content area, fat footer (400px height).
* **Behavior:** Header border-bottom fades in only when `scrollY > 0`.
* **Z-Index:** Header sits at `z-50` to ensure it overlays all page content.

### B. Auth Layout (`(auth)/layout.tsx`)

* **Anatomy:** 100vh / 100vw container. `bg-gray-50`.
* **Content Placement:** Absolute center using `flex items-center justify-center`.
* **Card Specifications:** Max-width of `420px`. The card itself has `shadow-xl`, `rounded-2xl`, and padding of `p-8` (32px).

### C. Application Dashboard Layout (`(dashboard)/layout.tsx`)

This is the core engine for both Providers and Customers. It uses a CSS Grid architecture to freeze navigation and allow independent scrolling.

* **Structure:** `grid grid-cols-[240px_1fr] h-screen overflow-hidden bg-gray-50` (Desktop).
* **Zone 1: Left Sidebar (Global Nav)**
* **Width:** Fixed at `240px`.
* **Behavior:** Sticky, non-scrolling. Border-right `border-gray-200`.
* **Anatomy:**
* *Top (0-72px):* Brand Logo & Environment Badge (e.g., "Hajo MVP").
* *Middle (Scrollable):* Navigation links. `gap-1` flexbox. Active links get `bg-gray-100 text-gray-900 font-medium`. Inactive links get `text-gray-500 hover:bg-gray-50 hover:text-gray-900`.
* *Bottom (Fixed):* User Profile Mini-card. Avatar, Name, Role, and a `<MoreVertical>` Lucide icon to trigger a popover for Account/Logout.




* **Zone 2: Main Content Area**
* **Structure:** `flex flex-col h-full overflow-hidden`.
* **Sub-Zone 2A: Topbar (Context Nav)**
* **Height:** Fixed at `64px`. Border-bottom `border-gray-200`. `bg-white`.
* **Anatomy:**
* *Left:* Breadcrumbs (e.g., `Home / Bookings / #BK-1029`).
* *Right:* Global Action row. "CMD+K" search trigger button, Notification Bell (with absolute positioned `w-2 h-2 bg-red-500 rounded-full` indicator), and a primary "+" Quick Action button (e.g., "New Booking" or "New Service").



* **Sub-Zone 2B: Scrollable Canvas**
* **Behavior:** `overflow-y-auto p-8`.
* **Constraints:** Content wrapper has a `max-w-7xl mx-auto` to prevent data stretching on ultrawide monitors.




### D. Right Panel / Contextual Drawer (Slide-Over)

* **Use Case:** Viewing Booking Details or Editing a Service *without* navigating away from the list view.
* **Anatomy:** Fixed position `right-0 top-0 h-screen w-[400px]`. `bg-white shadow-2xl`.
* **Animation:** `transform translate-x-full` default, transitions to `translate-x-0` via Framer Motion.
* **Overlay:** `bg-gray-900/20 backdrop-blur-sm` overlay sitting at `z-40`, panel at `z-50`.

---

## 2. Deep Component Anatomy

Here is the exact structural breakdown of the platform's core functional UI elements.

### A. The `ProviderCard` (Customer Search Results)

* **Wrapper:** `<article className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">`
* **Top Section (Image & Badge):**
* Height: `120px` container. Image uses `object-cover`.
* Absolute positioned `Escrow/Verified Badge` at `top-3 right-3` (padding 4px 8px, text 12px, glassmorphism background).


* **Body (p-4):**
* `h3` Provider Name (18px, semibold, text-gray-900).
* `<p>` Trade Category (14px, text-gray-500) aligned inline with a visual dot `•` and Distance (`2.4km`).


* **Metrics Row (mt-3 flex items-center gap-4):**
* *Star Rating:* Yellow star icon + "4.8" (text-sm, font-medium) + "(124)" (text-gray-400).
* *Score Tier:* Dynamic colored dot (e.g., Gold) + "Gold Tier".


* **Footer (border-t border-gray-100 p-4 bg-gray-50):**
* Pricing range (`font-medium text-gray-900`) on the left.
* "Book Now" ghost button on the right.




### B. The `DataGrid` (Provider Dashboard Tables)

Instead of standard HTML tables, use a CSS Grid-based list for better mobile responsiveness.

* **Header Row:** `grid grid-cols-[2fr_1fr_1fr_100px] gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider`.
* **Data Row:** Same grid structure. `px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors`.
* **Cell Alignment:** Text left-aligned for data, right-aligned for currency (₦) and action menus.

### C. The `AI Insight Card` (Provider Insights)

* **Wrapper:** `bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-6 relative overflow-hidden`.
* **Iconography:** Background watermark of a Sparkle icon (Claude AI representation) positioned `absolute -right-4 -bottom-4 opacity-5 text-blue-500 w-32 h-32`.
* **Header:** Flex row. Small AI Sparkle icon + Title ("Pricing Opportunity").
* **Body:** `text-gray-600 text-sm leading-relaxed mt-2`.
* **Action:** Actionable text button with arrow `mt-4 text-blue-600 font-medium text-sm flex items-center hover:translate-x-1 transition-transform`.

---

## 3. Micro-Interactions & State Specifications

A high-end frontend feels alive. These states must be strictly enforced across all components.

### A. Focus States (Accessibility)

Never use default browser outlines.

* **Interactive Elements (Inputs, Buttons):** `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-transparent`.

### B. Loading States (TanStack Query integration)

* **Initial Load:** Use **Skeleton Loaders**, not spinners. Skeletons must exactly match the anatomy of the component they replace.
* *Class:* `animate-pulse bg-gray-200 rounded-md`.


* **Mutations (Submitting a form):** Disable the submit button (`opacity-50 cursor-not-allowed`). Replace button text with a `16x16px` SVG spinner + "Processing...".

### C. Empty States

Every list, table, or dashboard section must have a designed empty state.

* **Anatomy:** `flex flex-col items-center justify-center p-12 text-center`.
* **Visual:** A subtle, monochromatic illustration or large Lucide icon (`stroke-width-1`, text-gray-300, `w-16 h-16`).
* **Text:** `h3` heading ("No active bookings"), `<p>` descriptive text ("When you accept a job, it will appear here.").
* **Action:** Primary button to resolve the state ("Add your first service").

### D. Hover Kinetics

* **Cards:** `hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out`.
* **Buttons:** `hover:bg-gray-800` (for primary black buttons), `active:scale-[0.98]` (creates a satisfying physical press feeling).

---

## 4. Frontend Engineering Variables (Tailwind Setup)

These exact configurations must be added to `tailwind.config.js` to ensure the design system is mathematically sound.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Hajo Brand Tokens
        brand: {
          50: '#f0fdfa', // Surface highlights
          100: '#ccfbf1',
          500: '#14b8a6', // Primary Brand (Teal/Blue shift for trust)
          900: '#111827', // Deep Obsidian (Primary Text/Buttons)
        },
        // Escrow & Financial States
        escrow: {
          light: '#fef3c7',
          base: '#f59e0b', // Pending funds
        },
        tier: {
          bronze: '#CD7F32',
          silver: '#9CA3AF', // Mapped to Tailwind gray-400 for consistency
          gold: '#F59E0B',
          platinum: '#E5E4E2',
        }
      },
      boxShadow: {
        // Custom refined shadows (less blur, more architectural)
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'drawer': '-10px 0 15px -3px rgba(0, 0, 0, 0.1)',
      },
      fontSize: {
        // Enforcing strict leading (line-heights)
        'xs': ['0.75rem', { lineHeight: '1.125rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    }
  }
}
```

## 5. Forms & Input Data Layer Structure

Forms dictate the trust level of an application. Since Hajo deals with escrow and data collection, the input components must be highly engineered.

* **Floating Labels:** Do not use placeholder text as labels. Labels must sit above the input (`text-sm font-medium text-gray-700 mb-1.5`).
* **The Input Field:** `h-11 px-4 border border-gray-300 rounded-lg text-base shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white placeholder-gray-400 transition-colors`.
* **Validation States (React Hook Form + Zod):**
* *Error State:* Input border turns `border-red-500`. A red alert icon appears inside the input on the right (`absolute right-3 top-3`). Error text appears below: `text-sm text-red-600 mt-1 flex items-center gap-1`.
* *Success State (e.g., OTP Verification):* Input border turns `border-green-500`. Green checkmark appears inside the input.


* **Money Inputs:** Always include a fixed `₦` span attached to the left inner side of the input field. `padding-left: 2.5rem` on the input, with the symbol absolute positioned at `left-4`. Add an automatic thousands-separator mask (`1,000,000`) on `onChange`.

