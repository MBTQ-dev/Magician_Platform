# 🌈 MBTQ.dev | Compliance and Workforce Modules 

**A modular, production-ready reusable compliance and workflow mddules originally built to support deaf entrepreneurs, job seekers, developers, and creatives.**

**Generative AI Platform for Building with Supabase & Modern Frameworks**

**VR Agency • Deaf Community • LGBTQ+ Agency Compliant**

### Core Magician Services
- **Business Magician**: Complete business formation and lifecycle support
- **Developer Magician**: Code scaffolding, tech recommendations, and development tools
- **Creative Magician**: Branding, ASL video production, and marketing solutions
- **Job Magician**: Resume building, job matching, and career development

### Accessibility & Integration
- **ASL Video Guidance**: Accessible content in American Sign Language
- **VR Counselor Integration**: Connect with Vocational Rehabilitation specialists
- **Real-time Translation Services**: Communication accessibility tools
- **Deaf-first Design**: All interfaces optimized for deaf users

### Business Tools
- **Document Management**: Storage and organization for business documents
- **Self-Employment Service Modules**: Comprehensive pricing tools
- **SBA Resource Library**: Access to Small Business Administration resources
- **AI-Powered Business Analytics**: Intelligent business planning and analysis

## 🔧 Technologies

- **Frontend**: React + TypeScript with Shadcn/UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Dynamic Interactions**: HTMX for seamless UX
- **Cloud Storage**: Google Cloud Storage & Cloudflare R2 integration
- **Messaging**: Telegram bot and Slack integration
- **AI Services**: OpenAI & Anthropic integration
- **Deployment**: Vercel, Cloud Run, and Cloudflare Pages

## 📋 Requirements

- Node.js 20+
- Supabase account (or PostgreSQL database with Docker)
- OpenAI/Anthropic API key (for AI features)
- Vercel account (for deployment, optional)

## 🏁 Getting Started

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/MBTQ-dev/MBTQ.dev.git
   cd MBTQ.dev
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase and AI API keys
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
- Supabase connectivity

See [deno-app/README.md](./deno-app/README.md) for detailed documentation.

## 📚 Documentation

### Integration & Deployment
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment instructions and options
- **[Accessibility Statement](./ACCESSIBILITY_STATEMENT.md)** - WCAG 2.1 AA compliance details
- **[Security Policy](./SECURITY_POLICY.md)** - Security practices and vulnerability reporting
- **[Deno + Supabase Guide](./DENO_SUPABASE_GUIDE.md)** - Complete Deno integration guide

### Technical Documentation
- **[AI Agent Services](./server/services/magicians/README.md)** - Detailed Magician capabilities
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[Platform Integration](./PLATFORM-INTEGRATION-SUMMARY.md)** - Integration guide
- **[API Routes](./API_ROUTES.md)** - Complete API documentation

