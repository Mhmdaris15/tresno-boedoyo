import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBasicMuseumData() {
  console.log('🏛️ Starting basic museum seed data...');

  try {
    // Check if museum already exists
    const existingMuseum = await prisma.museum.findFirst({
      where: { name: 'National Museum of Indonesia' }
    });

    if (existingMuseum) {
      console.log('✅ Museum already exists:', existingMuseum.name);
      return;
    }

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

    const artifact3 = await prisma.artifact.create({
      data: {
        museumId: museum.id,
        name: 'Majapahit Golden Jewelry',
        description: 'Exquisite golden jewelry collection from the Majapahit Empire, showcasing advanced metalworking techniques.',
        category: 'JEWELRY' as const,
        origin: 'East Java',
        period: '13th-15th century CE',
        materials: ['Gold', 'Precious stones'],
        significance: 'Demonstrates wealth and artistic sophistication of Majapahit Empire',
        talkingPoints: [
          'Advanced goldsmithing techniques',
          'Symbol of royal power',
          'Trade network evidence',
          'Cultural fusion'
        ],
        images: ['/images/artifacts/majapahit-jewelry.jpg'],
        xPosition: 70.0,
        yPosition: 25.0,
        floor: 1,
        estimatedDuration: 12
      }
    });

    console.log('✅ Created artifacts:', artifact1.name, artifact2.name, artifact3.name);
    console.log('🎉 Basic museum seed data completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding museum data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedBasicMuseumData().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
