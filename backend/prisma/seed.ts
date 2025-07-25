import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('Starting database seed...');

  try {
    // Create skills first
    const skills = await Promise.all([
      prisma.skill.upsert({
        where: { name: 'Photography' },
        update: {},
        create: {
          name: 'Photography',
          category: 'DOCUMENTATION',
          description: 'Digital photography and image documentation'
        }
      }),
      prisma.skill.upsert({
        where: { name: 'Stone Conservation' },
        update: {},
        create: {
          name: 'Stone Conservation',
          category: 'MAINTENANCE',
          description: 'Restoration and conservation of stone structures'
        }
      }),
      prisma.skill.upsert({
        where: { name: 'Cultural Research' },
        update: {},
        create: {
          name: 'Cultural Research',
          category: 'RESEARCH',
          description: 'Academic research in cultural heritage'
        }
      }),
      prisma.skill.upsert({
        where: { name: 'Teaching' },
        update: {},
        create: {
          name: 'Teaching',
          category: 'EDUCATION',
          description: 'Educational instruction and curriculum development'
        }
      }),
      prisma.skill.upsert({
        where: { name: 'Cataloging' },
        update: {},
        create: {
          name: 'Cataloging',
          category: 'DOCUMENTATION',
          description: 'Systematic organization and documentation'
        }
      })
    ]);

    console.log('Skills created:', skills.length);

    // Create coordinator user
    const coordinatorPassword = await bcrypt.hash('coordinator123', 12);
    const coordinatorUser = await prisma.user.upsert({
      where: { email: 'coordinator@tresno-boedoyo.com' },
      update: {},
      create: {
        email: 'coordinator@tresno-boedoyo.com',
        password: coordinatorPassword,
        role: 'COORDINATOR',
        isActive: true
      }
    });

    // Create coordinator profile
    const coordinator = await prisma.coordinator.upsert({
      where: { userId: coordinatorUser.id },
      update: {},
      create: {
        userId: coordinatorUser.id,
        firstName: 'Heritage',
        lastName: 'Coordinator',
        phone: '+62-812-3456-7890',
        department: 'Cultural Heritage Preservation',
        bio: 'Dedicated to preserving Indonesian cultural heritage for future generations.'
      }
    });

    console.log('Coordinator created:', coordinator.id);

    // Create sample volunteer user for testing
    const volunteerPassword = await bcrypt.hash('volunteer123', 12);
    const volunteerUser = await prisma.user.upsert({
      where: { email: 'volunteer@tresno-boedoyo.com' },
      update: {},
      create: {
        email: 'volunteer@tresno-boedoyo.com',
        password: volunteerPassword,
        role: 'VOLUNTEER',
        isActive: true
      }
    });

    // Create volunteer profile
    const volunteer = await prisma.volunteer.upsert({
      where: { userId: volunteerUser.id },
      update: {},
      create: {
        userId: volunteerUser.id,
        firstName: 'Test',
        lastName: 'Volunteer',
        phone: '+62-813-7654-3210',
        dateOfBirth: new Date('1995-06-15'),
        nationality: 'Indonesian',
        languages: ['Indonesian', 'English'],
        bio: 'Passionate about preserving Indonesian cultural heritage.',
        isAvailable: true
      }
    });

    console.log('Volunteer created:', volunteer.id);

    // Create sample opportunities
    const opportunities = [
      {
        title: 'Borobudur Temple Documentation',
        description: 'Help document and preserve the ancient reliefs of Borobudur Temple through digital photography and cataloging. This project aims to create a comprehensive digital archive of the temple\'s cultural and artistic heritage.',
        location: 'Magelang, Central Java',
        dateTime: new Date('2025-08-01T08:00:00Z'),
        duration: 8,
        maxVolunteers: 20,
        requirements: 'Basic photography skills, physical fitness for walking and climbing, respect for cultural sites',
        benefits: 'Certificate of participation, cultural heritage training, networking with professionals',
        impactStatement: 'Help preserve one of Indonesia\'s most important cultural treasures for future generations',
        skills: [
          { skillName: 'Photography', required: true, level: 'INTERMEDIATE' },
          { skillName: 'Cataloging', required: false, level: 'BEGINNER' }
        ]
      },
      {
        title: 'Prambanan Stone Conservation',
        description: 'Assist in the conservation efforts for Prambanan Temple complex, including cleaning and restoration work under expert supervision. Learn traditional stone conservation techniques.',
        location: 'Yogyakarta',
        dateTime: new Date('2025-08-10T07:00:00Z'),
        duration: 10,
        maxVolunteers: 15,
        requirements: 'Physical fitness, attention to detail, willingness to work outdoors',
        benefits: 'Hands-on conservation training, expert mentorship, certificate',
        impactStatement: 'Contribute to preserving the magnificent Hindu temple complex',
        skills: [
          { skillName: 'Stone Conservation', required: true, level: 'BEGINNER' }
        ]
      },
      {
        title: 'Traditional Batik Research',
        description: 'Research and document traditional batik techniques from Central Java for cultural preservation. Interview master craftspeople and document their techniques.',
        location: 'Solo, Central Java',
        dateTime: new Date('2025-07-20T09:00:00Z'),
        duration: 6,
        maxVolunteers: 10,
        requirements: 'Research experience, interview skills, cultural sensitivity',
        benefits: 'Research publication opportunity, cultural immersion, stipend',
        impactStatement: 'Preserve traditional knowledge for future artisans',
        skills: [
          { skillName: 'Cultural Research', required: true, level: 'INTERMEDIATE' }
        ]
      },
      {
        title: 'Heritage Education Program',
        description: 'Develop and deliver educational programs about Indonesian heritage to local schools. Create engaging content and interactive workshops for students.',
        location: 'Jakarta',
        dateTime: new Date('2025-09-01T08:00:00Z'),
        duration: 4,
        maxVolunteers: 25,
        requirements: 'Teaching experience, creativity, passion for education',
        benefits: 'Teaching certificate, curriculum development experience, impact measurement',
        impactStatement: 'Inspire the next generation to value their cultural heritage',
        skills: [
          { skillName: 'Teaching', required: true, level: 'INTERMEDIATE' }
        ]
      },
      {
        title: 'Digital Archive Project',
        description: 'Help digitize historical documents and artifacts from Indonesian museums. Scan, catalog, and organize digital collections for online access.',
        location: 'Bandung, West Java',
        dateTime: new Date('2025-08-15T09:00:00Z'),
        duration: 6,
        maxVolunteers: 12,
        requirements: 'Computer literacy, attention to detail, patience with detailed work',
        benefits: 'Digital archiving certification, technology training, flexible schedule',
        impactStatement: 'Make cultural heritage accessible to researchers worldwide',
        skills: [
          { skillName: 'Cataloging', required: true, level: 'INTERMEDIATE' },
          { skillName: 'Photography', required: false, level: 'BEGINNER' }
        ]
      }
    ];

    for (const oppData of opportunities) {
      const { skills: oppSkills, ...opportunityData } = oppData;
      
      const opportunity = await prisma.opportunity.create({
        data: {
          ...opportunityData,
          coordinatorId: coordinator.id,
          status: 'PUBLISHED'
        }
      });

      // Add skills to opportunity
      for (const skillData of oppSkills) {
        const skill = skills.find(s => s.name === skillData.skillName);
        if (skill) {
          await prisma.opportunitySkill.create({
            data: {
              opportunityId: opportunity.id,
              skillId: skill.id,
              required: skillData.required,
              level: skillData.level as any
            }
          });
        }
      }

      console.log('Opportunity created:', opportunity.title);
    }

    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  });
