-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagemUrl" TEXT,
    "valor" DECIMAL(10,2) NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "giftId" TEXT NOT NULL,
    "nomeComprador" TEXT NOT NULL,
    "mensagem" TEXT,
    "valor" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDENTE',
    "metodoPagamento" TEXT,
    "mercadoPagoPreferenceId" TEXT,
    "mercadoPagoPaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_mercadoPagoPaymentId_key" ON "Order"("mercadoPagoPaymentId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
