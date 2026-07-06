# 🛍️ Luxe E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 16, featuring real-time order tracking, test payment integration, and a comprehensive admin panel. Inspired by Amazon's user experience with enhanced features.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com/)

---

## ✨ Features

### 🛒 Shopping Experience
- **Dynamic Product Catalog**: Browse products with advanced filtering and sorting
- **Smart Search**: Category-based search with real-time results
- **Shopping Cart**: Add, remove, and update quantities with toast notifications
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Amazon-Inspired UI**: Familiar, user-friendly interface
- **INR Pricing**: All prices displayed in Indian Rupees (₹)

### 🔐 Authentication & User Management
- **NextAuth.js Integration**: Secure authentication system
- **User Profiles**: Manage account details and preferences
- **Role-Based Access**: User, Seller, and Admin roles.
- **Seller Onboarding Flow**: Secure application process for users to become sellers (requires Admin approval).
- **Cloud-Synced Addresses**: Securely save and manage multiple shipping addresses tied to your account across all devices
- **Order History**: View all past orders with detailed information

### 💳 Payment System
- **Razorpay Integration**: Real payment gateway for India
- **Mock Payment**: Instant testing without external setup
- **Secure Checkout**: Multi-step checkout process
- **Payment Success Page**: Order confirmation with confetti animation
- **INR Transactions**: All payments processed in Indian Rupees

### 📦 Order Tracking
- **Real-Time Status Updates**: Visual timeline (Placed → Packed → Shipped → Delivered)
- **Automated Timestamps**: Track every status change
- **Estimated Delivery**: Auto-calculated delivery dates
- **Responsive Timeline**: Horizontal on desktop, vertical on mobile
- **Status Badges**: Color-coded for quick status recognition

### 🏪 Seller Dashboard (NEW)
- **Product Management**: Sellers can list and manage their own products
- **Cloudinary Integration**: Professional image uploads via Cloudinary
- **Modern Gradient UI**: Beautiful dashboard with statistics
- **Low Stock Alerts**: Automatic warnings when inventory runs low
- **Recent Orders**: Track orders containing seller's products
- **Revenue Analytics**: View sales and earnings in INR
- **Quick Actions**: Easy access to add/edit products

### 👨‍💼 Admin Panel
- **Order Management Dashboard**: View and manage all orders
- **One-Click Status Updates**: Easy order progression
- **Order Statistics**: Overview of orders by status
- **Advanced Filtering**: Filter by status, date, customer
- **Customer Details**: Full order and shipping information
- **Seller Product Oversight**: View all seller listings

### 🎨 UI/UX
- **Toast Notifications**: Real-time feedback for user actions
- **Smooth Animations**: Framer Motion for enhanced interactions
- **Loading States**: Clear indicators for async operations
- **Error Handling**: User-friendly error messages
- **Dark Mode Ready**: Consistent theming support

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v4
- **Password Hashing**: bcryptjs
- **Image Upload**: Cloudinary
- **Payment Gateway**: Razorpay

### Developer Experience
- **Language**: TypeScript 5
- **Linting**: ESLint
- **Testing**: Jest & React Testing Library
- **CI/CD**: GitHub Actions
- **Containerization**: Docker & Docker Compose
- **Package Manager**: npm

---

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Git for version control

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ecommerce-platform.git
cd ecommerce-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# NextAuth Configuration  
NEXTAUTH_SECRET=your_random_32_character_secret_here
NEXTAUTH_URL=http://localhost:3000

