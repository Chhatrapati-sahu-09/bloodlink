const mongoose = require('mongoose');
const User = require('./models/User');
const Donor = require('./models/Donor');
const Patient = require('./models/Patient');
const BloodBank = require('./models/BloodBank');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bloodbank';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Clear existing data
  await User.deleteMany({});
  await Donor.deleteMany({});
  await Patient.deleteMany({});
  await BloodBank.deleteMany({});

  // --- Donors ---
  const donors = [
    { name: 'Amit Sharma', email: 'amit.sharma@example.com', password: 'Password123', role: 'DONOR', phone: '9876543210', bloodGroup: 'A+', age: 28, weight: 72, medicalConditions: '', lastDonationDate: new Date('2023-09-01') },
    { name: 'Priya Singh', email: 'priya.singh@example.com', password: 'Password123', role: 'DONOR', phone: '9876543211', bloodGroup: 'B+', age: 32, weight: 65, medicalConditions: '', lastDonationDate: new Date('2023-08-15') },
    { name: 'Rahul Verma', email: 'rahul.verma@example.com', password: 'Password123', role: 'DONOR', phone: '9876543212', bloodGroup: 'O-', age: 24, weight: 80, medicalConditions: '', lastDonationDate: new Date('2023-07-10') },
    { name: 'Sneha Patel', email: 'sneha.patel@example.com', password: 'Password123', role: 'DONOR', phone: '9876543213', bloodGroup: 'AB+', age: 29, weight: 58, medicalConditions: '', lastDonationDate: new Date('2023-10-01') },
    { name: 'Vikram Rao', email: 'vikram.rao@example.com', password: 'Password123', role: 'DONOR', phone: '9876543214', bloodGroup: 'A-', age: 35, weight: 75, medicalConditions: '', lastDonationDate: new Date('2023-06-20') },
    { name: 'Meena Joshi', email: 'meena.joshi@example.com', password: 'Password123', role: 'DONOR', phone: '9876543215', bloodGroup: 'B-', age: 27, weight: 62, medicalConditions: '', lastDonationDate: new Date('2023-05-18') },
    { name: 'Rohit Saini', email: 'rohit.saini@example.com', password: 'Password123', role: 'DONOR', phone: '9876543216', bloodGroup: 'O+', age: 31, weight: 85, medicalConditions: '', lastDonationDate: new Date('2023-11-01') },
    { name: 'Kavita Nair', email: 'kavita.nair@example.com', password: 'Password123', role: 'DONOR', phone: '9876543217', bloodGroup: 'AB-', age: 26, weight: 60, medicalConditions: '', lastDonationDate: new Date('2023-09-15') },
    { name: 'Suresh Kumar', email: 'suresh.kumar@example.com', password: 'Password123', role: 'DONOR', phone: '9876543218', bloodGroup: 'A+', age: 40, weight: 90, medicalConditions: '', lastDonationDate: new Date('2023-08-01') },
    { name: 'Pooja Mehra', email: 'pooja.mehra@example.com', password: 'Password123', role: 'DONOR', phone: '9876543219', bloodGroup: 'B+', age: 22, weight: 55, medicalConditions: '', lastDonationDate: new Date('2023-07-25') },
  ];

  for (const d of donors) {
    const user = await User.create({ name: d.name, email: d.email, password: d.password, role: d.role, phone: d.phone });
    await Donor.create({ userId: user._id, bloodGroup: d.bloodGroup, age: d.age, weight: d.weight, medicalConditions: d.medicalConditions, lastDonationDate: d.lastDonationDate });
  }

  // --- Patients ---
  const patients = [
    { name: 'Sunil Gupta', email: 'sunil.gupta@example.com', password: 'Password123', role: 'PATIENT', phone: '9000000001', patientType: 'INDIVIDUAL', address: '123 Main St', city: 'Delhi' },
    { name: 'Anita Desai', email: 'anita.desai@example.com', password: 'Password123', role: 'PATIENT', phone: '9000000002', patientType: 'INDIVIDUAL', address: '456 Park Ave', city: 'Mumbai' },
    { name: 'Ramesh Yadav', email: 'ramesh.yadav@example.com', password: 'Password123', role: 'PATIENT', phone: '9000000003', patientType: 'INDIVIDUAL', address: '789 Lake Rd', city: 'Bangalore' },
    { name: 'City Hospital', email: 'city.hospital@example.com', password: 'Password123', role: 'PATIENT', phone: '9000000004', patientType: 'HOSPITAL', hospitalName: 'City Hospital', address: '101 Hospital Rd', city: 'Chennai' },
    { name: 'Global Health', email: 'global.health@example.com', password: 'Password123', role: 'PATIENT', phone: '9000000005', patientType: 'HOSPITAL', hospitalName: 'Global Health', address: '202 Clinic St', city: 'Hyderabad' },
    { name: 'Priya Malhotra', email: 'priya.malhotra@example.com', password: 'Password123', role: 'PATIENT', phone: '9000000006', patientType: 'INDIVIDUAL', address: '303 River Rd', city: 'Pune' },
    { name: 'Aarav Jain', email: 'aarav.jain@example.com', password: 'Password123', role: 'PATIENT', phone: '9000000007', patientType: 'INDIVIDUAL', address: '404 Hill St', city: 'Kolkata' },
    { name: 'Apollo Hospital', email: 'apollo.hospital@example.com', password: 'Password123', role: 'PATIENT', phone: '9000000008', patientType: 'HOSPITAL', hospitalName: 'Apollo Hospital', address: '505 Med Rd', city: 'Delhi' },
    { name: 'Neha Kapoor', email: 'neha.kapoor@example.com', password: 'Password123', role: 'PATIENT', phone: '9000000009', patientType: 'INDIVIDUAL', address: '606 Green Ave', city: 'Ahmedabad' },
    { name: 'Max Care', email: 'max.care@example.com', password: 'Password123', role: 'PATIENT', phone: '9000000010', patientType: 'HOSPITAL', hospitalName: 'Max Care', address: '707 Wellness St', city: 'Jaipur' },
  ];

  for (const p of patients) {
    const user = await User.create({ name: p.name, email: p.email, password: p.password, role: p.role, phone: p.phone });
    await Patient.create({ userId: user._id, patientType: p.patientType, hospitalName: p.hospitalName, address: p.address, city: p.city });
  }

  // --- Staff (Blood Bank) ---
  const staff = [
    { name: 'Dr. Alok Mishra', email: 'alok.mishra@example.com', password: 'Password123', role: 'BLOODBANK', phone: '8000000001', bloodBankName: 'Red Cross', licenseNumber: 'LIC12345', address: '1 Red Cross Rd', city: 'Delhi' },
    { name: 'Dr. Seema Rao', email: 'seema.rao@example.com', password: 'Password123', role: 'BLOODBANK', phone: '8000000002', bloodBankName: 'LifeCare', licenseNumber: 'LIC23456', address: '2 LifeCare St', city: 'Mumbai' },
    { name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@example.com', password: 'Password123', role: 'BLOODBANK', phone: '8000000003', bloodBankName: 'BloodLink', licenseNumber: 'LIC34567', address: '3 BloodLink Ave', city: 'Bangalore' },
    { name: 'Dr. Nisha Jain', email: 'nisha.jain@example.com', password: 'Password123', role: 'BLOODBANK', phone: '8000000004', bloodBankName: 'Hope Blood Bank', licenseNumber: 'LIC45678', address: '4 Hope St', city: 'Chennai' },
    { name: 'Dr. Vivek Singh', email: 'vivek.singh@example.com', password: 'Password123', role: 'BLOODBANK', phone: '8000000005', bloodBankName: 'Unity Blood Bank', licenseNumber: 'LIC56789', address: '5 Unity Rd', city: 'Hyderabad' },
    { name: 'Dr. Anjali Mehta', email: 'anjali.mehta@example.com', password: 'Password123', role: 'BLOODBANK', phone: '8000000006', bloodBankName: 'CarePlus', licenseNumber: 'LIC67890', address: '6 CarePlus Ave', city: 'Pune' },
    { name: 'Dr. Sandeep Kaur', email: 'sandeep.kaur@example.com', password: 'Password123', role: 'BLOODBANK', phone: '8000000007', bloodBankName: 'HealWell', licenseNumber: 'LIC78901', address: '7 HealWell St', city: 'Kolkata' },
    { name: 'Dr. Ritu Sharma', email: 'ritu.sharma@example.com', password: 'Password123', role: 'BLOODBANK', phone: '8000000008', bloodBankName: 'SafeBlood', licenseNumber: 'LIC89012', address: '8 SafeBlood Rd', city: 'Ahmedabad' },
    { name: 'Dr. Manoj Joshi', email: 'manoj.joshi@example.com', password: 'Password123', role: 'BLOODBANK', phone: '8000000009', bloodBankName: 'LifeLine', licenseNumber: 'LIC90123', address: '9 LifeLine Ave', city: 'Jaipur' },
    { name: 'Dr. Shalini Gupta', email: 'shalini.gupta@example.com', password: 'Password123', role: 'BLOODBANK', phone: '8000000010', bloodBankName: 'BloodCare', licenseNumber: 'LIC01234', address: '10 BloodCare St', city: 'Delhi' },
  ];

  for (const s of staff) {
    const user = await User.create({ name: s.name, email: s.email, password: s.password, role: s.role, phone: s.phone });
    await BloodBank.create({ userId: user._id, bloodBankName: s.bloodBankName, licenseNumber: s.licenseNumber, address: s.address, city: s.city, contactNumber: s.phone });
  }

  console.log('Seed data inserted successfully!');
  process.exit();
}

seed().catch(err => { console.error(err); process.exit(1); });
