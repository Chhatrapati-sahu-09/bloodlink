const Donor = require('../models/Donor');

const createDonor = async (userId, donorData) => {
  const donor = new Donor({ userId, ...donorData });
  await donor.save(); // Eligibility updated in pre-save
  return donor;
};

const updateDonor = async (donorId, updateData) => {
  const donor = await Donor.findByIdAndUpdate(donorId, updateData, { new: true });
  return donor;
};

const getDonorByUserId = async (userId) => {
  return await Donor.findOne({ userId });
};

const updateEligibility = async (donorId) => {
  const donor = await Donor.findById(donorId);
  if (donor) {
    donor.updateEligibility();
    await donor.save();
  }
  return donor;
};

const getEligibleDonors = async (bloodGroup) => {
  return await Donor.find({ bloodGroup, eligible: true }).populate('userId', 'name email phone');
};

module.exports = {
  createDonor,
  updateDonor,
  getDonorByUserId,
  updateEligibility,
  getEligibleDonors
};