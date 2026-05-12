# Hajo AI Agent Architecture & Implementation Guide

**Version:** 1.0 — MVP Implementation
**Author:** Engineering Team
**Target:** PI-Agent SDK Integration with Gemini Models
**Date:** 2026
**Updated:** May 12, 2026

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [PI-Agent SDK Architecture](#2-pi-agent-sdk-architecture)
3. [Gemini Integration Strategy](#3-gemini-integration-strategy)
4. [Hajo AI Agent Design](#4-Hajo-ai-agent-design)
5. [Core Agent Capabilities](#5-core-agent-capabilities)
6. [System Integration Architecture](#6-system-integration-architecture)
7. [Implementation Phases](#7-implementation-phases)
8. [API & Tool Design](#8-api--tool-design)
9. [Prompts & Reasoning](#9-prompts--reasoning)
10. [State Management](#10-state-management)
11. [Error Handling & Fallbacks](#11-error-handling--fallbacks)
12. [Performance & Optimization](#12-performance--optimization)
13. [Deployment & Monitoring](#13-deployment--monitoring)
14. [Configuration & Secrets](#14-configuration--secrets)
15. [Testing Strategy](#15-testing-strategy)

---

## 1. Executive Overview

### 1.1 Project Context

**Hajo** is a two-sided marketplace connecting informal service workers with customers. The AI Agent layer serves three critical functions:

1. **Intelligent Matching** — Natural language queries → ranked provider recommendations using context (location, skills, language, ratings, availability)
2. **Credit Scoring** — Behavioral analysis of transaction history to compute creditworthiness scores
3. **Contextual Insights** — Summary generation, trend analysis, and personalized recommendations for both providers and customers

### 1.2 Why PI-Agent SDK?

The **PI-Agent SDK** from earendil-works/pi provides:

- **Unified LLM API** — Seamless multi-provider support (OpenAI, Anthropic, Google Gemini, etc.) via `@earendil-works/pi-ai`
- **Agent Runtime** — Production-ready agentic loop with tool calling, state management, and context preservation via `@earendil-works/pi-agent-core`
- **Tool Composition** — Built-in patterns for defining, composing, and sequencing tools (matching, scoring, notifications, etc.)
- **TypeScript-First** — Full typing support, reducing runtime errors in high-throughput scenarios
- **Enterprise Ready** — Designed for collaborative coding agents; scales to complex workflows

### 1.3 Why Gemini Models?

**Google Gemini** is selected as the primary model for:

- **Cost Efficiency** — Competitive pricing vs. GPT-4; aggressive rates for high-volume inference (matching queries, scoring)
- **Multimodal Support** — Future support for photo-based provider verification, receipt scanning, and image-based customer reviews
- **Long Context** — Gemini 2.0 (and later) supports large context windows ideal for historical transaction analysis and complex reasoning
- **Regional Compliance** — Google's data residency options support African market deployment requirements

**Fallback Strategy**: Anthropic Claude for tasks requiring highest reasoning quality (complex scoring logic, appeals).

### 1.4 Integration Points with Hajo

```
┌─────────────────────────────────────────────────────────────────┐
│                    Hajo Frontend                          │
│            (Next.js App + React Native Mobile)                  │
└────────────┬───────────────────────────────────────────────────┘
             │ (REST API calls)
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Express Backend                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          AI Agent Router (/api/ai/*)                   │   │
│  │  ┌───────────────────────────────────────────────────┐ │   │
│  │  │  PI-Agent Core Runtime                            │ │   │
│  │  │  - Tool calling loop                              │ │   │
│  │  │  - State & context management                     │ │   │
│  │  │  - Prompt composition                             │ │   │
│  │  └───────────────────────────────────────────────────┘ │   │
│  │                                                         │   │
│  │  ┌───────────────────────────────────────────────────┐ │   │
│  │  │  LLM Provider Abstraction (PI-AI)                │ │   │
│  │  │  ├─ Gemini API (primary)                         │ │   │
│  │  │  ├─ Claude API (fallback)                        │ │   │
│  │  │  └─ Routing / load-balancing                     │ │   │
│  │  └───────────────────────────────────────────────────┘ │   │
│  │                                                         │   │
│  │  Tools:                                                │   │
│  │  ├─ Provider Matching Tool                            │   │
│  │  ├─ Credit Scoring Tool                               │   │
│  │  ├─ Booking Analysis Tool                             │   │
│  │  ├─ Customer Insights Tool                            │   │
│  │  └─ Notification Generation Tool                      │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Database Access Layer                              │   │
│  │  ├─ Prisma ORM (Users, Providers, Bookings)        │   │
│  │  ├─ Squad API (Wallet & Transaction History)       │   │
│  │  └─ Vector Search (Provider embeddings)            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. PI-Agent SDK Architecture

### 2.1 Core Components

#### **@earendil-works/pi-ai** — Unified LLM Abstraction

```typescript
// Example: Unified API across multiple providers
import { createAIClient } from "@earendil-works/pi-ai";

const aiClient = createAIClient({
  provider: "google", // or "openai", "anthropic", etc.
  model: "gemini-2.0-flash", // Gemini 2.0 Flash for speed
  apiKey: process.env.GOOGLE_API_KEY,
  // Optional: fallback provider
  fallback: {
    provider: "anthropic",
    model: "claude-3-opus-20250219",
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
});

// Unified message interface
const response = await aiClient.complete({
  messages: [
    {
      role: "user",
      content: "Find providers matching: 'plumber near me, good reviews'",
    },
  ],
  temperature: 0.7,
  maxTokens: 2048,
});
```

**Key Features:**
- Abstracted provider differences (token limits, format, response styles)
- Automatic fallback on provider errors (rate limits, outages)
- Unified response parsing (standardized message format)
- Streaming support for real-time chat UI
- Tool/function calling with schema validation

#### **@earendil-works/pi-agent-core** — Agent Runtime

```typescript
// Core agent loop: sense → act → observe → think
import { AgentRuntime, createTool } from "@earendil-works/pi-agent-core";

const matchingTool = createTool({
  name: "find_providers",
  description: "Find service providers matching customer query",
  schema: {
    query: { type: "string", description: "Natural language search" },
    location: { type: "string", description: "City or lat/lon" },
    maxResults: { type: "number", default: 10 },
  },
  execute: async (params) => {
    // Implementation: call database, rank by ML model, return results
    return queryProviders(params);
  },
});

const agent = new AgentRuntime({
  aiClient,
  tools: [matchingTool, scoringTool, bookingAnalysisTool],
  systemPrompt: Hajo_SYSTEM_PROMPT,
});

// Execute agent loop
const result = await agent.run({
  userMessage: "I need a plumber in Lagos who can come today",
  conversationHistory: [],
  maxIterations: 5, // Safety limit
});
```

**Agent Loop Flow:**

```
1. USER MESSAGE arrives
   │
   ├─► Agent receives message + context
   │
2. LLM REASONING
   ├─► Analyze intent (matching? scoring? insights?)
   ├─► Determine which tools to call
   ├─► Structure tool arguments
   │
3. TOOL EXECUTION
   ├─► Call provider matching tool
   ├─► Fetch database records
   ├─► Rank & filter results
   ├─► Return structured output
   │
4. OBSERVATION
   ├─► LLM reads tool results
   ├─► Determines if more tools needed
   │   (e.g., "need to score top 3 providers")
   │
5. SYNTHESIS
   ├─► Generate final response with reasoning
   ├─► Format for frontend consumption
   │
6. RETURN RESULT
   └─► Send response to client
```

### 2.2 Tool Schema Design Pattern

All Hajo tools follow this pattern:

```typescript
interface HajoTool {
  // Metadata
  name: string; // kebab-case, e.g., "match-providers"
  description: string; // 1-2 sentences
  category: "matching" | "scoring" | "insights" | "admin";

  // Input schema (JSON Schema format)
  schema: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
  };

  // Execution with error handling
  execute(params: Record<string, unknown>): Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
    context?: Record<string, unknown>;
  }>;

  // Execution timeout (ms)
  timeout?: number; // default 30000

  // Rate limiting
  rateLimit?: {
    maxPerMinute: number;
    maxPerHour: number;
  };
}
```

---

## 3. Gemini Integration Strategy

### 3.1 API Setup & Authentication

```typescript
// backend/src/config/gemini.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiClient = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY || ""
);

export const geminiConfig = {
  model: "gemini-2.0-flash", // Recommended for balance of speed/cost
  apiVersion: "v1",
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
};

export async function createGeminiSession() {
  return geminiClient.getGenerativeModel({
    model: geminiConfig.model,
    safetySettings: geminiConfig.safetySettings,
  });
}
```

### 3.2 Gemini vs. Other Providers — Decision Matrix

| Capability | Gemini 2.0 | Claude 3.5 Opus | GPT-4o |
|---|---|---|---|
| **Cost ($/M tokens)** | $0.075 input / $0.30 output | $3 / $15 | $2.50 / $10 |
| **Context Window** | 1M tokens | 200k tokens | 128k tokens |
| **Speed (tok/s)** | ~200-300 | ~80-100 | ~100-120 |
| **Reasoning Quality** | ⭐⭐⭐⭐⭐ (Gemini 2.0) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Tool Calling** | ✅ Native | ✅ Native | ✅ Native |
| **Multimodal** | ✅ Video, Image, Audio | ✅ Image, PDF | ✅ Image |
| **Streaming** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Regional Compliance** | ✅ Africa-friendly | ⚠️ Limited | ⚠️ Limited |

**Recommendation:**
- **Primary**: Gemini 2.0 Flash for matching + scoring (speed + cost)
- **Fallback**: Claude 3.5 Opus for complex reasoning (credit scoring appeals)
- **Future**: Multimodal tasks (provider photo verification)

### 3.3 Gemini Tool Calling Integration

```typescript
// backend/src/integrations/gemini/gemini.client.ts

import {
  GenerativeModel,
  FunctionCallingMode,
} from "@google/generative-ai";

export class GeminiAgentClient {
  constructor(private model: GenerativeModel) {}

  async executeWithTools(
    userMessage: string,
    tools: Array<{
      name: string;
      description: string;
      parameters: Record<string, unknown>;
    }>,
    toolExecutors: Map<
      string,
      (args: Record<string, unknown>) => Promise<unknown>
    >
  ) {
    const chat = this.model.startChat({
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
      tools: [
        {
          functionDeclarations: tools,
        },
      ],
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingMode.AUTO, // Auto-invoke tools when appropriate
          allowedFunctionNames: tools.map((t) => t.name),
        },
      },
    });

    let messages: Array<{ role: string; parts: unknown[] }> = [
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    let iterations = 0;
    const maxIterations = 5;

    while (iterations < maxIterations) {
      iterations++;

      const response = await chat.sendMessage(messages[messages.length - 1]);
      const responseText = response.text;

      // Check if tool calls were made
      const toolCalls = response.functionCalls();

      if (!toolCalls || toolCalls.length === 0) {
        // No more tool calls; return final response
        return {
          success: true,
          message: responseText,
          iterations,
        };
      }

      // Execute tool calls
      const toolResults = await Promise.all(
        toolCalls.map(async (call) => {
          const executor = toolExecutors.get(call.name);
          if (!executor) {
            throw new Error(`Unknown tool: ${call.name}`);
          }
          const result = await executor(call.args);
          return {
            functionName: call.name,
            content: result,
          };
        })
      );

      // Add assistant response and tool results to conversation
      messages.push({
        role: "model",
        parts: response.content.parts,
      });

      messages.push({
        role: "user",
        parts: [
          {
            functionResponses: toolResults,
          },
        ],
      });
    }

    return {
      success: false,
      error: "Max iterations reached",
      iterations,
    };
  }
}
```

### 3.4 Streaming Responses for Real-Time Chat

```typescript
// Real-time streaming for chat UI
export async function streamGeminiResponse(
  userMessage: string,
  onChunk: (chunk: string) => void
) {
  const model = geminiClient.getGenerativeModel({
    model: "gemini-2.0-flash-001",
  });

  const stream = await model.generateContentStream(userMessage);

  for await (const chunk of stream.stream) {
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      onChunk(text);
    }
  }
}
```

---

## 4. Hajo AI Agent Design

### 4.1 Multi-Agent Architecture

Hajo deploys **4 specialized agents**, each with distinct responsibilities:

```
┌─────────────────────────────────────────────────────┐
│          AI Agent Orchestrator                       │
│         (Routes user queries)                        │
└────────────┬────────────────────────────────────────┘
             │
      ┌──────┼──────┬──────────┬──────────┐
      │      │      │          │          │
      ▼      ▼      ▼          ▼          ▼
   ┌──────┐┌────┐┌───────────────────┐┌──────────┐
   │Match ││Credit Scoring│ Insights │ Notif    │
   │Agent ││Agent         │ Agent    │ Agent    │
   └──────┘└────┘└───────────────────┘└──────────┘
```

#### **Agent 1: Provider Matching Agent** (Customer-facing)

**Purpose**: Convert natural language queries into ranked provider recommendations.

**Inputs**:
- Customer message: "I need a plumber who speaks English, available tonight, affordable"
- Customer location (lat/lon or address)
- Customer ratings/history (optional, for context)

**Tools**:
1. `search_providers_by_location` — Find providers within radius
2. `filter_providers_by_skills` — Filter by service category
3. `rank_by_availability` — Check booking calendar
4. `fetch_provider_reviews` — Get ratings and reviews
5. `calculate_travel_estimate` — Distance + transit time

**Output**:
```json
{
  "matches": [
    {
      "providerId": "prov_123",
      "name": "Ahmed Plumbing",
      "location": {"lat": 6.5244, "lng": 3.3792},
      "distance_km": 2.1,
      "estimated_arrival": "45 mins",
      "rating": 4.8,
      "availability": "Today 6-10pm",
      "hourly_rate": "₦5,000",
      "reason": "Top match: Highly rated, nearby, available tonight, speaks English"
    }
  ],
  "reasoning": "Searched 47 plumbers in Lagos, filtered by availability and language, ranked by rating × distance × price fit"
}
```

#### **Agent 2: Credit Scoring Agent** (Provider-facing)

**Purpose**: Calculate creditworthiness scores based on transaction behavior.

**Inputs**:
- Provider ID
- Transaction history (completed bookings, amounts, timing)
- Customer ratings
- Payment consistency
- Booking completion rate

**Tools**:
1. `fetch_provider_transactions` — Last 12 months
2. `calculate_avg_rating` — Aggregate from reviews
3. `fetch_wallet_balance` — Current liquidity
4. `assess_payment_timing` — Punctuality of transfers
5. `detect_anomalies` — Unusual patterns (fraud detection)

**Scoring Algorithm** (30-point scale):

```
Score = (completion_rate × 0.25) 
       + (avg_rating × 0.25) 
       + (transaction_volume × 0.20) 
       + (payment_punctuality × 0.15) 
       + (account_age_months × 0.10) 
       + (anomaly_check × 0.05)

Range: 0-30 (maps to credit grades A-F)
```

**Output**:
```json
{
  "provider_id": "prov_123",
  "credit_score": 24,
  "credit_grade": "A",
  "breakdown": {
    "completion_rate": 98.2,
    "avg_rating": 4.8,
    "total_volume_earned": "₦850,000",
    "on_time_payments": 96.1,
    "account_age_months": 14,
    "risk_flags": []
  },
  "recommendation": "Tier-1 provider: eligible for working capital loans up to ₦500,000"
}
```

#### **Agent 3: Insights Agent** (Dashboard Analytics)

**Purpose**: Generate actionable insights for both providers and customers.

**For Providers**:
- Revenue trends (weekly, monthly, YoY growth)
- Top-performing services
- Customer demographic breakdown
- Peak booking times
- Rating drivers (what improves score?)

**For Customers**:
- Spending trends by category
- Recommended providers based on booking history
- Budget optimization tips
- Popular services in their area

**Tools**:
1. `aggregate_booking_stats` — Volume, revenue, frequency
2. `analyze_rating_trends` — Sentiment + drivers
3. `fetch_peer_benchmarks` — Compare to similar providers
4. `generate_recommendations` — Personalized suggestions

**Output**:
```json
{
  "user_id": "cust_456",
  "period": "2026-Q1",
  "insights": [
    {
      "title": "You spent 34% more this quarter",
      "details": "Total: ₦420,000 (Q4 2025: ₦312,000)",
      "trend": "up"
    },
    {
      "title": "Plumbing is your most frequent service",
      "details": "5 bookings (50% of total), avg. rating 4.9/5"
    },
    {
      "title": "Ahmed Plumbing is your trusted provider",
      "details": "Booked 3x, 5-star ratings every time. Consider booking him for your next job."
    }
  ]
}
```

#### **Agent 4: Notification Agent** (Async Messaging)

**Purpose**: Generate contextual, personalized notifications.

**Triggers**:
- Booking confirmed → send to provider (details, location, route)
- Payment received → send to provider (amount, commission breakdown)
- New high-match providers in area → send to customer
- Rating received → send contextual thank you / ask for improvement
- Credit score updated → send milestone achievement

**Tools**:
1. `compose_notification` — Generate message text
2. `select_channel` — SMS, push, email based on user preference
3. `personalize_message` — Include user name, booking details, etc.
4. `dispatch_notification` — Send via Termii (SMS) or Firebase (push)

---

### 4.2 Agent Orchestration

```typescript
// backend/src/modules/ai/agent.orchestrator.ts

import { AgentRuntime } from "@earendil-works/pi-agent-core";
import { createAIClient } from "@earendil-works/pi-ai";

export class HajoAgentOrchestrator {
  private matchingAgent: AgentRuntime;
  private scoringAgent: AgentRuntime;
  private insightsAgent: AgentRuntime;
  private notificationAgent: AgentRuntime;

  async routeQuery(
    userMessage: string,
    userId: string,
    userRole: "customer" | "provider"
  ) {
    // Determine intent
    const intent = await this.detectIntent(userMessage);

    switch (intent) {
      case "matching":
        return this.matchingAgent.run({
          userMessage,
          context: { userId, userRole },
        });

      case "scoring":
        return this.scoringAgent.run({
          userMessage,
          context: { userId, userRole },
        });

      case "insights":
        return this.insightsAgent.run({
          userMessage,
          context: { userId, userRole },
        });

      default:
        return { error: "Could not understand request" };
    }
  }

  private async detectIntent(message: string): Promise<string> {
    const classifier = await createAIClient({
      provider: "google",
      model: "gemini-2.0-flash",
    });

    const response = await classifier.complete({
      messages: [
        {
          role: "user",
          content: `Classify this message intent. Reply with ONLY one word: "matching", "scoring", "insights", or "other".
          
Message: "${message}"`,
        },
      ],
    });

    const intent = response.content.toLowerCase().trim();
    return ["matching", "scoring", "insights"].includes(intent)
      ? intent
      : "other";
  }
}
```

---

## 5. Core Agent Capabilities

### 5.1 Provider Matching Capability

**Use Case**: Customer searches "Find me a good plumber with English near me"

**Flow**:

1. **Intent Recognition** → Matching Agent
2. **Query Parsing**:
   ```
   Skill: plumber
   Language: English
   Location: customer's current location
   Min Rating: good (4.0+)
   ```
3. **Database Query**:
   ```sql
   SELECT * FROM providers 
   WHERE category='plumbing' 
   AND languages ILIKE '%English%'
   AND distance_from(location, customer_location) < 10km
   AND avg_rating >= 4.0
   ORDER BY rating DESC, distance ASC
   LIMIT 50
   ```
4. **Ranking Algorithm** (Gemini-powered):
   - Distance × 0.20
   - Rating × 0.30
   - Recent availability × 0.20
   - Price competitiveness × 0.15
   - Customer-provider language match × 0.15
5. **Final Response**:
   ```json
   {
     "top_matches": [
       {
         "provider": {"id": "prov_123", "name": "Ahmed"},
         "distance": "2.1km",
         "rating": 4.9,
         "availability": "Today 6-10pm",
         "estimated_cost": "₦5,000-7,000",
         "booking_url": "/book/prov_123"
       }
     ]
   }
   ```

### 5.2 Scoring Capability

**Use Case**: Provider views their credit score; system processes loan eligibility

**Flow**:

1. **Fetch Data**:
   - Last 12 months of transactions from Prisma
   - Payment history from Squad API
   - Customer ratings from database

2. **Calculate Metrics**:
   ```typescript
   const metrics = {
     completionRate = (completed / total) × 100
     avgRating = mean(customer_ratings)
     totalEarned = sum(transaction_amounts)
     onTimePayments = (on_time_transfers / total_transfers) × 100
     accountAge = today - signup_date (in months)
   }
   ```

3. **Apply Scoring Model** (Gemini validates reasoning):
   ```
   Raw Score = 
     (completionRate × 0.25) +
     (avgRating/5 × 25 × 0.25) +
     min(totalEarned/1M, 1) × 20 × 0.20 +
     (onTimePayments × 0.15) +
     min(accountAge/24, 1) × 10 × 0.10 +
     anomalyCheck(+5 if clean, -5 if suspicious) × 0.05
   ```

4. **Generate Recommendation**:
   ```
   If score 24-30: "Tier A - Eligible for ₦500k+ working capital"
   If score 18-23: "Tier B - Eligible for ₦200-500k working capital"
   If score 12-17: "Tier C - Eligible for microloans, ₦50-200k"
   If score < 12: "Building history - Come back in 60 days"
   ```

### 5.3 Insights Capability

**Use Case**: Provider dashboard shows "You're outpacing peers in your category"

**Flow**:

1. **Fetch Provider Stats** (Last 90 days):
   - Total bookings, revenue, cancellation rate
   - Average rating, review sentiment
   - Peak times, top services

2. **Fetch Peer Benchmarks**:
   ```sql
   SELECT 
     PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY revenue) as median_revenue,
     PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY rating) as p75_rating
   FROM providers 
   WHERE category = provider.category 
   AND city = provider.city
   AND active_for_months BETWEEN provider.active_for_months-3 AND provider.active_for_months+3
   ```

3. **Generate Insight**:
   ```
   Your ₦850,000 Q1 revenue is in the 78th percentile for electricians in Lagos.
   You're earning 34% more than median (₦633,000).
   
   Key driver: Your 4.9★ rating attracts repeat bookings (+23% vs. peers).
   
   Opportunity: 60% of your bookings are Mon-Fri. Consider advertising availability for weekend jobs (+15-20% revenue potential).
   ```

### 5.4 Notification Generation

**Use Case**: Customer receives personalized SMS after booking confirmed

**Template Selection** (Gemini chooses):
```
Trigger: booking_confirmed
User Role: customer
Language: English
Channel: SMS (character limit: 160)

→ Agent generates:
"Hi Emeka! Your booking with Ahmed Plumbing is confirmed for TODAY 6-8pm. 
Location: Lekki Phase 1. Track progress: [link]. Support: 08012345678"

(Personalized + concise + actionable)
```

---

## 6. System Integration Architecture

### 6.1 Backend Module Structure

```
backend/src/modules/ai/
├── agent.orchestrator.ts          # Main router
├── agents/
│   ├── matching.agent.ts          # Provider matching
│   ├── scoring.agent.ts           # Credit scoring
│   ├── insights.agent.ts          # Analytics
│   └── notification.agent.ts      # Message generation
├── tools/
│   ├── matching.tools.ts          # Search, rank, filter tools
│   ├── scoring.tools.ts           # Transaction, rating tools
│   ├── insights.tools.ts          # Analytics, benchmarking
│   └── notification.tools.ts      # Dispatch, templating
├── prompts/
│   ├── matching.system.ts         # Matching agent system prompt
│   ├── scoring.system.ts          # Scoring agent system prompt
│   └── insights.system.ts         # Insights agent system prompt
├── types/
│   ├── agent.types.ts             # Shared types
│   ├── tools.types.ts             # Tool schemas
│   └── responses.types.ts         # Response formats
└── ai.routes.ts                   # Express routes
```

### 6.2 API Endpoints

```
POST /api/ai/match
  Request: { query: string, location: {lat, lng}, limit?: number }
  Response: { matches: ProviderMatch[], reasoning: string }

POST /api/ai/score
  Request: { providerId: string }
  Response: { score: number, grade: string, breakdown: {...} }

POST /api/ai/insights
  Request: { userId: string, period: "week" | "month" | "quarter" }
  Response: { insights: Insight[] }

POST /api/ai/chat
  Request: { message: string, conversationId?: string }
  Response: { reply: string, conversationId: string }
  (Streaming supported)
```

### 6.3 Database Integration

```typescript
// Prisma models referenced by AI agents

model Provider {
  id String @id
  name String
  category String // "plumber", "electrician", etc.
  location Location
  languages String[]
  ratings Rating[]
  bookings Booking[]
  transactions Transaction[]
  wallet Wallet
  creditScore CreditScore?
}

model Booking {
  id String @id
  customerId String
  providerId String
  status "pending" | "confirmed" | "completed" | "cancelled"
  scheduledAt DateTime
  completedAt DateTime?
  rating Int? // 1-5 stars
  review String?
}

model Transaction {
  id String @id
  fromUserId String
  toUserId String
  amount Int // in kobo
  timestamp DateTime
  type "booking_payment" | "wallet_transfer" | "commission"
}
```

### 6.4 Squad API Integration Points

```typescript
// Wallet & transaction history for scoring

const squadClient = new SquadClient(apiKey);

// Get provider's transaction history
const transactions = await squadClient.getTransactions({
  accountId: provider.squadAccountId,
  startDate: thirtyDaysAgo,
  endDate: today,
});

// Calculate metrics
const totalReceived = sum(transactions.map(t => t.amount));
const onTimeTransfers = transactions.filter(t => 
  t.timestamp.getTime() - t.completedAt.getTime() < 24 * 60 * 60 * 1000
).length;
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Deliverables**:
- PI-Agent SDK integration skeleton
- Gemini API client setup + fallback routing
- Agent orchestrator framework
- 2 basic tools (provider search, basic scoring)

**Code Structure**:
```
backend/src/modules/ai/
├── agent.orchestrator.ts (basic router)
├── agents/
│   └── matching.agent.ts (first agent)
├── tools/
│   ├── matching.tools.ts
│   └── scoring.tools.ts
├── prompts/
│   └── matching.system.ts
└── ai.routes.ts
```

**Testing**: Unit tests for tools + mock LLM responses

### Phase 2: Provider Matching (Week 2-3)

**Deliverables**:
- Full provider matching agent
- Location-aware search
- Ranking algorithm (Gemini-enhanced)
- Real-time availability check

**API**: `POST /api/ai/match`

**Testing**:
- E2E tests with real database
- Load test: 1000 concurrent queries
- Latency target: < 2 seconds p95

### Phase 3: Credit Scoring (Week 3-4)

**Deliverables**:
- Scoring agent implementation
- Transaction history analysis
- Fraud detection heuristics
- Scoring dashboard backend

**API**: `POST /api/ai/score`

**Testing**:
- Validate scoring against historical data
- A/B test with different weighting schemes
- Verify correlation with default rates

### Phase 4: Insights & Notifications (Week 4)

**Deliverables**:
- Insights agent + dashboard endpoints
- Notification generation + dispatch
- Real-time analytics

**APIs**:
- `POST /api/ai/insights`
- `POST /api/ai/notify`

---

## 8. API & Tool Design

### 8.1 Tool Definition Schema

Every tool follows this interface:

```typescript
interface HajoTool {
  // Metadata for LLM understanding
  name: string; // snake_case
  displayName: string;
  description: string; // 1-2 sentences, action-focused
  category: "search" | "filter" | "rank" | "calculate" | "fetch" | "dispatch";

  // Input schema (JSON Schema 7)
  inputSchema: {
    type: "object";
    properties: Record<string, {
      type: "string" | "number" | "boolean" | "array" | "object";
      description: string;
      enum?: unknown[]; // For categorical inputs
      minimum?: number;
      maximum?: number;
    }>;
    required: string[];
    additionalProperties: false;
  };

  // Execution
  execute(params: Record<string, unknown>): Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
    metadata?: {
      executionTimeMs: number;
      dataPoints: number; // for "found N results"
    };
  }>;

  // Rate limiting & safety
  rateLimit?: { perMinute: number; perHour: number };
  timeout: number; // milliseconds
  requiresAuth: boolean;
  allowedRoles: ("customer" | "provider" | "admin")[];
}
```

### 8.2 Example Tool: Provider Search

```typescript
// backend/src/modules/ai/tools/matching.tools.ts

export const searchProvidersTool: HajoTool = {
  name: "search_providers",
  displayName: "Search Providers",
  description: "Find service providers by category, location, and skills",

  inputSchema: {
    type: "object",
    properties: {
      category: {
        type: "string",
        description: "Service category: plumber, electrician, tailor, etc.",
        enum: PROVIDER_CATEGORIES,
      },
      location: {
        type: "object",
        description: "Search center: latitude and longitude",
        properties: {
          lat: { type: "number", description: "Latitude" },
          lng: { type: "number", description: "Longitude" },
        },
        required: ["lat", "lng"],
      },
      radiusKm: {
        type: "number",
        description: "Search radius in kilometers",
        minimum: 0.5,
        maximum: 50,
        default: 5,
      },
      minRating: {
        type: "number",
        description: "Minimum average rating (0-5 stars)",
        minimum: 0,
        maximum: 5,
        default: 3.0,
      },
      limit: {
        type: "number",
        description: "Max providers to return",
        minimum: 1,
        maximum: 100,
        default: 10,
      },
    },
    required: ["category", "location"],
    additionalProperties: false,
  },

  timeout: 5000,
  requiresAuth: false,
  allowedRoles: ["customer", "provider", "admin"],

  async execute(params: Record<string, unknown>) {
    const startTime = Date.now();

    try {
      const {
        category,
        location,
        radiusKm = 5,
        minRating = 3,
        limit = 10,
      } = params as {
        category: string;
        location: { lat: number; lng: number };
        radiusKm?: number;
        minRating?: number;
        limit?: number;
      };

      // Database query with spatial search
      const providers = await prisma.provider.findMany({
        where: {
          category: category.toLowerCase(),
          active: true,
          ratings: {
            some: {}, // Has at least one rating
          },
        },
        select: {
          id: true,
          name: true,
          location: true,
          ratings: {
            select: { score: true },
          },
          bookings: {
            where: { status: "completed" },
            select: { id: true },
          },
        },
        take: limit * 3, // Fetch extra for ranking
      });

      // Calculate distance for each provider
      const withDistance = providers.map((p) => ({
        ...p,
        distanceKm: haversineDistance(location, p.location),
        avgRating: mean(p.ratings.map((r) => r.score)),
        bookingCount: p.bookings.length,
      }));

      // Filter by distance and rating
      const filtered = withDistance.filter(
        (p) => p.distanceKm <= radiusKm && p.avgRating >= minRating
      );

      // Sort by relevance (Gemini doesn't see this, but tools are deterministic)
      const sorted = filtered
        .sort(
          (a, b) =>
            b.avgRating - a.avgRating || a.distanceKm - b.distanceKm
        )
        .slice(0, limit);

      return {
        success: true,
        data: sorted.map((p) => ({
          providerId: p.id,
          name: p.name,
          distance_km: p.distanceKm.toFixed(1),
          rating: p.avgRating.toFixed(1),
          booking_count: p.bookingCount,
        })),
        metadata: {
          executionTimeMs: Date.now() - startTime,
          dataPoints: sorted.length,
          totalSearched: providers.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
```

### 8.3 Example Tool: Calculate Credit Score

```typescript
export const calculateCreditScoreTool: HajoTool = {
  name: "calculate_credit_score",
  displayName: "Calculate Provider Credit Score",
  description: "Compute creditworthiness score based on transaction history",

  inputSchema: {
    type: "object",
    properties: {
      providerId: {
        type: "string",
        description: "Provider ID",
      },
      months: {
        type: "number",
        description: "Lookback period in months",
        minimum: 1,
        maximum: 36,
        default: 12,
      },
    },
    required: ["providerId"],
    additionalProperties: false,
  },

  timeout: 8000,
  requiresAuth: true,
  allowedRoles: ["provider", "admin"],

  async execute(params: Record<string, unknown>) {
    const startTime = Date.now();

    try {
      const { providerId, months = 12 } = params as {
        providerId: string;
        months?: number;
      };

      const provider = await prisma.provider.findUnique({
        where: { id: providerId },
        include: {
          bookings: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000),
              },
            },
            include: {
              reviews: true,
            },
          },
          transactions: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      });

      if (!provider) {
        return {
          success: false,
          error: `Provider ${providerId} not found`,
        };
      }

      // Calculate metrics
      const completedBookings = provider.bookings.filter(
        (b) => b.status === "completed"
      );
      const completionRate =
        (completedBookings.length / provider.bookings.length) * 100 || 0;

      const ratings = completedBookings
        .map((b) => b.reviews?.[0]?.rating || 0)
        .filter((r) => r > 0);
      const avgRating = mean(ratings) || 0;

      const totalEarned = provider.transactions
        .filter((t) => t.type === "booking_payment")
        .reduce((sum, t) => sum + t.amountKobo, 0);

      const accountAgeMonths = Math.floor(
        (Date.now() - provider.createdAt.getTime()) / (30 * 24 * 60 * 60 * 1000)
      );

      // Scoring formula (0-30 scale)
      const components = {
        completionScore: (completionRate / 100) * 7.5, // max 7.5
        ratingScore: (avgRating / 5) * 7.5, // max 7.5
        volumeScore:
          Math.min(totalEarned / (1000000 * 100), 1) * 5, // max 5 (1M earned = 5 points)
        ageScore: Math.min(accountAgeMonths / 24, 1) * 3, // max 3 (2 years = 3 points)
        consistencyScore: 2.5, // bonus for being active
      };

      const totalScore = Object.values(components).reduce((a, b) => a + b, 0);

      // Grade mapping
      const gradeMap = {
        A: { min: 24, max: 30 },
        B: { min: 18, max: 23 },
        C: { min: 12, max: 17 },
        D: { min: 6, max: 11 },
        F: { min: 0, max: 5 },
      };

      const grade = Object.entries(gradeMap).find(
        ([_, range]) => totalScore >= range.min && totalScore <= range.max
      )?.[0] || "F";

      return {
        success: true,
        data: {
          providerId,
          creditScore: parseFloat(totalScore.toFixed(1)),
          creditGrade: grade,
          breakdown: {
            completionRate: parseFloat(completionRate.toFixed(1)),
            avgRating: parseFloat(avgRating.toFixed(1)),
            totalEarned: totalEarned / 100, // Convert from kobo to naira
            bookingCount: provider.bookings.length,
            accountAgeMonths,
          },
          recommendation:
            grade === "A"
              ? "Tier-1 provider: Eligible for ₦500k+ working capital loans"
              : grade === "B"
                ? "Tier-2 provider: Eligible for ₦200-500k working capital"
                : grade === "C"
                  ? "Tier-3 provider: Eligible for microloans ₦50-200k"
                  : "Tier-4 provider: Continue building transaction history",
        },
        metadata: {
          executionTimeMs: Date.now() - startTime,
          lookbackMonths: months,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
```

---

## 9. Prompts & Reasoning

### 9.1 System Prompts

#### **Matching Agent System Prompt**

```
You are an AI assistant helping customers find service providers in Nigeria.

Your role:
- Understand natural language requests for services (e.g., "I need a plumber today")
- Extract location, service type, and preferences
- Use provided tools to search providers
- Rank results by relevance and explain your reasoning

Communication style:
- Friendly, professional, respectful
- Always explain why you recommended these providers
- Ask clarifying questions if needed (e.g., budget, time constraints)
- Use Nigerian context (references to Lagos, Abuja, etc. as appropriate)

Guidelines:
- Prioritize highly-rated providers near the customer
- Mention availability and estimated arrival time
- Highlight provider credentials (languages, certifications)
- Always provide 3-5 options, not just the "best"

Example interaction:
Customer: "I need someone to fix my AC unit in Lekki"
You: Call search_providers tool with category="HVAC", location=Lekki, radius=5km
Results: 12 providers found
You respond: "I found 5 highly-rated AC technicians near you. Here are my top recommendations with estimated arrival times and pricing."

Current request:
[USER MESSAGE WILL BE INSERTED HERE]

Use search_providers and filter_providers tools to find matches.
Provide 3-5 recommendations with reasoning.
```

#### **Scoring Agent System Prompt**

```
You are an AI financial analyst helping service providers understand their creditworthiness.

Your role:
- Analyze transaction history and booking patterns
- Calculate a credit score using the provided framework
- Explain what drives the score
- Suggest actions to improve credit standing

Scoring Framework:
- Completion Rate (25%): % of accepted bookings that were completed
- Average Rating (25%): Customer ratings (0-5 stars)
- Transaction Volume (20%): Total earnings over 12 months
- Payment Punctuality (15%): How quickly transfers are made
- Account Age (10%): Months since signup
- Anomaly Detection (5%): Fraud/suspicious pattern check

Communication style:
- Use encouraging tone (celebrate progress, acknowledge challenges)
- Explain each score component clearly
- Provide specific action items (e.g., "Complete 2 more jobs to reach tier B")
- Reference comparable providers when relevant

Example output:
"Your credit score is 24/30 (Grade A). You're in the top 15% of electricians in Lagos. Your consistent 4.9★ rating and 98% completion rate are your biggest strengths. You're eligible for up to ₦500,000 in working capital loans to grow your business."

Current request:
[USER MESSAGE WILL BE INSERTED HERE]

Use calculate_credit_score and fetch_provider_history tools.
Provide clear, actionable insights.
```

#### **Insights Agent System Prompt**

```
You are a business intelligence assistant helping service providers optimize their earnings.

Your role:
- Analyze provider or customer activity patterns
- Compare against peer benchmarks
- Generate actionable insights
- Forecast trends and opportunities

Analysis dimensions:
- Revenue trends (daily, weekly, monthly, seasonal)
- Top-performing services
- Customer demographics
- Booking patterns (time of day, day of week)
- Rating drivers (what makes customers leave 5★ reviews?)
- Pricing competitiveness

Communication style:
- Lead with most impactful insight
- Use data-driven recommendations
- Celebrate wins ("You're outpacing 78% of peers")
- Suggest specific next steps ("Post availability for weekends to +20% earnings potential")

Example output:
"Your electrician business grew 34% Q1 2026. You're earning ₦850k vs. ₦633k median for your cohort. Key driver: Your 4.9★ rating attracts repeat customers (+23%). Opportunity: You're fully booked Mon-Fri but idle weekends. Consider promoting weekend availability to capture +15-20% additional revenue."

Current request:
[USER MESSAGE WILL BE INSERTED HERE]

Use aggregate_stats, fetch_peer_benchmarks, and analyze_trends tools.
Provide 3-5 key insights with supporting data.
```

### 9.2 Few-Shot Prompting Examples

```typescript
// backend/src/modules/ai/prompts/matching.system.ts

export const MATCHING_AGENT_PROMPT = `
You are an intelligent matching engine for Hajo, a Nigerian services marketplace.

ROLE: Help customers find the RIGHT service provider based on their needs.

TOOLS YOU HAVE:
1. search_providers(category, location, radiusKm, minRating, limit)
   → Returns providers matching criteria with ratings and distance

2. filter_by_skills(providers, skills, keywords)
   → Filters providers by specific skills or keywords

3. check_availability(providerId, timeRange)
   → Returns provider availability in next 7 days

4. fetch_reviews(providerId, limit)
   → Returns latest customer reviews and ratings

5. estimate_cost(category, jobType)
   → Returns typical price range in Lagos

RESPONSE FORMAT:
Always structure responses as:
1. Understanding: Restate what customer needs
2. Search Strategy: Explain which tools you'll use
3. Results: Show top matches with comparison
4. Recommendation: Which provider is best match and why
5. Next Steps: How to book, payment info, etc.

EXAMPLES:

Customer: "I need an electrician in Lekki urgently. Can they come today?"
Your process:
- Search electricians in Lekki (5km radius, min 4★)
- Filter by availability (today)
- Check reviews for responsiveness/professionalism
- Return: "I found 3 electricians available today. Ahmed is my top pick: 4.9★, 
   2.1km away, available 6-10pm, ₦3,500/hour. He's completed 47 jobs with 98% satisfaction."

Customer: "Looking for a tailor who can rush a wedding dress. Budget ₦15,000"
Your process:
- Search tailors in customer's area
- Filter by experience with formal wear / rush jobs
- Verify cost fits budget
- Return: "Found 2 tailors specializing in bridal wear. Amina has completed 23 wedding 
   dresses (5★ avg), offers rush service (+30% fee), stays within your ₦15,000 budget."

IMPORTANT:
- Always explain your reasoning ("Found 47 electricians, filtered by availability")
- Show multiple options (at least 3) so customer can compare
- Mention key factors: distance, rating, availability, price
- Be honest about tradeoffs ("Ahmed is closest and cheapest, but Oba has more bridal experience")
- Use local context (mention neighborhoods, typical transit times)

Current customer request:
[MESSAGE]

Use your tools to find the best matches. Focus on helpfulness and transparency.
`;
```

---

## 10. State Management

### 10.1 Conversation State Storage

```typescript
// backend/src/modules/ai/types/agent.types.ts

export interface ConversationState {
  id: string;
  userId: string;
  userRole: "customer" | "provider";
  messages: Message[];
  context: ContextData;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date; // Auto-cleanup after 7 days
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    toolsCalled?: string[];
    tokensUsed?: number;
    latencyMs?: number;
  };
}

export interface ContextData {
  // Customer context
  customerLocation?: { lat: number; lng: number };
  searchHistory?: string[]; // Recent searches
  lastBookings?: string[]; // Recent booking IDs

  // Provider context
  providerServicesOffered?: string[];
  providerLocation?: { lat: number; lng: number };
  providerAvailability?: AvailabilityWindow[];

  // Shared context
  cachedResults?: Map<string, unknown>;
  userPreferences?: UserPreferences;
}

export interface UserPreferences {
  language: "en" | "yo" | "ha"; // English, Yoruba, Hausa
  currency: "NGN";
  distanceUnit: "km" | "miles";
  communicationChannel: "sms" | "push" | "email";
}
```

### 10.2 Session Storage in Redis

```typescript
// backend/src/integrations/redis/conversation.cache.ts

import redis from "redis";

export class ConversationCache {
  private client: redis.RedisClient;
  private TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

  async saveConversation(state: ConversationState): Promise<void> {
    const key = `conversation:${state.id}`;
    const value = JSON.stringify(state);
    await this.client.setex(key, this.TTL_SECONDS, value);
  }

  async getConversation(conversationId: string): Promise<ConversationState | null> {
    const key = `conversation:${conversationId}`;
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const key = `conversation:${conversationId}`;
    await this.client.del(key);
  }
}
```

### 10.3 Stateful Agent Execution

```typescript
// backend/src/modules/ai/agents/matching.agent.ts

export class MatchingAgent {
  async handleUserMessage(
    userId: string,
    conversationId: string,
    userMessage: string
  ) {
    // Load prior conversation state
    const conversationState = await conversationCache.getConversation(
      conversationId
    );

    // Update with new message
    const updatedState: ConversationState = {
      ...conversationState,
      messages: [
        ...conversationState.messages,
        {
          role: "user",
          content: userMessage,
          timestamp: new Date(),
        },
      ],
    };

    // Run agent with context
    const agentResponse = await this.matchingAgentRuntime.run({
      userMessage,
      conversationHistory: updatedState.messages.slice(-5), // Last 5 messages for context
      context: updatedState.context,
    });

    // Save updated state
    updatedState.messages.push({
      role: "assistant",
      content: agentResponse.message,
      timestamp: new Date(),
      metadata: {
        toolsCalled: agentResponse.toolsCalled,
        tokensUsed: agentResponse.tokensUsed,
        latencyMs: agentResponse.latencyMs,
      },
    });

    await conversationCache.saveConversation(updatedState);

    return agentResponse;
  }
}
```

---

## 11. Error Handling & Fallbacks

### 11.1 Graceful Degradation Strategy

```
┌─────────────────────────────────────────────────────────┐
│  User Request                                           │
└────────────┬────────────────────────────────────────────┘
             │
    ┌────────▼────────┐
    │ Try Gemini API  │
    └────────┬────────┘
             │
     ┌───────┴────────┐
     │                │
  SUCCESS          FAIL (rate limit,
     │               timeout, error)
     │                │
     │          ┌─────▼──────────┐
     │          │ Wait + Retry   │ (exponential backoff)
     │          │ (up to 3x)     │
     │          └─────┬──────────┘
     │                │
     │       ┌────────┴────────┐
     │       │                 │
     │    SUCCESS            FAIL
     │       │                 │
     │       │            ┌────▼──────────────┐
     │       │            │ Fall back to      │
     │       │            │ Claude API        │
     │       │            └────┬──────────────┘
     │       │                 │
     │       │        ┌────────┴────────┐
     │       │        │                 │
     │       │     SUCCESS            FAIL
     │       │        │                 │
     │       │        │            ┌────▼──────────────┐
     │       │        │            │ Return cached     │
     │       │        │            │ results or        │
     │       │        │            │ fallback response │
     │       │        │            └────┬──────────────┘
     │       │        │                 │
     └───────┴────────┴─────────────────┘
             │
      ┌──────▼────────┐
      │ Return result │
      └───────────────┘
```

### 11.2 Implementation

```typescript
// backend/src/integrations/ai/ai-client.ts

export class HajoAIClient {
  async executeWithFallback(
    request: AIRequest,
    options: { maxRetries: number; timeout: number }
  ) {
    // Attempt 1: Gemini (primary)
    try {
      return await this.executeGemini(request, options.timeout);
    } catch (error) {
      if (error instanceof RateLimitError && options.maxRetries > 0) {
        // Exponential backoff
        await sleep(2 ** (3 - options.maxRetries) * 1000);
        options.maxRetries--;
        return this.executeWithFallback(request, options);
      }
      // If Gemini fails, try Claude
    }

    // Attempt 2: Claude (fallback)
    try {
      logger.warn("Gemini failed, falling back to Claude");
      return await this.executeClaude(request, options.timeout);
    } catch (error) {
      // If Claude fails, return cached response
    }

    // Fallback 3: Cached result
    const cached = await cacheStore.get(`ai_response:${request.key}`);
    if (cached) {
      logger.warn("Both APIs failed, returning cached response");
      return {
        ...cached,
        isCached: true,
      };
    }

    // Final fallback: Generic response
    return {
      success: false,
      message: "Sorry, I'm having trouble processing your request. Please try again in a moment.",
      isCached: false,
    };
  }

  private async executeGemini(request: AIRequest, timeoutMs: number) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await this.geminiClient.complete({
        messages: request.messages,
        tools: request.tools,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  private async executeClaude(request: AIRequest, timeoutMs: number) {
    // Similar implementation for Claude
  }
}
```

### 11.3 Error Types & Logging

```typescript
export class AIError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider: "gemini" | "claude",
    public retryable: boolean
  ) {
    super(message);
  }
}

export class RateLimitError extends AIError {
  constructor(provider: "gemini" | "claude", waitSeconds: number) {
    super(
      `Rate limited by ${provider}. Retry after ${waitSeconds}s`,
      "RATE_LIMIT",
      provider,
      true
    );
  }
}

// Usage
try {
  await aiClient.execute(request);
} catch (error) {
  if (error instanceof RateLimitError) {
    // Implement backoff
  } else if (error instanceof AIError) {
    logger.error({
      level: "error",
      provider: error.provider,
      code: error.code,
      retryable: error.retryable,
      message: error.message,
    });
  }
}
```

---

## 12. Performance & Optimization

### 12.1 Latency Targets

| Operation | Target (p95) | Measurement |
|---|---|---|
| Provider Search | 1.5s | Query → Response to client |
| Credit Score Calc | 2.0s | Start → Complete calculation |
| Insights Generation | 3.0s | Start → Dashboard render |
| Notification Gen | 0.5s | Trigger → Send SMS/Push |

### 12.2 Optimization Strategies

#### **1. Caching Layer**

```typescript
// Cache provider search results for 15 minutes
export async function searchProviders(params: SearchParams) {
  const cacheKey = `providers:${JSON.stringify(params)}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const results = await queryDatabase(params);
  await redis.setex(cacheKey, 900, JSON.stringify(results)); // 15 min TTL

  return results;
}
```

#### **2. Batch Processing**

```typescript
// Score multiple providers in one pass instead of sequential calls
export async function batchCalculateScores(
  providerIds: string[]
) {
  const providers = await prisma.provider.findMany({
    where: { id: { in: providerIds } },
    include: {
      transactions: { where: { createdAt: { gte: twelveMonthsAgo } } },
      bookings: { where: { createdAt: { gte: twelveMonthsAgo } } },
    },
  });

  return providers.map((p) => calculateScore(p)); // Parallel
}
```

#### **3. Vectorized Searching**

```typescript
// Use embeddings for semantic search
const embedding = await generateEmbedding(userQuery);

const similarProviders = await vectorDb.search({
  embedding,
  topK: 50, // Broader search
  threshold: 0.7,
});

// Narrow down with exact filters
const filtered = similarProviders.filter(
  (p) => p.distance < 5 && p.rating >= 4
);
```

#### **4. Async Scoring**

```typescript
// Don't wait for score calculation; return immediately
export async function getProvider(providerId: string) {
  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
  });

  // Fire-and-forget: update score in background
  updateCreditScoreAsync(providerId);

  return provider;
}

async function updateCreditScoreAsync(providerId: string) {
  const score = await calculateScore(providerId);
  await cacheStore.set(`score:${providerId}`, score);
}
```

### 12.3 Monitoring & Alerts

```typescript
// backend/src/middleware/ai.telemetry.ts

export function recordAIMetrics(agentName: string, operation: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - startTime;
      const status = res.statusCode;

      metrics.histogram("ai.operation.duration_ms", duration, {
        agent: agentName,
        operation,
        status,
      });

      if (duration > 3000) {
        logger.warn(`Slow AI operation: ${agentName}/${operation} took ${duration}ms`);
      }
    });

    next();
  };
}

// Route usage
router.post(
  "/match",
  recordAIMetrics("matching", "search"),
  handleMatchingRequest
);
```

---

## 13. Deployment & Monitoring

### 13.1 Deployment Architecture

```
┌─────────────────┐
│  GitHub Actions │ (CI/CD)
│  On: push main  │
└────────┬────────┘
         │
   ┌─────▼──────────────────────────────┐
   │ 1. Run Tests                        │
   │ 2. Build Docker Image               │
   │ 3. Push to Container Registry       │
   └─────┬──────────────────────────────┘
         │
   ┌─────▼──────────────────────────────┐
   │ Kubernetes Deployment               │
   │ (If scaling)                        │
   │                                      │
   │  ├─ 2 replicas (always-on)          │
   │  ├─ HPA: scale to 5 on 80% CPU      │
   │  └─ Resource limits: 1CPU, 1GB RAM  │
   └─────┬──────────────────────────────┘
         │
   ┌─────▼──────────────────────────────┐
   │ Envoy / Reverse Proxy               │
   │ (Load balance, circuit break)       │
   └─────┬──────────────────────────────┘
         │
   ┌─────▼──────────────────────────────┐
   │ Gemini API (Primary)                │
   │ Claude API (Fallback)               │
   │ Redis Cache                         │
   │ PostgreSQL Database                 │
   └─────────────────────────────────────┘
```

### 13.2 Monitoring Stack

```yaml
# prometheus-config.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "Hajo-ai"
    static_configs:
      - targets: ["localhost:9090"]

rules:
  - alert: AIResponseSlow
    expr: ai_operation_duration_ms > 3000
    for: 5m
    annotations:
      summary: "AI operation slow ({{ $value }}ms)"

  - alert: HighErrorRate
    expr: rate(ai_errors_total[5m]) > 0.05
    for: 2m
    annotations:
      summary: "High AI error rate"

  - alert: GeminiRateLimited
    expr: increase(gemini_rate_limit_errors[5m]) > 10
    for: 1m
    annotations:
      summary: "Gemini API rate limited"
```

### 13.3 Key Metrics to Track

```typescript
export const AI_METRICS = {
  // Latency
  "ai.operation.duration_ms": "Histogram", // Per agent, per operation
  "ai.tool_call.duration_ms": "Histogram", // Per tool

  // Errors
  "ai.errors.total": "Counter", // By error type
  "ai.fallback.rate": "Gauge", // % of requests hitting fallback

  // Usage
  "ai.requests.total": "Counter", // By agent, by operation
  "ai.tokens_used.total": "Counter", // By provider
  "ai.cost.dollars": "Counter", // By provider, by operation

  // Quality
  "ai.response.rating": "Histogram", // User satisfaction (1-5)
  "ai.provider_matches.relevance": "Histogram", // Top match click-through rate

  // Cache
  "ai.cache.hits": "Counter",
  "ai.cache.misses": "Counter",
};
```

---

## 14. Configuration & Secrets

### 14.1 Environment Variables

```bash
# .env.example (backend)

# LLM Providers
GOOGLE_API_KEY=xxx
ANTHROPIC_API_KEY=xxx

# AI Configuration
AI_PRIMARY_PROVIDER=gemini
AI_GEMINI_MODEL=gemini-2.0-flash
AI_CLAUDE_MODEL=claude-3-5-opus-20250219
AI_FALLBACK_ENABLED=true
AI_MAX_RETRIES=3
AI_TIMEOUT_MS=30000

# Agent Settings
AGENT_MAX_ITERATIONS=5
AGENT_SYSTEM_PROMPT_VERSION=v1

# Caching
REDIS_URL=redis://localhost:6379
CACHE_TTL_MINUTES=15
CONVERSATION_CACHE_TTL_DAYS=7

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_REQUESTS_PER_HOUR=1000

# Database (existing)
DATABASE_URL=postgresql://...

# API Keys (existing)
SQUAD_API_KEY=xxx
TERMII_API_KEY=xxx
```

### 14.2 Configuration Loading

```typescript
// backend/src/config/ai.ts

import { z } from "zod";

const AIConfigSchema = z.object({
  primaryProvider: z.enum(["gemini", "claude"]).default("gemini"),
  geminiModel: z.string().default("gemini-2.0-flash"),
  claudeModel: z.string().default("claude-3-5-opus-20250219"),
  geminiApiKey: z.string(),
  claudeApiKey: z.string(),
  fallbackEnabled: z.boolean().default(true),
  maxRetries: z.number().default(3),
  timeoutMs: z.number().default(30000),
  maxIterations: z.number().default(5),
});

export const aiConfig = AIConfigSchema.parse({
  primaryProvider: process.env.AI_PRIMARY_PROVIDER,
  geminiModel: process.env.AI_GEMINI_MODEL,
  claudeModel: process.env.AI_CLAUDE_MODEL,
  geminiApiKey: process.env.GOOGLE_API_KEY,
  claudeApiKey: process.env.ANTHROPIC_API_KEY,
  fallbackEnabled: process.env.AI_FALLBACK_ENABLED === "true",
  maxRetries: parseInt(process.env.AI_MAX_RETRIES || "3"),
  timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || "30000"),
  maxIterations: parseInt(process.env.AGENT_MAX_ITERATIONS || "5"),
});
```

---

## 15. Testing Strategy

### 15.1 Unit Tests

```typescript
// backend/src/modules/ai/tests/matching.agent.test.ts

describe("Matching Agent", () => {
  let agent: MatchingAgent;

  beforeEach(() => {
    agent = new MatchingAgent(mockGeminiClient);
  });

  it("should find providers matching search criteria", async () => {
    const result = await agent.handleUserMessage(
      "Find a plumber in Lekki"
    );

    expect(result.success).toBe(true);
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.matches[0]).toHaveProperty("name");
    expect(result.matches[0]).toHaveProperty("rating");
  });

  it("should rank providers by distance and rating", async () => {
    const result = await agent.handleUserMessage(
      "Find electricians near me"
    );

    const distances = result.matches.map((m) => m.distanceKm);
    expect(distances).toEqual([...distances].sort());
  });

  it("should handle empty results gracefully", async () => {
    const result = await agent.handleUserMessage(
      "Find a Martian repair specialist"
    );

    expect(result.success).toBe(true);
    expect(result.matches.length).toBe(0);
    expect(result.message).toContain("No providers found");
  });
});
```

### 15.2 Integration Tests

```typescript
// backend/src/modules/ai/tests/ai-integration.test.ts

