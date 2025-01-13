/*
  Warnings:

  - The primary key for the `neraca_bank` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `uuid` was added to the `neraca_bank` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "neraca_bank" DROP CONSTRAINT "neraca_bank_pkey",
ADD COLUMN     "uuid" TEXT NOT NULL,
ALTER COLUMN "id_pelapor" DROP NOT NULL,
ADD CONSTRAINT "neraca_bank_pkey" PRIMARY KEY ("uuid");
