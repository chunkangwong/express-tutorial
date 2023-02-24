-- CreateTable
CREATE TABLE "posts" (
    "user_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

