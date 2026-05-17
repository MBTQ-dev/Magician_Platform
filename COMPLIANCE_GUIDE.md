# Compliance Integration Guide

## Overview

The Magician Platform provides a comprehensive, reusable compliance framework for vocational rehabilitation (VR), workforce development, and accessibility standards. This guide explains how to integrate these compliance systems into your own projects.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [VR Compliance Integration](#vr-compliance-integration)
3. [Workforce Development Integration](#workforce-development-integration)
4. [Accessibility Compliance](#accessibility-compliance)
5. [Security & Privacy](#security-and-privacy)
6. [API Integration](#api-integration)
7. [Workflow Automation](#workflow-automation)
8. [Reporting & Auditing](#reporting-and-auditing)

## Architecture Overview

The compliance system is built on a modular architecture with three core layers:

1. **Data Layer**: PostgreSQL database with Drizzle ORM for type-safe schema definitions
2. **Service Layer**: Reusable TypeScript services for compliance validation and tracking
3. **API Layer**: RESTful endpoints and webhook integrations for external systems

### Key Components

```
├── server/
│   ├── services/
│   │   ├── vrComplianceService.ts       # VR compliance tracking
│   │   └── magicians/                   # AI-powered automation agents
│   ├── routes/
│   │   ├── vr-flow.ts                   # VR enrollment workflows
│   │   └── workforce.ts                 # Workforce program endpoints
│   └── middleware/
│       └── compliance-validator.ts      # Request validation middleware
├── shared/
│   └── schema.ts                        # Shared Zod schemas
└── .github/
    └── workflows/
        └── compliance-checks.yml        # Automated compliance validation
```

## VR Compliance Integration

### Regulatory Framework

Our VR compliance system adheres to:
- **34 CFR Part 361** - State Vocational Rehabilitation Services Program
- **Rehabilitation Act of 1973** (as amended)
- **RSA Performance Standards** - Federal reporting requirements
- **State VR Agency Policies** - Customizable for each state

### Database Schema

The VR compliance system uses three core tables:

#### 1. VR Enrollment (`vr_enrollment`)

```typescript
{
  id: uuid,
  userId: uuid,                    // Foreign key to users table
  vrAgency: string,                // State VR agency name
  vrCounselor: string,             // Assigned VR counselor
  vrCounselorEmail: string,        // Contact for coordination
  programType: enum,               // self_employment, job_placement, training, supported_employment
  ipeApproved: boolean,            // Individualized Plan for Employment status
  ipeApprovalDate: timestamp,      // IPE approval timestamp
  currentPhase: enum,              // assessment, planning, training, placement, stabilization
  startDate: timestamp,            // Program enrollment date
  endDate: timestamp,              // Program completion date (nullable)
  status: enum,                    // active, completed, withdrawn, on_hold
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. VR Service Records (`vr_service_records`)

```typescript
{
  id: uuid,
  enrollmentId: uuid,              // Foreign key to vr_enrollment
  serviceDate: timestamp,          // Date service provided
  serviceType: string,             // Type of service (training, counseling, equipment, etc.)
  serviceCost: decimal,            // Cost for reimbursement tracking
  serviceProvider: string,         // Provider name/organization
  serviceOutcome: text,            // Outcome description
  isCompliant: boolean,            // Meets VR regulations
  regulationReference: string,     // 34 CFR Part 361 section reference
  approvedByVrCounselor: boolean,  // Counselor approval status
  notes: text,                     // Additional documentation
  createdAt: timestamp
}
```

#### 3. VR Milestones (`vr_milestones`)

```typescript
{
  id: uuid,
  enrollmentId: uuid,              // Foreign key to vr_enrollment
  milestoneName: string,           // Milestone description
  targetDate: timestamp,           // Expected completion date
  completionDate: timestamp,       // Actual completion (nullable)
  status: enum,                    // pending, in_progress, completed, overdue
  verificationDoc: text,           // Documentation/evidence
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Integration Example

```typescript
import { db } from './db';
import { vrEnrollment, vrServiceRecords } from './schema';

// Create VR enrollment
async function enrollInVRProgram(userId: string, data: VREnrollmentData) {
  const enrollment = await db.insert(vrEnrollment).values({
    userId,
    vrAgency: data.agency,
    vrCounselor: data.counselor,
    vrCounselorEmail: data.counselorEmail,
    programType: data.programType,
    currentPhase: 'assessment',
    status: 'active',
    startDate: new Date()
  }).returning();
  
  return enrollment;
}

// Record VR service
async function recordVRService(enrollmentId: string, service: ServiceData) {
  const record = await db.insert(vrServiceRecords).values({
    enrollmentId,
    serviceDate: service.date,
    serviceType: service.type,
    serviceCost: service.cost,
    serviceProvider: service.provider,
    isCompliant: validateCompliance(service),
    regulationReference: getRegulationReference(service.type)
  }).returning();
  
  return record;
}
```

### Compliance Validation

The system includes automatic compliance checking:

```typescript
function validateCompliance(service: ServiceData): boolean {
  const checks = [
    // Verify IPE approval for service
    checkIPEApproval(service.enrollmentId),
    // Verify service is in approved category
    checkServiceCategory(service.type),
    // Verify counselor authorization
    checkCounselorApproval(service),
    // Verify cost is within limits
    checkCostLimits(service.cost, service.type)
  ];
  
  return checks.every(check => check === true);
}
```

## Workforce Development Integration

### WIOA Compliance

The workforce development system tracks compliance with:
- **WIOA Title I** - Workforce Investment Act requirements
- **Performance Metrics** - Employment outcomes and retention
- **Eligibility Documentation** - Program qualification criteria

### Database Schema

#### Workforce Program Enrollment (`workforce_program_enrollment`)

```typescript
{
  id: uuid,
  userId: uuid,
  programName: string,             // WIOA program name
  programType: enum,               // job_training, job_placement, career_services
  enrollmentDate: timestamp,
  completionDate: timestamp,
  status: enum,                    // enrolled, completed, exited
  eligibilityVerified: boolean,    // WIOA eligibility confirmed
  performanceMetrics: jsonb,       // Outcome tracking data
  createdAt: timestamp
}
```

#### Employment Outcomes (`employment_outcomes`)

```typescript
{
  id: uuid,
  userId: uuid,
  jobTitle: string,
  employer: string,
  startDate: timestamp,
  wagePerHour: decimal,
  hoursPerWeek: integer,
  employmentType: enum,            // full_time, part_time, self_employed
  retentionCheck90Day: boolean,    // 90-day retention milestone
  retentionCheck180Day: boolean,   // 180-day retention milestone
  accommodationsProvided: text,    // ADA accommodations
  source: enum,                    // vr_placement, workforce_program, self_directed
  createdAt: timestamp
}
```

## Accessibility Compliance

### WCAG 2.1 Level AA Standards

The platform implements comprehensive accessibility features:

#### 1. Visual Accessibility
- High contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text)
- Resizable text up to 200% without loss of functionality
- Clear visual focus indicators for keyboard navigation
- Color is never the only means of conveying information

#### 2. Auditory Accessibility (Deaf-First Design)
- All audio content has text alternatives
- ASL video interpretation available throughout
- Visual notifications for all system events
- No audio-only content or alerts

#### 3. Keyboard Accessibility
- Full keyboard navigation support
- Logical tab order throughout the interface
- Skip navigation links for main content
- Keyboard shortcuts documented and customizable

#### 4. Screen Reader Compatibility
- Semantic HTML structure
- ARIA labels and landmarks
- Alt text for all images
- Form labels properly associated with inputs

### Implementation Example

```typescript
// Accessible form component
<form aria-label="VR Program Enrollment">
  <label htmlFor="agency">
    VR Agency Name
    <span className="sr-only">(Required)</span>
  </label>
  <input
    id="agency"
    type="text"
    required
    aria-required="true"
    aria-describedby="agency-help"
  />
  <p id="agency-help" className="help-text">
    Enter the name of your state VR agency
  </p>
</form>
```

## Security and Privacy

### Authentication & Authorization

The platform uses a multi-layer security approach:

```typescript
// DeafAuth + JWT authentication
import { verifyToken } from './deafAuthService';
import { rateLimiter } from './middleware/rateLimiter';

// Rate limiting (5 attempts per 15 minutes)
app.use('/api/auth', rateLimiter);

// JWT verification middleware
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
```

### Data Privacy

- **Encryption**: All sensitive data encrypted at rest and in transit
- **Minimal Collection**: Only collect data necessary for compliance
- **Access Controls**: Role-based access to sensitive information
- **Audit Logging**: All data access logged for compliance review
- **User Consent**: Explicit consent for data collection and sharing

### Security Best Practices

```typescript
// Password hashing with bcrypt
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Input validation with Zod
import { z } from 'zod';

const enrollmentSchema = z.object({
  vrAgency: z.string().min(2).max(200),
  vrCounselor: z.string().min(2).max(100),
  vrCounselorEmail: z.string().email(),
  programType: z.enum(['self_employment', 'job_placement', 'training', 'supported_employment'])
});
```

## API Integration

### REST API Endpoints

The system provides comprehensive REST APIs for external integration:

#### VR Compliance Endpoints

```
POST   /api/vr/enrollment          # Create VR enrollment
GET    /api/vr/enrollment/:id      # Get enrollment details
PUT    /api/vr/enrollment/:id      # Update enrollment
POST   /api/vr/services            # Record VR service
GET    /api/vr/services/:enrollmentId  # List services
POST   /api/vr/milestones          # Create milestone
GET    /api/vr/milestones/:enrollmentId # List milestones
PUT    /api/vr/milestones/:id      # Update milestone
GET    /api/vr/compliance-report   # Generate compliance report
```

#### Workforce Endpoints

```
POST   /api/workforce/enrollment   # Enroll in workforce program
GET    /api/workforce/enrollment/:id # Get enrollment
POST   /api/workforce/outcomes     # Record employment outcome
GET    /api/workforce/outcomes/:userId # Get user outcomes
GET    /api/workforce/metrics      # Get performance metrics
```

#### Magician Services Endpoints

```
GET    /api/magicians              # List all Magician services
POST   /api/magicians/:id/execute  # Execute Magician action
GET    /api/magicians/actions      # Get action history
```

### Webhook Integration

Subscribe to compliance events:

```typescript
// Register webhook
POST /api/webhooks/register
{
  "url": "https://your-system.com/webhooks/compliance",
  "events": ["vr.milestone.completed", "workforce.outcome.recorded"],
  "secret": "your-webhook-secret"
}

// Webhook payload example
{
  "event": "vr.milestone.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "enrollmentId": "uuid",
    "milestoneName": "90-day employment retention",
    "completionDate": "2024-01-15",
    "userId": "uuid"
  },
  "signature": "hmac-sha256-signature"
}
```

## Workflow Automation

### GitHub Actions Integration

The platform includes reusable GitHub Actions workflows:

```yaml
# .github/workflows/compliance-checks.yml
name: Compliance Validation

on: [push, pull_request, schedule]

jobs:
  vr-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate VR Schemas
        run: npm run validate:vr
      - name: Check Regulation Alignment
        run: npm run check:regulations
```

### Automated Milestone Tracking

```typescript
// Automated milestone monitoring
async function checkOverdueMilestones() {
  const overdue = await db
    .select()
    .from(vrMilestones)
    .where(and(
      eq(vrMilestones.status, 'in_progress'),
      lt(vrMilestones.targetDate, new Date())
    ));
  
  for (const milestone of overdue) {
    await notifyStakeholders(milestone);
    await updateMilestoneStatus(milestone.id, 'overdue');
  }
}
```

## Reporting and Auditing

### Compliance Reports

Generate comprehensive compliance reports:

```typescript
// Generate VR compliance report
async function generateVRComplianceReport(enrollmentId: string) {
  const enrollment = await getEnrollment(enrollmentId);
  const services = await getServices(enrollmentId);
  const milestones = await getMilestones(enrollmentId);
  
  return {
    enrollment: enrollment,
    services: {
      total: services.length,
      compliant: services.filter(s => s.isCompliant).length,
      totalCost: services.reduce((sum, s) => sum + s.serviceCost, 0)
    },
    milestones: {
      total: milestones.length,
      completed: milestones.filter(m => m.status === 'completed').length,
      overdue: milestones.filter(m => m.status === 'overdue').length
    },
    regulatoryCompliance: {
      regulation: '34 CFR Part 361',
      compliant: checkRegulationCompliance(enrollment, services, milestones)
    }
  };
}
```

### Audit Trail

All compliance actions are logged:

```typescript
// Audit trail logging
const auditLog = await db.insert(complianceAuditTrail).values({
  userId: user.id,
  action: 'vr_service_recorded',
  entityType: 'vr_service_record',
  entityId: service.id,
  changesMade: JSON.stringify(service),
  ipAddress: req.ip,
  timestamp: new Date()
});
```

## Integration Checklist

### Prerequisites
- [ ] PostgreSQL database (version 12+)
- [ ] Node.js runtime (version 20+)
- [ ] Environment variables configured
- [ ] SSL certificates for production

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install drizzle-orm pg zod express
   ```

2. **Configure Database**
   ```bash
   # Set DATABASE_URL environment variable
   export DATABASE_URL="postgresql://user:password@host:5432/db"
   
   # Run migrations
   npm run db:push
   ```

3. **Import Schemas**
   ```typescript
   import { vrEnrollment, vrServiceRecords } from '@magician-platform/schemas';
   ```

4. **Setup Authentication**
   ```typescript
   import { authenticate } from '@magician-platform/auth';
   app.use('/api', authenticate);
   ```

5. **Configure Compliance Checks**
   ```typescript
   import { validateVRCompliance } from '@magician-platform/compliance';
   ```

## Support and Resources

### Documentation
- [API Reference](./api-definition.md)
- [Database Schema](./shared/schema.ts)
- [Accessibility Statement](./ACCESSIBILITY_STATEMENT.md)
- [Security Policy](./SECURITY_POLICY.md)

### Community
- GitHub Issues: [Report bugs or request features](https://github.com/MBTQ-dev/Magician_Platform/issues)
- Discord: ASL-friendly community support
- Email: support@360magicians.com

### Compliance Resources
- [34 CFR Part 361 Regulations](https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-361)
- [RSA Performance Standards](https://rsa.ed.gov/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WIOA Information](https://www.dol.gov/agencies/eta/wioa)

## Version History

- **v1.0.0** (2024) - Initial release with VR and workforce compliance
- Comprehensive schema definitions
- RESTful API integration
- Automated compliance validation
- Accessibility-first design

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

**Built with ❤️ for the deaf community and compliance professionals**

For questions or support, please open an issue or contact the team.
