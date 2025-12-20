
# Entity Relationship Diagram (ERD)

```
USER
│
├── DONOR
│     └── (userId)
│
├── PATIENT
│     └── (userId)
│
└── BLOODBANK
	└── (userId)
	     │
	     ├── BLOOD_INVENTORY
	     │       └── (bloodBankId)
	     │
	     └── BLOOD_REQUEST
			 ├── (bloodBankId)
			 └── (patientId)
```

## Explanation of Relationships

- **User**: Base entity for authentication and role management. Each user can be a Donor, Patient, or Blood Bank Staff.
- **Donor**: Linked to a User (userId). Stores donor-specific info (blood group, last donation, etc).
- **Patient**: Linked to a User (userId). Can be an individual or hospital. Stores patient/hospital info.
- **BloodBank**: Linked to a User (userId). Represents staff and blood bank details.
- **BloodInventory**: Linked to a BloodBank (bloodBankId). Tracks blood units, type, expiry, and status.
- **BloodRequest**: Linked to a Patient (patientId) and BloodBank (bloodBankId). Represents requests for blood, status, urgency, and fulfillment.

**Key Relationships:**
- One User → One Donor/Patient/BloodBank
- One BloodBank → Many BloodInventory
- One Patient → Many BloodRequest
- One BloodBank → Many BloodRequest (as fulfiller)
