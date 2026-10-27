-- CreateTable
CREATE TABLE "review_intelligence" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "trustScore" DECIMAL(4,2) NOT NULL,
    "reliabilityTag" TEXT NOT NULL,
    "authenticityBreakdown" JSONB NOT NULL,
    "sentimentDistribution" JSONB NOT NULL,
    "positivePoints" JSONB NOT NULL,
    "complaintPoints" JSONB NOT NULL,
    "sampleReviews" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_intelligence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_intelligence_productId_key" ON "review_intelligence"("productId");

-- AddForeignKey
ALTER TABLE "review_intelligence" ADD CONSTRAINT "review_intelligence_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
