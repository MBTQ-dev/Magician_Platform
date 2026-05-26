# API Routes Documentation

## Base URL
Development: `http://localhost:5000`
Production: `https://360magicians.com
## Core Routes

### Health & Status
- `GET /api/health` - Server health check
  - Response: `{ status: "ok", environment: "development" }`

- `GET /api/ai-status` - AI services availability
  - Response: `{ openai: boolean, anthropic: boolean, environment: string }`

- `GET /api/business-tools` - List available business tools
  - Response: `{ tools: [...] }`

## Authentication & Users

### Users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:userId/progress` - Get user's progress
- `GET /api/users/:userId/tasks/:taskId/progress` - Get task progress
- `POST /api/users/:userId/subtasks/:subtaskId/progress` - Update subtask progress
- `GET /api/users/:userId/businesses` - Get user's businesses
- `GET /api/users/:userId/vr-counselors` - Get user's VR counselors
- `POST /api/users/:userId/vr-counselors` - Assign VR counselor to user

## Business Lifecycle

### Lifecycle Phases
- `GET /api/lifecycle-phases` - Get all lifecycle phases
- `GET /api/lifecycle-phases/:slug` - Get phase by slug

### Tasks & Subtasks
- `GET /api/phases/:phaseId/tasks` - Get tasks for a phase
- `GET /api/tasks/:id` - Get task by ID
- `GET /api/tasks/:taskId/subtasks` - Get subtasks for a task

### Tools
- `GET /api/phases/:phaseId/tools` - Get tools for a phase
- `POST /api/tools/generate-ideas` - Generate business ideas
  - Body: `{ interests: string[], marketInfo?: string, constraints?: string[] }`

## Business Formation

### Entity Management
- `GET /api/business-formation/entity-types` - Get supported entity types
- `GET /api/business-formation/requirements/:stateCode/:entityType` - Get state-specific requirements
- `POST /api/business-formation/create` - Create business entity
- `GET /api/business-formation/status/:formationId` - Get formation status

## Business Management

### Businesses
- `POST /api/businesses` - Create business
- `GET /api/businesses/:id` - Get business by ID
- `PATCH /api/businesses/:id` - Update business

## Ecosystem Services

### Services
- `GET /api/ecosystem/services` - Get all ecosystem services
- `POST /api/ecosystem/business-ideas` - Generate business ideas
- `GET /api/tools` - Get business tool recommendations

## 360 Magicians

### Magician Operations
- `POST /api/magicians/:magicianType/process` - Process magician request
  - Types: gatekeeper, reputation-tracker, workflow-automator, community-concierge
- `GET /api/magicians/:magicianType/status` - Get magician status
- `POST /api/magicians/coordinate` - Inter-magician coordination

## Storage & Files

### Cloud Storage
- `GET /api/storage/business-ideas` - List stored business ideas
- `GET /api/storage/files` - List files in storage
  - Query: `?prefix=string&limit=number`
- `POST /api/storage/upload-url` - Generate signed upload URL
  - Body: `{ filename: string, contentType?: string, expiresIn?: number }`
- `POST /api/storage/data` - Save data to storage
  - Body: `{ filename: string, data: any, options?: object }`
- `GET /api/storage/data/:filename` - Get data from storage
  - Query: `?parse=true|false`
- `DELETE /api/storage/data/:filename` - Delete file from storage

## ASL & Accessibility

### ASL Videos
- `GET /api/asl-videos` - Get ASL videos
  - Query: `?phaseId=number&taskId=number`
- `GET /api/asl-videos/:id` - Get specific ASL video

### ASL Dictionary
- `GET /api/asl-dictionary` - Get ASL dictionary terms
  - Query: `?category=string&importance=string&tags=string[]&searchTerm=string`

## Agency Partnerships

### Partner Agencies
- `GET /api/agency-partnerships/agencies` - Get all partner agencies
  - Query: `?agencyType=string&isActive=boolean`
  - Response: `{ success: boolean, data: PartnerAgency[] }`
- `GET /api/agency-partnerships/agencies/:id` - Get specific partner agency
  - Response: `{ success: boolean, data: PartnerAgency }`
- `POST /api/agency-partnerships/agencies` - Register new partner agency
  - Body: `{ name, agencyType, description?, contactName, contactEmail, contactPhone?, address?, city?, state?, zipCode?, website?, servicesOffered?, specializations?, partnershipLevel? }`
  - Response: `{ success: boolean, data: PartnerAgency, message: string }`
