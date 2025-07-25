import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addMoreArtifacts() {
  console.log('🏺 Adding more artifacts to National Museum...');

  try {
    // Get the museum
    const museum = await prisma.museum.findFirst({
      where: { name: 'National Museum of Indonesia' }
    });

    if (!museum) {
      console.error('❌ Museum not found');
      return;
    }

    // Add more diverse artifacts
    const additionalArtifacts = [
      {
        name: 'Traditional Batak Ulos Textile',
        description: 'Sacred ceremonial textile from North Sumatra, woven with traditional patterns and used in important life ceremonies.',
        category: 'TEXTILE' as const,
        origin: 'North Sumatra',
        period: '19th-20th century',
        materials: ['Cotton', 'Gold thread', 'Natural dyes'],
        significance: 'Represents cultural identity and spiritual beliefs of Batak people',
        talkingPoints: [
          'Sacred ceremonial purpose',
          'Traditional weaving techniques',
          'Cultural symbolism',
          'Life cycle ceremonies'
        ],
        images: ['/images/artifacts/batak-ulos.jpg'],
        xPosition: 30.0,
        yPosition: 60.0,
        floor: 1,
        estimatedDuration: 8
      },
      {
        name: 'Keris Majapahit Ceremonial Dagger',
        description: 'Ornate ceremonial dagger (keris) from the Majapahit period, featuring intricate blade patterns and symbolic hilt design.',
        category: 'WEAPON' as const,
        origin: 'East Java',
        period: '14th-15th century',
        materials: ['Steel', 'Wood', 'Gold inlay'],
        significance: 'Symbol of nobility and spiritual power in Javanese culture',
        talkingPoints: [
          'UNESCO Intangible Heritage',
          'Spiritual significance',
          'Metalworking mastery',
          'Royal regalia'
        ],
        images: ['/images/artifacts/keris-majapahit.jpg'],
        xPosition: 80.0,
        yPosition: 45.0,
        floor: 1,
        estimatedDuration: 12
      },
      {
        name: 'Dayak Ceremonial Mask',
        description: 'Intricately carved wooden mask used in traditional Dayak ceremonies, representing ancestral spirits and forest guardians.',
        category: 'RELIGIOUS_OBJECT' as const,
        origin: 'Kalimantan',
        period: '18th-19th century',
        materials: ['Ironwood', 'Natural pigments', 'Rattan'],
        significance: 'Connects community with ancestral spirits and nature',
        talkingPoints: [
          'Animistic beliefs',
          'Forest connection',
          'Ceremonial dance',
          'Ancestral spirits'
        ],
        images: ['/images/artifacts/dayak-mask.jpg'],
        xPosition: 60.0,
        yPosition: 70.0,
        floor: 1,
        estimatedDuration: 10
      },
      {
        name: 'Sriwijaya Gold Buddha Statue',
        description: 'Small golden Buddha statue from the Sriwijaya maritime empire, showcasing Buddhist artistic traditions in ancient Indonesia.',
        category: 'SCULPTURE' as const,
        origin: 'South Sumatra',
        period: '7th-8th century',
        materials: ['Gold', 'Bronze core'],
        significance: 'Evidence of early Buddhist kingdom and maritime trade networks',
        talkingPoints: [
          'Maritime empire',
          'Buddhist art style',
          'Trade networks',
          'Religious synthesis'
        ],
        images: ['/images/artifacts/sriwijaya-buddha.jpg'],
        xPosition: 90.0,
        yPosition: 30.0,
        floor: 1,
        estimatedDuration: 15
      },
      {
        name: 'Prehistoric Flores Stone Tools',
        description: 'Collection of stone tools from prehistoric Flores, providing insights into early human habitation in Indonesia.',
        category: 'ARCHAEOLOGICAL_FIND' as const,
        origin: 'Flores, East Nusa Tenggara',
        period: '50,000-100,000 years ago',
        materials: ['Volcanic stone', 'Obsidian'],
        significance: 'Evidence of early human migration and adaptation in Southeast Asia',
        talkingPoints: [
          'Human migration',
          'Homo floresiensis',
          'Tool technology',
          'Prehistoric life'
        ],
        images: ['/images/artifacts/flores-tools.jpg'],
        xPosition: 20.0,
        yPosition: 50.0,
        floor: 1,
        estimatedDuration: 8
      }
    ];

    console.log(`Creating ${additionalArtifacts.length} additional artifacts...`);

    for (const artifactData of additionalArtifacts) {
      // Check if artifact already exists
      const existingArtifact = await prisma.artifact.findFirst({
        where: {
          museumId: museum.id,
          name: artifactData.name
        }
      });

      if (existingArtifact) {
        console.log(`⚠️ Artifact already exists: ${artifactData.name}`);
        continue;
      }

      const artifact = await prisma.artifact.create({
        data: {
          ...artifactData,
          museumId: museum.id
        }
      });

      console.log(`✅ Created: ${artifact.name}`);
    }

    console.log('🎉 Additional artifacts added successfully!');

    // Show final count
    const totalArtifacts = await prisma.artifact.count({
      where: { museumId: museum.id }
    });

    console.log(`📊 Total artifacts in museum: ${totalArtifacts}`);

  } catch (error) {
    console.error('❌ Error adding artifacts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreArtifacts();
