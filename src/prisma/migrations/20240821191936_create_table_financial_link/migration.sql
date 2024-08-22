/*
  Warnings:

  - You are about to drop the column `projeto` on the `task` table. All the data in the column will be lost.
  - Made the column `createdById` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "projeto",
ADD COLUMN     "contributionId" TEXT,
ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "createdById" SET NOT NULL;

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "createdIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "valorTotal" VARCHAR(255) NOT NULL,
    "valorAcumulado" VARCHAR(255) NOT NULL,
    "dataInicio" VARCHAR(255) NOT NULL,
    "status" VARCHAR(16) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contribution" (
    "id" TEXT NOT NULL,
    "createdIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" VARCHAR(100) NOT NULL,
    "entrada" VARCHAR(100) NOT NULL,
    "parcelas" VARCHAR(2) NOT NULL,
    "valorParcela" VARCHAR(100) NOT NULL,
    "userId" TEXT,
    "projectId" TEXT,

    CONSTRAINT "contribution_pkey" PRIMARY KEY ("id")
);

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
    "vencimento" VARCHAR(2),
    "contributionId" TEXT,
    "clienteId" VARCHAR(255),

    CONSTRAINT "financial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectEmployees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectClients" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "project_id_key" ON "project"("id");

-- CreateIndex
CREATE UNIQUE INDEX "contribution_id_key" ON "contribution"("id");

-- CreateIndex
CREATE UNIQUE INDEX "financial_id_key" ON "financial"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectEmployees_AB_unique" ON "_ProjectEmployees"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectEmployees_B_index" ON "_ProjectEmployees"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectClients_AB_unique" ON "_ProjectClients"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectClients_B_index" ON "_ProjectClients"("B");

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribution" ADD CONSTRAINT "contribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribution" ADD CONSTRAINT "contribution_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial" ADD CONSTRAINT "financial_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial" ADD CONSTRAINT "financial_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectEmployees" ADD CONSTRAINT "_ProjectEmployees_A_fkey" FOREIGN KEY ("A") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectEmployees" ADD CONSTRAINT "_ProjectEmployees_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectClients" ADD CONSTRAINT "_ProjectClients_A_fkey" FOREIGN KEY ("A") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectClients" ADD CONSTRAINT "_ProjectClients_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
