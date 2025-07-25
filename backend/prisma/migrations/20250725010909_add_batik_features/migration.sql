-- CreateTable
CREATE TABLE "generated_batiks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "originalPrompt" TEXT NOT NULL,
    "motif" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "colors" TEXT[],
    "region" TEXT NOT NULL,
    "complexity" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageBase64" TEXT,
    "inGallery" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generated_batiks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batik_gallery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "batikId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "likes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batik_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batik_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "batik_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batik_comments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batik_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batik_collections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batik_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batik_collection_items" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "batikId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "batik_collection_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_generation_limits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthlyLimit" INTEGER NOT NULL DEFAULT 5,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "lastResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalGenerated" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_generation_limits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batik_gallery_userId_batikId_key" ON "batik_gallery"("userId", "batikId");

-- CreateIndex
CREATE UNIQUE INDEX "batik_likes_userId_galleryId_key" ON "batik_likes"("userId", "galleryId");

-- CreateIndex
CREATE UNIQUE INDEX "batik_collection_items_collectionId_batikId_key" ON "batik_collection_items"("collectionId", "batikId");

-- CreateIndex
CREATE UNIQUE INDEX "user_generation_limits_userId_key" ON "user_generation_limits"("userId");

-- AddForeignKey
ALTER TABLE "generated_batiks" ADD CONSTRAINT "generated_batiks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batik_gallery" ADD CONSTRAINT "batik_gallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batik_gallery" ADD CONSTRAINT "batik_gallery_batikId_fkey" FOREIGN KEY ("batikId") REFERENCES "generated_batiks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batik_likes" ADD CONSTRAINT "batik_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batik_likes" ADD CONSTRAINT "batik_likes_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "batik_gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batik_comments" ADD CONSTRAINT "batik_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batik_comments" ADD CONSTRAINT "batik_comments_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "batik_gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batik_collections" ADD CONSTRAINT "batik_collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batik_collection_items" ADD CONSTRAINT "batik_collection_items_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "batik_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batik_collection_items" ADD CONSTRAINT "batik_collection_items_batikId_fkey" FOREIGN KEY ("batikId") REFERENCES "generated_batiks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_generation_limits" ADD CONSTRAINT "user_generation_limits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
