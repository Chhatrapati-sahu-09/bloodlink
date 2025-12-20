const BloodRequest = require('../models/BloodRequest');
const BloodInventory = require('../models/BloodInventory');
const User = require('../models/User');
const Patient = require('../models/Patient');

// Get patient dashboard data
const getPatientDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find patient profile
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Get user's requests
    const requests = await BloodRequest.find({ patientId: patient._id })
      .sort({ requestedAt: -1 })
      .limit(10);

    // Get available blood groups
    const availableBlood = await BloodInventory.aggregate([
      {
        $match: {
          units: { $gt: 0 },
          expiryDate: { $gt: new Date() }
        }
      },
      {
        $group: {
          _id: '$bloodGroup',
          totalUnits: { $sum: '$units' },
          bloodBanks: { $addToSet: '$bloodBankId' }
        }
      }
    ]);

    // Calculate stats
    const stats = {
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'PENDING').length,
      approvedRequests: requests.filter(r => r.status === 'APPROVED').length,
      completedRequests: requests.filter(r => r.status === 'COMPLETED').length,
      availableBloodGroups: availableBlood.length
    };

    res.json({
      recentRequests: requests,
      availableBlood,
      stats
    });
  } catch (error) {
    console.error('Error fetching patient dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search for available blood
const searchBlood = async (req, res) => {
  try {
    const { bloodGroup, location, units } = req.query;

    let filter = {
      units: { $gte: units || 1 },
      expiryDate: { $gt: new Date() }
    };

    if (bloodGroup) filter.bloodGroup = bloodGroup;

    const results = await BloodInventory.find(filter)
      .populate('bloodBankId', 'name location')
      .sort({ units: -1 });

    // Group by blood bank
    const groupedResults = results.reduce((acc, item) => {
      const bankId = item.bloodBankId._id.toString();
      if (!acc[bankId]) {
        acc[bankId] = {
          bloodBank: item.bloodBankId,
          bloodGroups: {}
        };
      }

      if (!acc[bankId].bloodGroups[item.bloodGroup]) {
        acc[bankId].bloodGroups[item.bloodGroup] = 0;
      }

      acc[bankId].bloodGroups[item.bloodGroup] += item.units;
      return acc;
    }, {});

    res.json(Object.values(groupedResults));
  } catch (error) {
    console.error('Error searching blood:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new blood request
const createBloodRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find patient profile
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const requestData = {
      patientId: patient._id,
      bloodGroup: req.body.bloodGroup,
      unitsRequested: req.body.unitsRequested,
      urgency: req.body.urgency || 'NORMAL',
      status: 'PENDING',
      requestedAt: new Date()
    };

    const request = new BloodRequest(requestData);
    await request.save();

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating blood request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get request tracking data
const getRequestTracking = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find patient profile
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const requests = await BloodRequest.find({ patientId: patient._id })
      .sort({ requestedAt: -1 });

    // Calculate stats
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'PENDING').length,
      approved: requests.filter(r => r.status === 'APPROVED').length,
      completed: requests.filter(r => r.status === 'COMPLETED').length,
      rejected: requests.filter(r => r.status === 'REJECTED').length
    };

    res.json({
      requests,
      stats
    });
  } catch (error) {
    console.error('Error fetching request tracking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update request
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find patient profile
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const request = await BloodRequest.findOneAndUpdate(
      { _id: id, patientId: patient._id },
      req.body,
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel request
const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find patient profile
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const request = await BloodRequest.findOneAndUpdate(
      { _id: id, patientId: patient._id },
      { status: 'CANCELLED' },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get emergency alerts
const getEmergencyAlerts = async (req, res) => {
  try {
    const patientId = req.user.id;

    // Get emergency requests for the patient
    const emergencyRequests = await BloodRequest.find({
      requesterId: patientId,
      urgency: 'Emergency',
      status: { $in: ['PENDING', 'APPROVED'] }
    }).sort({ requestedAt: -1 });

    // Get general emergency alerts (could be system-wide)
    const generalAlerts = [
      {
        id: 1,
        title: 'Blood Shortage Alert',
        message: 'Critical shortage of O- blood type. Please consider donating if eligible.',
        type: 'warning',
        date: new Date()
      }
    ];

    res.json({
      emergencyRequests,
      generalAlerts
    });
  } catch (error) {
    console.error('Error fetching emergency alerts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPatientDashboard,
  searchBlood,
  createBloodRequest,
  getRequestTracking,
  updateRequest,
  cancelRequest,
  getEmergencyAlerts
};