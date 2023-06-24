const Razorpay = require('razorpay');
const Order = require('../models/order');
require('dotenv').config();

exports.purchasePremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const amount = 2500;
    const currency = 'INR';

    const order = await rzp.orders.create({ amount, currency });
    await Order.create({ orderId: order.id, status: 'PENDING' });
    return res.status(201).json({ order, key_id: rzp.key_id });
  } 
  catch (error) {
    res.status(403).json({ error: 'Something went wrong' });
  }
};



exports.updateTransactionStatus = async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id } = req.body;
      const order = await Order.findOne({ where: { orderId: razorpay_order_id } });

      if(!order){
        return res.status(404).json({error: 'Order not found'});
      }
      
      if (!razorpay_payment_id) {
        // Transaction failed
        const promise1 = order.update({ status: 'FAILED', userId: req.user.id });
        const promise2 = req.user.update({ isPremiumUser: false, status: 'FAILED' });
        await Promise.all([promise1, promise2]);
        return res.status(400).json({ success: false, message: 'Transaction Failed' });
      } else { 
        // Transaction is successful
        const promise1 = order.update({ paymentId: razorpay_payment_id, status: 'SUCCESSFUL', userId: req.user.id });
        const promise2 = req.user.update({ isPremiumUser: true, status: 'SUCCESSFUL' });
        await Promise.all([promise1, promise2]);
        return res.status(200).json({ success: true, message: 'Transaction Successful' });
      }
    } catch (error) {
        res.status(403).json({ error: 'Something went wrong' });
      }
}
