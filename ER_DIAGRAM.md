# ER Diagram

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

See ARCHITECTURE.md for detailed relationship explanations.
