/**
 * Seed script for opportunities
 * 
 * This script populates the database with sample opportunities
 * for testing the personalized opportunity matching feature.
 */

import { DatabaseStorage } from '../server/database';
import type { InsertOpportunity } from '../shared/schema';

// Time constants for deadline calculations
const DAYS_IN_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * DAYS_IN_MS;
const TWO_WEEKS = 14 * DAYS_IN_MS;
const THREE_WEEKS = 21 * DAYS_IN_MS;
const ONE_MONTH = 30 * DAYS_IN_MS;
const SIX_WEEKS = 45 * DAYS_IN_MS;

// Helper function to convert Date to date string (YYYY-MM-DD)
function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

async function seedOpportunities() {
  const db = new DatabaseStorage();

  const sampleOpportunities: InsertOpportunity[] = [
    {
      type: 'gig',
      title: 'ASL Video Editor Needed',
      description: 'Edit 10 ASL tutorial videos for our educational platform. Must be familiar with ASL and video editing software.',
      category: 'accessibility',
      tags: ['video-editing', 'asl', 'education'],
      requiredFibonrose: 100,
      targetAudience: ['asl_user', 'deaf'],
      budget: '$500',
      deadline: toDateString(new Date(Date.now() + TWO_WEEKS)),
      location: 'remote',
      contactEmail: 'jobs@mbtq.example.com',
      contactName: 'MBTQ Hiring Team',
      isActive: true,
      priority: 10,
    },
    {
      type: 'collaboration',
      title: 'Looking for Co-Founder - Deaf-Owned Startup',
      description: 'Building a Deaf-owned startup focused on accessible technology. Need technical co-founder with experience in web development.',
      category: 'business',
      tags: ['startup', 'technology', 'co-founder', 'web-development'],
      requiredFibonrose: 200,
      targetAudience: ['deaf', 'entrepreneur'],
      location: 'remote',
      contactEmail: 'founder@startup.example.com',
      contactName: 'Jane Doe',
      isActive: true,
      priority: 15,
    },
    {
      type: 'grant',
      title: 'DAO Community Grant Program',
      description: 'Apply for funding for community projects that benefit the Deaf community. Up to $5,000 available.',
      category: 'community',
      tags: ['funding', 'community', 'grant', 'dao'],
      requiredFibonrose: 150,
      targetAudience: ['deaf', 'entrepreneur'],
      budget: 'Up to $5,000',
      deadline: toDateString(new Date(Date.now() + ONE_MONTH)),
      location: 'remote',
      externalUrl: 'https://dao.mbtq.example.com/grants',
      isActive: true,
      priority: 20,
    },
    {
      type: 'training',
      title: 'Business Formation Workshop',
      description: 'Free workshop on how to form your business, including LLC formation, EIN application, and business banking.',
      category: 'business',
      tags: ['education', 'business-formation', 'workshop', 'free'],
      requiredFibonrose: 50,
      targetAudience: ['entrepreneur', 'deaf'],
      location: 'hybrid',
      deadline: toDateString(new Date(Date.now() + ONE_WEEK)),
      externalUrl: 'https://learn.mbtq.example.com/workshops',
      isActive: true,
      priority: 12,
    },
    {
      type: 'event',
      title: 'Deaf Entrepreneurs Networking Event',
      description: 'Connect with other Deaf entrepreneurs, investors, and mentors. Food and ASL interpretation provided.',
      category: 'community',
      tags: ['networking', 'entrepreneurs', 'event', 'in-person'],
      requiredFibonrose: 75,
      targetAudience: ['deaf', 'entrepreneur'],
      location: 'Seattle, WA',
      deadline: toDateString(new Date(Date.now() + THREE_WEEKS)),
      contactEmail: 'events@mbtq.example.com',
      isActive: true,
      priority: 8,
    },
    {
      type: 'mentorship',
      title: 'Technology Mentorship Program',
      description: 'Get paired with an experienced tech professional for 3-month mentorship. Focus on web development, mobile apps, or AI/ML.',
      category: 'technology',
      tags: ['mentorship', 'technology', 'career-development'],
      requiredFibonrose: 120,
      targetAudience: ['deaf', 'hard_of_hearing'],
      location: 'remote',
      externalUrl: 'https://mentorship.mbtq.example.com',
      isActive: true,
      priority: 18,
    },
    {
      type: 'gig',
      title: 'Accessibility Consultant for Mobile App',
      description: 'Need a Deaf accessibility consultant to review our mobile app and provide recommendations for improvements.',
      category: 'accessibility',
      tags: ['consulting', 'accessibility', 'mobile', 'ux'],
      requiredFibonrose: 180,
      targetAudience: ['deaf', 'asl_user'],
      budget: '$1,200',
      location: 'remote',
      deadline: toDateString(new Date(Date.now() + 10 * DAYS_IN_MS)),
      contactEmail: 'consulting@tech-company.example.com',
      isActive: true,
      priority: 14,
    },
    {
      type: 'training',
      title: 'ASL Business Terminology Course',
      description: 'Learn essential business terms in ASL. Perfect for entrepreneurs and business professionals. 6-week online course.',
      category: 'education',
      tags: ['asl', 'business', 'education', 'course'],
      requiredFibonrose: 30,
      targetAudience: ['asl_user', 'deaf', 'entrepreneur'],
      budget: 'Free',
      location: 'remote',
      externalUrl: 'https://learn.mbtq.example.com/asl-business',
      isActive: true,
      priority: 9,
    },
    {
      type: 'collaboration',
      title: 'Open Source Accessibility Project',
      description: 'Join our team building open-source accessibility tools for the Deaf community. All skill levels welcome.',
      category: 'technology',
      tags: ['open-source', 'accessibility', 'collaboration', 'technology'],
      requiredFibonrose: 60,
      targetAudience: ['deaf', 'hard_of_hearing'],
      location: 'remote',
      externalUrl: 'https://github.com/mbtq/accessibility-tools',
      isActive: true,
      priority: 11,
    },
    {
      type: 'grant',
      title: 'Small Business Innovation Grant',
      description: 'SBA-backed grant for innovative small businesses. Preference given to businesses serving the Deaf community.',
      category: 'business',
      tags: ['grant', 'sba', 'innovation', 'small-business'],
      requiredFibonrose: 250,
      targetAudience: ['entrepreneur', 'business_owner'],
      budget: 'Up to $25,000',
      deadline: toDateString(new Date(Date.now() + SIX_WEEKS)),
      externalUrl: 'https://sba.gov/grants',
      isActive: true,
      priority: 25,
    },
  ];

  console.log('Starting to seed opportunities...');

  let successCount = 0;
  let errorCount = 0;

  for (const opportunity of sampleOpportunities) {
    try {
      await db.createOpportunity(opportunity);
      successCount++;
      console.log(`✓ Created opportunity: ${opportunity.title}`);
    } catch (error) {
      errorCount++;
      console.error(`✗ Failed to create opportunity: ${opportunity.title}`, error);
    }
  }

  console.log(`\nSeeding complete!`);
  console.log(`✓ Successfully created: ${successCount}`);
  console.log(`✗ Failed: ${errorCount}`);
  console.log(`Total: ${sampleOpportunities.length}`);
}

// Run the seed function
seedOpportunities()
  .then(() => {
    console.log('Seed script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
