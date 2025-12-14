# 360 Magicians Platform

The 360 Magicians are role-bound AI agents that execute platform logic across the MBTQ ecosystem. They serve as the autonomous workforce that keeps the platform alive, responsive, and self-governing.

## Architecture

### Core Principles

1. **DeafAuth Integration**: Every Magician validates permissions through DeafAuth
2. **Fibonrose Validation**: Magicians reference Fibonrose scores to make trust-based decisions
3. **PinkSync Workflows**: Automation guardrails defined through workflow recipes
4. **DAO Governance**: Community-approved policies enforced by Magicians
5. **Ethical Boundaries**: Deaf-first, privacy-respecting, transparent operations

### Base Magician

All Magicians extend the `BaseMagician` abstract class which provides:

- DeafAuth validation
- Fibonrose score checking
- Action logging for transparency
- Inter-Magician coordination
- Capability management

## Implemented Magicians

### 1. Gatekeeper Magician 🚪

**Purpose**: Identity verification, onboarding, access control

**Capabilities**:
- Welcome new users
- Verify DeafAuth credentials
- Explain permissions
- Flag suspicious activity
- Route users to appropriate Magicians

**API Endpoints**:
- `POST /api/magicians/gatekeeper/welcome` - Welcome a user
- `POST /api/magicians/gatekeeper/login` - Authenticate credentials
- `GET /api/magicians/gatekeeper/permissions` - Get user permissions

### 2. Reputation Tracker Magician ⭐

**Purpose**: Fibonrose score calculation, badge issuance, trust validation

**Capabilities**:
- Monitor contributions across MBTQ apps
- Update Fibonrose scores in real-time
- Issue badges when milestones are hit
- Answer questions about reputation system
- Detect reputation gaming

**API Endpoints**:
- `GET /api/magicians/reputation/score` - Get user's Fibonrose score
- `POST /api/magicians/reputation/contribution` - Record a contribution
- `GET /api/magicians/reputation/badges` - Get user's badges
- `GET /api/magicians/reputation/leaderboard` - View leaderboard

**Point Values**:
- Complete gig: +40 points
- 5-star review: +10 points
- DAO vote: +5 points
- Mentor session: +30 points
- ASL content created: +30 points

### 3. Workflow Automator Magician 🔄

**Purpose**: Execute PinkSync automation recipes, handle routine tasks

**Capabilities**:
- Run scheduled tasks
- Trigger conditional workflows
- Sync data between apps
- Monitor system health
- Handle bulk operations

**API Endpoints**:
- `GET /api/magicians/workflow/recipes` - List workflow recipes
- `POST /api/magicians/workflow/recipes` - Create new recipe
- `POST /api/magicians/workflow/execute` - Execute a recipe
- `GET /api/magicians/workflow/health` - Check system health

**Default Workflows**:
- Weekly DAO digest emails
- New user onboarding sequence
- Gig completion workflow

### 4. Community Concierge Magician 💬

**Purpose**: Answer questions, surface resources, connect users

**Capabilities**:
- Handle "How do I...?" questions
- Point users to docs and tutorials
- Match mentors to mentees
- Surface relevant opportunities
- Collect feedback and sentiment

**Features**:
- FAQ database with ASL video support
- Mentor matching based on Fibonrose
- Opportunity surfacing
- Feedback collection

## Database Schema

### Fibonrose System

```sql
-- User reputation scores
CREATE TABLE fibonrose_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  total_score INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity log
CREATE TABLE fibonrose_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  points_change INTEGER NOT NULL,
  new_total INTEGER NOT NULL,
  source TEXT NOT NULL,
  details JSON,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Badges earned
CREATE TABLE fibonrose_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW()
);
```

### Magician Logs

```sql
-- Action audit trail
CREATE TABLE magician_actions (
  id SERIAL PRIMARY KEY,
  magician_id TEXT NOT NULL,
  user_id INTEGER,
  action_type TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSON,
  success BOOLEAN NOT NULL,
  error TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### Workflow Recipes

```sql
-- Automation recipes
CREATE TABLE workflow_recipes (
  id SERIAL PRIMARY KEY,
  recipe_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_config JSON NOT NULL,
  actions JSON NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Usage Examples

### Authentication with Gatekeeper

```javascript
// Login
const response = await fetch('/api/magicians/gatekeeper/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'secure_password'
  })
});

const { success, token, user, fibonroseScore } = await response.json();
```

### Check Fibonrose Score

```javascript
// Get current score
const response = await fetch('/api/magicians/reputation/score', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { success, score } = await response.json();
// score.total, score.level, score.badges, score.progress
```

### Record Contribution

```javascript
// Record a contribution (e.g., after completing a gig)
const response = await fetch('/api/magicians/reputation/contribution', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 123,
    contributionType: 'complete_gig',
    source: 'signgigs',
    details: { gigId: 456, rating: 5 }
  })
});

const { success, newScore, leveledUp, badgesEarned } = await response.json();
```

### Create Workflow Recipe

```javascript
// Create custom workflow
const response = await fetch('/api/magicians/workflow/recipes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Daily Report',
    trigger: {
      type: 'schedule',
      config: { cron: '0 9 * * *' } // Daily at 9 AM
    },
    actions: [
      {
        type: 'gather_metrics',
        config: { period: '24h' }
      },
      {
        type: 'send_email',
        config: { template: 'daily_report', recipients: 'admin' }
      }
    ]
  })
});
```

### Ask Question to Community Concierge

```javascript
// Ask a question
const response = await fetch('/api/magicians/community_concierge/execute', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'ask_question',
    params: {
      question: 'How do I get started on SignGigs?'
    }
  })
});

const { success, answer, aslVideoUrl, relatedQuestions } = await response.json();
```

## Coordination Between Magicians

Magicians can coordinate with each other using the `coordinateWith` method:

```typescript
// Example: Gatekeeper flags suspicious activity
// → Safety Monitor reviews the case

await this.coordinateWith({
  fromMagician: 'gatekeeper',
  toMagician: 'safety_monitor',
  requestType: 'review_suspicious_activity',
  payload: {
    userId: 123,
    activityType: 'multiple_failed_logins',
    details: { attempts: 5, timespan: '5 minutes' }
  },
  priority: 'high'
});
```

## Planned Magicians

- **Content Curator Magician** 📚 - Organize knowledge, surface content
- **Safety Monitor Magician** 🛡️ - Protect from abuse, scams, harassment
- **Opportunity Scout Magician** 🎯 - Match gigs, collaborations, grants
- **Analytics Oracle Magician** 📊 - Generate insights, track ecosystem health
- **Governance Facilitator Magician** 🗳️ - Run DAO processes, coordinate voting

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

### Type Checking

```bash
npm run typecheck
```

### Testing

```bash
npm test
```

## Security Considerations

1. **DeafAuth First**: All Magicians validate permissions before executing actions
2. **Audit Logging**: Every action is logged for transparency and accountability
3. **Rate Limiting**: Protect against abuse and gaming
4. **Privacy Preservation**: User data never shared without explicit consent
5. **Anomaly Detection**: Suspicious patterns flagged for review

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on contributing to the 360 Magicians platform.

## License

MIT License - See [LICENSE](../LICENSE) for details.
