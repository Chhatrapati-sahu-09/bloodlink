const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const BloodInventory = require('../models/BloodInventory');
const AuditLog = require('../models/AuditLog');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const usersByRole = {
      donors: await User.countDocuments({ role: 'DONOR' }),
      bloodBanks: await User.countDocuments({ role: 'BLOODBANK' }),
      hospitals: await User.countDocuments({ role: 'HOSPITAL' }),
      admins: await User.countDocuments({ role: 'ADMIN' })
    };
    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({ status: 'PENDING' });
    const inventoryResult = await BloodInventory.aggregate([
      { $group: { _id: null, totalUnits: { $sum: '$units' } } }
    ]);
    const totalInventoryUnits = inventoryResult.length > 0 ? inventoryResult[0].totalUnits : 0;

    const stats = {
      totalUsers,
      usersByRole,
      totalRequests,
      pendingRequests,
      totalInventoryUnits
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the action
    await AuditLog.create({
      action: 'APPROVE_USER',
      performedBy: req.user.id,
      targetUser: userId,
      details: `Approved user ${user.name} (${user.role})`
    });

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.blockUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the action
    await AuditLog.create({
      action: 'BLOCK_USER',
      performedBy: req.user.id,
      targetUser: userId,
      details: `Blocked user ${user.name} (${user.role})`
    });

    res.json({ message: 'User blocked successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('performedBy', 'name email')
      .populate('targetUser', 'name email')
      .sort({ timestamp: -1 })
      .limit(100); // Last 100 logs

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};