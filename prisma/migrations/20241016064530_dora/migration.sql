/*
  Warnings:

  - You are about to drop the column `createAt` on the `meja` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `meja` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `menu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `meja` DROP COLUMN `createAt`,
    DROP COLUMN `updateAt`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `menu` DROP COLUMN `createAt`,
    DROP COLUMN `updateAt`,
    ADD COLUMN `stok` INTEGER NOT NULL DEFAULT 0;
