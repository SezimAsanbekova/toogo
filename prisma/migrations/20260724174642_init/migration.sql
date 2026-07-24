-- CreateEnum
CREATE TYPE "Role" AS ENUM ('partner', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'blocked');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "BestSeason" AS ENUM ('spring', 'summer', 'autumn', 'winter', 'all_year');

-- CreateEnum
CREATE TYPE "LocationStatus" AS ENUM ('active', 'hidden');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('pending', 'approved', 'rejected', 'deleted');

-- CreateEnum
CREATE TYPE "ModerationAction" AS ENUM ('approved', 'rejected', 'deleted');

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" VARCHAR(20),
    "whatsapp" VARCHAR(20),
    "telegram" VARCHAR(100),
    "role" "Role" NOT NULL DEFAULT 'partner',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" BIGSERIAL NOT NULL,
    "region_id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "altitude" INTEGER,
    "distance_km" INTEGER,
    "travel_time" VARCHAR(50),
    "difficulty" "Difficulty",
    "visit_price" DECIMAL(10,2),
    "best_season" "BestSeason",
    "recommendations" TEXT,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "status" "LocationStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_photos" (
    "id" BIGSERIAL NOT NULL,
    "location_id" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "location_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_services" (
    "id" BIGSERIAL NOT NULL,
    "partner_id" BIGINT NOT NULL,
    "location_id" BIGINT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "currency" VARCHAR(10),
    "phone" VARCHAR(20),
    "whatsapp" VARCHAR(20),
    "telegram" VARCHAR(100),
    "status" "ServiceStatus" NOT NULL DEFAULT 'pending',
    "reject_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "approved_at" TIMESTAMP(3),

    CONSTRAINT "partner_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_photos" (
    "id" BIGSERIAL NOT NULL,
    "service_id" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "service_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_cache" (
    "id" BIGSERIAL NOT NULL,
    "location_id" BIGINT NOT NULL,
    "temperature" DECIMAL(4,1),
    "weather_condition" VARCHAR(100),
    "wind_speed" DECIMAL(4,1),
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weather_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_history" (
    "id" BIGSERIAL NOT NULL,
    "service_id" BIGINT NOT NULL,
    "admin_id" BIGINT NOT NULL,
    "action" "ModerationAction" NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "regions_name_key" ON "regions"("name");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_photos" ADD CONSTRAINT "location_photos_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_services" ADD CONSTRAINT "partner_services_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_services" ADD CONSTRAINT "partner_services_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_services" ADD CONSTRAINT "partner_services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_photos" ADD CONSTRAINT "service_photos_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "partner_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weather_cache" ADD CONSTRAINT "weather_cache_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_history" ADD CONSTRAINT "moderation_history_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "partner_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_history" ADD CONSTRAINT "moderation_history_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
