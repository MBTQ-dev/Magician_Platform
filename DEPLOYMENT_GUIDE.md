# Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying and integrating the Magician Platform's compliance and workflow system into your own projects. The platform is designed to be modular and reusable across different environments and platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Deployment Options](#deployment-options)
6. [Integration Patterns](#integration-patterns)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: Version 20 or higher
- **PostgreSQL**: Version 12 or higher
- **npm**: Version 8 or higher (or yarn/pnpm)
- **Git**: For version control

### Optional Requirements

- **Docker**: For containerized deployment
- **Google Cloud Account**: For cloud storage and deployment
- **Vercel Account**: For serverless deployment
- **SSL Certificate**: For production HTTPS

### Development Tools

- **TypeScript**: Language support
- **VS Code** (recommended): IDE with extensions
- **Postman/Insomnia**: API testing
- **pgAdmin/DBeaver**: Database management

## Quick Start

### 1. Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/MBTQ-dev/Magician_Platform.git
cd Magician_Platform

# Or use as a template
gh repo create my-project --template MBTQ-dev/Magician_Platform
```

### 2. Install Dependencies

```bash
# Install with npm (use --legacy-peer-deps for compatibility)
npm install --legacy-peer-deps

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or your preferred editor
```

### 4. Setup Database

```bash
# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate

# (Optional) Open Drizzle Studio for database management
npm run db:studio
```

### 5. Start Development Server

```bash
# Start development server
npm run dev

# Access at http://localhost:5000
```

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Application Settings
NODE_ENV=development
PORT=5000

# JWT Authentication
JWT_SECRET=your-secure-random-string-min-32-characters

# API Keys (Optional - for AI features)
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GOOGLE_AI_API_KEY=your-google-ai-key

# Google Cloud Storage (Optional - for file uploads)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Deno Application (Optional)
SUPABASE_DB_URL=postgresql://username:password@localhost:5432/database_name
```

### Production Environment Variables

For production, add these additional variables:

```bash
NODE_ENV=production

# Security
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
SESSION_SECRET=your-session-secret-min-32-characters

# Database (use connection pooling for production)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Monitoring (Optional)
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

### Generating Secrets

```bash
# Generate secure random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use openssl
openssl rand -hex 32
```

## Database Setup

### Local PostgreSQL Setup

#### Using Docker (Recommended for Development)

```bash
# Start PostgreSQL container
docker run -d \
  --name magician-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=magician_platform \
  -p 5432:5432 \
  postgres:16

# Verify connection
docker exec -it magician-postgres psql -U postgres -d magician_platform
```

#### Using docker-compose

```yaml
# docker-compose.yml (included in repository)
version: '3.8'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: magician_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down
```

#### Native PostgreSQL Installation

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
createdb magician_platform
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb magician_platform
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### Cloud Database Options

#### Neon (Serverless PostgreSQL)

```bash
# Sign up at neon.tech
# Copy connection string
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
```

#### Supabase

```bash
# Sign up at supabase.com
# Get connection string from project settings
DATABASE_URL=postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres
```

#### Railway

```bash
# Sign up at railway.app
# Create PostgreSQL service
# Copy connection URL
```

#### Google Cloud SQL

```bash
# Create Cloud SQL instance
gcloud sql instances create magician-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=us-central1
```

### Schema Migration

```bash
# Push schema to database (development)
npm run db:push

# Generate migration files
npm run db:generate

# Apply migrations (production)
npm run db:migrate

# Check schema
npm run db:check
```

### Database Backup

```bash
# Backup database
pg_dump -U postgres magician_platform > backup.sql

# Restore database
psql -U postgres magician_platform < backup.sql

# Automated backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres magician_platform > backup_$TIMESTAMP.sql
```

## Deployment Options

### Option 1: Vercel (Recommended for Production)

Vercel provides serverless deployment with automatic HTTPS and global CDN.

#### Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel deploy --prod
```

#### Configuration

Create `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "DATABASE_URL": "@database-url",
      "JWT_SECRET": "@jwt-secret"
    }
  }
}
```

#### Environment Variables

```bash
# Add secrets via Vercel dashboard or CLI
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add OPENAI_API_KEY production
```

### Option 2: Docker Deployment

#### Build Docker Image

```bash
# Build image
docker build -t magician-platform .

# Run container
docker run -d \
  --name magician-app \
  -p 5000:5000 \
  --env-file .env \
  magician-platform

# View logs
docker logs -f magician-app
```

#### Dockerfile (Included)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

#### Docker Compose (Full Stack)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Option 3: Google Cloud Platform

#### Cloud Run Deployment

```bash
# Install gcloud CLI
# See: https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Build and deploy
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/magician-platform
gcloud run deploy magician-platform \
  --image gcr.io/YOUR_PROJECT_ID/magician-platform \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Deploy Script (Included)

```bash
# Use included deployment script
./deploy-to-cloud-run.sh
```

### Option 4: Traditional VPS/VM

#### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "magician-platform" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Using systemd (Linux)

Create `/etc/systemd/system/magician-platform.service`:

```ini
[Unit]
Description=Magician Platform
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/Magician_Platform
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable magician-platform
sudo systemctl start magician-platform
sudo systemctl status magician-platform
```

### Option 5: Deno Deploy (Optional Deno App)

For the optional Deno application in `/deno-app`:

```bash
# Install Deno
curl -fsSL https://deno.land/install.sh | sh

# Deploy to Deno Deploy
cd deno-app
deployctl deploy --project=magician-platform --prod main.ts
```

## Integration Patterns

### Pattern 1: Direct API Integration

Use the platform's REST API directly from your application:

```typescript
// Example: Create VR enrollment
const response = await fetch('https://your-deployment.com/api/vr/enrollment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiToken}`
  },
  body: JSON.stringify({
    vrAgency: 'State VR Agency',
    vrCounselor: 'Jane Smith',
    vrCounselorEmail: 'jane@vr.gov',
    programType: 'self_employment'
  })
});

