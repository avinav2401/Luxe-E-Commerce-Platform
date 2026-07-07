# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account
2. Complete email verification
3. Login to your dashboard

## Step 2: Get Your Credentials

1. From the Cloudinary dashboard, navigate to **Settings** → **API Keys**
2. You'll see three important values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 3: Create Upload Preset

1. Go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `products`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `products` (optional)
5. Click **Save**

## Step 4: Add to Environment Variables

### For Local Development (.env.local)

Create or update `.env.local` file:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=products
```

Replace the values with your actual credentials from Step 2.

### For Vercel Deployment

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (value: `products`)
4. Select all environments (Production, Preview, Development)
5. Click **Save**
6. Redeploy your application

## Step 5: Test Upload

1. Login as a seller
2. Go to **Seller Dashboard** → **Add New Product**
3. Click **Upload Image**
4. Select an image
5. Image should upload to Cloudinary
6. Check your Cloudinary Media Library to confirm

## Troubleshooting

**Upload fails:**
- Verify upload preset name is exactly `products`
- Check that signing mode is `Unsigned`
- Ensure Cloud Name is correct

**Images don't display:**
- Check browser console for errors
- Verify the secure_url is being saved correctly
- Test the image URL directly in browser

## Security Notes

- ✅ API Secret is only used server-side (safe)
- ✅ Cloud Name & Upload Preset are public (safe)
- ❌ Never expose API Secret in client-side code
