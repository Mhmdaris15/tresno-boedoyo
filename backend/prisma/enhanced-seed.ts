import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function enhancedSeed() {
  console.log('Starting enhanced database seed...');

  try {
    // Create comprehensive heritage sites
    const heritageSites = [
      {
        name: 'Borobudur Temple',
        description: 'A 9th-century Mahayana Buddhist temple in Magelang Regency, Central Java. The world\'s largest Buddhist temple.',
        type: 'TEMPLE',
        category: 'Buddhist Temple',
        location: 'Borobudur, Magelang, Central Java',
        address: 'Jl. Badrawati, Kw. Candi Borobudur, Borobudur, Magelang, Central Java 56553',
        latitude: -7.6079,
        longitude: 110.2038,
        province: 'Central Java',
        city: 'Magelang',
        unescoStatus: true,
        significance: 'The monument consists of six square platforms topped by three circular platforms and is decorated with 2,672 relief panels and 504 Buddha statues.',
        images: ['/images/heritage/borobudur-1.jpg'],
        openingHours: '06:00 - 18:00 (Daily)',
        entryFee: 'IDR 50,000 (Domestic), USD 25 (Foreign)',
        conservationStatus: 'FAIR',
        threatLevel: 'MODERATE'
      },
      {
        name: 'Prambanan Temple Complex',
        description: 'A 9th-century Hindu temple compound dedicated to the Trimurti: Brahma, Vishnu and Shiva.',
        type: 'TEMPLE',
        category: 'Hindu Temple Complex',
        location: 'Prambanan, Yogyakarta',
        latitude: -7.7520,
        longitude: 110.4914,
        province: 'Special Region of Yogyakarta',
        city: 'Sleman',
        unescoStatus: true,
        significance: 'The largest Hindu temple site in Indonesia and one of the largest Hindu temples in Southeast Asia.',
        images: ['/images/heritage/prambanan-1.jpg'],
        openingHours: '06:00 - 18:00 (Daily)',
        entryFee: 'IDR 40,000 (Domestic), USD 25 (Foreign)',
        conservationStatus: 'GOOD',
        threatLevel: 'MODERATE'
      },
      {
        name: 'Yogyakarta Sultan Palace (Kraton)',
        description: 'The primary royal palace of the Sultanate of Yogyakarta, still functioning as a royal residence.',
        type: 'PALACE',
        category: 'Royal Palace',
        location: 'Yogyakarta City Center',
        latitude: -7.8053,
        longitude: 110.3644,
        province: 'Special Region of Yogyakarta',
        city: 'Yogyakarta',
        unescoStatus: false,
        significance: 'The cultural heart of Yogyakarta and center of Javanese court culture.',
        images: ['/images/heritage/kraton-1.jpg'],
        openingHours: '09:00 - 14:00 (Closed Friday)',
        entryFee: 'IDR 15,000 (Domestic), IDR 25,000 (Foreign)',
        conservationStatus: 'EXCELLENT',
        threatLevel: 'LOW'
      },
      {
        name: 'Tana Toraja Cultural Landscape',
        description: 'Traditional villages known for elaborate funeral rites, cliff graves, and distinctive tongkonan houses.',
        type: 'CULTURAL_LANDSCAPE',
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
        conservationStatus: 'GOOD',
        threatLevel: 'MODERATE'
      },
      {
        name: 'Sangiran Early Man Site',
        description: 'Key archaeological site for understanding human evolution, with fossils dating back 1.5 million years.',
        type: 'ARCHAEOLOGICAL_SITE',
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
        conservationStatus: 'GOOD',
        threatLevel: 'LOW'
      },
      {
        name: 'Komodo National Park',
        description: 'Home to the world\'s largest lizard, the Komodo dragon, and diverse marine life.',
        type: 'NATURAL_HERITAGE',
        category: 'National Park',
        location: 'Komodo Island, East Nusa Tenggara',
        latitude: -8.5833,
        longitude: 119.4833,
        province: 'East Nusa Tenggara',
        city: 'West Manggarai',
        unescoStatus: true,
        significance: 'Critical habitat for the endangered Komodo dragon and rich marine biodiversity.',
        images: ['/images/heritage/komodo-1.jpg'],
        openingHours: '06:00 - 18:00 (Daily)',
        entryFee: 'IDR 150,000 + boat transport',
        conservationStatus: 'GOOD',
        threatLevel: 'HIGH'
      },
      {
        name: 'Ujung Kulon National Park',
        description: 'Last refuge of the critically endangered Javan rhinoceros and pristine tropical rainforest.',
        type: 'NATURAL_HERITAGE',
        category: 'National Park',
        location: 'Ujung Kulon Peninsula, Banten',
        latitude: -6.7667,
        longitude: 105.3667,
        province: 'Banten',
        city: 'Pandeglang',
        unescoStatus: true,
        significance: 'Critical habitat for the Javan rhinoceros, with only 60-70 individuals remaining.',
        images: ['/images/heritage/ujungkulon-1.jpg'],
        openingHours: '08:00 - 16:00 (Daily)',
        entryFee: 'IDR 30,000',
        conservationStatus: 'CRITICAL',
        threatLevel: 'HIGH'
      },
      {
        name: 'Minangkabau Traditional Houses',
        description: 'Traditional rumah gadang houses with distinctive horn-shaped roofs representing Minangkabau culture.',
        type: 'TRADITIONAL_ARCHITECTURE',
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
        conservationStatus: 'FAIR',
        threatLevel: 'MODERATE'
      },
      {
        name: 'Bagan Si Api-api Archaeological Site',
        description: 'Ancient temple ruins from the Srivijaya period, evidence of early Buddhist civilization.',
        type: 'ARCHAEOLOGICAL_SITE',
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
        conservationStatus: 'POOR',
        threatLevel: 'HIGH'
      },
      {
        name: 'Lake Toba Cultural Landscape',
        description: 'Volcanic lake with traditional Batak villages and unique cultural practices.',
        type: 'CULTURAL_LANDSCAPE',
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
        conservationStatus: 'GOOD',
        threatLevel: 'MODERATE'
      },
      {
        name: 'Dieng Plateau',
        description: 'High-altitude plateau with ancient Hindu temples and unique volcanic landscape.',
        type: 'CULTURAL_LANDSCAPE',
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
        conservationStatus: 'FAIR',
        threatLevel: 'MODERATE'
      },
      {
        name: 'Candi Sukuh',
        description: '15th-century Javanese-Hindu temple with unique pyramid architecture and fertility symbols.',
        type: 'TEMPLE',
        category: 'Hindu Temple',
        location: 'Sukuh, Central Java',
        latitude: -7.6333,
        longitude: 111.1167,
        province: 'Central Java',
        city: 'Karanganyar',
        unescoStatus: false,
        significance: 'Unique pyramid-style temple with fertility symbolism, representing late Majapahit period.',
        images: ['/images/heritage/sukuh-1.jpg'],
        openingHours: '07:00 - 17:00 (Daily)',
        entryFee: 'IDR 10,000',
        conservationStatus: 'GOOD',
        threatLevel: 'LOW'
      }
    ];

    console.log('Adding comprehensive heritage sites...');
    
    for (const siteData of heritageSites) {
      await prisma.heritageSite.upsert({
        where: { name: siteData.name },
        update: {},
        create: siteData
      });
    }

    console.log('Enhanced heritage sites created:', heritageSites.length);

    // Add more diverse volunteer opportunities
    const additionalOpportunities = [
      {
        title: 'Komodo Dragon Research Support',
        description: 'Assist marine biologists and conservationists in Komodo National Park with research data collection and eco-tourism education.',
        type: 'RESEARCH',
        location: 'Komodo Island, East Nusa Tenggara',
        startDate: '2025-09-15',
        endDate: '2025-09-22',
        maxParticipants: 8,
        requirements: 'Marine biology background preferred, swimming ability, field research experience',
        benefits: 'Marine conservation certification, research publication opportunity, diving certification',
        impactStatement: 'Support critical research for endangered species conservation',
        duration: 12
      },
      {
        title: 'Toraja Cultural Documentation',
        description: 'Document traditional Toraja ceremonies, architecture, and oral histories for cultural preservation.',
        type: 'DOCUMENTATION',
        location: 'Tana Toraja, South Sulawesi',
        startDate: '2025-08-20',
        endDate: '2025-08-27',
        maxParticipants: 12,
        requirements: 'Anthropology or cultural studies background, video/audio recording skills, cultural sensitivity',
        benefits: 'Cultural immersion, documentation skills training, academic collaboration',
        impactStatement: 'Preserve intangible cultural heritage for future generations',
        duration: 10
      },
      {
        title: 'Sangiran Fossil Excavation',
        description: 'Participate in archaeological excavations at Sangiran Early Man Site with international research teams.',
        type: 'RESEARCH',
        location: 'Sangiran, Central Java',
        startDate: '2025-10-01',
        endDate: '2025-10-14',
        maxParticipants: 15,
        requirements: 'Archaeology or geology background, physical fitness, precision work skills',
        benefits: 'Archaeological certification, field excavation training, research collaboration',
        impactStatement: 'Contribute to understanding human evolution in Southeast Asia',
        duration: 8
      },
      {
        title: 'Minangkabau Architecture Conservation',
        description: 'Help restore traditional rumah gadang structures using traditional building techniques.',
        type: 'MAINTENANCE',
        location: 'Padang Panjang, West Sumatra',
        startDate: '2025-09-05',
        endDate: '2025-09-19',
        maxParticipants: 20,
        requirements: 'Construction or carpentry skills, traditional building interest, physical fitness',
        benefits: 'Traditional architecture training, craftsmanship certification, cultural exchange',
        impactStatement: 'Preserve unique architectural heritage of Minangkabau people',
        duration: 8
      },
      {
        title: 'Lake Toba Sustainable Tourism',
        description: 'Develop eco-tourism programs for Batak villages around Lake Toba.',
        type: 'EDUCATION',
        location: 'Samosir Island, North Sumatra',
        startDate: '2025-11-01',
        endDate: '2025-11-15',
        maxParticipants: 18,
        requirements: 'Tourism or hospitality background, community engagement skills, language abilities',
        benefits: 'Sustainable tourism certification, community development experience, cultural exchange',
        impactStatement: 'Support local communities through responsible cultural tourism',
        duration: 6
      }
    ];

    console.log('Enhanced database seeding completed!');

  } catch (error) {
    console.error('Error in enhanced seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the enhanced seed function
enhancedSeed()
  .catch((e) => {
    console.error('Enhanced seed failed:', e);
    process.exit(1);
  });