const enrollment = await response.json();
```

### Pattern 2: Webhook Integration

Subscribe to compliance events:

```typescript
// Register webhook in your application
const webhook = await fetch('https://your-deployment.com/api/webhooks/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiToken}`
  },
  body: JSON.stringify({
    url: 'https://your-app.com/webhooks/compliance',
    events: ['vr.milestone.completed', 'workforce.outcome.recorded'],
    secret: 'your-webhook-secret'
  })
});

// Handle webhook in your application
app.post('/webhooks/compliance', (req, res) => {
  // Verify signature
  const signature = req.headers['x-webhook-signature'];
  const isValid = verifyWebhookSignature(req.body, signature, webhookSecret);
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process event
  const { event, data } = req.body;
  console.log(`Received event: ${event}`, data);
  
  res.status(200).send('OK');
});
```

### Pattern 3: Module Import

Import specific modules into your project:

```typescript
// Install as dependency (future npm package)
// npm install @magician-platform/compliance

// Import specific services
import { vrComplianceService } from '@magician-platform/compliance';
import { vrEnrollment, vrServiceRecords } from '@magician-platform/schemas';

// Use in your application
const enrollment = await vrComplianceService.createEnrollment({
  userId: user.id,
  vrAgency: 'State VR',
  programType: 'self_employment'
});
```

### Pattern 4: GitHub Actions Workflow

Use compliance checks in your CI/CD:

```yaml
# .github/workflows/compliance.yml
name: Compliance Check

on: [push, pull_request]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run VR Compliance Checks
        uses: MBTQ-dev/magician-platform-action@v1
        with:
          check-type: 'vr-compliance'
          
      - name: Run Accessibility Audit
        uses: MBTQ-dev/magician-platform-action@v1
        with:
          check-type: 'accessibility'
```

## Monitoring and Maintenance

### Health Checks

The platform includes built-in health check endpoints:

```bash
# Liveness check (is the service running?)
curl https://your-deployment.com/api/health/live

# Readiness check (is the service ready to handle requests?)
curl https://your-deployment.com/api/health/ready

# Full health status
curl https://your-deployment.com/api/health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2024-12-14T23:53:24.634Z",
  "uptime": 3600,
  "database": "connected",
  "services": {
    "magicians": "operational",
    "storage": "operational"
  }
}
```

### Logging

```typescript
// Application logs
console.log('[INFO] Application started');
console.error('[ERROR] Database connection failed');

