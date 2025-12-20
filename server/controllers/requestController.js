const BloodRequest = require('../models/BloodRequest');
const BloodInventory = require('../models/BloodInventory');

exports.createRequest = async (req, res) => {
  const { bloodGroup, units, location, isEmergency } = req.body;
  try {
    // Prevent duplicate pending requests for same blood group by same requester
    const existingRequest = await BloodRequest.findOne({
      requesterId: req.user.id,
      bloodGroup,
      status: 'PENDING'
    });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this blood group' });
    }

    const request = new BloodRequest({
      requesterId: req.user.id,
      bloodGroup,
      units,
      location,
      isEmergency: isEmergency || false
    });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRequests = async (req, res) => {
  try {
    // Blood banks see requests in their area or all (simplified)
    const requests = await BloodRequest.find({ status: { $in: ['PENDING', 'APPROVED'] } })
      .populate('requesterId', 'name email phone')
      .sort({ isEmergency: -1, requestedAt: 1 }); // Emergency first, then oldest
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await BloodRequest.findById(id);
    if (!request || request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Invalid request' });
    }

    // Check if blood bank has sufficient inventory
    const inventory = await BloodInventory.findOne({
      bloodBankId: req.user.id,
      bloodGroup: request.bloodGroup,
      units: { $gte: request.units }
    });
    if (!inventory) {
      return res.status(400).json({ message: 'Insufficient inventory' });
    }

    request.status = 'APPROVED';
    await request.save();

    // Reduce inventory units
    inventory.units -= request.units;
    await inventory.save();

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await BloodRequest.findByIdAndUpdate(
      id,
      { status: 'REJECTED' },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.completeRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await BloodRequest.findByIdAndUpdate(
      id,
      { status: 'COMPLETED' },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};