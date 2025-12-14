# Migration Guide: Legacy Files to Unified Architecture

## Overview

This guide documents the migration from multiple standalone API servers to a unified Express.js server architecture.

## What Changed

### Before (Legacy Architecture)
The project had multiple standalone server files:
- `api-server-notion.js` - Server with Notion integration
- `api-server.js` - Basic API server
- `api-server.ts` - TypeScript API server
- `generate-idea-to-notion.js` - Standalone Notion script
- `flask-bridge.js` - Flask integration bridge
- Various test servers and scripts

**Issues with old architecture:**
- Code duplication
- Hard to maintain
- Memory inefficient
- Inconsistent APIs
- Difficult to test

### After (Unified Architecture)
Single, well-structured server with modular routes:

```
server/
├── index.ts              # Main server with lazy-loaded routes
├── routes.ts             # Central route registration
├── routes/               # Modular route handlers
│   ├── businessFormationRoutes.ts
│   ├── ecosystemRoutes.ts
│   ├── magiciansRoutes.ts
│   ├── ai.ts
│   ├── anthropic.ts
│   └── ...
├── services/             # Business logic layer
│   ├── notionService.ts
│   ├── northwestAgentService.ts
│   ├── deafAuthService.ts
│   ├── fibonroseService.ts
│   └── magicians/        # 360 Magicians AI agents
└── middleware/           # Express middleware
```

**Benefits:**
- Single source of truth
- Modular and maintainable
- Memory efficient with lazy loading
- Consistent REST API
- Easy to test and extend

## API Endpoints

All functionality from the legacy servers is now available through the unified API:

### Core Endpoints
- `GET /api/health` - Health check
- `GET /api/ai-status` - AI services status

### Business Formation
- `GET /api/business-formation/entity-types` - Get entity types
- `GET /api/business-formation/requirements/:stateCode/:entityType` - Get state requirements
- `POST /api/business-formation/create` - Create business entity

### Ecosystem
- `GET /api/ecosystem/services` - Get ecosystem services
- `POST /api/ecosystem/business-ideas` - Generate business ideas

### 360 Magicians
- `POST /api/magicians/:magicianType/process` - Process magician request
- `GET /api/magicians/:magicianType/status` - Get magician status

### Storage & Files
- `POST /api/storage/upload-url` - Generate upload URL
- `GET /api/storage/files` - List files
- `POST /api/storage/data` - Save data

### AI/ML Operations
- `POST /api/ai/generate` - Generate AI content
- `POST /api/claude/chat` - Claude AI chat
- `POST /api/tools/generate-ideas` - Generate business ideas

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Using Docker
```bash
docker-compose up -d
```

## Environment Variables

All the same environment variables are supported:

```bash
# Database
DATABASE_URL=postgresql://...

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Notion
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=...
GOOGLE_CLOUD_BUCKET_NAME=...

# Server
PORT=5000
NODE_ENV=development
```

## Archived Files Location

All legacy files have been moved to `archived_legacy_files/` directory, which is excluded from git via `.gitignore`.

To access archived files:
```bash
cd archived_legacy_files/
ls -la
```

## Testing

The unified server includes all functionality from the legacy servers. To verify:

1. Start the server: `npm run dev`
2. Test health endpoint: `curl http://localhost:5000/api/health`
3. Check AI status: `curl http://localhost:5000/api/ai-status`
4. Test business tools: `curl http://localhost:5000/api/business-tools`

## Deployment

### Cloud Run (GCP)
The `deploy-to-cloud-run.sh` script has been updated to deploy the unified server.

### Vercel
The platform is configured for Vercel deployment with serverless functions.

## Need Help?

- Check `ARCHIVED_FILES.md` for the complete list of archived files
- Review `README.md` for current architecture details
- See `implementation-plan.md` for deployment guidelines

## Migration Checklist

- [x] Archive legacy standalone servers
- [x] Update route structure
- [x] Consolidate services layer
- [x] Update documentation
- [x] Update shell scripts
- [x] Test all endpoints
- [ ] Update CI/CD pipelines (if any)
- [ ] Update deployment configurations
