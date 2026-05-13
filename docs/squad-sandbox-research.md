# Squad Sandbox Environment Research

**Date:** May 13, 2026  
**Hackathon Status:** Primary environment for SkillBridge integration  
**Environment:** Sandbox (NOT production)

---

## Overview

Squad provides a complete sandbox environment for testing and development before going live on production. For the SkillBridge hackathon, all integration work uses the **sandbox environment exclusively**. This document captures the sandbox architecture, credentials, testing tools, and integration specifics discovered during research.

---

## Environment URLs

### Sandbox (Development & Testing)
- **Base URL:** `https://sandbox-api-d.squadco.com`
- **Dashboard:** `https://dashboard.sandbox.squadco.com` (or similar sandbox dashboard)
- **Virtual Account Service:** Included in sandbox API
- **Payment Processing:** Full simulation available

### Production (Go-Live Only)
- **Base URL:** `https://api-d.squadco.com`
- **Dashboard:** `https://dashboard.squadco.com`
- **Note:** Do NOT use for hackathon; only for production after approval

**Important:** Use only the `-d` versions of the URLs. Older examples with different hostnames (`sandbox-api.squadco.com`, `sandbox-api-squadco.com`) are legacy and should be avoided in new integrations.

---

## Sandbox Credentials Setup

### How to Get Sandbox API Keys

1. Create a Squad sandbox account at `https://sandbox.squadco.com`
2. Log in to the sandbox dashboard
3. Navigate to **Settings → API Keys** (or equivalent)
4. Generate new API credentials:
   - **Secret Key** — Server-side only, used for API calls
   - **Public Key** — Client-side safe, used for payment modal
5. Copy keys into your local `.env` file

### Key Variables for `.env` (Sandbox)

```env
# Squad Sandbox API
SQUAD_SECRET_KEY=your_sandbox_secret_key_here
SQUAD_PUBLIC_KEY=your_sandbox_public_key_here
SQUAD_API_BASE=https://sandbox-api-d.squadco.com
SQUAD_ENVIRONMENT=sandbox

# Settlement Account (Sandbox)
# Use a test GTBank account or mock account number for sandbox
SQUAD_GTBANK_ACCOUNT_NUMBER=0123456789
SQUAD_MERCHANT_ID=your_test_merchant_id
```

**Critical for Hackathon:** The `.env.example` files across the project (root, backend, frontend) must clearly indicate that sandbox keys are required for testing.

---

## Virtual Accounts in Sandbox

### Virtual Account Creation

Squad's virtual account endpoint works in sandbox with full functionality. To create a virtual account:

**Endpoint:**
```http
POST https://sandbox-api-d.squadco.com/virtual-account
Authorization: Bearer YOUR_SANDBOX_SECRET_KEY
Content-Type: application/json
```

**Request Body:**
```json
{
  "customer_identifier": "user_uuid_12345",
  "display_name": "Ada Okafor",
  "mobile_num": "+2348012345678",
  "amount": 0,
  "note": "Virtual account for service booking deposits",
  "metadata": {
    "user_type": "service_provider",
    "role": "craftsperson"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "account_id": "virtual_account_id_xyz",
    "account_number": "0123456789",
    "bank_code": "058",
    "bank_name": "GTBank",
    "account_name": "Ada Okafor",
    "amount": 0,
    "virtual_account_type": "NUBAN",
    "created_at": "2026-05-13T10:30:00Z",
    "metadata": {
      "user_type": "service_provider",
      "role": "craftsperson"
    }
  }
}
```

### Virtual Account Transfers (Sandbox Testing)

In sandbox, you can simulate transfers to virtual accounts without actual bank involvement:

1. Use the virtual account number returned from creation
2. Simulate a bank transfer in the Squad dashboard testing tools
3. Verify the transaction appears in your reconciliation webhooks
4. Check that the customer's wallet or account balance updates

**Note:** Sandbox transfers are instant and do not require real bank processing.

---

## Test Payment Credentials

### Test Card Numbers (Sandbox Only)

These work only in sandbox and will fail on production:

| Card Type | Number | Exp | CVV | OTP/PIN | Expected Result |
|-----------|--------|-----|-----|---------|-----------------|
| Visa (Success) | `4111 1111 1111 1111` | Any future date | Any 3-digit | Any 4-digit | Success |
| Mastercard (Success) | `5555 5555 5555 4444` | Any future date | Any 3-digit | Any 4-digit | Success |
| Card (Declined) | `4000 0000 0000 0002` | Any future date | Any 3-digit | Any 4-digit | Declined |
| Card (3DS Required) | `4000 0000 0000 0010` | Any future date | Any 3-digit | Any 4-digit | 3DS prompt |

### Test Bank Accounts (Sandbox)

- **GTBank Test Account:** `0123456789` with any test amount
- **Other Banks:** Squad sandbox supports simulation of other major Nigerian banks; consult dashboard for test bank codes

