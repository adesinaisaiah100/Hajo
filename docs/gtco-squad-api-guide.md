# GTCO Squad API Guide

Last reviewed: 2026-05-12

This document summarizes how to use the GTCO Squad API based on the current official Squad documentation and is written for engineers integrating payments, virtual accounts, transfers, refunds, and webhooks.

## What Squad Is Good For

Squad gives you a few different integration patterns:

- Hosted checkout via `POST /transaction/initiate`
- Frontend payment modal via Squad public key
- Direct card, bank, and USSD collection APIs
- Virtual accounts for transfer-based collections
- Wallet-based payouts and bank transfers
- Refunds, transaction verification, and webhooks

For most teams, the safest order is:

1. Start with hosted checkout or the payment modal
2. Add webhook handling and transaction verification
3. Add virtual accounts if you need bank-transfer collections
4. Add transfers and refunds only after your reconciliation flow is solid

## Base URLs and Authentication

Official environment URLs in the current docs:

- Sandbox: `https://sandbox-api-d.squadco.com`
- Production: `https://api-d.squadco.com`

Authentication uses your secret key in the `Authorization` header:

```http
Authorization: Bearer YOUR_SECRET_KEY
Content-Type: application/json
```

Important notes:

- Secret keys are server-side only
- Public keys are for the payment modal only
- Many older examples on the docs site still show legacy-looking hostnames such as `sandbox-api.squadco.com` or `sandbox-api-squadco.com`
- For new integrations, prefer the environment base URLs explicitly listed on the current docs pages above

## Choose the Right Integration Path

### 1. Hosted checkout

Use this when you want Squad to return a `checkout_url` and handle payment UX for you.

Best for:

- Fastest integration
- Web and mobile backends
- Teams that do not want to collect raw payment credentials

Main endpoint:

- `POST /transaction/initiate`

Typical flow:

1. Your backend creates a unique transaction reference
2. Your backend calls Squad to initiate payment
3. Squad returns a `checkout_url`
4. You redirect the user to that URL
5. Squad sends a webhook when payment completes
6. Your backend verifies the transaction before giving value

### 2. Payment modal

Use this when you want a lighter frontend checkout without redirecting away from your page.

Best for:

- Web apps
- Faster checkout UX
- Card, bank, USSD, and transfer options in a hosted widget

Requirements:

- Use the Squad public key on the frontend
- Still rely on webhooks and server-side verification for final confirmation

### 3. Direct API integration

Use this when you want to build your own payment form and orchestration.

Best for:

- Custom payment experiences
- Full control of payment step handling

Important caution:

- Direct card collection is only for PCI-DSS-certified and profiled merchants according to the Squad docs

### 4. Virtual accounts

Use this when customers should pay via transfer to a dedicated account number.

Best for:

- Marketplaces
- Wallet top-ups
- Offline-to-online reconciliation
- Transfer-first Nigerian payment experiences

Important caution:

- Squad states your settlement account must be a GTBank account to create virtual accounts
- Squad also says you should provide your preferred account prefix to your Technical Account Manager before go-live

### 5. Transfer API

Use this when you want to pay out from your Squad wallet to bank accounts.

Best for:

- Vendor payouts
- Customer withdrawals
- Marketplace settlement tools

## Quick Start

### Step 1: Create sandbox access

According to the official docs, the standard setup is:

1. Create a Squad sandbox account
2. Get your test keys from the dashboard
3. Configure your webhook URL in the dashboard
4. Test end-to-end before switching to live credentials

### Step 2: Build your core data model

At minimum, store:

- Your internal order or payment ID
- `transaction_ref`
- Squad `gateway_ref` when returned
- Customer email and name
- Amount and currency
- Payment status
- Raw webhook payload
- Verification response payload
- Refund and payout references where relevant

### Step 3: Make transaction references unique

This matters a lot in Squad:

- Payment references must be unique
- Transfer references must be unique
- Transfer references must include your merchant ID as a prefix or suffix pattern as instructed by Squad

Recommended pattern:

```text
SBMERCHANTID_order_20260512_000123
```

## Core Payment Flow

### Initiate a hosted payment

Endpoint:

- `POST /transaction/initiate`

Useful request fields from the docs:

- `email`
- `amount`
- `initiate_type`
- `currency`
- `transaction_ref`
- `customer_name`
- `callback_url`
- `payment_channels`
- `metadata`
- `pass_charge`
- `sub_merchant_id` for aggregators

