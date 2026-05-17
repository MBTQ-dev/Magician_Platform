# Deno Application API Documentation

## Overview

The Deno application provides RESTful API endpoints for authentication, reputation management, and real-time communication using the modular trio components.

**Base URL**: `http://localhost:8000` (development) or your deployed URL

## Authentication Endpoints

### POST /api/auth/login

Authenticate a user with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "username": "username",
    "isDeaf": false,
    "preferASL": false,
    "roles": ["user"],
    "permissions": []
  },
  "token": "jwt-token-here"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "error": "Invalid credentials"
}
```

### POST /api/auth/register

Register a new user account.

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "secure-password",
  "username": "newusername",
  "isDeaf": true,
  "preferASL": true
}
```

**Success Response (201 Created)**:
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "newuser@example.com",
    "username": "newusername",
    "isDeaf": true,
    "preferASL": true,
    "roles": ["user"],
    "permissions": []
  },
  "token": "jwt-token-here"
}
```

**Error Response (400 Bad Request)**:
```json
{
  "error": "Email already exists"
}
```

## Reputation Endpoints

### GET /api/reputation/score/:userId

Get the trust score for a specific user.

**Parameters**:
- `userId` (path): User UUID

**Success Response (200 OK)**:
```json
{
  "userId": "user-uuid",
  "score": 55,
  "level": 9,
  "rank": "Veteran",
  "contributions": 25,
  "lastUpdated": "2025-12-15T01:00:00.000Z",
  "nextLevelAt": 89
}
```

**Example**:
```bash
curl http://localhost:8000/api/reputation/score/user-123-uuid
```

### POST /api/reputation/contribute

Record a contribution for a user.

**Request Body**:
```json
{
  "userId": "user-uuid",
  "type": "complete_gig",
  "value": 5,
  "metadata": {
    "gigId": "gig-456",
    "description": "Completed web development project"
  }
}
```

**Contribution Types**:
- Positive: `complete_gig` (5), `mentor_session` (8), `create_asl_content` (10), `contribute_code` (8)
- Neutral: `dao_vote` (1), `report_bug` (2), `submit_feedback` (1)
- Negative: `harassment_violation` (-20), `spam_violation` (-10), `fraud_attempt` (-50)

**Success Response (201 Created)**:
```json
{
  "success": true,
  "contribution": {
    "id": "contrib-uuid",
    "userId": "user-uuid",
    "type": "complete_gig",
    "value": 5,
    "metadata": { "gigId": "gig-456" },
    "timestamp": "2025-12-15T01:00:00.000Z"
  }
}
```

## Real-time Endpoints

### POST /api/realtime/publish

Publish an event to a real-time channel.

**Request Body**:
```json
{
  "channel": "user-updates",
  "type": "profile_updated",
  "source": "user-settings",
  "data": {
    "userId": "user-uuid",
    "field": "preferASL",
    "value": true
  },
  "priority": "medium"
}
```

**Priority Levels**: `low`, `medium`, `high`, `critical`

**Success Response (200 OK)**:
```json
{
  "success": true
}
```

**Example**:
```bash
curl -X POST http://localhost:8000/api/realtime/publish \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "notifications",
    "type": "new_message",
    "source": "chat-system",
    "data": { "message": "Hello!" },
    "priority": "high"
  }'
```

## Real-time Channels

The platform uses the following real-time channels:

- **user-updates**: User profile and preference changes
- **notifications**: System and user notifications
- **collaboration**: Real-time collaboration events
- **accessibility**: Accessibility service status updates

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```bash
curl http://localhost:8000/api/reputation/score/user-uuid \
  -H "Authorization: Bearer your-jwt-token"
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**:
```json
{
  "error": "Invalid request parameters"
}
```

**401 Unauthorized**:
```json
{
  "error": "Authentication required"
}
```

**405 Method Not Allowed**:
```json
{
  "error": "Method not allowed"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Anonymous requests: 100 requests per 15 minutes
- Authenticated requests: 1000 requests per 15 minutes

## WebSocket Support

For real-time subscriptions, use Supabase Realtime directly:

```typescript
import { createSupabaseClient } from "./lib/supabase.ts";

const supabase = createSupabaseClient();
const channel = supabase.channel("user-updates");

channel.on("broadcast", { event: "*" }, (payload) => {
  console.log("Received:", payload);
});

await channel.subscribe();
```

## Testing

Test API endpoints using curl or your preferred HTTP client:

```bash
# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Test reputation score
curl http://localhost:8000/api/reputation/score/user-uuid

# Test contribution recording
curl -X POST http://localhost:8000/api/reputation/contribute \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-uuid", "type": "complete_gig"}'
```

## SDK Examples

### JavaScript/TypeScript

```typescript
// Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});
const { user, token } = await loginResponse.json();

// Get reputation score
const scoreResponse = await fetch(
  `http://localhost:8000/api/reputation/score/${user.id}`,
  { headers: { 'Authorization': `Bearer ${token}` } }
);
const score = await scoreResponse.json();

// Record contribution
await fetch('http://localhost:8000/api/reputation/contribute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userId: user.id,
    type: 'complete_gig',
    metadata: { gigId: 'gig-123' }
  })
});
```

## Additional Resources

- [Deno & Supabase Integration Guide](../DENO_SUPABASE_GUIDE.md)
- [Module Documentation](./modules/README.md)
- [Supabase Documentation](https://supabase.com/docs)
