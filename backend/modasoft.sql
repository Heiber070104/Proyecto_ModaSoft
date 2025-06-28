-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 28, 2025 at 04:14 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `modasoft`
--

-- --------------------------------------------------------

--
-- Table structure for table `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre`) VALUES
(1, 'Camisa'),
(2, 'Pantalón'),
(3, 'Zapato');

-- --------------------------------------------------------

--
-- Table structure for table `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL,
  `cedula` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `cedula`, `nombre`, `direccion`, `telefono`, `correo`) VALUES
(1, 30324605, 'Juliet Escalona', 'Calle 23', '04145539006', 'julietescalona04@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `compra`
--

CREATE TABLE `compra` (
  `id_compra` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `id_proveedor` int DEFAULT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `estado` enum('pendiente','pagada','cancelada') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `compra`
--

INSERT INTO `compra` (`id_compra`, `fecha`, `id_proveedor`, `total`, `estado`) VALUES
(12, '2025-06-08', 1, '20.00', 'pendiente'),
(13, '2025-06-27', 2, '230.00', 'pagada');

-- --------------------------------------------------------

--
-- Table structure for table `cuentas_cobrar`
--

CREATE TABLE `cuentas_cobrar` (
  `id_cuenta_cobrar` int NOT NULL,
  `id_venta` int DEFAULT NULL,
  `monto` decimal(12,2) DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `estado` enum('pendiente','cobrado') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cuentas_pagar`
--

