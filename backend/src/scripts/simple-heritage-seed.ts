import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedSimpleHeritageSites() {
  console.log('🌱 Seeding heritage sites...')

  try {
    // Create sample heritage sites
    const borobudur = await prisma.heritageSite.create({
      data: {
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
      }
    })

    const prambanan = await prisma.heritageSite.create({
      data: {
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
      }
    })

    const kraton = await prisma.heritageSite.create({
      data: {
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
      }
    })

    console.log('✅ Created heritage sites:', [borobudur.name, prambanan.name, kraton.name])
    console.log('🎉 Heritage sites seeding completed!')

  } catch (error) {
    console.error('❌ Error seeding heritage sites:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedSimpleHeritageSites()
