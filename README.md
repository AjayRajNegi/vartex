# 🎓 VarTex - The Future of Online Education

Welcome to **VarTex**, a modern, interactive learning management system designed to revolutionize how people learn online. Built with cutting-edge technology and a focus on user experience, VarTex provides a comprehensive platform for both learners and educators.

## ✨ What is VarTex?

VarTex is a full-featured online learning platform that combines the power of modern web technologies with intuitive design to create an exceptional learning experience. Whether you're a student looking to expand your skills or an instructor wanting to share your knowledge, VarTex provides all the tools you need.

## 🚀 Key Features

### For Learners

- **📚 Comprehensive Course Library** - Access a wide range of carefully curated courses designed by industry experts
- **📊 Progress Tracking** - Monitor your learning journey with detailed analytics and personalized dashboards
- **🎯 Interactive Learning** - Engage with rich content, videos, and interactive elements
- **💳 Seamless Payments** - Secure course purchases through Razorpay integration
- **📱 Responsive Design** - Learn anywhere, anytime with our mobile-optimized platform

### For Instructors & Admins

- **🛠️ Rich Content Creation** - Create engaging courses with our advanced rich text editor
- **📁 File Management** - Upload and organize course materials with AWS S3 integration
- **📈 Analytics Dashboard** - Track enrollment statistics and course performance
- **🎨 Course Management** - Organize content with chapters and lessons
- **🔒 Admin Controls** - Manage users, courses, and platform settings

## 🛠️ Built With

- **Next.js 15** - Latest React framework with App Router
- **React 19** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Prisma** - Type-safe database access
- **PostgreSQL** - Robust relational database
- **Razorpay** - Secure payment processing
- **AWS S3** - Scalable file storage
- **Better Auth** - Modern authentication system

## 🏗️ Architecture

VarTex follows a modern, scalable architecture:

- **App Router** - File-based routing with nested layouts
- **Server Components** - Optimized rendering and data fetching
- **API Routes** - RESTful endpoints for dynamic functionality
- **Middleware** - Route protection and authentication
- **Database Layer** - Prisma ORM with PostgreSQL
- **File Storage** - AWS S3 for media and course content

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- AWS S3 bucket
- Razorpay account
- GitHub OAuth app (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/vartex.git
   cd vartex
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:

   - `DATABASE_URL` - PostgreSQL connection string
   - `RAZORPAY_KEY_SECRET` - Razorpay secret key
   - `AWS_ENDPOINT_URL_S3` - AWS S3 endpoint
   - `AUTH_GITHUB_CLIENT_ID` - GitHub OAuth client ID
   - `AUTH_GITHUB_SECRET` - GitHub OAuth secret

4. **Set up the database**

   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
vartex/
├── app/                   # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (public)/          # Public-facing pages
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User learning dashboard
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── hooks/                 # Custom React hooks
├── data/                  # Server-side data access functions
└── prisma/                # Database schema and migrations
```

## 🎯 Core Functionality

### Course Management

- Create, edit, and publish courses
- Organize content with chapters and lessons
- Upload course materials and videos
- Set pricing and manage enrollments

### Learning Experience

- Browse and enroll in courses
- Track progress through lessons
- Access rich multimedia content
- Complete courses and earn achievements

### Payment System

- Secure Razorpay integration
- Course purchase workflow
- Enrollment management
- Payment confirmation webhooks

### User Management

- Email and GitHub authentication
- Role-based access control
- User profiles and progress tracking
- Admin user management

## 🔒 Security Features

- **Authentication** - Secure login with email OTP and OAuth
- **Authorization** - Role-based access control
- **Bot Protection** - Arcjet integration for security
- **Data Validation** - Zod schema validation
- **Secure Payments** - Razorpay-certified payment processing

## 🎨 UI/UX Design

- **Modern Interface** - Clean, intuitive design
- **Responsive Layout** - Works on all devices
- **Dark Mode** - Theme switching support
- **Accessibility** - WCAG compliant components
- **Loading States** - Smooth user experience

## 📈 Performance

- **Server Components** - Optimized rendering
- **Image Optimization** - Next.js image optimization
- **Database Queries** - Efficient data fetching
- **Caching** - Strategic caching for better performance
- **Code Splitting** - Automatic bundle optimization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Tabler Icons](https://tabler-icons.io/)
- Rich text editing with [TipTap](https://tiptap.dev/)

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check our documentation
- Reach out to our support team

---

**VarTex** - Elevating the learning experience, one course at a time. 🚀
