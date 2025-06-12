-- CreateTable
CREATE TABLE "saves" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "savename" TEXT NOT NULL,
    "savedata" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL,
    "cfv" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "email" TEXT NOT NULL,
    "isadmin" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "creationfiles" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creationfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepageaccordion" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "homepageaccordion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config" (
    "key" TEXT NOT NULL,
    "valueString" TEXT NOT NULL,
    "valueNumber" INTEGER NOT NULL,
    "valueBool" BOOLEAN NOT NULL,
    "valueArray" TEXT[],

    CONSTRAINT "config_pkey" PRIMARY KEY ("key")
);
