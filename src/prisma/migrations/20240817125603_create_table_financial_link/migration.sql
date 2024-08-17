/*
  Warnings:

  - You are about to alter the column `valor` on the `contribution` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - Added the required column `entrada` to the `contribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parcelas` to the `contribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorParcela` to the `contribution` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdById` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "contribution" ADD COLUMN     "createdIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entrada" VARCHAR(100) NOT NULL,
ADD COLUMN     "parcelas" VARCHAR(2) NOT NULL,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "valorParcela" VARCHAR(100) NOT NULL,
ALTER COLUMN "valor" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "projectId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "createdIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "contributionId" TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "createdById" SET NOT NULL;

-- CreateTable
CREATE TABLE "financial" (
    "id" TEXT NOT NULL,
    "createdIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(7) NOT NULL,
    "valor" VARCHAR(100) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "pagamento" VARCHAR(100) NOT NULL,
    "vencimento" VARCHAR(2) NOT NULL,
    "contributionId" TEXT,
    "clienteId" VARCHAR(255),

    CONSTRAINT "financial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "financial_id_key" ON "financial"("id");

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial" ADD CONSTRAINT "financial_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial" ADD CONSTRAINT "financial_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
