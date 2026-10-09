# Magician Platform Deployment Guide

## Overview

This guide covers deployment options for the Magician Platform across multiple environments.

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Docker (optional)
- Cloud provider account (Vercel, GCP, or Cloudflare)

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/MBTQ-dev/Magician_Platform.git
   cd Magician_Platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## Production Deployments

### Vercel Deployment

1. **Connect repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Configure build settings

2. **Environment variables**
   Set the following in Vercel dashboard:
   ```
   DATABASE_URL
   OPENAI_API_KEY
   ANTHROPIC_API_KEY
   GOOGLE_CLOUD_PROJECT_ID
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Google Cloud Run Deployment

1. **Build container**
   ```bash
   docker build -t gcr.io/PROJECT_ID/magician-platform .
   docker push gcr.io/PROJECT_ID/magician-platform
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy magician-platform \
     --image gcr.io/PROJECT_ID/magician-platform \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Configure environment**
   Use Secret Manager or environment variables in Cloud Run console.

### Cloudflare Pages Deployment

1. **Connect repository**
   - Go to Cloudflare Dashboard > Pages
   - Create new project from Git

2. **Build configuration**
   ```
   Build command: npm run build
   Build output directory: dist
   ```

3. **Environment variables**
   Configure in Pages settings.

## Database Setup

### PostgreSQL (Local)

```bash
createdb magician_platform
npm run db:push
```

### Neon (Cloud)

1. Create project at [neon.tech](https://neon.tech)
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `npm run db:push`

### Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `npm run db:push`

## SSL/TLS Configuration

### Vercel
- Automatic SSL included

### Cloud Run
- Automatic managed certificates

### Custom Domain
```bash
gcloud beta run domain-mappings create \
  --service magician-platform \
  --domain your-domain.com
```

## Monitoring & Logging

### Application Logs

```bash
# Local
npm run dev

# Cloud Run
gcloud logging read "resource.type=cloud_run_revision"

# Vercel
vercel logs
```

### Database Monitoring

- Use Drizzle Studio: `npm run db:studio`
- Neon dashboard for cloud databases

## Scaling

### Vercel
- Automatic edge scaling
- Configure in vercel.json

### Cloud Run
```bash
gcloud run services update magician-platform \
  --min-instances 1 \
  --max-instances 10
```

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check `DATABASE_URL` format
   - Verify network access/firewall rules

2. **Build failures**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run typecheck`

3. **Environment variables missing**
   - Verify all required variables are set
   - Check for typos in variable names

### Debug Mode

```bash
DEBUG=* npm run dev
```

## Security Checklist

- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] Database access restricted
- [ ] API rate limiting enabled
- [ ] CORS configured correctly
- [ ] Input validation active
- [ ] Error messages sanitized

## Backup & Recovery

### Database Backup

```bash
pg_dump DATABASE_URL > backup.sql
```

### Restore

```bash
psql DATABASE_URL < backup.sql
```

## Support

For deployment issues:
1. Check [GitHub Issues](https://github.com/MBTQ-dev/Magician_Platform/issues)
2. Review application logs
3. Contact VR4deaf technical support
