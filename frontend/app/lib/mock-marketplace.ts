export type ScoreTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
export type BookingStatus = "PENDING" | "QUOTE_REQUESTED" | "QUOTE_SENT" | "NEGOTIATING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
export type TransactionType =
  | "DEPOSIT"
  | "ESCROW_CHARGE"
  | "ESCROW_RELEASE"
  | "WITHDRAWAL"
  | "REFUND"
  | "WALLET_CREDIT";

export type ProviderService = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
};

export type ProviderReview = {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ProviderProfile = {
  id: string;
  name: string;
  tradeName: string;
  category: string;
  city: string;
  area: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  tier: ScoreTier;
  verified: boolean;
  responseTime: string;
  jobsCompleted: number;
  memberSince: string;
  priceFrom: number;
  priceTo: number;
  bio: string;
  avatarUrl: string;
  heroImageUrl: string;
  skills: string[];
  languages: string[];
  matchReasons: string[];
  services: ProviderService[];
  reviews: ProviderReview[];
};

export type BookingRecord = {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  providerTrade: string;
  serviceId: string;
  serviceTitle: string;
  amount: number;
  currency: string;
  status: BookingStatus;
  scheduledAt: string;
  location: string;
  notes: string;
  createdAt: string;
  timeline: Array<{ label: string; timestamp: string; complete: boolean }>;
  checkoutUrl?: string | null;
  quotationId?: string | null;
};

export type TransactionRecord = {
  id: string;
  type: TransactionType;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
  description: string;
};

export type WalletSnapshot = {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings?: number;
  virtualAccountName: string;
  virtualAccountNumber: string;
  transactions: TransactionRecord[];
};

const providerDirectory: ProviderProfile[] = [
  {
    id: "prov-1",
    name: "Amina Yusuf",
    tradeName: "Amina Home Electricals",
    category: "Electrician",
    city: "Lagos",
    area: "Yaba",
    distanceKm: 2.4,
    rating: 4.9,
    reviewCount: 128,
    tier: "GOLD",
    verified: true,
    responseTime: "Replies in 15 minutes",
    jobsCompleted: 86,
    memberSince: "2024-03-11T09:00:00.000Z",
    priceFrom: 12000,
    priceTo: 70000,
    bio: "Residential electrician focused on repairs, rewiring, and urgent callouts for apartments and small businesses.",
    avatarUrl: "https://i.pravatar.cc/150?u=amina",
    heroImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
    skills: ["Fault tracing", "Switch installation", "DB board servicing"],
    languages: ["English", "Yoruba"],
    matchReasons: [
      "Strong ratings for urgent home repairs",
      "Works frequently in Yaba and Surulere",
      "Transparent pricing for diagnostics",
    ],
    services: [
      {
        id: "svc-1",
        title: "Home fault diagnosis",
        description: "Inspection and diagnosis for unstable sockets, trips, and wiring faults.",
        category: "Diagnostics",
        price: 12000,
        currency: "NGN",
      },
      {
        id: "svc-2",
        title: "Apartment rewiring",
        description: "Full rewiring for 1-2 bedroom apartments with safety checks.",
        category: "Installation",
        price: 70000,
        currency: "NGN",
      },
    ],
    reviews: [
      {
        id: "rev-1",
        reviewerName: "Tolu Adebayo",
        rating: 5,
        comment: "Arrived on time and explained the issue clearly before starting work.",
        createdAt: "2026-04-09T11:00:00.000Z",
      },
      {
        id: "rev-2",
        reviewerName: "Grace Ibe",
        rating: 5,
        comment: "Very professional and the escrow flow made the payment process stress-free.",
        createdAt: "2026-03-28T15:00:00.000Z",
      },
    ],
  },
  {
    id: "prov-2",
    name: "Kunle Okafor",
    tradeName: "SwiftFix Plumbing",
    category: "Plumber",
    city: "Lagos",
    area: "Lekki",
    distanceKm: 5.1,
    rating: 4.7,
    reviewCount: 94,
    tier: "SILVER",
    verified: true,
    responseTime: "Replies in 30 minutes",
    jobsCompleted: 52,
    memberSince: "2024-08-18T09:00:00.000Z",
    priceFrom: 15000,
    priceTo: 95000,
    bio: "Leak repair specialist handling pipe replacements, blocked drains, and emergency plumbing jobs.",
    avatarUrl: "https://i.pravatar.cc/150?u=kunle",
    heroImageUrl: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800",
    skills: ["Pipe replacement", "Drain clearing", "Bathroom fittings"],
    languages: ["English", "Igbo"],
    matchReasons: [
      "Best fit for leak repair and pipe issues",
      "High completion rate on larger residential jobs",
    ],
    services: [
      {
        id: "svc-3",
        title: "Emergency leak repair",
        description: "Stop leaks quickly and replace damaged fittings where required.",
        category: "Repairs",
        price: 15000,
        currency: "NGN",
      },
      {
        id: "svc-4",
        title: "Full bathroom fitting",
        description: "Install basin, WC, shower fittings, and finishing accessories.",
        category: "Installation",
        price: 95000,
        currency: "NGN",
      },
    ],
    reviews: [
      {
        id: "rev-3",
        reviewerName: "Mariam Bello",
        rating: 4,
        comment: "Resolved the leak quickly and kept the work area neat.",
        createdAt: "2026-04-18T13:00:00.000Z",
      },
    ],
  },
  {
    id: "prov-3",
    name: "Efe Martins",
    tradeName: "Efe Tailoring Studio",
    category: "Tailor",
    city: "Lagos",
    area: "Ikeja",
    distanceKm: 3.6,
    rating: 4.8,
    reviewCount: 71,
    tier: "GOLD",
    verified: true,
    responseTime: "Replies in under 1 hour",
    jobsCompleted: 64,
    memberSince: "2023-12-07T09:00:00.000Z",
    priceFrom: 18000,
    priceTo: 60000,
    bio: "Custom tailoring for women and corporate wear with quick measurement turnaround and fitting support.",
    avatarUrl: "https://i.pravatar.cc/150?u=efe",
    heroImageUrl: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800",
    skills: ["Measurements", "Alterations", "Corporate wear"],
    languages: ["English", "Pidgin"],
    matchReasons: [
      "Strong reviews for neat finishing",
      "Fast turnaround for alterations",
    ],
    services: [
      {
        id: "svc-5",
        title: "Native outfit tailoring",
        description: "Custom sewing for dresses, senator sets, and event wear.",
        category: "Custom sewing",
        price: 35000,
        currency: "NGN",
      },
      {
        id: "svc-6",
        title: "Office wear alteration",
        description: "Adjust fit and finishing for trousers, skirts, and blazers.",
        category: "Alteration",
        price: 18000,
        currency: "NGN",
      },
    ],
    reviews: [
      {
        id: "rev-4",
        reviewerName: "Hauwa Musa",
        rating: 5,
        comment: "Excellent finishing and delivered exactly when promised.",
        createdAt: "2026-04-23T16:00:00.000Z",
      },
    ],
  },
];

const bookingStore: BookingRecord[] = [
  {
    id: "bk-1029",
    customerId: "cust-1",
    customerName: "Samuel Ade",
    providerId: "prov-1",
    providerName: "Amina Yusuf",
    providerTrade: "Electrician",
    serviceId: "svc-1",
    serviceTitle: "Home fault diagnosis",
    amount: 12000,
    currency: "NGN",
    status: "PENDING",
    scheduledAt: "2026-05-17T09:00:00.000Z",
    location: "Yaba, Lagos",
    notes: "Frequent breaker trips whenever the AC is switched on.",
    createdAt: "2026-05-13T10:00:00.000Z",
    timeline: [
      { label: "Booking requested", timestamp: "2026-05-13T10:00:00.000Z", complete: true },
      { label: "Provider confirmation", timestamp: "Pending", complete: false },
      { label: "Escrow release", timestamp: "Pending", complete: false },
    ],
    checkoutUrl: "https://example.com/mock-checkout",
  },
  {
    id: "bk-1022",
    customerId: "cust-1",
    customerName: "Samuel Ade",
    providerId: "prov-2",
    providerName: "Kunle Okafor",
    providerTrade: "Plumber",
    serviceId: "svc-3",
    serviceTitle: "Emergency leak repair",
    amount: 15000,
    currency: "NGN",
    status: "ACCEPTED",
    scheduledAt: "2026-05-15T14:00:00.000Z",
    location: "Lekki Phase 1, Lagos",
    notes: "Kitchen sink leaking under the counter.",
    createdAt: "2026-05-11T14:00:00.000Z",
    timeline: [
      { label: "Booking requested", timestamp: "2026-05-11T14:00:00.000Z", complete: true },
      { label: "Provider accepted", timestamp: "2026-05-11T16:00:00.000Z", complete: true },
      { label: "Waiting for completion", timestamp: "Pending", complete: false },
    ],
  },
  {
    id: "bk-1014",
    customerId: "cust-2",
    customerName: "Ifeoma David",
    providerId: "prov-1",
    providerName: "Amina Yusuf",
    providerTrade: "Electrician",
    serviceId: "svc-2",
    serviceTitle: "Apartment rewiring",
    amount: 70000,
    currency: "NGN",
    status: "PENDING",
    scheduledAt: "2026-05-18T12:00:00.000Z",
    location: "Surulere, Lagos",
    notes: "Need rewiring for a 2-bedroom flat before tenant move-in.",
    createdAt: "2026-05-12T08:00:00.000Z",
    timeline: [
      { label: "Booking requested", timestamp: "2026-05-12T08:00:00.000Z", complete: true },
      { label: "Provider confirmation", timestamp: "Pending", complete: false },
      { label: "Escrow release", timestamp: "Pending", complete: false },
    ],
  },
];

const walletDirectory: Record<"customer" | "provider", WalletSnapshot> = {
  customer: {
    availableBalance: 185000,
    pendingBalance: 12000,
    virtualAccountName: "Hajo Wallet",
    virtualAccountNumber: "1029384756",
    transactions: [
      {
        id: "trx-1",
        type: "DEPOSIT",
        amount: 200000,
        status: "SUCCESS",
        createdAt: "2026-05-10T09:00:00.000Z",
        description: "Wallet funding via Squad virtual account",
      },
      {
        id: "trx-2",
        type: "ESCROW_CHARGE",
        amount: 12000,
        status: "PENDING",
        createdAt: "2026-05-13T10:00:00.000Z",
        description: "Escrow hold for booking BK-1029",
      },
    ],
  },
  provider: {
    availableBalance: 248000,
    pendingBalance: 70000,
    totalEarnings: 902000,
    virtualAccountName: "Amina Yusuf",
    virtualAccountNumber: "2093847561",
    transactions: [
      {
        id: "trx-3",
        type: "ESCROW_RELEASE",
        amount: 58000,
        status: "SUCCESS",
        createdAt: "2026-05-09T16:00:00.000Z",
        description: "Escrow release for completed rewiring project",
      },
      {
        id: "trx-4",
        type: "WITHDRAWAL",
        amount: 100000,
        status: "SUCCESS",
        createdAt: "2026-05-08T10:00:00.000Z",
        description: "Withdrawal to primary bank account",
      },
    ],
  },
};

export function getMockProviders() {
  return providerDirectory;
}

export function searchMockProviders(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return providerDirectory;
  }

  return providerDirectory.filter((provider) =>
    [
      provider.name,
      provider.tradeName,
      provider.category,
      provider.city,
      provider.area,
      provider.skills.join(" "),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

export function getMockProvider(id: string) {
  return providerDirectory.find((provider) => provider.id === id) ?? null;
}

export function getMockBookings(role: "customer" | "provider", userId?: string) {
  if (!userId) return [];
  return bookingStore.filter((booking) =>
    role === "customer" ? booking.customerId === userId : booking.providerId === userId,
  );
}

export function getMockBooking(id: string) {
  return bookingStore.find((booking) => booking.id === id) ?? null;
}

export function createMockBooking(input: {
  providerId: string;
  serviceId: string;
  amount: number;
  currency: string;
  scheduledAt: string;
  notes: string;
  location: string;
}) {
  const provider = getMockProvider(input.providerId);
  const service = provider.services.find((item) => item.id === input.serviceId) ?? provider.services[0];
  const booking: BookingRecord = {
    id: `bk-${1030 + bookingStore.length}`,
    customerId: "cust-1",
    customerName: "Samuel Ade",
    providerId: provider.id,
    providerName: provider.name,
    providerTrade: provider.category,
    serviceId: service.id,
    serviceTitle: service.title,
    amount: input.amount,
    currency: input.currency,
    status: "PENDING",
    scheduledAt: input.scheduledAt,
    location: input.location,
    notes: input.notes,
    createdAt: new Date().toISOString(),
    timeline: [
      { label: "Booking requested", timestamp: new Date().toISOString(), complete: true },
      { label: "Provider confirmation", timestamp: "Pending", complete: false },
      { label: "Escrow release", timestamp: "Pending", complete: false },
    ],
    checkoutUrl: "https://example.com/mock-checkout",
  };

  bookingStore.unshift(booking);
  walletDirectory.customer.pendingBalance += booking.amount;
  walletDirectory.customer.transactions.unshift({
    id: `trx-customer-${Date.now()}`,
    type: "ESCROW_CHARGE",
    amount: booking.amount,
    status: "PENDING",
    createdAt: booking.createdAt,
    description: `Escrow hold for ${service.title}`,
  });

  return booking;
}

export function updateMockBookingStatus(id: string, status: BookingStatus) {
  const booking = getMockBooking(id);

  if (!booking) {
    return null;
  }

  booking.status = status;

  if (status === "ACCEPTED") {
    booking.timeline[1] = {
      label: "Provider accepted",
      timestamp: new Date().toISOString(),
      complete: true,
    };
  }

  if (status === "COMPLETED") {
    booking.timeline[2] = {
      label: "Escrow released",
      timestamp: new Date().toISOString(),
      complete: true,
    };
    walletDirectory.provider.availableBalance += booking.amount;
  }

  if (status === "CANCELLED") {
    walletDirectory.customer.pendingBalance = Math.max(
      walletDirectory.customer.pendingBalance - booking.amount,
      0,
    );
  }

  return booking;
}

export function getMockWallet(role: "customer" | "provider") {
  return walletDirectory[role];
}
