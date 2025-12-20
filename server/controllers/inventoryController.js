const BloodInventory = require('../models/BloodInventory');

exports.getInventory = async (req, res) => {
  try {
    const inventory = await BloodInventory.find({ bloodBankId: req.user.id });
    // Add expiry status
    const inventoryWithStatus = inventory.map(item => ({
      ...item.toObject(),
      isExpired: item.checkExpiry()
    }));
    res.json(inventoryWithStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addInventory = async (req, res) => {
  const { bloodGroup, units, expiryDate } = req.body;
  try {
    const inventory = new BloodInventory({
      bloodBankId: req.user.id,
      bloodGroup,
      units,
      expiryDate
    });
    await inventory.save();
    res.status(201).json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateInventory = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const inventory = await BloodInventory.findOneAndUpdate(
      { _id: id, bloodBankId: req.user.id },
      updates,
      { new: true }
    );
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};