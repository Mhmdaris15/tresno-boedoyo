import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addMoreSites() {
  console.log('Adding more heritage sites...');

  try {
    const newSites = [
      {
        name: 'Tana Toraja Cultural Landscape',
        description: 'Traditional villages known for elaborate funeral rites, cliff graves, and distinctive tongkonan houses.',
        type: 'CULTURAL_LANDSCAPE' as const,
        category: 'Traditional Village',
        location: 'Tana Toraja, South Sulawesi',
        latitude: -2.9889,
        longitude: 119.8853,
        province: 'South Sulawesi',
        city: 'Tana Toraja',
        unescoStatus: false,
        significance: 'Unique death rituals, traditional architecture, and living cultural traditions.',
        images: ['/images/heritage/toraja-1.jpg'],
        openingHours: 'Always accessible',
        entryFee: 'Free',
        conservationStatus: 'GOOD' as const,
        threatLevel: 'MODERATE' as const
      },
      {
        name: 'Sangiran Early Man Site',
        description: 'Key archaeological site for understanding human evolution, with fossils dating back 1.5 million years.',
        type: 'ARCHAEOLOGICAL_SITE' as const,
        category: 'Archaeological Site',
        location: 'Sangiran, Central Java',
        latitude: -7.4167,
        longitude: 110.8333,
        province: 'Central Java',
        city: 'Sragen',
        unescoStatus: true,
        significance: 'One of the most important sites for understanding human evolution in Asia.',
        images: ['/images/heritage/sangiran-1.jpg'],
        openingHours: '08:00 - 16:00 (Daily)',
        entryFee: 'IDR 5,000',
        conservationStatus: 'GOOD' as const,
        threatLevel: 'LOW' as const
      },
      {
        name: 'Minangkabau Traditional Houses',
        description: 'Traditional rumah gadang houses with distinctive horn-shaped roofs representing Minangkabau culture.',
        type: 'TRADITIONAL_HOUSE' as const,
        category: 'Traditional Architecture',
        location: 'Padang Panjang, West Sumatra',
        latitude: -0.4667,
        longitude: 100.4000,
        province: 'West Sumatra',
        city: 'Padang Panjang',
        unescoStatus: false,
        significance: 'Iconic representation of Minangkabau matriarchal society and architectural heritage.',
        images: ['/images/heritage/minangkabau-1.jpg'],
        openingHours: '09:00 - 17:00 (Daily)',
        entryFee: 'IDR 10,000',
        conservationStatus: 'FAIR' as const,
        threatLevel: 'MODERATE' as const
      },
      {
        name: 'Bagan Si Api-api Archaeological Site',
        description: 'Ancient temple ruins from the Srivijaya period, evidence of early Buddhist civilization.',
        type: 'ARCHAEOLOGICAL_SITE' as const,
        category: 'Archaeological Site',
        location: 'Rokan Hilir, Riau',
        latitude: 2.0833,
        longitude: 101.3500,
        province: 'Riau',
        city: 'Rokan Hilir',
        unescoStatus: false,
        significance: 'Evidence of Srivijaya maritime empire and early Buddhist influence in Sumatra.',
        images: ['/images/heritage/bagan-1.jpg'],
        openingHours: '08:00 - 16:00 (Daily)',
        entryFee: 'IDR 10,000',
        conservationStatus: 'POOR' as const,
        threatLevel: 'HIGH' as const
      },
      {
        name: 'Lake Toba Cultural Landscape',
        description: 'Volcanic lake with traditional Batak villages and unique cultural practices.',
        type: 'CULTURAL_LANDSCAPE' as const,
        category: 'Cultural Landscape',
        location: 'Samosir Island, North Sumatra',
        latitude: 2.6833,
        longitude: 98.8833,
        province: 'North Sumatra',
        city: 'Samosir',
        unescoStatus: false,
        significance: 'Traditional Batak culture, largest volcanic lake in the world, and unique island communities.',
        images: ['/images/heritage/laketoba-1.jpg'],
        openingHours: 'Always accessible',
        entryFee: 'Free',
        conservationStatus: 'GOOD' as const,
        threatLevel: 'MODERATE' as const
      },
      {
        name: 'Dieng Plateau',
        description: 'High-altitude plateau with ancient Hindu temples and unique volcanic landscape.',
        type: 'CULTURAL_LANDSCAPE' as const,
        category: 'Archaeological Site',
        location: 'Dieng, Central Java',
        latitude: -7.2000,
        longitude: 109.9167,
        province: 'Central Java',
        city: 'Wonosobo',
        unescoStatus: false,
        significance: 'Ancient Hindu temple complex at 2,000m altitude with geological significance.',
        images: ['/images/heritage/dieng-1.jpg'],
        openingHours: '06:00 - 18:00 (Daily)',
        entryFee: 'IDR 15,000',
        conservationStatus: 'FAIR' as const,
        threatLevel: 'MODERATE' as const
      }
    ];

    for (const siteData of newSites) {
      const existingSite = await prisma.heritageSite.findFirst({
        where: { name: siteData.name }
      });

      if (!existingSite) {
        await prisma.heritageSite.create({
          data: siteData
        });
        console.log('✅ Created:', siteData.name);
      } else {
        console.log('⏭️  Already exists:', siteData.name);
      }
    }

    console.log('🎉 Additional heritage sites added successfully!');

  } catch (error) {
    console.error('❌ Error adding heritage sites:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addMoreSites()
  .catch((e) => {
    console.error('Script failed:', e);
    process.exit(1);
  });
