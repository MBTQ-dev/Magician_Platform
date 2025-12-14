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

### Deno + Fresh Application (Optional)

The platform includes an optional Deno-based Fresh framework application in the `/deno-app` directory that can run alongside the main Node.js application.

**To run the Deno application:**

1. Install Deno (if not already installed):
   ```bash
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

2. Set the database environment variable:
   ```bash
   export SUPABASE_DB_URL="postgres://user:password@host:port/database"
   ```

3. Start the Deno Fresh app:
   ```bash
   cd deno-app
   deno task dev
   ```

The Deno application will be available at `http://localhost:8000` and provides:
- Fresh framework for server-side rendering
- Example API routes (`/api/trust`)
- Interactive island components
- PostgreSQL connectivity

See [deno-app/README.md](./deno-app/README.md) for detailed documentation.

## 📚 Documentation

- **[Compliance Documentation](./COMPLIANCE-DOCUMENTATION.md)** - VR and workforce compliance standards
- **[Magician Services](./server/services/magicians/README.md)** - Detailed Magician capabilities
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[Platform Integration](./PLATFORM-INTEGRATION-SUMMARY.md)** - Integration guide

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

# Run accessibility tests
npm run test:a11y
```

## 📦 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy --prod
```

### Environment Variables

Required environment variables:

```env
DATABASE_URL=postgres://...
OPENAI_API_KEY=sk-...
GOOGLE_CLOUD_PROJECT_ID=...
GOOGLE_CLOUD_BUCKET_NAME=...
JWT_SECRET=...
NODE_ENV=production
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Ensure all tests pass
6. Submit a pull request

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
- **Troubleshooting**: See [REMOVING_CLOUD_RUN_STATUS_CHECK.md](REMOVING_CLOUD_RUN_STATUS_CHECK.md) for resolving stuck GitHub status checks

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

### In Progress 🚧
- [ ] Additional Magicians (Content Curator, Safety Monitor, etc.)
- [ ] Mobile applications
- [ ] Advanced AI/ML features
- [ ] Real-time collaboration
- [ ] Enhanced analytics

### Planned 📋
- [ ] Multi-language support (beyond ASL/English)
- [ ] Blockchain integration for credentials
- [ ] Expanded VR agency integrations
- [ ] AI-powered career path recommendations

## 🌐 Alignment

This platform is aligned with and references:
- **github.com/pinkycollie/mbtq-dev** - MBTQ ecosystem
- **github.com/pinkycollie/360magicians** - 360 Magicians framework
- Vocational Rehabilitation regulations
- Workforce Solutions standards
- Deaf community best practices

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