# Opportunities System

## Overview

The Opportunities System provides personalized opportunity matching for MBTQ platform users. Instead of showing hard-coded mock opportunities, the system now:

1. **Stores opportunities in a database** with rich metadata including type, category, tags, target audience, and Fibonrose requirements
2. **Personalizes opportunity recommendations** based on:
   - User's Fibonrose score (only shows opportunities they qualify for)
   - User's profile (Deaf status, ASL preference)
   - User's interests and preferences
   - Opportunity relevance scoring

## Database Schema

### Opportunities Table

The `opportunities` table stores all available opportunities:

```typescript
{
  id: number;
  type: 'gig' | 'collaboration' | 'grant' | 'training' | 'event' | 'mentorship';
  title: string;
  description: string;
  category?: 'business' | 'accessibility' | 'technology' | 'community' | 'education';
  tags?: string[];
  requiredFibonrose: number; // Minimum Fibonrose score needed
  targetAudience?: string[]; // e.g., ['deaf', 'asl_user', 'entrepreneur']
  budget?: string;
  deadline?: Date;
  location?: string; // 'remote', 'in_person', 'hybrid', or specific location
  externalUrl?: string;
  contactEmail?: string;
  contactName?: string;
  isActive: boolean;
  priority: number; // Higher priority = shown first
  postedBy?: number; // User ID who posted the opportunity
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}
```

### User Interests Table

The `userInterests` table stores user preferences for personalized matching:

```typescript
{
  id: number;
  userId: number;
  category: string; // e.g., 'business', 'technology', 'accessibility'
  subcategories?: string[]; // More specific interests
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lookingFor?: string[]; // e.g., ['gigs', 'grants', 'mentorship']
  createdAt: Date;
  updatedAt: Date;
}
```

## Personalized Matching Algorithm

The `surfaceOpportunities` method implements a smart ranking algorithm:

### 1. Initial Filtering
- Only shows active opportunities
- Filters by user's Fibonrose score (must meet minimum requirement)
- Filters by target audience (matches user's profile)
- Excludes expired opportunities
- Optionally filters by category and type parameters

### 2. Relevance Scoring
Each opportunity receives a relevance score based on:

- **Priority** (from opportunity): Base score
- **Type match** (+50 points): If opportunity type matches what user is looking for
- **Category match** (+30 points): If opportunity category matches user interests
- **Looking-for match** (+40 points): If user is specifically looking for this type
- **Subcategory/tag match** (+10 points per match): More granular interest matching
- **User tag match** (+5 points per match): General tag relevance
- **Recency bonus** (+10 points): Opportunities posted within the last 7 days

### 3. Ranking and Limiting
- Opportunities are sorted by relevance score (highest first)
- Results are limited to top N (default: 10)

## API Usage

### Surface Opportunities

```typescript
// Basic usage
const result = await communityConciergeMagician.execute(
  'surface_opportunities',
  context,
  {}
);

// With filters
const result = await communityConciergeMagician.execute(
  'surface_opportunities',
  context,
  {
    category: 'business',
    type: 'grant',
    limit: 5
  }
);
```

**Response:**
```typescript
{
  success: true,
  opportunities: [...],
  total: number,
  message: string
}
```

## Database Operations

### Seeding Sample Data

```bash
# Seed opportunities
npm run db:seed:opportunities

# Seed user interests (for specific user ID)
npm run db:seed:user-interests -- <userId>
```

### Creating Opportunities

```typescript
const db = new DatabaseStorage();

await db.createOpportunity({
  type: 'gig',
  title: 'ASL Video Editor Needed',
  description: '...',
  category: 'accessibility',
  tags: ['video-editing', 'asl'],
  requiredFibonrose: 100,
  targetAudience: ['asl_user', 'deaf'],
  budget: '$500',
  isActive: true,
  priority: 10
});
```

### Managing User Interests

```typescript
const db = new DatabaseStorage();

// Get user's interests
const interests = await db.getUserInterests(userId);

// Create new interest
await db.createUserInterest({
  userId,
  category: 'business',
  subcategories: ['startup', 'entrepreneurship'],
  skillLevel: 'intermediate',
  lookingFor: ['grants', 'mentorship']
});

// Update interest
await db.updateUserInterest(interestId, {
  skillLevel: 'advanced'
});
```

## Benefits Over Hard-Coded Approach

1. **Dynamic**: Opportunities can be added, updated, or removed without code changes
2. **Personalized**: Each user sees different opportunities based on their profile and interests
3. **Scalable**: Can handle thousands of opportunities efficiently
4. **Relevant**: Smart ranking ensures most relevant opportunities appear first
5. **Flexible**: Easy to add new filtering and ranking criteria
6. **Testable**: Can easily seed test data for different scenarios

## Future Enhancements

Potential improvements to consider:

1. **User Actions Tracking**: Track which opportunities users view/apply to
2. **Machine Learning**: Use historical data to improve recommendations
3. **Notifications**: Alert users when new relevant opportunities are posted
4. **Application System**: Allow users to apply to opportunities directly
5. **Opportunity Posting**: Let users with sufficient Fibonrose post opportunities
6. **Saved Opportunities**: Allow users to bookmark opportunities for later
7. **Analytics**: Track opportunity performance and user engagement
