-- CreateTable
CREATE TABLE `user` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_user` VARCHAR(191) NOT NULL DEFAULT '',
    `role` ENUM('manajer', 'admin', 'kasir') NOT NULL,
    `username` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi` (
    `id_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `tgl_transaksi` VARCHAR(191) NOT NULL DEFAULT '',
    `id_user` INTEGER NOT NULL DEFAULT 0,
    `id_meja` INTEGER NOT NULL DEFAULT 0,
    `nama_pelanggan` VARCHAR(191) NOT NULL DEFAULT '',
    `status` ENUM('belum', 'lunas') NOT NULL,
    `total_bayar` INTEGER NOT NULL DEFAULT 0,

    INDEX `transaksi_id_meja_fkey`(`id_meja`),
    INDEX `transaksi_id_user_fkey`(`id_user`),
    PRIMARY KEY (`id_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_transaksi` (
    `id_detail_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_transaksi` INTEGER NOT NULL DEFAULT 0,
    `id_menu` INTEGER NOT NULL DEFAULT 0,
    `harga` INTEGER NOT NULL DEFAULT 0,
    `quantity` INTEGER NOT NULL DEFAULT 0,

    INDEX `detail_transaksi_id_menu_fkey`(`id_menu`),
    INDEX `detail_transaksi_id_transaksi_fkey`(`id_transaksi`),
    PRIMARY KEY (`id_detail_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meja` (
    `id_meja` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_meja` VARCHAR(191) NOT NULL DEFAULT '',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_meja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu` (
    `id_menu` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_menu` VARCHAR(191) NOT NULL DEFAULT '',
    `jenis` ENUM('makanan', 'minuman') NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL DEFAULT '',
    `gambar` VARCHAR(191) NOT NULL DEFAULT '',
    `harga` INTEGER NOT NULL DEFAULT 0,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_menu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_id_meja_fkey` FOREIGN KEY (`id_meja`) REFERENCES `meja`(`id_meja`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transaksi` ADD CONSTRAINT `detail_transaksi_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id_menu`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transaksi` ADD CONSTRAINT `detail_transaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi`(`id_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;
