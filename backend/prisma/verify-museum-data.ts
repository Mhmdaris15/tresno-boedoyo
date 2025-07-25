import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyMuseumData() {
  console.log('🔍 Verifying museum data...');

  try {
    // Check museums
    const museums = await prisma.museum.findMany({
      include: {
        artifacts: true,
        tours: true
      }
    });

    console.log('\n📍 Museums found:', museums.length);
    museums.forEach(museum => {
      console.log(`  - ${museum.name} (${museum.artifacts.length} artifacts, ${museum.tours.length} tours)`);
      console.log(`    Address: ${museum.address}, ${museum.city}`);
      console.log(`    Floor Plan: ${museum.floorPlanWidth}m x ${museum.floorPlanHeight}m`);
    });

    // Check artifacts
    const artifacts = await prisma.artifact.findMany({
      include: {
        museum: {
          select: { name: true }
        }
      }
    });

    console.log('\n🏺 Artifacts found:', artifacts.length);
    artifacts.forEach(artifact => {
      console.log(`  - ${artifact.name} (${artifact.category})`);
      console.log(`    Museum: ${artifact.museum.name}`);
      console.log(`    Position: (${artifact.xPosition}, ${artifact.yPosition}) on floor ${artifact.floor}`);
      console.log(`    Duration: ${artifact.estimatedDuration} minutes`);
    });

    // Check tours
    const tours = await prisma.tour.findMany({
      include: {
        museum: {
          select: { name: true }
        },
        stops: {
          include: {
            artifact: {
              select: { name: true }
            }
          }
        }
      }
    });

    console.log('\n🚶 Tours found:', tours.length);
    tours.forEach(tour => {
      console.log(`  - ${tour.title}`);
      console.log(`    Museum: ${tour.museum.name}`);
      console.log(`    Duration: ${tour.estimatedDuration} minutes, Max participants: ${tour.maxParticipants}`);
      console.log(`    Stops: ${tour.stops.length}`);
      tour.stops.forEach(stop => {
        console.log(`      ${stop.stopOrder}. ${stop.artifact.name} (${stop.estimatedTime} min)`);
      });
    });

    console.log('\n✅ Museum data verification completed!');

  } catch (error) {
    console.error('❌ Error verifying museum data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyMuseumData();
