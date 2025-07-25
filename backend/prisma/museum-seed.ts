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
        floorPlanWidth: 150.0, // meters
        floorPlanHeight: 100.0, // meters
        openingHours: 'Tuesday-Sunday: 08:00-16:00, Closed on Monday',
        contactInfo: '+62 21 3868172',
        isActive: true
      }
    });

    console.log('✅ Museum created:', museum.name);

    // Create artifacts with floor plan positions
    const artifacts = [
      {
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
      },
      {
        name: 'Borobudur Relief Panel',
        description: 'Original relief panel from Borobudur Temple depicting scenes from Buddhist Jataka tales.',
        category: 'SCULPTURE' as const,
        origin: 'Central Java',
        period: '8th-9th century CE',
        materials: ['Andesite stone'],
        significance: 'Represents the pinnacle of Buddhist art in Java',
        talkingPoints: [
          'Buddhist narrative art',
          'Sailendra dynasty craftsmanship',
          'Jataka tale symbolism',
          'UNESCO World Heritage connection'
        ],
        images: ['/images/artifacts/borobudur-relief.jpg'],
        xPosition: 45.0,
        yPosition: 25.0,
        floor: 1,
        estimatedDuration: 15
      },
      {
        name: 'Majapahit Gold Jewelry',
        description: 'Exquisite gold jewelry collection from the Majapahit Empire, showcasing advanced metalworking techniques.',
        category: 'JEWELRY' as const,
        origin: 'East Java',
        period: '13th-15th century CE',
        materials: ['Gold', 'Precious stones'],
        significance: 'Demonstrates the wealth and artistic sophistication of the Majapahit Empire',
        talkingPoints: [
          'Majapahit imperial wealth',
          'Advanced goldsmithing techniques',
          'Hindu-Javanese artistic fusion',
          'Trade network evidence'
        ],
        images: ['/images/artifacts/majapahit-gold.jpg'],
        xPosition: 70.0,
        yPosition: 40.0,
        floor: 1,
        estimatedDuration: 12
      },
      {
        name: 'Dayak Traditional Mask',
        description: 'Sacred ceremonial mask from Dayak tribes of Borneo, used in ancestral worship rituals.',
        category: 'RELIGIOUS_OBJECT' as const,
        origin: 'Kalimantan',
        period: '19th-20th century',
        materials: ['Wood', 'Natural pigments', 'Feathers'],
        significance: 'Represents the spiritual beliefs and artistic traditions of Dayak communities',
        talkingPoints: [
          'Dayak spiritual beliefs',
          'Ancestral worship practices',
          'Traditional craftsmanship',
          'Borneo cultural diversity'
        ],
        images: ['/images/artifacts/dayak-mask.jpg'],
        xPosition: 30.0,
        yPosition: 65.0,
        floor: 1,
        estimatedDuration: 8
      },
      {
        name: 'Srivijaya Buddha Statue',
        description: 'Bronze Buddha statue from the maritime Srivijaya Empire, reflecting Buddhist influence in Sumatra.',
        category: 'SCULPTURE' as const,
        origin: 'South Sumatra',
        period: '7th-13th century CE',
        materials: ['Bronze'],
        significance: 'Evidence of Srivijaya as a major Buddhist center in Southeast Asia',
        talkingPoints: [
          'Srivijaya maritime empire',
          'Buddhist trade networks',
          'Palembang as religious center',
          'Bronze casting techniques'
        ],
        images: ['/images/artifacts/srivijaya-buddha.jpg'],
        xPosition: 90.0,
        yPosition: 30.0,
        floor: 1,
        estimatedDuration: 12
      },
      {
        name: 'Batik Megamendung',
        description: 'Traditional Cirebon batik featuring the distinctive cloud pattern, representing Chinese-Javanese cultural fusion.',
        category: 'TEXTILE' as const,
        origin: 'Cirebon, West Java',
        period: '17th-18th century',
        materials: ['Cotton', 'Natural dyes', 'Wax'],
        significance: 'Showcases the multicultural heritage of Indonesian textile arts',
        talkingPoints: [
          'Chinese-Javanese cultural fusion',
          'Cirebon as trading port',
          'Batik symbolism and meaning',
          'Traditional dyeing techniques'
        ],
        images: ['/images/artifacts/batik-megamendung.jpg'],
        xPosition: 50.0,
        yPosition: 75.0,
        floor: 1,
        estimatedDuration: 10
      },
      {
        name: 'Keris Empu Gandring',
        description: 'Legendary keris (ceremonial dagger) with intricate pamor patterns, representing Javanese spiritual beliefs.',
        category: 'WEAPON' as const,
        origin: 'Central Java',
        period: '13th century',
        materials: ['Iron', 'Nickel', 'Meteorite steel'],
        significance: 'Symbol of Javanese craftsmanship and spiritual power',
        talkingPoints: [
          'Keris spiritual significance',
          'Pamor pattern meaning',
          'Empu (master smith) tradition',
          'UNESCO Intangible Heritage'
        ],
        images: ['/images/artifacts/keris-gandring.jpg'],
        xPosition: 80.0,
        yPosition: 60.0,
        floor: 1,
        estimatedDuration: 15
      },
      {
        name: 'Toraja Funeral Effigy',
        description: 'Tau-tau wooden effigy from Tana Toraja, representing the deceased in traditional funeral ceremonies.',
        category: 'SCULPTURE' as const,
        origin: 'South Sulawesi',
        period: '19th-20th century',
        materials: ['Wood', 'Traditional clothing'],
        significance: 'Represents unique Torajan beliefs about death and afterlife',
        talkingPoints: [
          'Torajan death rituals',
          'Ancestor veneration',
          'Unique funeral practices',
          'Cultural preservation challenges'
        ],
        images: ['/images/artifacts/toraja-tautau.jpg'],
        xPosition: 60.0,
        yPosition: 55.0,
        floor: 2,
        estimatedDuration: 10
      }
    ];

    console.log('🏺 Creating artifacts...');
    
    for (const artifactData of artifacts) {
      await prisma.artifact.upsert({
        where: { 
          museumId_name: {
            museumId: museum.id,
            name: artifactData.name
          }
        },
        update: {},
        create: {
          ...artifactData,
          museumId: museum.id
        }
      });
      console.log('✅ Created artifact:', artifactData.name);
    }

    // Create sample tour
    const guideUser = await prisma.user.findFirst({
      where: { role: 'COORDINATOR' }
    });

    if (guideUser) {
      const sampleTour = await prisma.tour.create({
        data: {
          museumId: museum.id,
          guideId: guideUser.id,
          title: 'Highlights of Indonesian Civilization',
          description: 'A comprehensive tour showcasing the rich cultural heritage and artistic achievements of Indonesia from ancient times to the colonial period.',
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

      console.log('🎯 Sample tour created:', sampleTour.title);
    }

    console.log('🎉 Museum seed data completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding museum data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedMuseumData()
  .catch((e) => {
    console.error('Museum seed failed:', e);
    process.exit(1);
  });