CREATE TABLE `cuentas_pagar` (
  `id_cuenta_pagar` int NOT NULL,
  `id_compra` int DEFAULT NULL,
  `monto` decimal(12,2) DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `estado` enum('pendiente','pagado') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detalle_compra`
--

CREATE TABLE `detalle_compra` (
  `id_detalle_compra` int NOT NULL,
  `id_compra` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_compra` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detalle_compra`
--

INSERT INTO `detalle_compra` (`id_detalle_compra`, `id_compra`, `id_producto`, `cantidad`, `precio_compra`) VALUES
(12, 12, 20, 1, '20.00'),
(13, 13, 20, 3, '180.00'),
(14, 13, 19, 2, '50.00');

-- --------------------------------------------------------

--
-- Table structure for table `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id_detalle_venta` int NOT NULL,
  `id_venta` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `devolucion`
--

CREATE TABLE `devolucion` (
  `id_devolucion` int NOT NULL,
  `id_venta` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `motivo` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventario`
--

CREATE TABLE `inventario` (
  `id_inventario` int NOT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad_disponible` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventario`
--

INSERT INTO `inventario` (`id_inventario`, `id_producto`, `cantidad_disponible`) VALUES
(1, 1, 4),
(2, 2, 5),
(3, 18, 10),
(4, 19, 3),
(5, 20, 19);

-- --------------------------------------------------------

--
-- Table structure for table `libro_contable`
--

CREATE TABLE `libro_contable` (
  `id_libro` int NOT NULL,
  `fecha` date NOT NULL,
  `tipo` enum('diario','mayor') COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `monto` decimal(12,2) NOT NULL,
  `id_compra` int DEFAULT NULL,
  `id_venta` int DEFAULT NULL,
  `id_devolucion` int DEFAULT NULL,
  `id_usuario` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `producto`
--

CREATE TABLE `producto` (
  `id_producto` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `id_categoria` int DEFAULT NULL,
  `id_talla` int DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`, `descripcion`, `precio_unitario`, `id_categoria`, `id_talla`, `deleted_at`) VALUES
(1, 'Pantalon grande', 'Grande', '15.00', 2, 1, '2025-06-22 04:25:34'),
(2, 'Camisa Pequeña', 'Pequeña', '5.00', 1, 2, '2025-06-21 00:40:08'),
(18, 'Pantalón jeans', 'Pantalón de mezclilla para hombre', '20.00', 1, 2, '2025-06-02 00:37:37'),
(19, 'Camisa formal', 'Camisa de manga larga', '25.00', 2, 1, NULL),
(20, 'Chaqueta acolchada', 'Ideal para invierno', '60.00', 3, 3, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `proveedor`
--

INSERT INTO `proveedor` (`id_proveedor`, `nombre`, `direccion`, `telefono`, `correo`) VALUES
(1, 'Gallo Cotorrero, C.A', 'Calle 12', '04123453234', 'cotorra@gmail.com'),
(2, 'Cositas, C.A', 'Calle 15', '041234534553', 'cosas@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `sesiones`
--

CREATE TABLE `sesiones` (
  `id_sesion` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `fecha_ultimo_acceso` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `conectado` tinyint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sesiones`
--

INSERT INTO `sesiones` (`id_sesion`, `id_usuario`, `fecha_ultimo_acceso`, `conectado`) VALUES
(2, 2, '2025-06-09 00:12:14', 0),
(4, 4, '2025-06-27 19:26:16', 1);

-- --------------------------------------------------------

--
-- Table structure for table `talla`
--

CREATE TABLE `talla` (
  `id_talla` int NOT NULL,
  `descripcion` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `talla`
--

INSERT INTO `talla` (`id_talla`, `descripcion`) VALUES
(1, 'X'),
(2, 'XL'),
(3, 'XZ'),
(4, 'XX'),
(5, 'XM'),
(6, 'XC');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL,
  `nombre_usuario` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre_personal` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rol` enum('Administrador','Vendedor','Contador') COLLATE utf8mb4_general_ci DEFAULT 'Vendedor',
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre_usuario`, `nombre_personal`, `correo`, `rol`, `password`, `activo`) VALUES
(2, 'Gerardo', 'Gerardo Jiménez', 'jimenez@gmail.com', 'Administrador', '$2b$10$AfOVv1ji9ymlt78AKRK3AeewLbbbNUqblKFFQ4QFxJZdV0eUzz6le', 1),
(4, 'Heiber', 'Heiber Morán', 'heiber@gmail.com', 'Administrador', '$2y$12$YG4Z7UW19Ufz/yjLeA.AQ.Irj0sf.1hy38RDs34EIzWBWyaym2BNW', 1);

-- --------------------------------------------------------

--
-- Table structure for table `venta`
--

CREATE TABLE `venta` (
  `id_venta` int NOT NULL,
  `id_producto` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `id_cliente` int DEFAULT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `estado` enum('en_proceso','completada','cancelada') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indexes for table `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indexes for table `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indexes for table `cuentas_cobrar`
--
ALTER TABLE `cuentas_cobrar`
  ADD PRIMARY KEY (`id_cuenta_cobrar`),
  ADD KEY `id_venta` (`id_venta`);

--
-- Indexes for table `cuentas_pagar`
--
ALTER TABLE `cuentas_pagar`
  ADD PRIMARY KEY (`id_cuenta_pagar`),
  ADD KEY `id_compra` (`id_compra`);

--
-- Indexes for table `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD PRIMARY KEY (`id_detalle_compra`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indexes for table `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id_detalle_venta`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indexes for table `devolucion`
--
ALTER TABLE `devolucion`
  ADD PRIMARY KEY (`id_devolucion`),
  ADD KEY `id_venta` (`id_venta`);

--
-- Indexes for table `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indexes for table `libro_contable`
--
ALTER TABLE `libro_contable`
  ADD PRIMARY KEY (`id_libro`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_devolucion` (`id_devolucion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_talla` (`id_talla`);

--
-- Indexes for table `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indexes for table `sesiones`
--
ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`id_sesion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `talla`
--
ALTER TABLE `talla`
  ADD PRIMARY KEY (`id_talla`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`);

--
-- Indexes for table `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_producto` (`id_producto`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `compra`
--
ALTER TABLE `compra`
  MODIFY `id_compra` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `cuentas_cobrar`
--
ALTER TABLE `cuentas_cobrar`
  MODIFY `id_cuenta_cobrar` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cuentas_pagar`
--
ALTER TABLE `cuentas_pagar`
  MODIFY `id_cuenta_pagar` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `detalle_compra`
--
ALTER TABLE `detalle_compra`
  MODIFY `id_detalle_compra` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id_detalle_venta` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `devolucion`
--
ALTER TABLE `devolucion`
  MODIFY `id_devolucion` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `libro_contable`
--
ALTER TABLE `libro_contable`
  MODIFY `id_libro` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `id_sesion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `talla`
--
ALTER TABLE `talla`
  MODIFY `id_talla` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `venta`
--
ALTER TABLE `venta`
  MODIFY `id_venta` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`);

--
-- Constraints for table `cuentas_cobrar`
--
ALTER TABLE `cuentas_cobrar`
  ADD CONSTRAINT `cuentas_cobrar_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`);

--
-- Constraints for table `cuentas_pagar`
--
ALTER TABLE `cuentas_pagar`
  ADD CONSTRAINT `cuentas_pagar_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`);

--
-- Constraints for table `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD CONSTRAINT `detalle_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`),
  ADD CONSTRAINT `detalle_compra_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Constraints for table `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`),
  ADD CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Constraints for table `devolucion`
--
ALTER TABLE `devolucion`
  ADD CONSTRAINT `devolucion_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`);

--
-- Constraints for table `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `libro_contable`
--
ALTER TABLE `libro_contable`
  ADD CONSTRAINT `libro_contable_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`),
  ADD CONSTRAINT `libro_contable_ibfk_2` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`),
  ADD CONSTRAINT `libro_contable_ibfk_3` FOREIGN KEY (`id_devolucion`) REFERENCES `devolucion` (`id_devolucion`),
  ADD CONSTRAINT `libro_contable_ibfk_4` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`),
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`id_talla`) REFERENCES `talla` (`id_talla`);

--
-- Constraints for table `sesiones`
--
ALTER TABLE `sesiones`
  ADD CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
