/*
  Warnings:

  - You are about to drop the column `createAt` on the `meja` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `meja` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `meja` DROP COLUMN `createAt`,
    DROP COLUMN `updateAt`;