- `PUT /api/agency-partnerships/agencies/:id` - Update partner agency
  - Body: Any agency fields to update
  - Response: `{ success: boolean, data: PartnerAgency, message: string }`

### Agency Clients
- `GET /api/agency-partnerships/agencies/:agencyId/clients` - Get all clients for an agency
  - Query: `?status=string`
  - Response: `{ success: boolean, data: Array<{ client, user, counselor }> }`
- `GET /api/agency-partnerships/clients/:id` - Get specific client details
  - Response: `{ success: boolean, data: { client, agency, user, counselor } }`
- `POST /api/agency-partnerships/agencies/:agencyId/clients` - Create new client referral
  - Body: `{ userId, clientName, clientEmail, clientPhone?, specialNeeds?, referralReason?, assignedCounselorId?, notes? }`
  - Response: `{ success: boolean, data: AgencyClient, message: string }`
- `PUT /api/agency-partnerships/clients/:id` - Update client information
  - Body: Any client fields to update
  - Response: `{ success: boolean, data: AgencyClient, message: string }`
- `POST /api/agency-partnerships/clients/:id/assign-counselor` - Assign VR counselor to client
  - Body: `{ counselorId: number }`
  - Response: `{ success: boolean, data: AgencyClient, message: string }`

### Agency Services
- `GET /api/agency-partnerships/clients/:clientId/services` - Get all services for a client
  - Query: `?status=string`
  - Response: `{ success: boolean, data: AgencyService[] }`
- `POST /api/agency-partnerships/clients/:clientId/services` - Create new service for client
  - Body: `{ serviceType, serviceName, serviceDescription?, status?, startDate?, outcome?, feedback? }`
  - Response: `{ success: boolean, data: AgencyService, message: string }`
- `PUT /api/agency-partnerships/services/:id` - Update service status
  - Body: `{ status?, completionDate?, outcome?, feedback? }`
  - Response: `{ success: boolean, data: AgencyService, message: string }`

### Dashboard & Analytics
- `GET /api/agency-partnerships/agencies/:agencyId/dashboard` - Get agency dashboard statistics
  - Response: `{ success: boolean, data: { totalClients, activeClients, completedClients, totalServices, pendingServices, inProgressServices, completedServices, recentReferrals } }`
- `GET /api/agency-partnerships/dashboard/statistics` - Get overall platform statistics
  - Response: `{ success: boolean, data: { totalPartnerAgencies, activeAgencies, agenciesByType, totalClients, activeClients, totalServices, completedServices } }`
- `GET /api/asl-dictionary/term/:name` - Get term by name
- `GET /api/asl-dictionary/:id` - Get term by ID
- `POST /api/asl-dictionary` - Create dictionary term
- `PATCH /api/asl-dictionary/:id` - Update dictionary term
- `DELETE /api/asl-dictionary/:id` - Delete dictionary term

## VR Counselors

### Counselors
- `GET /api/vr-counselors` - Get all VR counselors
- `GET /api/vr-counselors/:id` - Get counselor by ID

## Resources

### Resource Management
- `GET /api/resources` - Get resources
  - Query: `?category=string&sbaRelated=boolean&tags=string[]`
- `GET /api/resources/:id` - Get resource by ID
- `POST /api/resources` - Create resource
- `PATCH /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

## AI Services

### AI Generation
- `POST /api/ai/generate` - Generate AI content
- `POST /api/claude/chat` - Chat with Claude AI
- `POST /api/v1/ai/*` - Unified AI controller endpoints

## Startup Team Builder

### Team Management
- Routes available via `/api/startup-team/*`

## Profile Management

### User Profiles
- Routes available via `/api/profile/*`

## Webhook Endpoints

### Webhooks
- Routes available via `/api/webhooks/*`

## Pipeline Operations

### Pipeline
- Routes available via `/api/pipeline/*`

## Notes

- All routes require appropriate authentication headers (where applicable)
- Rate limiting is applied to prevent abuse
- Error responses follow standard format: `{ error: string, message?: string }`
- Success responses follow format: `{ success: true, data: any }`

## Testing Endpoints

For quick testing:
```bash
# Health check
curl http://localhost:5000/api/health

# AI status
curl http://localhost:5000/api/ai-status

# Business tools
curl http://localhost:5000/api/business-tools

# Lifecycle phases
curl http://localhost:5000/api/lifecycle-phases
```
