-- CreateEnum
CREATE TYPE "HeritageSiteType" AS ENUM ('TEMPLE', 'PALACE', 'TRADITIONAL_VILLAGE', 'ARCHAEOLOGICAL_SITE', 'CULTURAL_LANDSCAPE', 'MONUMENT', 'MUSEUM', 'TRADITIONAL_HOUSE', 'SACRED_SITE', 'CULTURAL_CENTER');

-- CreateEnum
CREATE TYPE "ConservationStatus" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ThreatLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('DAMAGE', 'VANDALISM', 'NATURAL_DETERIORATION', 'IMPROVEMENT_NEEDED', 'POSITIVE_OBSERVATION', 'SAFETY_CONCERN');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ArtifactCategory" AS ENUM ('SCULPTURE', 'PAINTING', 'TEXTILE', 'POTTERY', 'JEWELRY', 'WEAPON', 'MANUSCRIPT', 'RELIGIOUS_OBJECT', 'ARCHAEOLOGICAL_FIND', 'TRADITIONAL_TOOL', 'INTERACTIVE_DISPLAY', 'MULTIMEDIA');

-- CreateEnum
CREATE TYPE "TourStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "opportunities" ADD COLUMN     "heritageSiteId" TEXT;

-- CreateTable
CREATE TABLE "heritage_sites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "HeritageSiteType" NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "establishedDate" TIMESTAMP(3),
    "unescoStatus" BOOLEAN NOT NULL DEFAULT false,
    "culturalValue" TEXT,
    "historicalPeriod" TEXT,
    "architecture" TEXT,
    "significance" TEXT,
    "images" TEXT[],
    "virtualTourUrl" TEXT,
    "officialWebsite" TEXT,
    "openingHours" TEXT,
    "entryFee" TEXT,
    "bestTimeToVisit" TEXT,
    "accessibility" TEXT,
    "facilities" TEXT[],
    "conservationStatus" "ConservationStatus" NOT NULL DEFAULT 'GOOD',
    "threatLevel" "ThreatLevel" NOT NULL DEFAULT 'LOW',
    "lastAssessment" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "heritage_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_reports" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportType" "ReportType" NOT NULL,
    "description" TEXT NOT NULL,
    "urgency" "UrgencyLevel" NOT NULL DEFAULT 'LOW',
    "images" TEXT[],
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_reviews" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "visitDate" TIMESTAMP(3),
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "museums" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "description" TEXT,
    "floorPlanImage" TEXT,
    "floorPlanWidth" DOUBLE PRECISION,
    "floorPlanHeight" DOUBLE PRECISION,
    "openingHours" TEXT,
    "contactInfo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "museums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artifacts" (
    "id" TEXT NOT NULL,
    "museumId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ArtifactCategory" NOT NULL,
    "origin" TEXT,
    "period" TEXT,
    "materials" TEXT[],
    "significance" TEXT,
    "talkingPoints" TEXT[],
    "images" TEXT[],
    "xPosition" DOUBLE PRECISION NOT NULL,
    "yPosition" DOUBLE PRECISION NOT NULL,
    "floor" INTEGER NOT NULL DEFAULT 1,
    "acquisitionDate" TIMESTAMP(3),
    "isDisplayed" BOOLEAN NOT NULL DEFAULT true,
    "estimatedDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tours" (
    "id" TEXT NOT NULL,
    "museumId" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "estimatedDuration" INTEGER NOT NULL,
    "maxParticipants" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "status" "TourStatus" NOT NULL DEFAULT 'DRAFT',
    "startPointX" DOUBLE PRECISION,
    "startPointY" DOUBLE PRECISION,
    "endPointX" DOUBLE PRECISION,
    "endPointY" DOUBLE PRECISION,
    "optimizedPath" JSONB,
    "aiNarrative" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_stops" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,
    "stopOrder" INTEGER NOT NULL,
    "estimatedTime" INTEGER,
    "customNotes" TEXT,
    "aiTransition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_stops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_reviews_siteId_reviewerId_key" ON "site_reviews"("siteId", "reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "tour_stops_tourId_stopOrder_key" ON "tour_stops"("tourId", "stopOrder");

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_heritageSiteId_fkey" FOREIGN KEY ("heritageSiteId") REFERENCES "heritage_sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_reports" ADD CONSTRAINT "site_reports_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "heritage_sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_reports" ADD CONSTRAINT "site_reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_reviews" ADD CONSTRAINT "site_reviews_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "heritage_sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_reviews" ADD CONSTRAINT "site_reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tours" ADD CONSTRAINT "tours_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tours" ADD CONSTRAINT "tours_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_stops" ADD CONSTRAINT "tour_stops_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_stops" ADD CONSTRAINT "tour_stops_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "artifacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