// Structured logging (production)
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Monitoring Tools

#### Application Monitoring

- **Vercel Analytics**: Built-in for Vercel deployments
- **Google Cloud Monitoring**: For GCP deployments
- **Sentry**: Error tracking and performance monitoring
- **New Relic**: APM and infrastructure monitoring

#### Database Monitoring

```sql
-- Check database size
SELECT pg_database_size('magician_platform') / 1024 / 1024 AS size_mb;

-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT query, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Backup Strategy

#### Automated Backups

```bash
# Daily backup script (crontab)
0 2 * * * /path/to/backup-script.sh

# backup-script.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /backups/db_$DATE.sql
# Upload to cloud storage
gsutil cp /backups/db_$DATE.sql gs://your-backup-bucket/
# Clean up old backups (keep 30 days)
find /backups -name "db_*.sql" -mtime +30 -delete
```

### Update Strategy

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install --legacy-peer-deps

# Run migrations
npm run db:migrate

# Build
npm run build

# Restart service
pm2 restart magician-platform

# Or with systemd
sudo systemctl restart magician-platform
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3000 npm run dev
```

#### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Check firewall rules (if remote database)
telnet hostname 5432
```

#### Build Failures

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Clear build cache
rm -rf dist .vite

# Rebuild
npm run build
```

#### TypeScript Errors

```bash
# Run type checking
npm run check

# Update TypeScript
npm install -D typescript@latest
```

### Performance Issues

#### Slow Database Queries

```sql
-- Enable query logging
ALTER DATABASE magician_platform SET log_min_duration_statement = 1000;

-- Analyze tables
ANALYZE;

-- Add indexes for slow queries
CREATE INDEX idx_vr_enrollment_user ON vr_enrollment(user_id);
CREATE INDEX idx_vr_services_enrollment ON vr_service_records(enrollment_id);
```

#### High Memory Usage

```bash
# Check Node.js memory usage
node --max-old-space-size=4096 dist/index.js

# Monitor with PM2
pm2 monit

# Profile with node
node --inspect dist/index.js
```

### Getting Help

#### Documentation
- [README.md](./README.md) - Project overview
- [COMPLIANCE_GUIDE.md](./COMPLIANCE_GUIDE.md) - Compliance integration
- [API_ROUTES.md](./API_ROUTES.md) - API documentation

#### Community Support
- GitHub Issues: [Report issues](https://github.com/MBTQ-dev/Magician_Platform/issues)
- GitHub Discussions: [Ask questions](https://github.com/MBTQ-dev/Magician_Platform/discussions)
- Discord: ASL-friendly community support

#### Professional Support
- Email: support@360magicians.com
- Priority support: Available for enterprise deployments

## Security Checklist

Before deploying to production:

- [ ] Change all default passwords and secrets
- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS (SSL/TLS certificate)
- [ ] Configure CORS appropriately
- [ ] Set NODE_ENV=production
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Setup automated backups
- [ ] Enable monitoring and alerting
- [ ] Review security policy
- [ ] Test disaster recovery procedures

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Health checks configured
- [ ] Error tracking enabled
- [ ] Performance testing completed
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Team trained on maintenance procedures

## Next Steps

After successful deployment:

1. **Configure Compliance Settings**: Customize VR and workforce settings for your organization
2. **Setup Integrations**: Connect to your existing systems via API or webhooks
3. **Customize Workflows**: Adapt the workflow automation to your processes
4. **Train Users**: Provide training on accessibility features and workflows
5. **Monitor Performance**: Set up dashboards and alerts
6. **Plan Updates**: Schedule regular maintenance and updates

## Resources

### Documentation
- [Deployment Scripts](./scripts/)
- [Docker Configuration](./Dockerfile)
- [Vercel Configuration](./vercel.json)
- [Environment Example](./.env.example)

### External Resources
- [Node.js Documentation](https://nodejs.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Cloud Documentation](https://cloud.google.com/docs)

---

**Last Updated**: December 14, 2024

**Version**: 1.0.0

---

**Need help?** Contact support@360magicians.com or open an issue on GitHub.
