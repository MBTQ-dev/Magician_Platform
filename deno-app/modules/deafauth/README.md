# DeafAuth Module

Provides identity verification, authentication, and access control for the MBTQ ecosystem using Supabase Auth.

## Features

- **Supabase OAuth Integration**: Replace custom OAuth with Supabase authentication
- **Multi-provider Support**: Email, Google, GitHub, and custom providers
- **Role-based Access Control**: Manage user roles and permissions
- **Deaf-first Design**: ASL-friendly authentication flows
- **JWT Token Management**: Secure token generation and verification

## Usage

```typescript
import { authenticateUser, verifyToken, getUserProfile } from "./modules/deafauth/mod.ts";

// Authenticate user with email/password
const result = await authenticateUser({
  email: "user@example.com",
  password: "secure-password",
});

// Verify JWT token
const user = await verifyToken(result.token);

// Get user profile
const profile = await getUserProfile(user.id);
```

## Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Enable authentication providers in Supabase dashboard
3. Set environment variables:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## API Reference

See [types.ts](./types.ts) for complete type definitions.
