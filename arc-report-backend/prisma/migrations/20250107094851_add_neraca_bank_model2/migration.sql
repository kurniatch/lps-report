/*
  Warnings:

  - The primary key for the `neraca_bank` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `id_pelapor` on table `neraca_bank` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "neraca_bank" DROP CONSTRAINT "neraca_bank_pkey",
ALTER COLUMN "id_pelapor" SET NOT NULL,
ALTER COLUMN "pos_laporan_keuangan" DROP NOT NULL,
ADD CONSTRAINT "neraca_bank_pkey" PRIMARY KEY ("id_pelapor");
