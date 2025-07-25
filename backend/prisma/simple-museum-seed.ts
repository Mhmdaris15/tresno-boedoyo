import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMuseumData() {
  console.log('🏛️ Starting museum seed data...');

  try {
    // Create National Museum of Indonesia
    const museum = await prisma.museum.create({
      data: {
        name: 'National Museum of Indonesia',
        address: 'Jl. Medan Merdeka Barat No.12, Gambir',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        description: 'The National Museum of Indonesia, also known as Museum Gajah (Elephant Museum), is an archaeological, historical, ethnological, and geographical museum located in Jakarta.',
        floorPlanImage: '/images/museum/national-museum-floorplan.jpg',
        floorPlanWidth: 150.0,
        floorPlanHeight: 100.0,
        openingHours: 'Tuesday-Sunday: 08:00-16:00, Closed on Monday',
        contactInfo: '+62 21 3868172',
        isActive: true
      }
    });

    console.log('✅ Museum created:', museum.name);

    // Create sample artifacts
    const artifact1 = await prisma.artifact.create({
      data: {
        museumId: museum.id,
        name: 'Yupa Stone Inscription',
        description: 'Ancient stone inscription from the Kutai Kingdom (4th century CE), one of the oldest written records in Indonesia.',
        category: 'MANUSCRIPT' as const,
        origin: 'East Kalimantan',
        period: '4th century CE',
        materials: ['Stone', 'Sanskrit inscription'],
        significance: 'Earliest evidence of Hindu influence and written culture in Indonesia',
        talkingPoints: [
          'Oldest written record in Indonesia',
          'Shows early Hindu-Buddhist influence',
          'Kutai Kingdom connection',
          'Sanskrit language usage'
        ],
        images: ['/images/artifacts/yupa-stone.jpg'],
        xPosition: 25.0,
        yPosition: 30.0,
        floor: 1,
        estimatedDuration: 10
      }
    });

    const artifact2 = await prisma.artifact.create({
      data: {
        museumId: museum.id,
        name: 'Borobudur Relief Model',
        description: 'Scale model of the famous Buddhist temple reliefs depicting the journey to enlightenment.',
        category: 'SCULPTURE' as const,
        origin: 'Central Java',
        period: '8th-9th century CE',
        materials: ['Stone', 'Sandstone'],
        significance: 'Represents pinnacle of Buddhist art and architecture in Indonesia',
        talkingPoints: [
          'Buddhist cosmology representation',
          'Architectural masterpiece',
          'UNESCO World Heritage Site',
          'Mandala symbolism'
        ],
        images: ['/images/artifacts/borobudur-relief.jpg'],
        xPosition: 45.0,
        yPosition: 40.0,
        floor: 1,
        estimatedDuration: 15
      }
    });

    console.log('✅ Created artifacts:', artifact1.name, artifact2.name);

    // Find an existing coordinator/guide user for the tour
    const guideUser = await prisma.user.findFirst({
      where: { role: 'COORDINATOR' }
    });

    if (guideUser) {
      // Create a sample tour
      const sampleTour = await prisma.tour.create({
        data: {
          museumId: museum.id,
          guideId: guideUser.id,
          title: 'Highlights of Indonesian Civilization',
          description: 'A comprehensive tour showcasing the rich cultural heritage of Indonesia.',
          estimatedDuration: 90,
          maxParticipants: 20,
          startTime: new Date('2025-07-26T10:00:00Z'),
          status: 'ACTIVE',
          startPointX: 10.0,
          startPointY: 15.0,
          endPointX: 90.0,
          endPointY: 80.0
        }
      });

      // Create tour stops
      await prisma.tourStop.create({
        data: {
          tourId: sampleTour.id,
          artifactId: artifact1.id,
          stopOrder: 1,
          estimatedTime: 10,
          customNotes: 'Starting point - ancient inscriptions'
        }
      });

      await prisma.tourStop.create({
        data: {
          tourId: sampleTour.id,
          artifactId: artifact2.id,
          stopOrder: 2,
          estimatedTime: 15,
          customNotes: 'Buddhist art and architecture'
        }
      });

      console.log('✅ Created tour:', sampleTour.title);
    } else {
      console.log('⚠️ No coordinator user found - skipping tour creation');
    }
    console.log('🎉 Museum seed data completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding museum data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedMuseumData().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
