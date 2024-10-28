/*
  Warnings:

  - You are about to drop the column `status` on the `meja` table. All the data in the column will be lost.
  - Added the required column `status_meja` to the `meja` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `meja` DROP COLUMN `status`,
    ADD COLUMN `status_meja` ENUM('tersedia', 'taksedia') NOT NULL;
