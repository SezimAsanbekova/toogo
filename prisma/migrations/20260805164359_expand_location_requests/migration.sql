-- AlterTable
ALTER TABLE "location_requests" ADD COLUMN     "altitude" INTEGER,
ADD COLUMN     "best_season" VARCHAR(20),
ADD COLUMN     "difficulty" VARCHAR(20),
ADD COLUMN     "distance_km" INTEGER,
ADD COLUMN     "recommendations" TEXT,
ADD COLUMN     "travel_time" VARCHAR(50),
ADD COLUMN     "visit_price" DECIMAL(10,2);

-- CreateTable
CREATE TABLE "location_request_photos" (
    "id" BIGSERIAL NOT NULL,
    "request_id" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_request_photos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "location_request_photos" ADD CONSTRAINT "location_request_photos_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "location_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
