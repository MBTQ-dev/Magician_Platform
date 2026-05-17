# Deno and Supabase Integration Guide

This guide explains the Deno runtime integration and Supabase services for the Magician Platform.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Modular Components](#modular-components)
4. [Setup Instructions](#setup-instructions)
5. [Development Workflow](#development-workflow)
6. [Deployment](#deployment)
7. [Migration Strategy](#migration-strategy)

## Overview

The Magician Platform now supports both Node.js and Deno runtimes, with Deno providing:

- **Modern ESM-first approach**: Native ES modules without build tools
- **TypeScript native**: No compilation step needed
- **Secure by default**: Explicit permissions for file, network, and environment access
- **Standard library**: Comprehensive standard library without npm dependencies
- **Supabase integration**: Built-in support for Supabase Auth, Database, and Realtime

## Architecture

```
Magician Platform
├── Node.js Backend (Existing)
│   ├── Express Server
│   ├── PostgreSQL/Drizzle ORM
│   └── Custom Services
│
└── Deno Application (New)
    ├── Fresh Framework (SSR)
    ├── Supabase Integration
    ├── Modular Components
    │   ├── DeafAuth (Authentication)
    │   ├── PinkSync (Real-time)
    │   ├── FibonRose (Reputation)
    │   └── PinkFlow (Testing)
    └── API Routes
```

## Modular Components

### DeafAuth - Authentication Module

**Location**: `deno-app/modules/deafauth/`

**Purpose**: Identity verification and access control using Supabase Auth

**Features**:
- Email/password authentication
- OAuth providers (Google, GitHub, Discord)
- JWT token management
- Role-based access control
- Deaf-first authentication flows

**Usage**:
```typescript
import { authenticateUser, verifyToken } from "./modules/deafauth/mod.ts";

const result = await authenticateUser({
  email: "user@example.com",
  password: "secure-password",
});

if (result.success) {
  console.log("Authenticated:", result.user);
}
```

### PinkSync - Real-time Communication Module

**Location**: `deno-app/modules/pinksync/`

**Purpose**: Real-time synchronization and accessibility optimization

**Features**:
- Supabase Realtime channels
- Bidirectional data sync
- Presence tracking
- Accessibility optimization
- ASL video support

**Usage**:
```typescript
import { subscribeToChannel, publishEvent } from "./modules/pinksync/mod.ts";

// Subscribe to updates
const subscription = await subscribeToChannel("user-updates", (payload) => {
  console.log("Update received:", payload);
});

// Publish event
await publishEvent("user-updates", {
  type: "profile_updated",
  source: "user-settings",
  data: { preferASL: true },
  priority: "medium",
});
```

### FibonRose - Reputation System Module

**Location**: `deno-app/modules/fibonrose/`

**Purpose**: Fibonacci-based trust and reputation scoring

**Features**:
- Contribution tracking
- Trust score calculation
- Badge system
- Reputation history
- Leaderboards

**Usage**:
```typescript
import { recordContribution, calculateTrustScore } from "./modules/fibonrose/mod.ts";

// Record contribution
await recordContribution({
  userId: "user-123",
  type: "complete_gig",
  metadata: { gigId: "gig-456" },
});

// Get trust score
const score = await calculateTrustScore("user-123");
console.log(`Trust Level ${score.level}: ${score.rank}`);
```

### PinkFlow - Testing and Validation Module

**Location**: `deno-app/modules/pinkflow/`

**Purpose**: Automated testing for accessibility and workflows

**Features**:
- WCAG 2.1 AA compliance checking
- Workflow validation
- ASL video validation
- Performance testing
- Real-time latency monitoring

**Usage**:
```typescript
import { validateAccessibility, testWorkflow } from "./modules/pinkflow/mod.ts";

// Validate accessibility
const result = await validateAccessibility({
  url: "https://example.com",
  standards: ["WCAG2.1-AA"],
});

// Test workflow
await testWorkflow({
  name: "user-registration",
  steps: [
    { action: "navigate", target: "/register" },
    { action: "fill", target: "#email", value: "test@example.com" },
    { action: "click", target: "#submit" },
  ],
});
```

## Setup Instructions

### Prerequisites

1. **Install Deno** (version 1.30+):
   ```bash
   curl -fsSL https://deno.land/install.sh | sh
   ```

2. **Create Supabase Project**:
   - Go to https://supabase.com
   - Create a new project
   - Note your project URL and anon key

3. **Set Environment Variables**:
   ```bash
   export SUPABASE_URL="https://your-project.supabase.co"
   export SUPABASE_KEY="your-anon-key"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   export SUPABASE_DB_URL="postgres://postgres:password@host:port/database"
   ```

### Database Setup

1. **Create Tables** in Supabase:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_deaf BOOLEAN DEFAULT false,
  prefer_asl BOOLEAN DEFAULT false,
  bio TEXT,
  location TEXT,
  website TEXT,
  roles TEXT[] DEFAULT ARRAY['user']::TEXT[],
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  fibonrose_score INTEGER DEFAULT 0,
  vr_counselor_id UUID,
  workforce_certified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contributions table
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT NOT NULL,
  value INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

## Development Workflow

### Running the Deno Application

```bash
cd deno-app

# Development mode (with hot reload)
deno task dev

# Production mode
deno task start
```

### Testing Modules

```bash
cd deno-app

# Test all modules
deno test --allow-env --allow-net

# Test specific module
deno test modules/deafauth/ --allow-env --allow-net
```

### Type Checking

```bash
cd deno-app

# Check all files
deno check main.ts

# Check specific module
deno check modules/deafauth/mod.ts
```

## Deployment

### Deno Deploy

1. **Install deployctl**:
   ```bash
   deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts
   ```

2. **Deploy**:
   ```bash
   cd deno-app
   deployctl deploy --project=magician-platform main.ts
   ```

### Docker

```dockerfile
FROM denoland/deno:1.40.0

WORKDIR /app

# Copy application
COPY deno-app/ .

# Cache dependencies
RUN deno cache main.ts

# Run application
CMD ["deno", "task", "start"]
```

## Migration Strategy

### Phase 1: Parallel Operation (Current)
- Node.js backend continues to handle all production traffic
- Deno application runs alongside for testing and development
- Modules can be imported and tested independently

### Phase 2: Gradual Feature Migration
- Migrate authentication to DeafAuth + Supabase
- Enable PinkSync for real-time features
- Integrate FibonRose reputation system
- Use PinkFlow for CI/CD testing

### Phase 3: Traffic Routing
- Route new features to Deno application
- Maintain Node.js for legacy features
- Monitor performance and stability

### Phase 4: Complete Transition
- All new development in Deno
- Node.js deprecated for new features
- Maintain Node.js for backward compatibility

## Benefits of Deno + Supabase

### Deno Benefits
- ✅ **Faster development**: No build step required
- ✅ **Better security**: Explicit permissions model
- ✅ **Modern standards**: Native ESM, top-level await
- ✅ **Reduced complexity**: No node_modules, simpler dependency management
- ✅ **Better tooling**: Built-in formatter, linter, test runner

### Supabase Benefits
- ✅ **Managed PostgreSQL**: No database administration
- ✅ **Built-in authentication**: OAuth providers included
- ✅ **Real-time subscriptions**: WebSocket connections managed
- ✅ **Row Level Security**: Database-level access control
- ✅ **Auto-generated APIs**: REST and GraphQL endpoints
- ✅ **Edge Functions**: Serverless functions close to users

## Resources

- [Deno Documentation](https://deno.land/manual)
- [Supabase Documentation](https://supabase.com/docs)
- [Fresh Framework](https://fresh.deno.dev/)
- [Module READMEs](./modules/README.md)

## Support

For questions or issues:
- Check module-specific README files
- Review GitHub Discussions
- Contact the development team
