-- CreateTable
CREATE TABLE "location_requests" (
    "id" BIGSERIAL NOT NULL,
    "partner_id" BIGINT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "region" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "location_requests" ADD CONSTRAINT "location_requests_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
