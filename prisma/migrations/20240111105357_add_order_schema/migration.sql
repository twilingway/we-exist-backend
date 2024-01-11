-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('FREE', 'CALLBACK', 'EDUCATION');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'WORK', 'PSYCHOLOGIST', 'CANCELLED', 'EXECUTED', 'DELETED');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT ARRAY['USER']::"Role"[];

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "bio" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "userId" TEXT,
    "order_status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "order_type" "OrderType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
