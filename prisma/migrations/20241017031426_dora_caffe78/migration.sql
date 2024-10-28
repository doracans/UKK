/*
  Warnings:

  - You are about to alter the column `status` on the `meja` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `meja` MODIFY `status` ENUM('belum', 'lunas') NOT NULL;
