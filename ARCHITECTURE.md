USER
│
├── userId (PK)
├── name
├── email (Unique)
├── password
├── role (ENUM: DONOR, PATIENT, BLOODBANK, ADMIN)
├── phone
├── createdAt
└── status

│ 1 : 1 (Optional Specialization Based on Role)
│
├───────────────┬────────────────┬────────────────
│               │                │
DONOR        PATIENT         BLOOD_BANK
│               │                │
├── donorId(PK) ├── patientId(PK) ├── bloodBankId(PK)
├── userId(FK)  ├── userId(FK)    ├── userId(FK)
├── bloodGroup  ├── type (IND/HOSP) ├── licenseNo
├── weight      ├── hospitalName     ├── address
├── lastDonation ├── address          ├── contactPerson
├── availability ├── contactDetails   ├── geoLocation
└── isVerified   └── isVerified       └── isVerified

BLOOD_INVENTORY
│
├── inventoryId (PK)
├── bloodBankId (FK)
├── bloodGroup
├── unitsAvailable
├── expiryDate
├── componentType (Whole, Platelets, Plasma)
├── lastUpdated
└── status

BLOOD_REQUEST
│
├── requestId (PK)
├── patientId (FK)
├── bloodGroup
├── unitsRequired
├── urgency (Low/Medium/High/Critical)
├── hospitalAddress
├── requiredDate
├── status (Pending/Approved/Rejected/Fulfilled)
├── createdAt
└── notes

REQUEST_ASSIGNMENT (New Table – Important)
│
├── assignmentId (PK)
├── requestId (FK)
├── bloodBankId (FK)
├── unitsApproved
├── assignedAt
└── fulfillmentStatus
