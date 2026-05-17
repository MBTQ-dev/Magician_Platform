# FibonRose Module

Reputation and trust scoring system using Fibonacci-based algorithm for the MBTQ ecosystem.

## Features

- **Fibonacci-based Scoring**: Mathematical reputation system based on contribution patterns
- **Trust Calculation**: Community trust metrics and verification
- **Badge System**: Achievement badges and milestones
- **Contribution Tracking**: Record and analyze user contributions
- **Decay Prevention**: Active participation maintains scores

## Usage

```typescript
import { calculateTrustScore, recordContribution, getBadges } from "./modules/fibonrose/mod.ts";

// Record a contribution
await recordContribution({
  userId: "user-123",
  type: "complete_gig",
  value: 5,
  metadata: { gigId: "gig-456" },
});

// Calculate trust score
const score = await calculateTrustScore("user-123");
console.log(`Trust score: ${score.score} (Level ${score.level})`);

// Get user badges
const badges = await getBadges("user-123");
```

## Contribution Types

- **Positive**: `complete_gig`, `mentor_session`, `help_community`, `create_asl_content`
- **Negative**: `harassment_violation`, `spam_violation`, `fraud_attempt`

## Trust Levels

- **Level 1**: 0-12 points (Newcomer)
- **Level 2**: 13-34 points (Active Member)
- **Level 3**: 35-89 points (Trusted Member)
- **Level 4**: 90-233 points (Community Leader)
- **Level 5**: 234+ points (Ambassador)

## Configuration

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
FIBONROSE_DECAY_ENABLED=true
FIBONROSE_DECAY_DAYS=90
```
