const Donor = require('../models/Donor');
const User = require('../models/User');

exports.getDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) return res.status(404).json({ message: 'Donor profile not found' });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDonorProfile = async (req, res) => {
  const { bloodGroup, age, weight, medicalConditions } = req.body;
  try {
    const existingDonor = await Donor.findOne({ userId: req.user.id });
    if (existingDonor) return res.status(400).json({ message: 'Donor profile already exists' });

    const donor = new Donor({
      userId: req.user.id,
      bloodGroup,
      age,
      weight,
      medicalConditions,
      isEligible: true
    });
    await donor.save();
    res.status(201).json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDonorProfile = async (req, res) => {
  const { bloodGroup, age, weight, medicalConditions, lastDonationDate } = req.body;
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) return res.status(404).json({ message: 'Donor profile not found' });

    donor.bloodGroup = bloodGroup || donor.bloodGroup;
    donor.age = age || donor.age;
    donor.weight = weight || donor.weight;
    donor.medicalConditions = medicalConditions || donor.medicalConditions;
    donor.lastDonationDate = lastDonationDate || donor.lastDonationDate;

    // Check eligibility (90 days rule)
    if (donor.lastDonationDate) {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      donor.isEligible = donor.lastDonationDate <= ninetyDaysAgo;
    }

    await donor.save();
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().populate('userId', 'name email phone');
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEligibleDonors = async (req, res) => {
  const { bloodGroup } = req.query;
  try {
    const donors = await Donor.find({
      bloodGroup,
      isEligible: true
    }).populate('userId', 'name email phone');
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};