// src/lib/stripe.ts
// Stripe client initialization for the project.
// Ensure the environment variable STRIPE_SECRET_KEY is set (e.g., in .env).
import Stripe from "stripe";
import config from "../config"

export const stripe = new Stripe(config.stripe_secret_key, { apiVersion: "2023-08-16" })
