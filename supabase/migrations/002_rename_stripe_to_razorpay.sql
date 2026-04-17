-- SQL Migration to rename Stripe columns to Razorpay
-- Run this in your Supabase SQL Editor

-- In users table
ALTER TABLE public.users 
RENAME COLUMN stripe_customer_id TO razorpay_customer_id;

-- In subscriptions table
ALTER TABLE public.subscriptions 
RENAME COLUMN stripe_subscription_id TO razorpay_subscription_id;

-- Update constraints if any
-- The original table had: stripe_subscription_id TEXT UNIQUE
-- RENAME COLUMN should preserve the UNIQUE constraint and types.
