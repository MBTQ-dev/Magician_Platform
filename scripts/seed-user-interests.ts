/**
 * Seed script for user interests
 * 
 * This script populates the database with sample user interests
 * for testing the personalized opportunity matching feature.
 */

import { DatabaseStorage } from '../server/database';
import type { InsertUserInterest } from '../shared/schema';

async function seedUserInterests() {
  const db = new DatabaseStorage();

  // You can customize the userId here or pass it as a command line argument
  const userId = process.argv[2] ? parseInt(process.argv[2]) : 1;

  console.log(`Seeding interests for user ID: ${userId}`);

  // Check if user exists
  const user = await db.getUser(userId);
  if (!user) {
    console.error(`User with ID ${userId} does not exist. Please create a user first.`);
    process.exit(1);
  }

  const sampleInterests: InsertUserInterest[] = [
    {
      userId,
      category: 'business',
      subcategories: ['startup', 'business-formation', 'entrepreneurship'],
      skillLevel: 'intermediate',
      lookingFor: ['grants', 'mentorship', 'training'],
    },
    {
      userId,
      category: 'technology',
      subcategories: ['web-development', 'mobile', 'accessibility'],
      skillLevel: 'advanced',
      lookingFor: ['gigs', 'collaborations'],
    },
    {
      userId,
      category: 'accessibility',
      subcategories: ['asl', 'deaf-culture', 'inclusive-design'],
      skillLevel: 'expert',
      lookingFor: ['gigs', 'collaborations', 'events'],
    },
  ];

  console.log('Starting to seed user interests...');

  let successCount = 0;
  let errorCount = 0;

  for (const interest of sampleInterests) {
    try {
      await db.createUserInterest(interest);
      successCount++;
      console.log(`✓ Created interest: ${interest.category}`);
    } catch (error) {
      errorCount++;
      console.error(`✗ Failed to create interest: ${interest.category}`, error);
    }
  }

  console.log(`\nSeeding complete!`);
  console.log(`✓ Successfully created: ${successCount}`);
  console.log(`✗ Failed: ${errorCount}`);
  console.log(`Total: ${sampleInterests.length}`);
}

// Run the seed function
seedUserInterests()
  .then(() => {
    console.log('Seed script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
