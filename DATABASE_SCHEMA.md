# MongoDB Database Schemas

## User Schema
```js
{
  name: String,
  email: String,
  password: String,
  role: String, // 'DONOR', 'PATIENT', 'BLOODBANK', 'ADMIN'
  phone: String,
  ...
}
```

## Donor Schema
```js
{
  userId: ObjectId, // ref: User
  bloodGroup: String,
  age: Number,
  weight: Number,
  medicalConditions: String,
  lastDonationDate: Date
}
```

## BloodInventory Schema
```js
{
  bloodBankId: ObjectId, // ref: BloodBank
  bloodGroup: String,
  units: Number,
  donationDate: Date,
  expiryDate: Date,
  status: String // 'AVAILABLE', 'USED', 'EXPIRED'
}
```

## BloodRequest Schema
```js
{
  patientId: ObjectId, // ref: Patient
  bloodBankId: ObjectId, // ref: BloodBank
  bloodGroup: String,
  units: Number,
  requestDate: Date,
  status: String, // 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'
  urgency: String, // 'Normal', 'Emergency'
  fulfilledBy: ObjectId, // ref: BloodBank
  fulfilledDate: Date
}
```

## Relationships
- User (1) → (1) Donor/Patient/BloodBank
- BloodBank (1) → (M) BloodInventory
- Patient (1) → (M) BloodRequest
- BloodBank (1) → (M) BloodRequest (as fulfiller)
