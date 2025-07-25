import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const heritageSitesData = [
  {
    id: 'site_borobudur',
    name: 'Borobudur Temple',
    description: 'A 9th-century Mahayana Buddhist temple in Magelang Regency, not far from the town of Muntilan, in Central Java, Indonesia. It is the world\'s largest Buddhist temple.',
    type: 'TEMPLE',
    category: 'Buddhist Temple',
    location: 'Borobudur, Magelang, Central Java',
    address: 'Jl. Badrawati, Kw. Candi Borobudur, Borobudur, Magelang, Central Java 56553',
    latitude: -7.6079,
    longitude: 110.2038,
    province: 'Central Java',
    city: 'Magelang',
    establishedDate: new Date('824-01-01'),
    unescoStatus: true,
    culturalValue: 'Outstanding universal value as a masterpiece of human creative genius and Buddhist art',
    historicalPeriod: 'Sailendra Dynasty (8th-9th century)',
    architecture: 'Javanese Buddhist architecture with mandala concept',
    significance: 'The monument consists of six square platforms topped by three circular platforms and is decorated with 2,672 relief panels and 504 Buddha statues.',
    images: [
      '/images/heritage/borobudur-1.jpg',
      '/images/heritage/borobudur-2.jpg',
      '/images/heritage/borobudur-3.jpg'
    ],
    virtualTourUrl: 'https://borobudurpark.com/virtual-tour',
    officialWebsite: 'https://borobudurpark.com',
    openingHours: '06:00 - 18:00 (Daily)',
    entryFee: 'IDR 50,000 (Domestic), USD 25 (Foreign)',
    bestTimeToVisit: 'April to October (Dry season)',
    accessibility: 'Partially accessible for wheelchair users',
    facilities: ['Parking', 'Restaurant', 'Gift Shop', 'Museum', 'Audio Guide'],
    conservationStatus: 'FAIR',
    threatLevel: 'MODERATE',
    lastAssessment: new Date('2024-10-15')
  },
  {
    id: 'site_prambanan',
    name: 'Prambanan Temple Complex',
    description: 'A 9th-century Hindu temple compound in Special Region of Yogyakarta, Indonesia, dedicated to the Trimurti, the expression of God as the Creator (Brahma), the Preserver (Vishnu) and the Destroyer (Shiva).',
    type: 'TEMPLE',
    category: 'Hindu Temple Complex',
    location: 'Prambanan, Yogyakarta',
    address: 'Jl. Raya Solo - Yogyakarta No.16, Kranggan, Bokoharjo, Prambanan, Sleman Regency, Special Region of Yogyakarta 55571',
    latitude: -7.7520,
    longitude: 110.4914,
    province: 'Special Region of Yogyakarta',
    city: 'Sleman',
    establishedDate: new Date('850-01-01'),
    unescoStatus: true,
    culturalValue: 'Masterpiece of classical Hindu architecture and art in Indonesia',
    historicalPeriod: 'Mataram Kingdom (8th-10th century)',
    architecture: 'Classical Hindu temple architecture with towering spires',
    significance: 'The largest Hindu temple site in Indonesia and one of the largest Hindu temples in Southeast Asia.',
    images: [
      '/images/heritage/prambanan-1.jpg',
      '/images/heritage/prambanan-2.jpg',
      '/images/heritage/prambanan-3.jpg'
    ],
    virtualTourUrl: 'https://prambanan.kemdikbud.go.id/virtual-tour',
    officialWebsite: 'https://prambanan.kemdikbud.go.id',
    openingHours: '06:00 - 18:00 (Daily)',
    entryFee: 'IDR 40,000 (Domestic), USD 25 (Foreign)',
    bestTimeToVisit: 'April to October (Dry season)',
    accessibility: 'Limited accessibility for wheelchair users',
    facilities: ['Parking', 'Restaurant', 'Gift Shop', 'Museum', 'Information Center'],
    conservationStatus: 'GOOD',
    threatLevel: 'MODERATE',
    lastAssessment: new Date('2024-11-20')
  },
  {
    id: 'site_kraton_yogya',
    name: 'Yogyakarta Sultan Palace (Kraton)',
    description: 'The primary royal palace of the Sultanate of Yogyakarta, still functioning as a royal residence and cultural center.',
    type: 'PALACE',
    category: 'Royal Palace',
    location: 'Yogyakarta City Center',
    address: 'Alun-alun Utara No.1, Patehan, Kraton, Yogyakarta City, Special Region of Yogyakarta 55133',
    latitude: -7.8053,
    longitude: 110.3644,
    province: 'Special Region of Yogyakarta',
    city: 'Yogyakarta',
    establishedDate: new Date('1755-01-01'),
    unescoStatus: false,
    culturalValue: 'Living heritage and center of Javanese culture and tradition',
    historicalPeriod: 'Sultanate of Yogyakarta (1755-present)',
    architecture: 'Traditional Javanese palace architecture',
    significance: 'The cultural heart of Yogyakarta and center of Javanese court culture.',
    images: [
      '/images/heritage/kraton-1.jpg',
      '/images/heritage/kraton-2.jpg',
      '/images/heritage/kraton-3.jpg'
    ],
    officialWebsite: 'https://kratonjogja.id',
    openingHours: '09:00 - 14:00 (Closed Friday)',
    entryFee: 'IDR 15,000 (Domestic), IDR 25,000 (Foreign)',
    bestTimeToVisit: 'Year-round, especially during cultural events',
    accessibility: 'Limited accessibility due to traditional architecture',
    facilities: ['Parking', 'Museum', 'Gift Shop', 'Cultural Performances'],
    conservationStatus: 'EXCELLENT',
    threatLevel: 'LOW',
    lastAssessment: new Date('2024-10-05')
  },
  {
    id: 'site_tana_toraja',
    name: 'Tana Toraja Cultural Landscape',
    description: 'Traditional villages in South Sulawesi known for elaborate funeral rites, cliff-carved graves, and distinctive tongkonan houses.',
    type: 'CULTURAL_LANDSCAPE',
    category: 'Traditional Village',
    location: 'Tana Toraja Regency, South Sulawesi',
    address: 'Tana Toraja Regency, South Sulawesi Province, Indonesia',
    latitude: -2.9889,
    longitude: 119.8853,
    province: 'South Sulawesi',
    city: 'Tana Toraja',
    unescoStatus: false,
    culturalValue: 'Unique death rituals and traditional architecture representing Torajan culture',
    historicalPeriod: 'Traditional Torajan culture (centuries old)',
    architecture: 'Distinctive tongkonan houses with boat-shaped roofs',
    significance: 'Preserves ancient Torajan culture, including unique funeral ceremonies and cliff burials.',
    images: [
      '/images/heritage/toraja-1.jpg',
      '/images/heritage/toraja-2.jpg',
      '/images/heritage/toraja-3.jpg'
    ],
    openingHours: 'Always accessible (guided tours recommended)',
    entryFee: 'Free (donations welcome)',
    bestTimeToVisit: 'May to September (Dry season)',
    accessibility: 'Limited due to mountainous terrain',
    facilities: ['Traditional Homestays', 'Local Guides', 'Cultural Centers'],
    conservationStatus: 'GOOD',
    threatLevel: 'MODERATE',
    lastAssessment: new Date('2024-09-12')
  },
  {
    id: 'site_ratu_boko',
    name: 'Ratu Boko Archaeological Park',
    description: 'Archaeological site containing the ruins of a kraton (palace complex) from the 8th-century Mataram Kingdom.',
    type: 'ARCHAEOLOGICAL_SITE',
    category: 'Ancient Palace Complex',
    location: 'Ratu Boko Hill, Yogyakarta',
    address: 'Ratu Boko Hill, Bokoharjo, Prambanan, Sleman Regency, Special Region of Yogyakarta',
    latitude: -7.7713,
    longitude: 110.4891,
    province: 'Special Region of Yogyakarta',
    city: 'Sleman',
    establishedDate: new Date('750-01-01'),
    unescoStatus: false,
    culturalValue: 'Archaeological evidence of ancient Javanese palace architecture',
    historicalPeriod: 'Mataram Kingdom (8th-10th century)',
    architecture: 'Ancient Javanese palace architecture with Hindu-Buddhist influences',
    significance: 'Provides insights into ancient Javanese court life and architectural development.',
    images: [
      '/images/heritage/ratu-boko-1.jpg',
      '/images/heritage/ratu-boko-2.jpg'
    ],
    openingHours: '06:00 - 18:00 (Daily)',
    entryFee: 'IDR 30,000 (Domestic), USD 20 (Foreign)',
    bestTimeToVisit: 'April to October, especially at sunset',
    accessibility: 'Moderate hiking required',
    facilities: ['Parking', 'Information Center', 'Viewing Platform'],
    conservationStatus: 'FAIR',
    threatLevel: 'HIGH',
    lastAssessment: new Date('2024-08-30')
  },
  {
    id: 'site_sangiran',
    name: 'Sangiran Early Man Site',
    description: 'One of the most important prehistoric archaeological sites for understanding human evolution, particularly Homo erectus.',
    type: 'ARCHAEOLOGICAL_SITE',
    category: 'Prehistoric Site',
    location: 'Sangiran, Central Java',
    address: 'Sangiran, Kalijambe, Sragen Regency, Central Java Province',
    latitude: -7.4458,
    longitude: 110.8385,
    province: 'Central Java',
    city: 'Sragen',
    unescoStatus: true,
    culturalValue: 'Outstanding universal value for human evolution studies',
    historicalPeriod: 'Pleistocene epoch (2 million - 200,000 years ago)',
    significance: 'Contains fossils of Homo erectus (Java Man) and provides crucial evidence for human evolution.',
    images: [
      '/images/heritage/sangiran-1.jpg',
      '/images/heritage/sangiran-2.jpg'
    ],
    officialWebsite: 'https://kebudayaan.kemdikbud.go.id/bpsmpsangiran',
    openingHours: '08:00 - 16:00 (Tuesday-Sunday)',
    entryFee: 'IDR 10,000 (Domestic), IDR 15,000 (Foreign)',
    bestTimeToVisit: 'Year-round',
    accessibility: 'Accessible with paved paths',
    facilities: ['Museum', 'Parking', 'Information Center', 'Research Facilities'],
    conservationStatus: 'GOOD',
    threatLevel: 'LOW',
    lastAssessment: new Date('2024-07-18')
  }
]

