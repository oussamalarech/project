const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

// User routes (require auth)
router.post('/', protect, createOrder);
// /myorders must come before /:id so it is not captured as a param
router.get('/myorders', protect, getMyOrders);

// Admin-only route (get all orders)
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
