# Blood Flow & System Workflow

## Standard Flow

1. **Donor** donates blood at a **Blood Bank**.
2. **Blood Bank** tests, stores, and updates **Inventory**.
3. **Patient** (or Hospital) requests blood via the system.
4. **Blood Bank** reviews, approves, and fulfills requests.
5. **Inventory** is updated (units deducted, status changed).

## Emergency Request Handling
- Emergency requests are flagged and prioritized in the dashboard.
- Blood Bank staff receive alerts and can fast-track approval.
- If inventory is low, system can notify other banks or donors.

## Inventory Update Logic
- On donation: Add units to inventory, set expiry.
- On request approval: Deduct units, update status.
- On expiry: Mark units as expired, remove from available stock.

---

**Why:**
- Professors and reviewers can visualize the real-world process and system logic.
