# PromptForge Frontend

<div align="center">

**Master the Machine Whisper** - The premium marketplace for discovering, buying, and selling highly-engineered AI prompts for GPT-4, Claude, and Midjourney.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-12.12.1-FFCA28?logo=firebase)](https://firebase.google.com)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Development Workflow](#development-workflow)
- [Core Components](#core-components)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Styling & Animations](#styling--animations)
- [Dashboard System](#dashboard-system)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 📖 Overview

PromptForge is a next-generation marketplace platform designed for the AI era. It enables users to:

- **Discover** premium, production-ready AI prompts
- **Buy** validated prompts for various AI models
- **Sell** engineered prompts to a global audience
- **Manage** inventory, revenue, and payouts
- **Review** and rate marketplace transactions

The platform supports multi-role access (Admin, Seller, Buyer) with dedicated dashboards for each user type, complete with analytics, financial tracking, and inventory management.

---

## ✨ Features

### For Buyers
- 🔍 Browse and search AI prompts by category
- ⭐ View ratings and reviews from verified purchasers
- 🛒 Purchase prompts with secure checkout
- 💳 Access purchased prompts in a personal vault
- 📊 Track purchase history and usage

### For Sellers
- 📝 Submit and manage prompt inventory
- 💰 Track revenue and sales analytics
- 📈 View performance metrics and trending prompts
- 💸 Manage payout settings and history
- 🏆 Monitor seller ratings and reviews

### For Admins
- 👥 User and account management
- ✅ Review and approve submitted prompts
- 📊 Platform analytics and financial reporting
- 🔐 Moderation tools and compliance
- 📋 System logs and audit trails

### Platform Features
- 🔐 Secure authentication via Google OAuth
- 🎨 Beautiful, responsive UI with dark theme
- ⚡ Server-side rendering (SSR) for performance
- 🔄 Real-time data synchronization
- 📱 Mobile-optimized responsive design
- 🎬 Smooth animations and transitions

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js** (16.2.4) - React framework with App Router
- **React** (19.2.4) - UI library
- **TypeScript** (5) - Type safety

### Styling & Animation
- **Tailwind CSS** (4) - Utility-first CSS framework
- **PostCSS** (4) - CSS transformation
- **Framer Motion** (12.38.0) - Advanced animations
- **GSAP** (3.15.0) - Timeline animations
- **shadcn/ui** (4.6.0) - Component library

### UI Components & Icons
- **Radix UI** (1.4.3) - Headless component library
- **Lucide React** (1.14.0) - Icon library
- **Recharts** (3.8.1) - Chart components

### State Management & API
- **React Context API** - Global state (Auth, Cart)
- **Custom API Client** - Centralized API communication
- **Fetch API** - HTTP requests with JWT auth

### Authentication
- **Firebase Auth** (12.12.1) - Google OAuth provider
- **JWT Tokens** - Secure API authentication

### Utilities
- **class-variance-authority** (0.7.1) - Variant management
- **clsx** (2.1.1) - Conditional className merging
- **tailwind-merge** (3.5.0) - Tailwind class merging

### Developer Tools
- **ESLint** (9) - Code quality
- **Babel React Compiler** (1.0.0) - React optimizations
- **TypeScript** - Static type checking

---

## 📁 Project Structure

```
promptforge-frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/            # Dashboard section
│   │   │   ├── admin/            # Admin dashboard
│   │   │   │   ├── approvals/
│   │   │   │   ├── financials/
│   │   │   │   ├── logs/
│   │   │   │   └── users/
│   │   │   └── seller/           # Seller dashboard
│   │   │       ├── analytics/
│   │   │       ├── inventory/
│   │   │       ├── payouts/
│   │   │       └── reviews/
│   │   ├── explore/              # Marketplace browse
│   │   │   └── [id]/             # Prompt details
│   │   ├── edit/                 # Prompt editing
│   │   │   └── [id]/
│   │   ├── profile/              # User profile
│   │   ├── purchases/            # Purchase history
│   │   ├── create/               # Prompt creation
│   │   ├── about/                # About page
│   │   ├── contact/              # Contact page
│   │   ├── faq/                  # FAQ page
│   │   ├── forgot-password/      # Password recovery
│   │   └── api/                  # API routes
│   │       └── reviews/          # Review endpoints
│   │
│   ├── components/               # Reusable components
│   │   ├── auth/                 # Authentication components
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── RoleGuard.tsx
│   │   ├── dashboard/            # Dashboard components
│   │   │   ├── AdminPortal.tsx
│   │   │   ├── BuyerHub.tsx
│   │   │   └── SellerDashboard.tsx
│   │   ├── home/                 # Homepage sections
│   │   │   ├── BottomCTA.tsx
│   │   │   ├── FeaturedPrompts.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── TrendingCategories.tsx
│   │   ├── layout/               # Layout components
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/                   # UI primitives
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   │
│   ├── context/                  # React Context
│   │   ├── AuthContext.tsx       # Authentication state
│   │   └── CartContext.tsx       # Shopping cart
│   │
│   └── lib/                      # Utilities
│       ├── apiClient.ts          # Centralized API client
│       ├── firebase.ts           # Firebase config
│       └── utils.ts              # Helper functions
│
├── public/                       # Static assets
├── components.json               # shadcn/ui config
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (Recommended 20 LTS)
- **npm** 9+ or **pnpm** 8+
- **Git** for version control
- Backend API server running (see Configuration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/promptforge-frontend.git
   cd promptforge-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Create environment configuration**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** (see [Configuration](#configuration))

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

### Development Server

The app will auto-update as you edit files thanks to Next.js fast refresh.

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: Analytics & Monitoring
NEXT_PUBLIC_SENTRY_DSN=optional
```

### Next.js Configuration

Key features enabled in `next.config.ts`:
- **React Compiler** - Automatic component optimization

### TypeScript Configuration

Strict mode enabled in `tsconfig.json` for better type safety.

### Tailwind CSS

The project uses Tailwind CSS 4 with PostCSS for styling. Configuration in `tailwind.config.ts`.

---

## 💻 Development Workflow

### Creating New Pages

1. Create a new directory under `src/app`
2. Add a `page.tsx` file
3. Use the layout system for consistent styling

```tsx
// src/app/my-feature/page.tsx
export default function MyFeaturePage() {
  return <div>My Feature</div>;
}
```

### Creating New Components

1. Create component file under `src/components/{category}`
2. Use TypeScript interfaces for props
3. Apply Tailwind classes for styling

```tsx
// src/components/my-category/MyComponent.tsx
interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export default function MyComponent({ title, onClick }: MyComponentProps) {
  return <button onClick={onClick}>{title}</button>;
}
```

### Adding API Endpoints

Use the centralized API client:

```typescript
// Making requests
const data = await apiClient.get('/api/prompts');
const result = await apiClient.post('/api/prompts', { name: 'AI Prompt' }, true);
const updated = await apiClient.put('/api/prompts/1', { name: 'Updated' }, true);
await apiClient.delete('/api/prompts/1', true);
```

---

## 🔌 API Integration

### API Client

The centralized API client (`src/lib/apiClient.ts`) handles:
- Base URL configuration
- Automatic JWT token injection
- Error handling
- Request/response formatting

```typescript
export const apiClient = {
  get: (endpoint: string, requireAuth?: boolean) => Promise<any>,
  post: (endpoint: string, data: any, requireAuth?: boolean) => Promise<any>,
  put: (endpoint: string, data: any, requireAuth?: boolean) => Promise<any>,
  delete: (endpoint: string, requireAuth?: boolean) => Promise<any>,
};
```

### API Endpoints

**Authentication**
- `POST /api/auth/sync` - Sync Google auth with backend
- `POST /api/users/me` - Get current user profile

**Prompts**
- `GET /api/prompts` - List all prompts
- `GET /api/prompts/:id` - Get prompt details
- `POST /api/prompts` - Create new prompt
- `PUT /api/prompts/:id` - Update prompt
- `DELETE /api/prompts/:id` - Delete prompt

**Reviews & Testimonials**
- `GET /api/reviews/featured` - Get featured reviews for testimonial carousel

**Dashboard**
- `GET /api/dashboard/seller` - Seller analytics
- `GET /api/dashboard/admin` - Admin overview

---

## 🔐 Authentication

### Firebase Setup

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Google OAuth provider
3. Configure OAuth consent screen
4. Add frontend URL to authorized origins
5. Copy credentials to `.env.local`

### Auth Flow

1. User clicks "Continue with Google"
2. Firebase popup opens for authentication
3. Google token obtained and sent to backend
4. Backend validates and returns JWT token
5. Token stored in localStorage
6. User redirected to `/explore`

### Protected Routes

Use `ProtectedRoute` component to guard private pages:

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

Use `RoleGuard` for role-based access:

```tsx
import RoleGuard from '@/components/auth/RoleGuard';

<RoleGuard roles={['admin', 'seller']}>
  <AdminFeature />
</RoleGuard>
```

---

## 🎨 Styling & Animations

### Tailwind CSS

The project uses Tailwind CSS 4 utility classes:

```tsx
<div className="bg-slate-900 text-white px-6 py-4 rounded-lg shadow-lg">
  Styled with Tailwind
</div>
```

### Framer Motion

Complex animations with Framer Motion:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Animated content
</motion.div>
```

### Theme

- **Color Scheme**: Dark theme (slate-900 background, blue accents)
- **Typography**: Modern sans-serif fonts
- **Spacing**: 4px base unit (Tailwind default)
- **Animations**: Smooth, professional transitions

---

## 📊 Dashboard System

### Admin Dashboard (`/dashboard/admin`)

**Features:**
- Platform overview with KPIs
- Revenue analytics
- User management
- Prompt approvals queue
- Financial reports
- System logs
- Category distribution

**Sub-sections:**
- `/dashboard/admin/approvals` - Pending prompt approvals
- `/dashboard/admin/financials` - Revenue & payment tracking
- `/dashboard/admin/logs` - System activity logs
- `/dashboard/admin/users` - User management

### Seller Dashboard (`/dashboard/seller`)

**Features:**
- Revenue tracking & forecasting
- Sales analytics
- Inventory management
- Payout history
- Review aggregation
- Prompt performance metrics

**Sub-sections:**
- `/dashboard/seller/analytics` - Sales & engagement metrics
- `/dashboard/seller/inventory` - Prompt management
- `/dashboard/seller/payouts` - Payment tracking
- `/dashboard/seller/reviews` - Customer feedback

### Buyer Dashboard (`/dashboard`)

**Features:**
- Purchase history
- Vault access for purchased prompts
- Account settings
- Personal profile management

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect GitHub repository**
   ```bash
   git push origin main
   ```

2. **Import project on Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Connect your GitHub repository
   - Select `promptforge-frontend`

3. **Configure environment variables**
   - Add all variables from `.env.local` to Vercel dashboard
   - Ensure `NEXT_PUBLIC_*` variables are set

4. **Deploy**
   - Vercel automatically deploys on git push
   - Preview deployments for pull requests

### Production Build

```bash
npm run build    # Generates optimized build
npm start        # Runs production server on port 3000
```

### Performance Optimizations

- **React Compiler** enabled for automatic optimization
- **Image Optimization** via next/image (when integrated)
- **Code Splitting** automatic via Next.js
- **CSS Purging** via Tailwind
- **Dynamic Imports** for large components

---

## 📝 Contributing

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Commit Convention

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

### Code Quality

```bash
npm run lint     # Check for linting errors
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit regularly
3. Ensure all tests pass and linting is clean
4. Create pull request with clear description
5. Request review from team members
6. Merge after approval

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Firebase](https://firebase.google.com)
- [TypeScript](https://www.typescriptlang.org)

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team
- Visit [promptforge.com/contact](https://promptforge.com/contact)

---

## 📄 License

This project is proprietary software. All rights reserved.

---

<div align="center">

**Built with ❤️ for the AI community**

[Website](#) • [GitHub](#) • [Twitter](#) • [Contact](#)

</div>