### Interactive Demo
- **[GitHub Pages](https://mbtq-dev.github.io/MBTQ.dev/)** - Live platform demo and integration examples

---

## 🗄️ Database Schema

The platform includes comprehensive database schemas for:

### Core Tables
| Table | Purpose |
|-------|---------|
| `users` | User accounts and profiles |
| `fibonrose_scores` | Reputation scores |
| `fibonrose_activities` | Point change log |
| `fibonrose_badges` | Earned badges |
| `magician_actions` | Audit trail |
| `workflow_recipes` | Automation workflows |

### VR Compliance Tables
| Table | Purpose |
|-------|---------|
| `vr_enrollment` | VR program enrollment tracking |
| `vr_service_records` | Service documentation |
| `vr_milestones` | Progress and milestone tracking |
| `employment_outcomes` | Job placement outcomes |

### Workforce Tables
| Table | Purpose |
|-------|---------|
| `workforce_program_enrollment` | Program tracking |
| `workforce_compliance_checks` | Compliance auditing |
| `compliance_audit_trail` | Complete audit log |

See [schema.ts](./shared/schema.ts) for complete definitions.

---

## 🎯 API Endpoints

### AI Agent Services

All AI Agents follow a standardized API pattern:

```
GET  /api/magicians                    - List all AI Agents
GET  /api/magicians/:id                - Get Agent info
POST /api/magicians/:id/execute        - Execute Agent action
```

### VR Compliance Endpoints

```
POST /api/vr/enrollment               - Create VR enrollment
GET  /api/vr/services/:enrollmentId   - Get services for enrollment
POST /api/workforce/outcomes          - Record employment outcome
```

### Specific Agent Endpoints

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

See full API documentation in the [Agent Services README](./server/services/magicians/README.md).

---

## 📊 Compliance & Reporting

The platform maintains compliance with:

| Standard | Description |
|----------|-------------|
| **34 CFR Part 361** | VR Services regulations |
| **Rehabilitation Act of 1973** | Disability rights in federal programs |
| **WIOA** | Workforce Innovation and Opportunity Act |
| **ADA** | Americans with Disabilities Act |
| **WCAG 2.1 Level AA** | Web accessibility standards |
| **LGBTQ+ Best Practices** | Inclusive service delivery standards |

Compliance reports can be generated through the platform or via GitHub Actions workflows.

---

## 🔒 Security & Privacy

| Feature | Description |
|---------|-------------|
| **Authentication** | DeafAuth service with JWT tokens and Supabase Auth |
| **Rate Limiting** | 5 attempts per 15 minutes for auth |
| **Data Encryption** | At rest and in transit |
| **Audit Logging** | All actions logged for compliance |
| **Privacy** | GDPR/CCPA aligned, minimal data collection |
| **Security** | Regular vulnerability scans |
| **LGBTQ+ Privacy** | Safe space data handling, pronoun respect |

---

## 🦻 Accessibility

The platform is built with **accessibility-first** design:

- **ASL Video Content**: Available throughout the platform
- **Visual Notifications**: No audio-only alerts
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Optimized for assistive technology
- **Color Contrast**: WCAG 2.1 AA compliant
- **Captions**: All video content captioned
- **Clear Communication**: Plain language, visual hierarchy
- **LGBTQ+ Inclusive**: Queer-friendly design patterns and language

---

## 🔄 Workflows & Automation

The platform includes automated workflows powered by GitHub Apps, Bots, and AI Agents:

### Development Workflows
| Workflow | Purpose |
|----------|---------|
| **CI/CD Pipeline** | Automated testing, building, and deployment |
| **Code Review** | AI-powered code review and accessibility auditing |
| **Documentation** | Auto-generated API docs and changelog |
| **Security Scanning** | Automated vulnerability detection |

### User Experience Workflows
| Workflow | Purpose |
|----------|---------|
| **Onboarding** | Welcome message with ASL video, profile setup |
| **Project Scaffolding** | AI-assisted project generation |
| **Accessibility Audit** | Automated WCAG compliance checking |

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

---

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
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Authentication
JWT_SECRET=...

# Environment
NODE_ENV=production
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Ensure all tests pass
6. Submit a pull request

---

## 🆘 Support

| Channel | Description |
|---------|-------------|
| **GitHub Issues** | Report bugs and feature requests |
| **Discord** | Community support (ASL-friendly) |
| **Documentation** | Comprehensive guides and tutorials |
| **Troubleshooting** | See [REMOVING_CLOUD_RUN_STATUS_CHECK.md](REMOVING_CLOUD_RUN_STATUS_CHECK.md) for resolving stuck GitHub status checks |

---

## 📝 License

[MIT License](LICENSE)

---

## 👥 Team & Acknowledgments

- 360 Magicians Team
- MBTQ.dev Platform Contributors
- Deaf Community Advisors
- LGBTQ+ Community Contributors
- Open Source Contributors

---

## 🗺️ Roadmap

### Completed ✅
- [x] 8 AI Agent services implemented
- [x] Supabase integration
- [x] Generative AI integration (GPT-4, Claude, Gemini)
- [x] Zod validation throughout
- [x] Comprehensive database schema
- [x] Accessibility-first design
- [x] LGBTQ+ friendly badges and design

### In Progress 🚧
- [ ] Additional AI Agents (Content Curator, Safety Monitor, etc.)
- [ ] Mobile applications
- [ ] Advanced AI/ML features
- [ ] Real-time collaboration
- [ ] Enhanced analytics

### Planned 📋
- [ ] Multi-language support (beyond ASL/English)
- [ ] More framework templates (Vue, Svelte, etc.)
- [ ] AI-powered accessibility recommendations
- [ ] Enhanced Supabase Edge Functions examples

## 🌐 Ecosystem

This platform is part of the MBTQ.dev ecosystem:

| Platform | Focus |
|----------|-------|
| **[MBTQ.dev](https://mbtq.dev)** | AI-Powered Full-Stack Development Platform |
| **[Business Magician](https://business.360magicians.com)** | Entrepreneurship and Business Services |
| **[360 Magicians](https://360magicians.com)** | AI Agent Framework |

---

**🌈 MBTQ.dev © 2025 | Community. Culture. Power. 💜**

**Open Source • Accessibility First • AI-Powered • LGBTQ+ Friendly**

[![Star on GitHub](https://img.shields.io/github/stars/MBTQ-dev/MBTQ.dev?style=social)](https://github.com/MBTQ-dev/MBTQ.dev)

For questions, feedback, or support, please [open an issue](https://github.com/MBTQ-dev/MBTQ.dev/issues) or contact the team.

---

## 🐳 Docker Development

We provide a Docker Compose configuration for easy local development:

```bash
docker-compose up -d
```

Visit http://localhost:8080 to see the application.

---

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
