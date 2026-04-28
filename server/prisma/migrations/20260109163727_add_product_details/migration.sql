-- AlterTable
ALTER TABLE "products" ADD COLUMN     "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "variants" TEXT[] DEFAULT ARRAY[]::TEXT[];
