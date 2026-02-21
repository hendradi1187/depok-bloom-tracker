-- CreateEnum
CREATE TYPE "PlantStatus" AS ENUM ('available', 'sold', 'on_display');

-- AlterTable
ALTER TABLE "plants" ADD COLUMN     "grade" TEXT,
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "status" "PlantStatus" NOT NULL DEFAULT 'available',
ADD COLUMN     "supplier_contact" TEXT NOT NULL DEFAULT '';
