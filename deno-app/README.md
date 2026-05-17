# Deno + Fresh Application

This directory contains a Deno-based Fresh framework application that runs alongside the main Node.js application.

## Overview

The Deno application provides:
- Fresh framework for server-side rendering
- Preact for reactive UI components
- PostgreSQL connectivity using the existing SUPABASE_DB_URL
- Example API route (`/api/trust`) that computes trust scores
- Interactive island component for trust calculation

## Prerequisites

- [Deno](https://deno.land/) installed (version 1.30+)
- PostgreSQL database accessible via `SUPABASE_DB_URL` environment variable

## Setup

1. **Set environment variables:**
   ```bash
   export SUPABASE_DB_URL="postgres://user:password@host:port/database"
   ```

2. **Install Deno** (if not already installed):
   ```bash
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

## Running the Application

### Development Mode (with hot reload)

```bash
cd deno-app
deno task dev
```

This will start the Fresh development server on `http://localhost:8000` with file watching enabled.

### Production Mode

```bash
cd deno-app
deno task start
```

## Project Structure

```
deno-app/
├── deno.json              # Deno configuration and tasks
├── import_map.json        # Import map for dependencies
├── fresh.config.ts        # Fresh framework configuration
├── fresh.gen.ts           # Generated manifest (auto-updated)
├── main.ts                # Application entry point
├── routes/
│   ├── index.tsx          # Home page route
│   └── api/
│       └── trust.ts       # Trust score API endpoint
├── islands/
│   └── TrustCalculator.tsx # Interactive trust calculator component
├── lib/
│   ├── fibonacci.ts       # Trust score calculation logic
│   └── db.ts              # Database connection helper
└── static/                # Static assets (CSS, images, etc.)
```

## Features

### API Routes

- **POST /api/trust** - Calculate trust score for a user
  - Request body: `{ "userId": "string" }`
  - Response: `{ "userId": "string", "count": number, "score": number }`

### Components

- **TrustCalculator** - Interactive island component that calls the trust API

## Database Integration

The application connects to PostgreSQL using the `SUPABASE_DB_URL` environment variable and the `postgres` npm package (postgres@3.1.0). This package uses tagged template literals for queries with automatic parameter sanitization.

Example query:
```typescript
const sql = connectDb();
const result = await sql`SELECT * FROM users WHERE id = ${userId}`;
```

The example trust API queries the `messages` table, but you can modify `routes/api/trust.ts` to match your database schema.

## Customization

### Switching to deno-postgres

If you encounter issues with `npm:postgres`, you can switch to the Deno-native postgres driver:

1. Update `import_map.json`:
   ```json
   {
     "imports": {
       "postgres": "https://deno.land/x/postgres@v0.17.0/mod.ts"
     }
   }
   ```

2. Update `lib/db.ts` to use the new import and API.

### Adding Tailwind CSS

1. Create `static/tailwind.css` with Tailwind directives
2. Build CSS using your Node pipeline or a Deno-based PostCSS step
3. Reference the compiled CSS in your routes

## Notes

- The Fresh framework automatically generates `fresh.gen.ts` during development
- Routes are file-system based (similar to Next.js)
- Islands are interactive components that hydrate on the client side
- The application runs on port 8000 by default (configurable in `fresh.config.ts`)

## Deployment

The Deno application can be deployed to:
- Deno Deploy
- Docker containers (with Deno runtime)
- Any platform that supports Deno

Make sure to set the `SUPABASE_DB_URL` environment variable in your deployment environment.
