const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank', required: true },
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  donationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'REJECTED'], default: 'PENDING' },
  notes: { type: String }
}, {
  timestamps: true
});

// Instance method to update inventory after donation
donationSchema.methods.updateInventory = async function() {
  if (this.status === 'COMPLETED') {
    const BloodInventory = mongoose.model('BloodInventory');

    // Calculate expiry date (42 days from donation)
    const expiryDate = new Date(this.donationDate);
    expiryDate.setDate(expiryDate.getDate() + 42);

    // Check if inventory entry exists for this blood group and expiry date
    let inventory = await BloodInventory.findOne({
      bloodBankId: this.bloodBankId,
      bloodGroup: this.bloodGroup,
      expiryDate: expiryDate
    });

    if (inventory) {
      // Update existing inventory
      inventory.units += this.units;
    } else {
      // Create new inventory entry
      inventory = new BloodInventory({
        bloodBankId: this.bloodBankId,
        bloodGroup: this.bloodGroup,
        units: this.units,
        expiryDate: expiryDate
      });
    }

    await inventory.save();

    // Update donor's last donation date
    const Donor = mongoose.model('Donor');
    await Donor.findByIdAndUpdate(this.donorId, {
      lastDonationDate: this.donationDate
    });
  }
};

module.exports = mongoose.model('Donation', donationSchema);