# Razorpay Credentials (Get from https://dashboard.razorpay.com/app/keys)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary Configuration (Get from https://cloudinary.com/console)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=products
```

**Getting MongoDB URI:**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create database user
4. Set network access to `0.0.0.0/0`
5. Get connection string from "Connect" → "Connect your application"

**Generating NEXTAUTH_SECRET:**

PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Or visit: https://generate-secret.vercel.app/32

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Usage Guide

### For Customers

1. **Browse Products**: Visit homepage to see product catalog
2. **Search & Filter**: Use search bar and category filters
3. **Add to Cart**: Click "Add to Cart" (toast notification appears)
4. **Checkout**: Review cart → Proceed to checkout
5. **Sign In**: Create account or login
6. **Enter Details**: Fill shipping information
7. **Select Payment**: Choose payment method (Mock/Razorpay)
8. **Track Order**: Go to "Your Orders" to see tracking timeline

### For Sellers (NEW)

1. **Create Account**: Register on the platform
2. **Change Role**: Go to Account → Profile → Change role to "Seller"
3. **Access Dashboard**: Click "🏪 Seller Dashboard" in navbar
4. **Add Products**:
   - Click "Add New Product"
   - Fill product details (name, description, price in ₹, category, stock)
   - Upload product image via Cloudinary widget
   - Submit to list product
5. **Manage Products**: View, edit, or delete products in "My Products"
6. **Track Sales**: Monitor statistics and recent orders on dashboard
7. **Stock Management**: Receive low stock alerts when inventory runs low

### For Shop Owners (Admin)

1. **Admin Access**: Ensure user has `role: 'admin'` in database
2. **Login**: Sign in with admin account
3. **Access Panel**: Navigate to `/admin/orders`
4. **View Orders**: See all orders and statistics
5. **Update Status**: Click status update buttons as orders progress
6. **Filter Orders**: Use status filters to find specific orders

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```
*Note: This will automatically trigger the GitHub Actions CI/CD pipeline to lint, test, and build your project.*

2. **Deploy**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (same as `.env.local`)
   - Deploy

3. **Update Environment**:
   - After deployment, update `NEXTAUTH_URL` to your Vercel domain
   - Redeploy

### Build for Production

```bash
npm run build
npm start
```

### Docker Deployment

To spin up the entire stack (Next.js + MongoDB) locally:

```bash
docker-compose up -d --build
```

---

## 🗂️ Project Structure

```
ecommerce-platform/
├── .github/
│   └── workflows/             # CI/CD pipelines
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   └── orders/        # Order management API
│   │   ├── admin/             # Admin panel pages
│   │   ├── auth/              # Auth pages (signin, register)
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout & success pages
│   │   ├── orders/            # Order history page
│   │   └── products/          # Product listing page
│   ├── components/            # Reusable components
│   │   ├── ui/                # UI components (buttons, inputs)
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── Footer.tsx         # Footer component
│   │   └── OrderTrackingTimeline.tsx  # Order tracking UI
│   ├── lib/                   # Utility functions
│   │   ├── apiHandler.ts      # API error wrapper
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── mongoose.ts        # MongoDB connection
│   │   ├── orderUtils.ts      # Order helper functions
│   │   ├── rateLimit.ts       # Rate limiting utility
│   │   └── validations.ts     # Zod schema definitions
│   ├── models/                # MongoDB models
│   │   ├── User.ts            # User model
│   │   └── Order.ts           # Order model with tracking
│   ├── store/                 # State management
│   │   ├── __tests__/         # Automated test files
│   │   └── useCartStore.ts    # Zustand cart store
│   ├── config/                # Configuration files
│   │   └── PaymentConfig.ts   # Payment method settings
│   └── data/                  # Static data
│       └── products.ts        # Product catalog
├── public/                    # Static assets
├── .env.local                # Environment variables (create this)
├── docker-compose.yml        # Docker composition file
├── Dockerfile                # Docker image definition
├── jest.config.ts            # Jest testing configuration
├── jest.setup.ts             # Jest setup and mocks
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## 🔑 Key Features Explained

### Order Tracking System

**User View:**
- Visual timeline showing order progression
- Color-coded status indicators
- Date/time stamps for each status change
- Estimated delivery date

**Admin View:**
- Dashboard with order statistics
- Filter by order status
- One-click status updates
- Customer information display

**Status Flow:**
```
🔵 Placed → 🟣 Packed → 🟠 Shipped → 🟢 Delivered
                ↓
            🔴 Cancelled