### Test Phone Numbers

- Use any valid Nigerian phone format starting with `+234` or `0`
- Example: `+2348012345678` or `08098765432`
- OTP codes in sandbox are typically returned in the webhook or dashboard logs (not sent via SMS)

---

## Sandbox-Specific Features

### OTP Behavior
- **In Sandbox:** OTPs are typically displayed in logs or the dashboard, not sent via actual SMS
- **In Production:** OTPs are sent via real SMS using Termii or equivalent provider
- **Testing Strategy:** Capture OTP from logs or dashboard, enter in your UI to verify OTP verification flow

### Webhook Testing
- Configure a webhook URL pointing to your local ngrok tunnel or sandbox webhook receiver
- Example: `https://your-ngrok-url.ngrok.io/api/webhooks/squad`
- Squad sandbox sends real webhook events when you initiate transactions
- You can replay or resend webhooks from the dashboard for testing

### Transaction Limits
- Sandbox typically has no transaction amount limits
- Test both small (`NGN 100`) and large (`NGN 1,000,000+`) amounts
- Verify refunds and reversals work correctly

### Rate Limiting
- Sandbox may have relaxed rate limits compared to production
- Still good practice to test your retry logic and error handling

---

## Mock vs. Real Integration in Sandbox

### Current Backend Implementation (Phase 1)

The backend already includes mock fallbacks for sandbox:

**Termii SMS (Mock in Sandbox):**
```javascript
// From backend/src/integrations/termii/termii.sms.js
if (!hasValidTermiiCredentials()) {
  return mockSendOtp(phone, otp); // Logs to console
}
```

**Squad Virtual Account (Mock in Sandbox):**
```javascript
// From backend/src/integrations/squad/squad.virtualAccount.js
if (!client) {
  return buildMockVirtualAccount(user); // Deterministic mock
}
```

### Transition to Real Sandbox Credentials

Once you obtain sandbox API keys:

1. Add keys to `.env` in the backend folder
2. The code automatically switches from mock to real API calls
3. No code changes required; environment detection handles it
4. Test OTP SMS and virtual account creation against real Squad sandbox API

---

## Integration Checklist for Hackathon

### Before Starting Phase 2

- [ ] Sign up for Squad sandbox account
- [ ] Obtain sandbox API keys (Secret + Public)
- [ ] Add keys to `backend/.env` and root `.env.example`
- [ ] Update phase docs to reference sandbox environment
- [ ] Update system design to clarify sandbox-only for hackathon
- [ ] Test mock implementation works locally
- [ ] Switch to real sandbox API keys and test end-to-end
- [ ] Verify virtual account creation against real Squad API
- [ ] Set up webhook receiver for transaction events
- [ ] Document test credentials in team Slack or shared notes

### Before Phase 3 (Frontend Integration)

- [ ] Ensure frontend environment also uses sandbox API base URL
- [ ] Test payment modal with sandbox public key
- [ ] Verify refresh token flow works with backend sandbox auth
- [ ] Test OTP delivery and verification against real Termii sandbox (if available)

### Before Submission/Demo

- [ ] All integration tests pass with real sandbox credentials
- [ ] End-to-end flow: register → OTP → verify → virtual account creation → booking confirmed
- [ ] Webhook reconciliation tested
- [ ] Error scenarios tested (declined card, invalid OTP, etc.)

---

## Important Reminders

### DO NOT Mix Environments

- **Sandbox keys** only work against `https://sandbox-api-d.squadco.com`
- **Production keys** only work against `https://api-d.squadco.com`
- Using wrong keys against wrong URL results in 401 Unauthorized errors

### Sandbox Data is Ephemeral

- Sandbox data may be reset by Squad at any time
- Do not rely on sandbox data persisting between deployments
- Save important test scenarios and expected outcomes in code comments

### Move to Production Only After Approval

- Hackathon does not use production environment
- Production keys are obtained only after Squad approves your application
- Switching to production requires code configuration change but no logic change (only base URL and keys differ)

---

## Reference Links

- Squad Official Documentation: https://docs.squadco.com
- Squad Sandbox Dashboard: https://sandbox.squadco.com
- Squad API Docs (Sandbox): https://docs.squadco.com/v1/reference/sandbox-overview
- Virtual Accounts Guide: https://docs.squadco.com/v1/guides/virtual-accounts
- Webhooks Reference: https://docs.squadco.com/v1/guides/webhooks

---

## Summary

The **Squad sandbox environment** is a fully-featured testing ground for the SkillBridge hackathon. It supports:

✅ Virtual account creation and transfers  
✅ OTP-based authentication (mock or real)  
✅ Payment processing simulation  
✅ Webhook event delivery  
✅ Refunds and reversals  
✅ Wallet and transaction reconciliation  

**For the hackathon, always use sandbox.** Production credentials and URLs are not needed unless explicitly approved by Squad or the hackathon organizers.

