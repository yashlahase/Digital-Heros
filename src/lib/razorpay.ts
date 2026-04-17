import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const RAZORPAY_PLANS = {
  monthly: process.env.RAZORPAY_MONTHLY_PLAN_ID!,
  yearly: process.env.RAZORPAY_YEARLY_PLAN_ID!,
}

export const PRICE_DISPLAY = {
  monthly: { amount: '₹849', period: 'month', label: 'Monthly' },
  yearly: { amount: '₹8,499', period: 'year', label: 'Yearly', savings: 'Save ₹1,689' },
}
