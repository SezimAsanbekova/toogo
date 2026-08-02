-- CreateTable
CREATE TABLE "admin_otp" (
    "id" UUID NOT NULL,
    "user_id" BIGINT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_otp_user_id_key" ON "admin_otp"("user_id");

-- AddForeignKey
ALTER TABLE "admin_otp" ADD CONSTRAINT "admin_otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
