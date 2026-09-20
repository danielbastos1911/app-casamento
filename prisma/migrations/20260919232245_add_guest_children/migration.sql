-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "filhos" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "filhosConfirmados" TEXT[] DEFAULT ARRAY[]::TEXT[];