The `amount` is sent in the lowest currency unit:

- `10000` means `NGN 100`

Example server request:

```ts
const response = await fetch("https://sandbox-api-d.squadco.com/transaction/initiate", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "customer@example.com",
    amount: 250000,
    currency: "NGN",
    initiate_type: "inline",
    transaction_ref: "SBMERCHANTID_order_20260512_000123",
    customer_name: "Ada Okafor",
    callback_url: "https://yourapp.com/payments/callback",
    payment_channels: ["card", "bank", "ussd", "transfer"],
    metadata: {
      orderId: "order_20260512_000123",
      source: "hajo-web",
    },
    pass_charge: false,
  }),
});

const payload = await response.json();
```

Expected success outcome:

- A successful initiation returns a `checkout_url`
- You send the user there or open the modal equivalent

### Verify a payment

Endpoint:

- `GET /transaction/verify/{transaction_ref}`

Use verification to confirm the final payment state before giving value. The docs show statuses such as:

- `Success`
- `Failed`
- `Abandoned`
- `Pending`

Recommended rule:

- Treat the webhook as the trigger
- Treat the verification API as the source of truth before fulfillment

Example:

```ts
const verify = await fetch(
  `https://sandbox-api-d.squadco.com/transaction/verify/${transactionRef}`,
  {
    headers: {
      Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
    },
  }
);

const verification = await verify.json();
```

## Payment Modal

The official modal docs use the Squad frontend script and a public key. The important parameters are:

- `key`
- `email`
- `amount`
- `transaction_ref`
- `currency_code`
- `payment_channels`
- `customer_name`
- `callback_url`
- `metadata`
- `pass_charge`

Practical rules:

- Use the public key on the client
- Generate `transaction_ref` on the server if possible
- Never treat modal success callbacks alone as proof of payment
- Wait for webhook plus verification

## Direct API Integration

Direct API integration supports:

- Card
- GTBank account debit
- USSD

Key points from the docs:

- Card flows can require PIN, OTP, PIN plus OTP, or 3DS
- The next step depends on `transaction_status` after the initial charge request
- GTBank account debit requires validation after initiation
- USSD uses a similar initiate-and-complete pattern

Use direct integration only if you truly need custom orchestration. Hosted checkout is simpler and safer for most builds.

## Webhooks

Webhooks are essential for production-grade Squad integrations.

According to the docs:

- Configure webhook URL on the dashboard
- Configure redirect URL separately if needed
- Implement duplicate transaction protection
- Return a successful acknowledgment when you process the event

Typical payment webhook event:

- `charge_successful`

Common fields shown in sample payloads:

- `TransactionRef`
- `Body.amount`
- `Body.transaction_ref`
- `Body.gateway_ref`
- `Body.transaction_status`
- `Body.email`
- `Body.currency`
- `Body.transaction_type`
- `Body.merchant_amount`
- `Body.created_at`
- `Body.meta`
- `Body.is_recurring`

### Signature validation

The current signature validation page says Squad sends `x-squad-encrypted-body` and that it is an HMAC SHA512 signature of the payload using your secret key.

Node example:

```ts
import crypto from "node:crypto";

