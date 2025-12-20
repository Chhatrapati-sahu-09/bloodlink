const express = require('express');
const {
  getInventory,
  addInventory,
  updateInventory,
  getAllInventory
} = require('../controllers/BloodInventoryController');
const { auth, roleGuard } = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, roleGuard(['BLOODBANK']), getInventory);
router.post('/', auth, roleGuard(['BLOODBANK']), addInventory);
router.put('/:id', auth, roleGuard(['BLOODBANK']), updateInventory);
router.get('/all', auth, roleGuard(['ADMIN']), getAllInventory);

module.exports = router;