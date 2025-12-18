# Repository Organization

This document provides a quick overview of the VR4Deaf-Apps repository structure and organization.

## 🔷 MBTQ Platform

This repository is part of the **MBTQ Platform** ecosystem. For the platform overview, visit:
**[https://mbtq-dev.github.io/VR4Deaf-Apps/](https://mbtq-dev.github.io/VR4Deaf-Apps/)**

### Three Pillars
- **🔐 DeafAUTH** - Authentication & identity management
- **⚡ PinkSync** - Real-time sync & accessibility
- **⭐ Fibonrose** - Reputation & trust scoring

## 📁 Directory Structure

```
VR4Deaf-Apps/
├── client/              # Frontend React application
├── server/              # Backend Express server
│   ├── routes/         # API route handlers
│   ├── services/       # Business logic & integrations
│   └── index.ts        # Main server entry
├── shared/             # Shared code (schemas, types)
├── docs/               # GitHub Pages documentation site
│   ├── index.html      # MBTQ Platform landing page
│   └── assets/         # CSS, JS, images
├── scripts/            # Utility scripts (db-setup, etc.)
├── archived-docs/      # Historical documentation
├── deno-app/           # Optional Deno/Fresh application
└── workflows/          # Workflow definitions
```

## 📚 Key Documentation

### Essential Docs (Root Level)
- **[README.md](./README.md)** - Main project documentation
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment instructions
- **[COMPLIANCE_GUIDE.md](./COMPLIANCE_GUIDE.md)** - VR compliance information
- **[API_ROUTES.md](./API_ROUTES.md)** - Complete API documentation
- **[SECURITY_POLICY.md](./SECURITY_POLICY.md)** - Security practices
- **[ACCESSIBILITY_STATEMENT.md](./ACCESSIBILITY_STATEMENT.md)** - Accessibility compliance
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

### Technical Docs
- **[DENO_SUPABASE_GUIDE.md](./DENO_SUPABASE_GUIDE.md)** - Deno & Supabase integration
- **[COMPLIANCE-DOCUMENTATION.md](./COMPLIANCE-DOCUMENTATION.md)** - Federal compliance details
- **[CI-TESTING.md](./CI-TESTING.md)** - CI/CD and testing
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Migration instructions

### Archived Docs
Historical and outdated documentation can be found in:
- **[archived-docs/](./archived-docs/)** - Archived documentation files

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:push

# Start development server
npm run dev
```

## 🔗 Related Repositories

Part of the **MBTQ Platform** ecosystem:
- [deaf-ecosystem](https://github.com/MBTQ-dev/deaf-ecosystem) - Core infrastructure
- [nextjs-deafauth](https://github.com/MBTQ-dev/nextjs-deafauth) - DeafAUTH implementation
- [pinksync](https://github.com/MBTQ-dev/pinksync) - Real-time sync service
- [fibonrose](https://github.com/MBTQ-dev/fibonrose) - Trust scoring system

## 📦 Package Info

- **Name**: vr4deaf-apps
- **Runtime**: Node.js 20+
- **Framework**: Express + React + TypeScript
- **Database**: PostgreSQL with Drizzle ORM

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

**Built with ❤️ for the deaf community**
