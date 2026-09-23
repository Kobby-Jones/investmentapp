# FINORA Security Specification & Test Protocol

## 1. Data Invariants
1. **User Identity & PII Isolation**: An investor can only access and modify their own `/users/{userId}` document. Users cannot self-escalate role to `admin` or modify their `kycStatus` directly.
2. **Subcollection Relational Integrity**: All portfolio holdings (`/users/{userId}/holdings/{holdingId}`) and transactions (`/users/{userId}/transactions/{transactionId}`) strictly belong to `userId == request.auth.uid` or an authorized administrator.
3. **Product Integrity**: Public users can read active investment products. Only verified administrators (`kobbyjones154@gmail.com` or doc in `/admins/{adminId}`) can create or update products.
4. **Withdrawal Accountability**: A user can only submit a withdrawal request where `incoming().userId == request.auth.uid`. Status updates (Approval/Rejection) are restricted to administrators.
5. **KYC Compliance Pipeline**: Users can submit their own KYC application (`incoming().userId == request.auth.uid`). Only compliance administrators can transition status to `Verified` or `Rejected`.
6. **Regulatory Audit Trail**: Audit logs are read-restricted to administrators. Authorized platform mutations append immutable logs.
7. **Temporal & Value Boundaries**: Numerical amounts must be positive numbers. Document IDs must conform to `^[a-zA-Z0-9_\-]+$` and `size() <= 128`.

---

## 2. The "Dirty Dozen" Attack Payloads

1. **Payload 01: Privilege Escalation (Shadow Role Injection)**
   - Target: `/users/victim_123`
   - Payload: `{ role: "admin", kycStatus: "Verified" }`
   - Expected Result: `PERMISSION_DENIED`

2. **Payload 02: Impersonated Withdrawal Extraction**
   - Target: `/withdrawals/wth_fake_01`
   - Payload: `{ userId: "other_user_456", amount: 50000, destination: "Hacker Account" }`
   - Expected Result: `PERMISSION_DENIED`

3. **Payload 03: Unauthorized Product Creation**
   - Target: `/products/prod_scam_01`
   - Payload: `{ name: "Guaranteed 100% Return Fund", minInvestment: 10 }` sent by non-admin.
   - Expected Result: `PERMISSION_DENIED`

4. **Payload 04: Self-Approved KYC Bypass**
   - Target: `/kyc_applications/kyc_01`
   - Payload: `{ status: "Verified" }` submitted by standard investor.
   - Expected Result: `PERMISSION_DENIED`

5. **Payload 05: Cross-Tenant Portfolio Holding Manipulation**
   - Target: `/users/investor_A/holdings/hold_99`
   - Payload: `{ units: 999999 }` written by investor B.
   - Expected Result: `PERMISSION_DENIED`

6. **Payload 06: Cross-Tenant Transaction Injection**
   - Target: `/users/investor_A/transactions/tx_fake`
   - Payload: `{ type: "deposit", amount: 1000000, status: "Completed" }` written by investor B.
   - Expected Result: `PERMISSION_DENIED`

7. **Payload 07: Buffer Overflow / Denial of Wallet via Giant ID**
   - Target: `/users/1.5KB_long_garbage_string_with_illegal_characters!@#$%^&*()`
   - Payload: Standard user profile.
   - Expected Result: `PERMISSION_DENIED` (fails `isValidId()`).

8. **Payload 08: Terminal State Override on Approved Withdrawal**
   - Target: `/withdrawals/wth_completed_01`
   - Payload: Modifying an already `Completed` withdrawal request without admin override.
   - Expected Result: `PERMISSION_DENIED`

9. **Payload 09: PII Scraping via Blanket List Query**
   - Target: `users` list without matching authenticated identity or admin privileges.
   - Expected Result: `PERMISSION_DENIED`

10. **Payload 10: Negative Value Injection**
    - Target: `/withdrawals/wth_neg`
    - Payload: `{ amount: -500 }`
    - Expected Result: `PERMISSION_DENIED`

11. **Payload 11: Audit Log Tampering**
    - Target: `/audit_logs/log_01`
    - Payload: Delete or modify an existing audit record.
    - Expected Result: `PERMISSION_DENIED` (Audit logs are append-only by authorized system).

12. **Payload 12: Unauthenticated Write**
    - Target: Any collection with unauthenticated `request.auth == null`.
    - Expected Result: `PERMISSION_DENIED` (Global safety net default deny).
