# Razorpay Integration Setup

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Razorpay Credentials (Test Mode)
RAZORPAY_KEY_ID=rzp_test_RtnY4IitdkptLt
RAZORPAY_KEY_SECRET=<YOUR_KEY_SECRET_HERE>
```

## Getting Your Razorpay Key Secret

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
2. Sign in to your account
3. Click on **Settings** → **API Keys**
4. Make sure you're in **Test Mode** (toggle at the top)
5. You'll see:
   - **Key ID**: `rzp_test_RtnY4IitdkptLt` (already provided)
   - **Key Secret**: Click "Generate Secret" or "Regenerate" if needed
6. Copy the **Key Secret** and paste it in `.env.local`

## For Vercel Deployment

Add both environment variables in Vercel:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   - Name: `RAZORPAY_KEY_ID`, Value: `rzp_test_RtnY4IitdkptLt`
   - Name: `RAZORPAY_KEY_SECRET`, Value: `<your_secret_key>`
4. Select all environments (Production, Preview, Development)
5. Redeploy

##Testing Payments

Use these test cards in Test Mode:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **OTP (if required)**: Any 6 digits

## Security Note

⚠️ **IMPORTANT**: Never commit your `.env.local` file or expose your Key Secret publicly!
