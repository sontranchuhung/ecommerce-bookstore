const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  checkoutToken: String,
  orderData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema);
