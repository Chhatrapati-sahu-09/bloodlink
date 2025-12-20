const BloodInventory = require('../models/BloodInventory');
const BloodRequest = require('../models/BloodRequest');
const BloodBank = require('../models/BloodBank');
const Donation = require('../models/Donation');
const User = require('../models/User');

// Get blood bank dashboard data
const getBloodBankDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find blood bank profile
    const bloodBank = await BloodBank.findOne({ userId });
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank profile not found' });
    }

    // Get inventory summary
    const inventory = await BloodInventory.aggregate([
      { $match: { bloodBankId: bloodBank._id } },
      {
        $group: {
          _id: '$bloodGroup',
          totalUnits: { $sum: '$units' },
          available: {
            $sum: {
              $cond: [
                { $gt: ['$expiryDate', new Date()] },
                '$units',
                0
              ]
            }
          },
          expiringSoon: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ['$expiryDate', new Date()] },
                    { $lte: ['$expiryDate', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)] }
                  ]
                },
                '$units',
                0
              ]
            }
          }
        }
      }
    ]);

    // Get pending requests
    const pendingRequests = await BloodRequest.find({
      status: 'PENDING'
    }).populate('patientId', 'userId').populate({
      path: 'patientId',
      populate: {
        path: 'userId',
        select: 'name'
      }
    });

    // Get low stock alerts (less than 10 units available)
    const lowStockAlerts = inventory.filter(item => item.available < 10);

    // Calculate totals
    const totalUnits = inventory.reduce((sum, item) => sum + item.available, 0);
    const expiringSoon = inventory.reduce((sum, item) => sum + item.expiringSoon, 0);

    res.json({
      inventory: inventory.reduce((acc, item) => {
        acc[item._id] = {
          available: item.available,
          expiringSoon: item.expiringSoon
        };
        return acc;
      }, {}),
      pendingRequests: pendingRequests.length,
      lowStockAlerts,
      stats: {
        totalUnits,
        pendingRequests: pendingRequests.length,
        emergencyRequests: pendingRequests.filter(r => r.urgency === 'EMERGENCY').length,
        expiringSoon
      }
    });
  } catch (error) {
    console.error('Error fetching blood bank dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get blood request management data
const getBloodRequestManagement = async (req, res) => {
  try {
    const { status, urgency } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;

    const requests = await BloodRequest.find(filter)
      .populate('patientId', 'userId')
      .populate({
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .sort({ urgency: -1, requestedAt: -1 });

    // Calculate stats
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'PENDING').length,
      emergency: requests.filter(r => r.urgency === 'EMERGENCY').length,
      approved: requests.filter(r => r.status === 'APPROVED').length
    };

    res.json({
      requests,
      stats
    });
  } catch (error) {
    console.error('Error fetching request management:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update request status
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await BloodRequest.findByIdAndUpdate(
      id,
      {
        status,
        ...(status === 'APPROVED' && { processedAt: new Date() }),
        ...(status === 'COMPLETED' && { processedAt: new Date() })
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get inventory summary
const getInventorySummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find blood bank profile
    const bloodBank = await BloodBank.findOne({ userId });
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank profile not found' });
    }

    const inventory = await BloodInventory.find({ bloodBankId: bloodBank._id })
      .sort({ expiryDate: 1 });

    const summary = inventory.reduce((acc, item) => {
      if (!acc[item.bloodGroup]) {
        acc[item.bloodGroup] = {
          total: 0,
          available: 0,
          expired: 0,
          expiringSoon: 0
        };
      }

      acc[item.bloodGroup].total += item.units;

      if (item.expiryDate < new Date()) {
        acc[item.bloodGroup].expired += item.units;
      } else if (item.expiryDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
        acc[item.bloodGroup].expiringSoon += item.units;
        acc[item.bloodGroup].available += item.units;
      } else {
        acc[item.bloodGroup].available += item.units;
      }

      return acc;
    }, {});

    res.json(summary);
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get donation records
const getDonationRecords = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find blood bank profile
    const bloodBank = await BloodBank.findOne({ userId });
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank profile not found' });
    }

    const { startDate, endDate, bloodGroup } = req.query;

    let filter = { bloodBankId: bloodBank._id };
    if (startDate && endDate) {
      filter.donationDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    const donations = await Donation.find(filter)
      .populate('donorId', 'userId')
      .populate({
        path: 'donorId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .sort({ donationDate: -1 });

    // Calculate stats
    const stats = {
      totalDonations: donations.length,
      totalUnits: donations.reduce((sum, d) => sum + d.units, 0),
      uniqueDonors: new Set(donations.map(d => d.donorId._id.toString())).size,
      recentDonations: donations.filter(d => {
        const today = new Date();
        const donationDate = new Date(d.donationDate);
        return donationDate.toDateString() === today.toDateString();
      }).length
    };

    res.json({
      donations,
      stats
    });
  } catch (error) {
    console.error('Error fetching donation records:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new donation
const addDonation = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find blood bank profile
    const bloodBank = await BloodBank.findOne({ userId });
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank profile not found' });
    }

    const donationData = {
      ...req.body,
      bloodBankId: bloodBank._id,
      status: 'COMPLETED' // Assuming donations are completed when added
    };

    const donation = new Donation(donationData);
    await donation.save();

    // Update inventory
    await donation.updateInventory();

    res.status(201).json(donation);
  } catch (error) {
    console.error('Error adding donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBloodBankDashboard,
  getBloodRequestManagement,
  updateRequestStatus,
  getDonationRecords,
  addDonation,
  getInventorySummary
};