export function isValidSquadWebhook(rawBody: string, signature: string) {
  const expected = crypto
    .createHmac("sha512", process.env.SQUAD_SECRET_KEY!)
    .update(rawBody)
    .digest("hex")
    .toUpperCase();

  return expected === signature;
}
```

Recommended webhook handling order:

1. Read the raw request body
2. Validate `x-squad-encrypted-body`
3. Parse JSON
4. Check idempotency using `transaction_ref` or event identifier
5. Call verification API
6. Fulfill only if verification confirms success
7. Store the webhook payload and verification result

Important note:

- Some Squad docs, especially under virtual accounts, also reference fields like `encrypted_body` and in one place mention `x-squad-signature`
- For a live virtual-account rollout, confirm the exact expected validation header and payload version with Squad support or your Technical Account Manager

## Virtual Accounts

Virtual accounts are one of the strongest Squad features for Nigerian transfer-based collections.

Main uses:

- One customer, one reserved account
- Easier reconciliation
- Lower checkout friction for transfer-preferring users

Key official notes:

- Settlement account must be GTBank
- Customer model includes strict BVN validation against name, DOB, gender, and phone number
- Webhook setup is required to receive payment notifications

Useful endpoints:

- `POST /virtual-account`
- `GET /virtual-account/customer/transactions/{customer_identifier}`
- `GET /virtual-account/merchant/accounts`

Recommended virtual-account flow:

1. Create a customer record in your app
2. Create the Squad virtual account with a stable `customer_identifier`
3. Save the returned account number
4. Show the account to the customer
5. Listen for virtual-account webhook notifications
6. Reconcile funds to the internal customer wallet or order

What to store for reconciliation:

- `customer_identifier`
- `virtual_account_number`
- `transaction_reference`
- `principal_amount`
- `settled_amount`
- `fee_charged`
- `transaction_date`
- `currency`
- Sender details if present

## Transfers and Payouts

Squad transfer APIs move funds from your Squad wallet to bank accounts.

Recommended flow:

1. Lookup recipient account first
2. Show the resolved account name to an operator or user
3. Create a unique transfer reference including your merchant ID
4. Initiate the transfer
5. Re-query or review status when timeouts occur

Key endpoints:

- `POST /payout/account/lookup`
- `POST /payout/transfer`
- `GET /payout/list`
- `GET /merchant/balance`

Important transfer rule from the docs:

- Squad says the transfer `transaction_reference` must include your merchant ID, otherwise the transfer can fail

Error-handling note:

- The transfer docs list `424` as a timeout or failed state that should be re-queried

## Refunds

Endpoint:

- `POST /transaction/refund`

Required fields called out by Squad:

- `gateway_transaction_ref`
- `transaction_ref`
- `refund_type`
- `reason_for_refund`
- `refund_amount`

Operational advice:

- Only allow refunds against previously verified successful transactions
- Persist who initiated the refund and why
- Reconcile refund events against your own order state

## Recommended Integration Architecture

For a production app, keep Squad behind your backend.

Recommended responsibilities:

- Frontend: collect user intent, show payment states, open modal or redirect
- Backend: create references, call Squad APIs, validate webhooks, verify payments, update records
- Database: store webhook payloads, verification responses, payout attempts, refunds, and idempotency keys

Do not:

- Put secret keys in frontend code
- Fulfill on redirect alone
- Fulfill on modal callback alone
- Fulfill on webhook alone without verification
- Reuse transaction references

## Sandbox Testing Checklist

- Confirm your test keys work
- Initiate a payment and capture the `checkout_url`
- Complete a test payment
- Confirm your webhook endpoint receives the event
- Confirm signature validation works
- Confirm the verification API returns the expected final status
- Confirm your idempotency logic blocks duplicate fulfillment
- Test failed, pending, and abandoned payment behavior where available
- Test refund flow if your product needs refunds
- Test transfer reference formatting before payout rollout

For direct card tests, the current docs list these sample sandbox cards:

- `4242424242424242` for direct OTP validation
- `5200000000001096` for 3DS authentication
- `5555555555554444` for PIN plus OTP

## Go-Live Checklist

1. Switch base URL from sandbox to production
2. Replace sandbox keys with live keys
3. Reconfirm webhook and redirect URLs in the live dashboard
4. Reconfirm virtual-account profiling and prefix setup if using virtual accounts
5. Reconfirm merchant ID rules for transfer references
6. Test with small live transactions first
7. Add monitoring for webhook failures, verification mismatches, and payout failures

## Implementation Advice for Hajo

If we use Squad in Hajo, the most practical rollout is:

1. Use hosted checkout or the payment modal for customer payments
2. Use webhooks plus verification to mark bookings as paid
3. Add virtual accounts later for wallet funding or transfer-first users
4. Add payouts only after settlement, escrow, and dispute rules are clearly defined

That sequence keeps the first release simpler while leaving room for stronger marketplace payment flows later.

## Official Sources

This guide was compiled from the current official Squad docs pages:

- https://docs.squadco.com/
- https://docs.squadco.com/Payments/Initiate-payment/
- https://docs.squadco.com/Payments/verify-transaction/
- https://docs.squadco.com/Payments/squad-payment-modal/
- https://docs.squadco.com/Payments/direct-api-integration/
- https://docs.squadco.com/webhook-direct-url/webhook-and-direct-url/
- https://docs.squadco.com/webhook-direct-url/signature-validation/
- https://docs.squadco.com/Virtual-accounts/virtual-account/
- https://docs.squadco.com/Virtual-accounts/api-specifications/
- https://docs.squadco.com/Transfer-API/transfer-apis/
- https://docs.squadco.com/Transfer-API/wallet-balance
- https://docs.squadco.com/Others/refund-api/


