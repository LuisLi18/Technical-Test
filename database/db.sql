CREATE TABLE `Order` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `orderNumber` VARCHAR(255) NOT NULL,
    `numProducts` INT NOT NULL,
    `finalPrice` DECIMAL(10, 2) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `Product` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `orderId` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `unitPrice` DECIMAL(10, 2) NOT NULL,
    `quantity` INT NOT NULL,
    `finalPrice` DECIMAL(10, 2) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE
);


create las funciones para producto pero con la ruta de un [id] de nextjs para obtener el eliminar por producto específico y 