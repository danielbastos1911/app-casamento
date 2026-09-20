-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('PENDENTE', 'CONFIRMADO', 'RECUSADO');

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "codigoConvite" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "grupo" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "acompanhantesPermitidos" INTEGER NOT NULL DEFAULT 0,
    "acompanhantesConfirmados" INTEGER NOT NULL DEFAULT 0,
    "restricaoAlimentar" TEXT,
    "mensagem" TEXT,
    "status" "RsvpStatus" NOT NULL DEFAULT 'PENDENTE',
    "respondidoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_codigoConvite_key" ON "Guest"("codigoConvite");
