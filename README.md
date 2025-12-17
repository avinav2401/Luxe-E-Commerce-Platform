# Luxe E-Commerce Platform (Amazon Clone)

A full-stack e-commerce application built with **Next.js 15**, **MongoDB**, **NextAuth.js**, and **Tailwind CSS**.

## Features

- **Storefront**: Dynamic product listing with filtering, sorting, and search.
- **Cart System**: Fully functional shopping cart (add, remove, update quantities).
- **Checkout**: Secure checkout flow with address and payment form.
- **Authentication**: User login/signup using NextAuth.js.
- **User Profile**: manageable profile with MongoDB integration.
- **Order History**: Track past orders.
- **Admin**: (In progress) Admin dashboard for product management.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB (via Mongoose)
- **Auth**: NextAuth.js v4

## Getting Started

1.  **Clone the repo**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment Variables**:
    Create a `.env.local` file:
    ```env
    MONGODB_URI=mongodb+srv://...
    NEXTAUTH_SECRET=your_secret
    NEXTAUTH_URL=http://localhost:3000
    ```
4.  **Run locally**:
    ```bash
    npm run dev
    ```

## Deployment

Ready for deployment on **Render** or **Vercel**.
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
