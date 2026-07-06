# Luxe E-Commerce Platform

A fully functional, modern e-commerce platform built with Next.js, featuring a robust multi-vendor marketplace architecture. 

## 🚀 Features

- **Multi-Role System:** Customer, Seller, and Admin roles.
- **Seller Onboarding Flow:** Customers can apply to become sellers. Admins review and approve applications.
- **Authentication:** Secure login with Google OAuth and Email/Password credentials via NextAuth.js.
- **Modern UI:** Built with Tailwind CSS and Radix UI components, heavily inspired by top-tier modern marketplaces.
- **Payments:** Razorpay integration for checkout.
- **Image Hosting:** Cloudinary integration for product images.
- **Database:** MongoDB via Mongoose.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + UI Components
- **Auth:** NextAuth.js
- **Database:** MongoDB
- **Payments:** Razorpay

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```
Fill in the required values in `.env.local`:
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL=http://localhost:3000`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (for Google Login)

### 3. Installation
Install the dependencies:
```bash
npm install
```

### 4. Create an Admin Account
To manage the platform (e.g., approve new sellers), you need an Admin account. 
Run the seed script to automatically create one:
```bash
npm run seed-admin
```
*(This creates an account with email `admin@luxe.com` and password `admin123`)*

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 User Workflows

### Customers
- Sign up with Google or Email.
- Browse products, add to cart, and checkout.

### Sellers
- Go to the **Account** page and click **Apply to become a Seller**.
- Fill out your Store Name and Description.
- Wait for an Admin to approve the application.
- Once approved, access the Seller Dashboard to list and manage products.

### Admins
- Log in using the seeded Admin credentials.
- Navigate to the Admin Dashboard (`/admin/sellers`).
- Review and approve/reject pending seller applications.
