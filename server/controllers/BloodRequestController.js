const BloodRequest = require('../models/BloodRequest');
const BloodInventory = require('../models/BloodInventory');
const Patient = require('../models/Patient');
const BloodBank = require('../models/BloodBank');

exports.createRequest = async (req, res) => {
  const { bloodGroup, unitsRequested, urgency } = req.body;
  try {
    // Find patient profile
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const request = new BloodRequest({
      patientId: patient._id,
      bloodGroup,
      unitsRequested,
      urgency: urgency || 'NORMAL'
    });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'PATIENT') {
      // Find patient profile and get their requests
      const patient = await Patient.findOne({ userId: req.user.id });
      if (patient) {
        requests = await BloodRequest.find({ patientId: patient._id });
      } else {
        requests = [];
      }
    } else if (req.user.role === 'BLOODBANK') {
      requests = await BloodRequest.find()
        .populate('patientId', 'userId')
        .populate({
          path: 'patientId',
          populate: {
            path: 'userId',
            select: 'name'
          }
        });
    } else {
      requests = await BloodRequest.find()
        .populate('patientId', 'userId')
        .populate({
          path: 'patientId',
          populate: {
            path: 'userId',
            select: 'name'
          }
        });
    }
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Find blood bank profile
    const bloodBank = await BloodBank.findOne({ userId: req.user.id });
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank profile not found' });
    }

    // Check if blood bank has enough units
    const inventory = await BloodInventory.findOne({
      bloodBankId: bloodBank._id,
      bloodGroup: request.bloodGroup,
      status: 'VALID'
    });

    if (!inventory || inventory.units < request.unitsRequested) {
      return res.status(400).json({ message: 'Insufficient blood units' });
    }

    request.status = 'APPROVED';
    request.bloodBankId = bloodBank._id;
    request.processedAt = new Date();
    await request.save();

    // Update inventory
    inventory.units -= request.unitsRequested;
    await inventory.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'REJECTED';
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.completeRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'COMPLETED';
    request.processedAt = new Date();
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchBlood = async (req, res) => {
  const { bloodGroup, location } = req.query;
  try {
    const inventory = await BloodInventory.find({
      bloodGroup,
      units: { $gt: 0 },
      status: 'VALID'
    }).populate('bloodBankId', 'bloodBankName address city contactNumber');
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};