describe("AI Integration", () => {
  it("should handle end-to-end matching flow", async () => {
    // 1. User message
    const response = await request(app)
      .post("/api/ai/match")
      .send({
        query: "I need a plumber in Lekki today",
        location: { lat: 6.5244, lng: 3.3792 },
      });

    expect(response.status).toBe(200);
    expect(response.body.matches).toBeDefined();

    // 2. Verify tools were called
    expect(mockDatabase.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM providers")
    );

    // 3. Verify response format
    expect(response.body.matches[0]).toMatchObject({
      providerId: expect.any(String),
      name: expect.any(String),
      rating: expect.any(Number),
      distance_km: expect.any(Number),
    });
  });

  it("should fallback to Claude on Gemini failure", async () => {
    mockGeminiClient.complete.mockRejectedOnce(
      new Error("API Error")
    );

    const response = await request(app)
      .post("/api/ai/match")
      .send({ query: "Find electricians" });

    expect(response.status).toBe(200); // Should still succeed
    expect(mockClaudeClient.complete).toHaveBeenCalled();
  });
});
```

### 15.3 Load Tests

```bash
# Using k6 for load testing
# test-ai-api.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up
    { duration: '2m', target: 100 },   // Stay at 100
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% must complete in 2s
    http_req_failed: ['rate<0.1'],      // Error rate < 10%
  },
};

export default function() {
  const payload = JSON.stringify({
    query: 'Find electricians in Lagos',
    location: { lat: 6.5244, lng: 3.3792 },
  });

  const response = http.post(
    'http://localhost:3000/api/ai/match',
    payload,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
```

---

## Conclusion

This documentation provides a complete blueprint for integrating the PI-Agent SDK with the Hajo platform using Gemini as the primary LLM. The architecture supports:

✅ **Multi-agent orchestration** (matching, scoring, insights, notifications)
✅ **Intelligent tool composition** with deterministic execution
✅ **Gemini + Claude hybrid** for optimal cost/quality
✅ **Production-ready** state management, error handling, monitoring
✅ **Scalable** from MVP to 100k+ users
✅ **African market** compliance and context awareness

**Next Steps:**
1. Set up development environment (Phase 1)
2. Implement PI-Agent SDK integration skeleton
3. Deploy Gemini API client with fallback routing
4. Build matching agent with core tools
5. Test end-to-end flow with real providers
6. Add credit scoring agent
7. Integrate into existing Hajo backend
8. Deploy to production with monitoring

---

**Questions?** See [System_design_nextjs.md](System_design_nextjs.md) for overall architecture, or [phases/README.md](phases/README.md) for phase-by-phase build plan.