```

### Payment Integration

**Available Methods:**
1. **Mock Payment**: Instant testing (no setup required)
2. **Razorpay Test**: India-focused test mode
3. **Stripe Test**: Global test mode

**Test Cards:**
- Razorpay: `4111 1111 1111 1111`
- Stripe: `4242 4242 4242 4242`
- Any future expiry, any CVV

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm test         # Run Jest automated tests
```

### Database Seeding

To automatically create an admin user for testing, run the seed script from the `ecommerce-platform` directory:

```bash
cd ecommerce-platform
npm run seed-admin
# or
npm run create-admin
```

*(This creates an account with email `admin@luxe.com` and password `admin123`)*

---

## 🐛 Troubleshooting

### Common Issues

**1. "Hydration failed" Error**
- All `.toLocaleString()` calls use explicit `'en-IN'` locale
- Should not occur with current codebase

**2. "Internal Server Error" on Auth**
- Check `MONGODB_URI` is set correctly
- Verify MongoDB Atlas network access allows `0.0.0.0/0`
- Ensure `NEXTAUTH_SECRET` is set

**3. Payment Not Working**
- Use "Mock Payment" for instant testing
- For Razorpay/Stripe, update test links in `PaymentConfig.ts`

**4. Admin Panel Not Accessible**
- Ensure user has `role: 'admin'` in database
- Check logged in with correct admin account

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/callback/credentials` - Login user

### User Management & Addresses (NEW)
- `GET /api/user/addresses` - Get user's saved addresses
- `PUT /api/user/addresses` - Update user's address book

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/[id]/update-status` - Update order status (admin only)

### Seller (NEW)
- `GET /api/seller/stats` - Get seller statistics
- `GET /api/seller/recent-orders` - Get orders with seller's products
- `GET /api/seller/products` - Get seller's products
- `POST /api/seller/products` - Create new product
- `PATCH /api/seller/products/[id]` - Update product
- `DELETE /api/seller/products/[id]` - Delete product

### Admin
- `GET /api/admin/orders` - Get all orders (admin only)
- `GET /api/admin/dashboard` - Get admin dashboard stats

---

## 🎨 Customization

### Delivery Time

Edit `src/lib/orderUtils.ts`:

```typescript
export function calculateEstimatedDelivery(orderDate: Date): Date {
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + 5); // Change 5 to your days
    return estimatedDate;
}
```

### Payment Methods

Edit `src/config/PaymentConfig.ts` to:
- Add/remove payment methods
- Update test payment links
- Change enabled status

### Order Status Flow

Edit `src/lib/orderUtils.ts` and `src/models/Order.ts` to:
- Add custom status stages
- Modify status colors
- Change progression flow

---

## 🚀 Performance

- **Server-Side Rendering**: Fast initial page loads
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Dynamic imports for better performance
- **Caching**: MongoDB connection pooling

---

## 🔒 Security

- **Request Validation**: Strict Zod schema validation on API routes
- **Rate Limiting**: In-memory rate limiting to prevent brute-force attacks on authentication
- **Security Headers**: X-Frame-Options, X-XSS-Protection, and Referrer-Policy configured
- **Password Hashing**: bcryptjs with salt rounds
- **Session Management**: Secure JWT tokens
- **Admin Protection**: Role-based access control
- **Environment Variables**: Sensitive data in `.env.local`
- **CORS**: Configured for API routes
- **Error Handling**: Centralized wrapper prevents sensitive stack trace leaks

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 👨‍💻 Author

**Avinav Priyadarshi**

- GitHub: [@avinav2401](https://github.com/avinav2401)

---

## 🙏 Acknowledgments

- UI/UX inspired by Amazon India
- Built with Next.js and modern web technologies
- MongoDB Atlas for cloud database hosting
- Vercel for seamless deployment

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Open an issue on GitHub
3. Review the walkthrough documentation in artifacts

---

**Made with ❤️ using Next.js 16**
