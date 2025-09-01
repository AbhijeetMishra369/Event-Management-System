import api from './api';

export async function createOrder({ eventId, ticketTypeId, quantity, currency = 'INR' }) {
  const { data } = await api.post('/payments/create-order', { eventId, ticketTypeId, quantity, currency });
  return data; // { orderId, amount, currency, key }
}

export async function verifyPayment(payload) {
  // payload includes razorpay_order_id, razorpay_payment_id, razorpay_signature and purchase context
  return api.post('/payments/verify', payload);
}