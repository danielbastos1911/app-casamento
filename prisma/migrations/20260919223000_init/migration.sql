-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventInfo" (
    "id" TEXT NOT NULL,
    "nomeNoivo" TEXT NOT NULL,
    "nomeNoiva" TEXT NOT NULL,
    "dataCasamento" TIMESTAMP(3) NOT NULL,
    "historia" TEXT NOT NULL,
    "cerimoniaLocal" TEXT NOT NULL,
    "cerimoniaEndereco" TEXT NOT NULL,
    "cerimoniaHorario" TEXT NOT NULL,
    "recepcaoLocal" TEXT NOT NULL,
    "recepcaoEndereco" TEXT NOT NULL,
    "recepcaoHorario" TEXT NOT NULL,
    "fotoCapaUrl" TEXT,
    "galeriaUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
