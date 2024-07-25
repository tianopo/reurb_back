-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "createdIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "acesso" VARCHAR(20) NOT NULL,
    "token" TEXT NOT NULL,
    "cpf" VARCHAR(14),
    "profissao" VARCHAR(100),
    "telefone" VARCHAR(15),
    "rg" VARCHAR(12),
    "estadoCivil" VARCHAR(25),
    "cep" VARCHAR(20),
    "rua" VARCHAR(255),
    "numero" VARCHAR(25),
    "bairro" VARCHAR(100),
    "complemento" VARCHAR(100),
    "estado" VARCHAR(2),
    "loteAtual" VARCHAR(50),
    "loteNovo" VARCHAR(50),
    "quadraAtual" VARCHAR(50),
    "quadraNova" VARCHAR(50),
    "totalRendaFamiliar" TEXT,
    "nomeConjuge" VARCHAR(255),
    "rgConjuge" VARCHAR(12),
    "cpfConjuge" VARCHAR(14),
    "profissaoConjuge" VARCHAR(100),
    "telefoneConjuge" VARCHAR(15),
    "emailConjuge" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_cpf_key" ON "user"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "user_rg_key" ON "user"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "user_rgConjuge_key" ON "user"("rgConjuge");

-- CreateIndex
CREATE UNIQUE INDEX "user_cpfConjuge_key" ON "user"("cpfConjuge");

-- CreateIndex
CREATE UNIQUE INDEX "user_emailConjuge_key" ON "user"("emailConjuge");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_cpf_idx" ON "user"("cpf");

-- CreateIndex
CREATE INDEX "user_rg_idx" ON "user"("rg");

-- CreateIndex
CREATE INDEX "user_cpfConjuge_idx" ON "user"("cpfConjuge");

-- CreateIndex
CREATE INDEX "user_rgConjuge_idx" ON "user"("rgConjuge");

-- CreateIndex
CREATE INDEX "user_emailConjuge_idx" ON "user"("emailConjuge");
