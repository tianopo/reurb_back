-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "createdIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descricao" VARCHAR(255) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "prioridade" VARCHAR(20) NOT NULL,
    "projeto" VARCHAR(255) NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TaskUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "task_id_key" ON "task"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_TaskUsers_AB_unique" ON "_TaskUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_TaskUsers_B_index" ON "_TaskUsers"("B");

-- AddForeignKey
ALTER TABLE "_TaskUsers" ADD CONSTRAINT "_TaskUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskUsers" ADD CONSTRAINT "_TaskUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
