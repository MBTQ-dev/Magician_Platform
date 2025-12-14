# Magician Platform: Comprehensive AI Agent Ecosystem

A comprehensive platform for deaf entrepreneurs, job seekers, developers, and creatives with full vocational rehabilitation and workforce solutions compliance.

![360 Magicians Platform](https://business.360magicians.com)

## 🌟 Overview

The Magician Platform is an integrated AI agent ecosystem featuring 8 specialized "Magician" services that coordinate to provide comprehensive support for:
- **Vocational Rehabilitation (VR)** programs and self-employment pathways
- **Workforce Development** and job placement services
- **Business Formation** and entrepreneurship support
- **Software Development** and technical training
- **Creative Services** and ASL content creation

All services are built with deaf-first accessibility and maintain strict compliance with federal VR regulations (34 CFR Part 361) and workforce development standards.

### 🔗 Related Repositories

This platform is part of the 360 Magicians ecosystem:
- **[github.com/pinkycollie/360magicians](https://github.com/pinkycollie/360magicians)** - 360 Magicians framework
- **[github.com/pinkycollie/mbtq-dev](https://github.com/pinkycollie/mbtq-dev)** - MBTQ ecosystem
- **[github.com/MBTQ-dev/Magician_Platform](https://github.com/MBTQ-dev/Magician_Platform)** - This repository

## 🚀 Production Ready Features

### Automated Workflows
- ✅ **Auto-merge** - Automated dependency updates with Dependabot
- ✅ **Auto-test** - Continuous testing and quality checks
- ✅ **Auto-update** - Weekly dependency updates
- ✅ **Auto-deploy** - Production deployment automation
- ✅ **Compliance checks** - Daily compliance audits
- ✅ **Health monitoring** - Comprehensive health checks

### Health Check Endpoints
- `GET /api/health` - Comprehensive system health
- `GET /api/health/live` - Liveness probe
- `GET /api/health/ready` - Readiness probe

### Development Tools
- ✅ Type checking with TypeScript strict mode
- ✅ Linting and formatting support
- ✅ Automated testing framework
- ✅ Build validation
- ✅ Security scanning

## 🤖 360 Magicians - AI Agent Services

### Core Platform Magicians

1. **Gatekeeper Magician** 🚪
   - Identity verification and authentication
   - Access control and user routing
   - DeafAuth integration
   - Security monitoring

2. **Reputation Tracker Magician** ⭐
   - Fibonrose reputation scoring
   - Badge issuance and tracking
   - Contribution recording
   - Community trust building

3. **Workflow Automator Magician** 🔄
   - Automated task execution
   - Workflow recipe management
   - System health monitoring
   - Integration coordination

4. **Community Concierge Magician** 💬
   - Question answering (FAQ with ASL)
   - Resource discovery
   - Mentor matching
   - Opportunity surfacing

### Vocational Magicians

5. **Business Magician** 💼
   - Business idea generation
   - Business plan creation
   - Formation guidance (LLC, Corp, etc.)
   - SBA resource navigation
   - **VR self-employment pathway support**
   - Financial planning and pricing

6. **Developer Magician** 💻
   - Project scaffolding and generation
   - Code review and debugging
   - Accessibility auditing (WCAG 2.1 AA)
   - Deployment guidance
   - Technical mentorship
   - Best practices

7. **Job Magician** 🎯
   - Job matching and search
   - Resume and interview prep
   - Accommodation guidance (ADA)
   - **VR job placement support**
   - Skills assessment
   - Networking opportunities

8. **Creative Magician** 🎨
   - ASL content creation guidance
   - Video production standards
   - Brand development
   - Portfolio building
   - Marketing strategy
   - Accessibility design

## 🚀 Key Features

### Vocational Rehabilitation Compliance
- ✅ **VR enrollment and tracking** - Full case management
- ✅ **IPE (Individualized Plan for Employment)** support
- ✅ **Service authorization and documentation**
- ✅ **Milestone tracking and monitoring**
- ✅ **90-day employment outcome tracking**
- ✅ **Self-employment pathway guidance**
- ✅ **Compliance with 34 CFR Part 361**

### Workforce Solutions
- ✅ **WIOA program integration**
- ✅ **Employment outcome tracking**
- ✅ **Performance metrics and reporting**
- ✅ **Compliance checks and auditing**
- ✅ **Retention milestone monitoring**

### Accessibility Features
- ✅ **ASL video content throughout**
- ✅ **WCAG 2.1 Level AA compliance**
- ✅ **Full keyboard navigation**
- ✅ **Screen reader optimization**
- ✅ **Visual notification system**
- ✅ **Deaf-first design principles**

### Technical Excellence
- ✅ **Comprehensive Zod validation** - Type-safe operations
- ✅ **Semantic database schema** - Drizzle ORM
- ✅ **Inter-Magician coordination** - Agent communication
- ✅ **Audit trail logging** - Full compliance tracking
- ✅ **DeafAuth + JWT** - Secure authentication
- ✅ **Rate limiting and security**

## 🔧 Technologies

- **Frontend**: React + TypeScript, Shadcn/UI components
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas throughout
- **Authentication**: DeafAuth + JWT tokens
- **Storage**: Google Cloud Storage
- **Deployment**: Vercel
- **AI/ML**: OpenAI, Anthropic Claude, Google AI
- **Real-time**: Socket.io, HTMX

## 📋 Requirements

- Node.js 20+
- PostgreSQL database (or use Docker)
- Google Cloud Storage account (for document storage)
- OpenAI API key (for AI features)

## 🏁 Getting Started

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/MBTQ-dev/Magician_Platform.git
   cd Magician_Platform
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Using Replit

The project is optimized for Replit deployment:

1. Import the repository into Replit
2. Dependencies install automatically
3. Configure secrets in Replit dashboard
4. Click "Run" to start

### Using Docker

```bash
docker-compose up -d
```

Visit http://localhost:8080 to see the application.

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Quality Checks
npm run typecheck        # Run TypeScript type checking
npm run lint             # Run linting
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run validate         # Run all validation (typecheck + lint + test)

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests
npm run test:integration # Run integration tests
npm run test:coverage    # Generate coverage report

# Database
npm run db:push          # Push schema to database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio
npm run db:check         # Check schema

# Maintenance
npm run clean            # Clean build artifacts
```

## 📚 Documentation

- **[GITHUB-PRINCIPLES.md](./GITHUB-PRINCIPLES.md)** - GitHub principles and standardized procedures
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[COMPLIANCE-DOCUMENTATION.md](./COMPLIANCE-DOCUMENTATION.md)** - VR and workforce compliance standards
- **[Magician Services](./server/services/magicians/README.md)** - Detailed Magician capabilities
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[Platform Integration](./PLATFORM-INTEGRATION-SUMMARY.md)** - Integration guide
- **[Audit Summary](./AUDIT-SUMMARY.md)** - Comprehensive audit results
- **[API Routes](./API_ROUTES.md)** - API documentation

## 🗄️ Database Schema

The platform includes comprehensive database schemas for:

### Core Tables
- `users` - User accounts and profiles
- `fibonrose_scores` - Reputation scores
- `fibonrose_activities` - Point change log
- `fibonrose_badges` - Earned badges
- `magician_actions` - Audit trail
- `workflow_recipes` - Automation workflows

### VR Compliance Tables
- `vr_enrollment` - VR program enrollment
- `vr_service_records` - Service documentation
- `vr_milestones` - Progress tracking
- `employment_outcomes` - Job placement outcomes

### Workforce Tables
- `workforce_program_enrollment` - Program tracking
- `workforce_compliance_checks` - Compliance auditing
- `compliance_audit_trail` - Complete audit log

See [schema.ts](./shared/schema.ts) for complete definitions.

## 🎯 API Endpoints

### Magician Services

All Magicians follow a standardized API pattern:

```
GET  /api/magicians                    - List all Magicians
GET  /api/magicians/:id                - Get Magician info
POST /api/magicians/:id/execute        - Execute Magician action
```

### Specific Endpoints

#### Business Magician
- `POST /api/magicians/business_magician/execute` with actions:
  - `generate_business_idea`
  - `create_business_plan`
  - `guide_business_formation`
  - `find_sba_resources`
  - `vr_self_employment_pathway`

#### Developer Magician
- `POST /api/magicians/developer_magician/execute` with actions:
  - `generate_project`
  - `review_code`
  - `accessibility_audit`
  - `deployment_guide`

#### Job Magician
- `POST /api/magicians/job_magician/execute` with actions:
  - `match_jobs`
  - `build_resume`
  - `prepare_interview`
  - `vr_job_placement`

#### Creative Magician
- `POST /api/magicians/creative_magician/execute` with actions:
  - `create_asl_content`
  - `plan_creative_project`
  - `build_portfolio`

See full API documentation in the [Magician README](./server/services/magicians/README.md).

## 🔒 Security & Privacy

- **Authentication**: DeafAuth service with JWT tokens
- **Rate Limiting**: 5 attempts per 15 minutes for auth
- **Data Encryption**: At rest and in transit
- **Audit Logging**: All actions logged for compliance
- **Privacy**: GDPR/CCPA aligned, minimal data collection
- **Security**: Regular vulnerability scans

## ♿ Accessibility

The platform is built with deaf-first accessibility:

- **ASL Video Content**: Available throughout the platform
- **Visual Notifications**: No audio-only alerts
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Optimized for assistive technology
- **Color Contrast**: WCAG 2.1 AA compliant
- **Captions**: All video content captioned
- **Clear Communication**: Plain language, visual hierarchy

## 🔄 Workflows & Automation

The platform includes automated workflows for:

1. **New User Onboarding**
   - Welcome message with ASL video
   - Profile setup assistance
   - Service introduction
   - Initial mentor matching

2. **VR Program Management**
   - Enrollment tracking
   - Service authorization
   - Milestone monitoring
   - Progress reporting

3. **Job Placement Process**
   - Skills assessment
   - Job matching
   - Application tracking
   - Placement verification

4. **Self-Employment Launch**
   - Business validation
   - Plan development
   - Formation assistance
   - Ongoing support

## 🧪 Testing

```bash
# Run tests
npm test

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run all validation
npm run validate

# Test coverage (when configured)
npm run test:coverage
```

## 📦 Deployment

### Replit Deployment (Automated)

Deployment to Replit is automated:

1. Push to `main` branch
2. Replit auto-deploys from GitHub
3. Monitor deployment in Replit console
4. Verify health: `GET /api/health`

Configuration files:
- `.replit` - Replit configuration
- `replit.nix` - Nix dependencies

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel deploy --prod

# Or use GitHub integration (automatic)
```

### Docker Deployment

```bash
# Build image
docker build -t magician-platform .

# Run container
docker run -p 5000:5000 --env-file .env magician-platform

# Or use docker-compose
docker-compose up -d
```

### Health Monitoring

After deployment, verify system health:

```bash
# Comprehensive health check
curl https://your-domain.com/api/health

# Liveness probe
curl https://your-domain.com/api/health/live

# Readiness probe
curl https://your-domain.com/api/health/ready
```

### Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgres://username:password@host:port/database

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json

# Authentication
JWT_SECRET=your-secret-key

# Application
NODE_ENV=production
PORT=5000

# Optional Services
SLACK_TOKEN=xoxb-...
NOTION_API_KEY=secret_...
STRIPE_SECRET_KEY=sk_...
```

See `.env.example` for complete list.

## 🤖 Automated Workflows

The platform includes comprehensive GitHub Actions workflows:

### 1. Auto-merge (Dependabot)
- **Trigger**: Dependabot PRs
- **Action**: Auto-approve and merge patch/minor updates
- **File**: `.github/workflows/auto-merge.yml`

### 2. Auto-test
- **Trigger**: Push to any branch, PRs
- **Action**: Run type checking, linting, build, tests, security scan
- **File**: `.github/workflows/auto-test.yml`

### 3. Auto-update
- **Trigger**: Weekly (Monday 9 AM UTC)
- **Action**: Update dependencies, create PR
- **File**: `.github/workflows/auto-update.yml`

### 4. Production Deploy
- **Trigger**: Push to main branch
- **Action**: Build, validate, deploy to Replit/Vercel
- **File**: `.github/workflows/production-deploy.yml`

### 5. Compliance Checks
- **Trigger**: Daily (2 AM UTC), push, PRs
- **Action**: VR compliance, accessibility, security audits
- **File**: `.github/workflows/compliance-checks.yml`

### 6. Agent Management
- **Trigger**: Manual dispatch
- **Action**: Health checks, performance audits, capacity planning
- **File**: `.github/workflows/agent-management.yml`

### 7. Dependabot
- **Configuration**: `.github/dependabot.yml`
- **Schedule**: Weekly updates
- **Groups**: Radix UI, types, dev dependencies
- **Ignore**: Major version updates (manual review required)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes with clear commits
4. Ensure all tests pass: `npm run validate`
5. Push and open a Pull Request

### Development Workflow

- Use conventional commits (e.g., `feat:`, `fix:`, `docs:`)
- Ensure TypeScript strict mode compliance
- Add tests for new features
- Update documentation
- Follow accessibility standards (WCAG 2.1 AA)
- Maintain VR compliance for related features

### Code Standards

- **TypeScript**: Strict mode, no `any` types
- **React**: Functional components with hooks
- **Accessibility**: WCAG 2.1 Level AA compliance
- **Testing**: >80% code coverage goal
- **Security**: No secrets in code, use environment variables

For detailed standards, see [GITHUB-PRINCIPLES.md](./GITHUB-PRINCIPLES.md).

## 📊 Compliance & Reporting

The platform maintains compliance with:

- **34 CFR Part 361** - VR Services regulations
- **Rehabilitation Act of 1973**
- **WIOA** - Workforce Innovation and Opportunity Act
- **ADA** - Americans with Disabilities Act
- **WCAG 2.1 Level AA** - Web accessibility standards

Compliance reports can be generated through the platform or via GitHub Actions workflows.

## 🆘 Support

- **VR Counselors**: Contact your state VR agency
- **Platform Support**: Open an issue on GitHub
- **Deaf Community**: Join our Discord (ASL-friendly)
- **Technical Support**: See documentation or contact maintainers

## 📝 License

[MIT License](LICENSE)

## 👥 Team & Acknowledgments

- 360 Magicians Team
- MBTQ Platform Contributors
- Deaf Community Advisors
- VR Agency Partners
- Workforce Development Partners

## 🗺️ Roadmap

### Completed ✅
- [x] 8 Magician services implemented
- [x] VR compliance tracking
- [x] Workforce solutions integration
- [x] Zod validation throughout
- [x] Comprehensive database schema
- [x] Deaf-first accessibility
- [x] Automated workflows (auto-merge, auto-test, auto-update)
- [x] Health check endpoints
- [x] Production-ready configuration
- [x] Standardized GitHub procedures

### In Progress 🚧
- [ ] Additional Magicians (Content Curator, Safety Monitor, etc.)
- [ ] Testing framework implementation (Jest/Vitest)
- [ ] ESLint and Prettier configuration
- [ ] Mobile applications
- [ ] Advanced AI/ML features
- [ ] Real-time collaboration
- [ ] Enhanced analytics

### Planned 📋
- [ ] Multi-language support (beyond ASL/English)
- [ ] Blockchain integration for credentials
- [ ] Expanded VR agency integrations
- [ ] AI-powered career path recommendations
- [ ] Performance optimization
- [ ] Enhanced monitoring and alerting

## 🌐 Alignment

This platform is aligned with the 360 Magicians ecosystem:

- ✅ **github.com/pinkycollie/mbtq-dev** - MBTQ ecosystem integration
  - Subdomain architecture support (idea.mbtq.dev, validate.mbtq.dev, build.mbtq.dev)
  - User type classifications (job_seeker, entrepreneur, employer)
  - Smart routing and VR pathway support

- ✅ **github.com/pinkycollie/360magicians** - 360 Magicians framework
  - 8 Magician services active and coordinating
  - Inter-Magician communication protocol
  - BaseMagician abstract class pattern
  - Singleton pattern implementation

- ✅ **Vocational Rehabilitation** - 34 CFR Part 361 compliance
  - VR enrollment and tracking
  - IPE (Individualized Plan for Employment) support
  - Service authorization and documentation
  - 90-day employment outcome tracking

- ✅ **Workforce Solutions** - WIOA standards
  - Program enrollment tracking
  - Performance metrics and reporting
  - Compliance checks and auditing
  - Retention milestone monitoring

- ✅ **Deaf Community Best Practices**
  - ASL-first content strategy
  - Visual communication priority
  - Deaf culture awareness
  - Community feedback integration

---

**Built with ❤️ for the deaf community**

For questions, feedback, or support, please open an issue or contact the team.

We provide a Docker Compose configuration for easy local development:

```bash
docker-compose up -d
```

Visit http://localhost:8080 to see the application.

## 🗄️ Environment Variables

Create a `.env` file in the project root with the following variables:

```
# Database connection
DATABASE_URL=postgres://username:password@localhost:5432/business_magician

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=path-to-credentials.json

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Application settings
NODE_ENV=development
PORT=5000
```

## 📂 Project Structure

```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and API clients
│   │   ├── pages/           # Page components
├── server/                  # Backend Express application
│   ├── routes/              # API routes (modular route handlers)
│   ├── services/            # Business logic and external integrations
│   │   ├── notionService.ts         # Notion API integration
│   │   ├── northwestAgentService.ts # Business formation services
│   │   ├── magicians/               # 360 Magicians AI agents
│   ├── middleware/          # Express middleware
│   ├── index.ts             # Main server entry point (lazy-loaded routes)
│   ├── routes.ts            # Central route registration
├── shared/                  # Shared code between client and server
│   ├── schema.ts            # Database schema definitions (Drizzle ORM)
├── scripts/                 # Utility scripts
├── archived_legacy_files/   # Archived legacy standalone files (not in repo)
```

## 🏗️ Architecture

### Current API Architecture

The platform uses a **unified Express.js API server** with modular routes:

- **Main Server**: `server/index.ts` - Express server with lazy-loaded routes for memory efficiency
- **Route Registration**: `server/routes.ts` - Central registration of all API routes
- **Modular Routes**: `server/routes/*.ts` - Individual route handlers for:
  - Business formation (`businessFormationRoutes.ts`)
  - Ecosystem services (`ecosystemRoutes.ts`)
  - AI/ML operations (`ai.ts`, `anthropic.ts`, `openai-test.ts`)
  - 360 Magicians (`magiciansRoutes.ts`)
  - Storage and file management (`storage.ts`)
  - And more...

### Services Layer

Business logic is organized in `server/services/`:
- **notionService.ts**: Notion API integration for knowledge management
- **northwestAgentService.ts**: Business entity formation through Northwest Registered Agent
- **deafAuthService.ts**: Authentication for deaf-first platform
- **fibonroseService.ts**: Reputation scoring system
- **magicians/**: 360 Magicians AI agents (GatekeeperMagician, ReputationTrackerMagician, etc.)

### Legacy Files Note

Legacy standalone API files have been archived to `archived_legacy_files/` (excluded from git). See `ARCHIVED_FILES.md` for details on migrated functionality.

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