async function seedHeritageSites() {
  console.log('🌱 Seeding heritage sites...')

  try {
    // Clear existing heritage sites (optional)
    await prisma.siteReview.deleteMany()
    await prisma.siteReport.deleteMany()
    await prisma.heritageSite.deleteMany()

    // Create heritage sites
    for (const siteData of heritageSitesData) {
      await prisma.heritageSite.create({
        data: siteData
      })
      console.log(`✅ Created heritage site: ${siteData.name}`)
    }

    // Create some sample reports and reviews
    const sites = await prisma.heritageSite.findMany()
    const users = await prisma.user.findMany()

    if (users.length > 0 && sites.length > 0) {
      // Create sample reports
      await prisma.siteReport.create({
        data: {
          siteId: sites[0].id,
          reporterId: users[0].id,
          reportType: 'IMPROVEMENT_NEEDED',
          description: 'Some steps need repair for visitor safety',
          urgency: 'MODERATE',
          images: ['/images/reports/borobudur-steps.jpg'],
        }
      })

      // Create sample reviews
      await prisma.siteReview.create({
        data: {
          siteId: sites[0].id,
          reviewerId: users[0].id,
          rating: 5,
          comment: 'Absolutely magnificent! A must-visit UNESCO World Heritage site. The sunrise view is breathtaking.',
          visitDate: new Date('2024-10-01'),
          images: ['/images/reviews/borobudur-sunrise.jpg']
        }
      })

      if (users.length > 1) {
        await prisma.siteReview.create({
          data: {
            siteId: sites[1].id,
            reviewerId: users[1].id,
            rating: 4,
            comment: 'Beautiful Hindu temple complex with impressive architecture. Can get crowded during peak hours.',
            visitDate: new Date('2024-10-15'),
            images: []
          }
        })
      }

      console.log('✅ Created sample reports and reviews')
    }

    console.log('🎉 Heritage sites seeding completed!')

  } catch (error) {
    console.error('❌ Error seeding heritage sites:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export default seedHeritageSites

// Run directly if this file is executed
if (require.main === module) {
  seedHeritageSites()
}
