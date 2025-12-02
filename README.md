# 360 Business Magician: Business Formation Platform 

A comprehensive business formation platform for deaf entrepreneurs, providing tools for business development, document management, and self-employment services.

![360 Business Magician](https://business.360magicians.com)

## 🚀 Features

- **Complete Business Lifecycle Support**: From idea generation to business growth and management
- **ASL Video Guidance**: Accessible content in American Sign Language
- **DeafAuth Authentication**: Deaf-first authentication system with accessibility-focused features
- **Document Management**: Storage and organization for business documents
- **Self-Employment Service Modules**: Comprehensive pricing tools
- **VR Counselor Integration**: Connect with Vocational Rehabilitation specialists
- **SBA Resource Library**: Access to Small Business Administration resources
- **AI-Powered Tools**: Tools for business ideation and planning

## 🔐 Authentication

The platform uses **DeafAuth** - a custom authentication system designed specifically for deaf-first accessibility, integrated with **Supabase** for secure backend services.

### DeafAuth Features:
- **Accessibility-First Design**: Visual alerts, ASL video verification support, high contrast modes
- **Communication Preferences**: Support for ASL, text, or mixed communication modes
- **Supabase Integration**: Secure authentication and real-time database capabilities
- **JWT Token Authentication**: Secure session management with automatic refresh
- **Rate Limiting**: Protection against brute force attacks

### Authentication Endpoints:
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/auth/refresh` - Refresh authentication session
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/accessibility-settings` - Update accessibility preferences
- `GET /api/auth/status` - Check authentication status

## 🔧 Technologies

- React + TypeScript frontend
- Express.js backend
- PostgreSQL database with Drizzle ORM
- **Supabase** for authentication and real-time features
- **DeafAuth** custom authentication service
- HTMX for dynamic interactions
- Google Cloud Storage integration
- Telegram bot integration
- Shadcn/UI components
- Vercel deployment

## 📋 Requirements

- Node.js 20+
- PostgreSQL database (or use Docker)
- **Supabase account** (for authentication and real-time features)
- Google Cloud Storage account (for document storage)
- OpenAI API key (for AI features)

## 🏁 Getting Started

### Quick Start

1. Clone the repository
2. Run setup script:
   ```bash
   node scripts/setup.js
   ```
3. Configure your environment variables (see below)
4. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Setup

We provide a Docker Compose configuration for easy local development:

```bash
docker-compose up -d
```

Visit http://localhost:8080 to see the application.

## 🗄️ Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Database connection
DATABASE_URL=postgres://username:password@localhost:5432/business_magician

# Authentication (DeafAuth + Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
JWT_SECRET=your-secure-jwt-secret-change-in-production
APP_URL=http://localhost:5000

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=path-to-credentials.json

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Application settings
NODE_ENV=development
PORT=5000

# Frontend settings
VITE_API_BASE_URL=/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-supabase-anon-key
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to Project Settings > API
3. Copy the URL and anon key to your `.env` file
4. (Optional) Copy the service role key for server-side operations

## 📂 Project Structure

```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks (including useDeafAuth)
│   │   ├── lib/             # Utilities and API clients
│   │   ├── pages/           # Page components
├── server/                  # Backend Express application
│   ├── middleware/          # Express middleware (including deafAuthMiddleware)
│   ├── routes/              # API routes (including authRoutes)
│   ├── services/            # Business logic (including deafAuthService, supabaseService)
│   ├── index.ts             # Server entry point
├── shared/                  # Shared code between client and server
│   ├── schema.ts            # Database schema definitions
├── scripts/                 # Utility scripts
```

## 🔄 Database Management

We use Drizzle ORM for database operations. Some useful commands:

```bash
# Push schema changes to database
npm run db:push

# Generate migration files
npm run db:generate

# Open Drizzle Studio (database UI)
npm run db:studio
```

## 📦 Deployment

The application is configured for deployment on Vercel:

```bash
node scripts/vercel-deploy.js
```

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

## 📄 License

[MIT License](LICENSE)

## 👥 Team

- 360 Magician Team