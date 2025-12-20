const BloodInventory = require('../models/BloodInventory');

exports.getInventory = async (req, res) => {
  try {
    const inventory = await BloodInventory.find({ bloodBankId: req.user.id });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  const { units } = req.body;
  try {
    const inventory = await BloodInventory.findById(req.params.id);
    if (!inventory || inventory.bloodBankId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    inventory.units = units;
    await inventory.save();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await BloodInventory.find().populate('bloodBankId', 'name');
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};