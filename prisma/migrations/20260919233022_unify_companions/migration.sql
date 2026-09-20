/*
  Warnings:

  - You are about to drop the column `acompanhantesPermitidos` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `filhos` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `filhosConfirmados` on the `Guest` table. All the data in the column will be lost.
  - The `acompanhantesConfirmados` column on the `Guest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "acompanhantesPermitidos",
DROP COLUMN "filhos",
DROP COLUMN "filhosConfirmados",
ADD COLUMN     "acompanhantes" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "acompanhantesConfirmados",
ADD COLUMN     "acompanhantesConfirmados" TEXT[] DEFAULT ARRAY[]::TEXT[];
