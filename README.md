# 🎓 ScholarStream

## Project Overview
**ScholarStream** is a comprehensive scholarship management platform that connects students with global scholarship opportunities. The platform streamlines the scholarship search, application, and management process while providing robust admin tools for scholarship management.

## 🌐 Live URL
**Frontend:** [https://scholarstream-client36.vercel.app](https://scholarstream-client36.vercel.app)  
**Backend API:** [https://scholarstream-server36.vercel.app](https://scholarstream-server36.vercel.app)

## 📋 Purpose
ScholarStream aims to simplify the scholarship discovery and application process by:
- Providing a centralized platform for scholarship listings from universities worldwide
- Enabling students to search, filter, and apply for scholarships seamlessly
- Facilitating secure payment processing for application fees
- Offering personalized dashboards for tracking applications and managing wishlists
- Empowering administrators with comprehensive management and analytics tools

## ✨ Key Features

### For Students
- 🔍 **Advanced Search & Filtering** - Search scholarships by university, country, subject category, degree level, and scholarship type
- 📊 **Smart Sorting** - Sort results by application deadline, tuition fees, and application fees
- ⭐ **Wishlist Management** - Save favorite scholarships for later review
- 💳 **Secure Payment Integration** - Stripe-powered payment processing for application fees
- 📝 **Application Tracking** - Monitor application status (pending, processing, completed, rejected, cancelled)
- ✍️ **Review System** - Submit and manage reviews for applied scholarships
- 🔐 **Firebase Authentication** - Secure user registration and login with JWT token verification
- 📱 **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX** - Smooth animations and intuitive interface using Framer Motion

### For Administrators
- ➕ **Scholarship Management** - Add, edit, and delete scholarship listings
- 👥 **User Management** - View and manage user accounts with role-based access control
- 📋 **Application Management** - Update application statuses and monitor submissions
- 📈 **Analytics Dashboard** - Visualize statistics with interactive charts (total scholarships, applications, users)
- 🔒 **Protected Routes** - Admin-only access to management features

### Technical Features
- 🚀 **Real-time Data Updates** - Dynamic content loading from MongoDB database
- 🎯 **Pagination** - Optimized data display with 6 items per page (3 columns layout)
- ⚡ **Performance Optimized** - Fast load times with Vite build tool
- 🔄 **SPA Architecture** - Seamless navigation without page reloads
- 🌐 **RESTful API Integration** - Clean API structure for frontend-backend communication
- 🔒 **JWT Authentication** - Secure token-based authentication system
- 🎨 **Tailwind CSS + DaisyUI** - Utility-first styling with pre-built components

## 🛠️ Technologies & NPM Packages Used

### Core Framework
- **React** (v18.3.1) - Component-based UI library
- **React DOM** (v18.3.1) - DOM rendering for React
- **Vite** (v7.2.4) - Next-generation frontend build tool

### Routing & State Management
- **React Router DOM** (v7.10.1) - Client-side routing and navigation

### HTTP & API
- **Axios** (v1.13.2) - Promise-based HTTP client for API requests

### Authentication
- **Firebase** (v12.6.0) - User authentication and authorization

### Payment Integration
- **@stripe/stripe-js** (v8.5.3) - Stripe JavaScript SDK
- **@stripe/react-stripe-js** (v5.4.1) - React components for Stripe payments

### UI & Styling
- **Tailwind CSS** (v4.1.17) - Utility-first CSS framework
- **@tailwindcss/vite** (v4.1.17) - Vite plugin for Tailwind CSS
- **DaisyUI** (v5.5.8) - Component library for Tailwind CSS
- **Framer Motion** (v12.23.25) - Animation library for React
- **React Icons** (v5.4.0) - Icon library with multiple icon sets

### Data Visualization
- **Recharts** (v3.5.1) - Composable charting library for React

### Notifications
- **React Toastify** (v11.0.5) - Toast notifications for React

### Development Tools
- **ESLint** (v9.39.1) - JavaScript linting utility
- **@vitejs/plugin-react** (v5.1.1) - Vite plugin for React
- **eslint-plugin-react-hooks** (v5.0.0) - ESLint rules for React Hooks
- **eslint-plugin-react-refresh** (v0.4.24) - ESLint plugin for React Refresh

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aziz-Ullah-Tarek/ScholarStream-Client.git
   cd ScholarStream-Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=https://scholarstream-server36.vercel.app
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and media files
│   ├── components/     # Reusable React components
│   ├── config/         # Configuration files (API URL)
│   ├── context/        # React Context (AuthContext)
│   ├── firebase/       # Firebase configuration
│   ├── layouts/        # Layout components (MainLayout, DashboardLayout)
│   ├── middleware/     # Route protection middleware
│   ├── pages/          # Page components
│   │   ├── Dashboard/  # User dashboard pages
│   │   ├── Admin/      # Admin pages
│   │   └── ...         # Other pages
│   ├── App.jsx         # Main App component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── .env                # Environment variables (local)
├── .env.production     # Production environment variables
├── netlify.toml        # Netlify deployment configuration
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Project dependencies and scripts
```

## 🔑 Key Pages

- **Home** (`/`) - Landing page with featured scholarships and success stories
- **All Scholarships** (`/all-scholarships`) - Browse all available scholarships with filters
- **Scholarship Details** (`/:id`) - Detailed view with reviews and wishlist functionality
- **Checkout** (`/checkout/:id`) - Application form and payment processing
- **Dashboard** - User dashboard with:
  - My Applications (`/dashboard/my-applications`)
  - My Wishlist (`/dashboard/my-wishlist`)
  - My Reviews (`/dashboard/my-reviews`)
- **Admin Panel** - Administrator tools:
  - Add Scholarship (`/admin/add-scholarship`)
  - Manage Scholarships (`/admin/manage-scholarships`)
  - Manage Users (`/admin/manage-users`)
  - Manage Applications (`/admin/manage-applications`)
  - Analytics (`/admin/analytics`)

## 🔒 Authentication & Authorization

- Firebase Authentication with email/password
- JWT token-based authorization
- Protected routes for authenticated users
- Admin-only routes for management features
- Automatic token refresh and session management

## 🎨 Design Features

- Clean and modern interface
- Smooth page transitions with Framer Motion
- Responsive grid layouts (3-column on desktop, 2 on tablet, 1 on mobile)
- Interactive hover effects and animations
- Toast notifications for user feedback
- Loading states and error handling
- Dark mode support (via DaisyUI themes)

## 📦 Deployment

### Netlify Deployment
The application is deployed on Netlify with the following configuration:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Environment variables must be set in Netlify dashboard before deployment.**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

ISC

## 👤 Author

**Aziz Ullah Tarek**

- GitHub: [@Aziz-Ullah-Tarek](https://github.com/Aziz-Ullah-Tarek)

## 🙏 Acknowledgments

- Stripe for payment processing
- Firebase for authentication services
- MongoDB for database management
- Netlify for hosting
- Vercel for backend hosting

---

**Developed by:Aziz Ullah Tarek**
