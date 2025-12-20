const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  medicalConditions: { type: String },
  lastDonationDate: { type: Date },
  isEligible: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Pre-save hook to automatically update eligibility
donorSchema.pre('save', function(next) {
  this.updateEligibility();
  next();
});

// Instance method to update eligibility based on 90-day rule
donorSchema.methods.updateEligibility = function() {
  if (!this.lastDonationDate) {
    this.isEligible = true;
    return;
  }
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  this.isEligible = this.lastDonationDate <= ninetyDaysAgo;
};

module.exports = mongoose.model('Donor', donorSchema);