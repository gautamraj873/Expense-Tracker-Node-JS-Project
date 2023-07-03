const Razorpay = require("razorpay");
const Order = require("../models/order");
const { v4: uuidv4 } = require('uuid');
const { generateAccessToken } = require('./user');


exports.purchasePremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 5000;
    const currency = 'INR';
    const receipt = uuidv4();

    const order = await rzp.orders.create({ amount, currency, receipt });
    await req.user.createOrder({ orderid: order.id, status: "PENDING" });
    res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: razorpay_order_id } });

    if(!order){
      return res.status(404).json({error: 'Order not found'});
    }

    if (razorpay_payment_id) {
      const promise1 = order.update({ paymentid: razorpay_payment_id, status: 'SUCCESSFUL', userId: req.user.id });
      const promise2 = req.user.update({ isPremiumUser: true, status: 'SUCCESSFUL' });
      await Promise.all([promise1, promise2]);
      return res.status(200).json({ success: true, message: 'Transaction Successful', token : generateAccessToken(req.user.id, undefined, true ) });        
    } 
    else { 
      const promise1 = order.update({ status: 'FAILED', userId: req.user.id });
      const promise2 = req.user.update({ isPremiumUser: false, status: 'FAILED' });
      await Promise.all([promise1, promise2]);
      return res.status(400).json({ success: false, message: 'Transaction Failed' });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Something went wrong" });
  }
};


