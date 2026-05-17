# Deployment Guide - Deno Application

This guide covers deploying the Deno application with Supabase integration to various platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Deno Deploy (Recommended)](#deno-deploy)
4. [Docker Deployment](#docker-deployment)
5. [Self-Hosted Deployment](#self-hosted)
6. [Supabase Setup](#supabase-setup)
7. [Monitoring and Logging](#monitoring)

## Prerequisites

- Deno 1.30+ installed locally
- Supabase account and project
- Git repository access
- Domain name (optional)

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the `deno-app` directory:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_URL=postgres://postgres:password@db.your-project.supabase.co:5432/postgres

# Application Configuration
PORT=8000
NODE_ENV=production

# Module Configuration
PINKSYNC_LATENCY_THRESHOLD=100
FIBONROSE_DECAY_ENABLED=true
FIBONROSE_DECAY_DAYS=90
PINKFLOW_HEADLESS=true
PINKFLOW_TIMEOUT=30000
```

### Security Best Practices

- Never commit `.env` files to version control
- Use different keys for staging and production
- Rotate service role keys periodically
- Use Row Level Security (RLS) in Supabase
- Enable API rate limiting

## Deno Deploy (Recommended)

Deno Deploy is the easiest and most performant way to deploy Deno applications.

### 1. Install deployctl

```bash
deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts
```

### 2. Link Your Project

```bash
cd deno-app
deployctl projects link --project=magician-platform
```

### 3. Set Environment Variables

Using the Deno Deploy dashboard:
1. Go to https://dash.deno.com/projects/magician-platform
2. Navigate to Settings → Environment Variables
3. Add all required variables from `.env`

Or via CLI:
```bash
deployctl env set SUPABASE_URL "https://your-project.supabase.co"
deployctl env set SUPABASE_KEY "your-anon-key"
# ... add all other variables
```

### 4. Deploy

```bash
# Deploy to production
deployctl deploy --project=magician-platform --prod main.ts

# Deploy to preview
deployctl deploy --project=magician-platform main.ts
```

### 5. Configure Custom Domain (Optional)

1. Go to project settings in Deno Deploy dashboard
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

### GitHub Actions Integration

Add to `.github/workflows/deno-deploy.yml`:

```yaml
name: Deploy to Deno Deploy

on:
  push:
    branches: [main]
    paths:
      - 'deno-app/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x
      
      - name: Deploy to Deno Deploy
        run: |
          cd deno-app
          deno install --allow-all -r -f https://deno.land/x/deploy/deployctl.ts
          deployctl deploy --project=magician-platform --prod main.ts
        env:
          DENO_DEPLOY_TOKEN: ${{ secrets.DENO_DEPLOY_TOKEN }}
```

## Docker Deployment

### Dockerfile

Create `deno-app/Dockerfile`:

```dockerfile
FROM denoland/deno:1.40.0

WORKDIR /app

# Copy application files
COPY . .

# Cache dependencies
RUN deno cache main.ts

# Expose port
EXPOSE 8000

# Run application
CMD ["deno", "run", "--allow-net", "--allow-env", "main.ts"]
```

### Build and Run

```bash
# Build image
docker build -t magician-platform-deno ./deno-app

# Run container
docker run -d \
  -p 8000:8000 \
  --env-file ./deno-app/.env \
  --name magician-deno \
  magician-platform-deno
```

### Docker Compose

Create `docker-compose.deno.yml`:

```yaml
version: '3.8'

services:
  deno-app:
    build:
      context: ./deno-app
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - ./deno-app/.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Self-Hosted Deployment

### Using systemd

Create `/etc/systemd/system/magician-deno.service`:

```ini
[Unit]
Description=Magician Platform Deno Application
After=network.target

[Service]
Type=simple
User=deno
WorkingDirectory=/opt/magician-platform/deno-app
EnvironmentFile=/opt/magician-platform/deno-app/.env
ExecStart=/usr/local/bin/deno run --allow-net --allow-env main.ts
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable magician-deno
sudo systemctl start magician-deno
sudo systemctl status magician-deno
```

### Using PM2 (Alternative)

```bash
# Install PM2 with Deno support
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'magician-deno',
    script: 'deno',
    args: 'run --allow-net --allow-env main.ts',
    cwd: '/opt/magician-platform/deno-app',
    env_file: '.env',
    instances: 2,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Nginx Reverse Proxy

Create `/etc/nginx/sites-available/magician-deno`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/magician-deno /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Supabase Setup

### 1. Create Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization and region
4. Set database password (save securely)
5. Wait for project to initialize

### 2. Run Migrations

```bash
cd deno-app

# Install Supabase CLI
brew install supabase/tap/supabase  # macOS
# or
npm install -g supabase              # npm

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Verify tables
supabase db remote commit
```

### 3. Configure Authentication

1. Go to Authentication → Providers in Supabase dashboard
2. Enable desired providers (Email, Google, GitHub, etc.)
3. Configure OAuth redirect URLs
4. Set up email templates for password reset

### 4. Set Up Row Level Security

Already configured in migration files. Verify in Supabase dashboard:
- Navigate to Authentication → Policies
- Check policies for `profiles`, `contributions`, `accessibility_preferences`

## Monitoring and Logging

### Deno Deploy

- Built-in logging in dashboard
- View logs: https://dash.deno.com/projects/magician-platform/logs
- Metrics: CPU, memory, request count, error rate

### Self-Hosted

#### Using Deno's Built-in Logger

```typescript
// Add to main.ts
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

serve((req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // ... handle request
}, { port: 8000 });
```

#### External Monitoring (Recommended)

- **Sentry**: Error tracking and performance monitoring
- **DataDog**: Full-stack observability
- **New Relic**: APM and infrastructure monitoring
- **Prometheus + Grafana**: Metrics and visualization

### Health Check Endpoint

Create `deno-app/routes/api/health.ts`:

```typescript
export const handler = (_req: Request): Response => {
  return new Response(JSON.stringify({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: Deno.metrics().ops.op_now,
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
```

## Performance Optimization

### Caching

```typescript
// Cache Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}
```

### Edge Caching with Deno Deploy

```typescript
export const handler = (req: Request): Response => {
  return new Response(data, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=600",
    },
  });
};
```

### Connection Pooling

Already handled by Supabase client. Configure in `lib/supabase.ts`:

```typescript
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  global: {
    headers: { 'x-application-name': 'magician-platform' },
  },
});
```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Check import paths in `import_map.json`
   - Run `deno cache main.ts` to update cache

2. **Permission denied errors**
   - Add required flags: `--allow-net`, `--allow-env`, `--allow-read`

3. **Supabase connection failures**
   - Verify environment variables
   - Check project is not paused
   - Verify network connectivity

4. **High latency**
   - Use Deno Deploy edge locations
   - Enable connection pooling
   - Optimize database queries
   - Add caching where appropriate

### Debug Mode

```bash
# Run with debug logging
DENO_LOG=debug deno run --allow-all main.ts

# Check imported modules
deno info main.ts

# Analyze bundle size
deno bundle main.ts > bundle.js
ls -lh bundle.js
```

## Rollback Procedure

### Deno Deploy

```bash
# List deployments
deployctl deployments list --project=magician-platform

# Rollback to specific deployment
deployctl deployments redeploy <deployment-id>
```

### Docker

```bash
# List images
docker images magician-platform-deno

# Rollback to previous image
docker stop magician-deno
docker rm magician-deno
docker run -d ... magician-platform-deno:previous-tag
```

## Support

- **Documentation**: See `DENO_SUPABASE_GUIDE.md`
- **API Docs**: See `API_DOCUMENTATION.md`
- **Issues**: GitHub Issues
- **Community**: GitHub Discussions
