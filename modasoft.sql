-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 10, 2025 at 12:17 AM
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
  `nombre` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre`, `deleted_at`) VALUES
(4, 'Camisa', NULL),
(5, 'Pantalon', NULL),
(6, 'Calzado', NULL);

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
  `correo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `cedula`, `nombre`, `direccion`, `telefono`, `correo`, `deleted_at`) VALUES
(4, 30301907, 'Heiber Morán', 'Calle 2', '04164790934', 'heiber@gmail.com', NULL),
(5, 23423453, 'José Figueroa', 'Calle 4', '04123453499', 'joseito2034@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `compra`
--

CREATE TABLE `compra` (
  `id_compra` int NOT NULL,
  `factura` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_creada` datetime NOT NULL,
  `fecha_vence` date NOT NULL,
  `id_proveedor` int NOT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `tipo_pago` enum('CREDITO','CONTADO') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `estado` enum('por confirmar','confirmada','cancelada') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado_despacho` enum('pendiente','completado','cancelado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `compra`
--

INSERT INTO `compra` (`id_compra`, `factura`, `fecha_creada`, `fecha_vence`, `id_proveedor`, `total`, `tipo_pago`, `estado`, `estado_despacho`) VALUES
(24, 'F-00000024', '2025-07-09 13:55:46', '2025-07-09', 5, '30000.00', 'CONTADO', 'confirmada', 'completado'),
(25, 'F-00000025', '2025-07-09 14:03:07', '2025-07-09', 6, '1600.00', 'CREDITO', 'confirmada', 'completado');

-- --------------------------------------------------------

--
-- Table structure for table `cuentas_cobrar`
--

CREATE TABLE `cuentas_cobrar` (
  `id_cuenta_cobrar` int NOT NULL,
  `id_venta` int DEFAULT NULL,
  `monto_total` decimal(12,2) DEFAULT NULL,
  `monto_pagado` decimal(12,2) DEFAULT '0.00',
  `fecha` date NOT NULL,
  `estado` enum('pendiente','cobrado') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cuentas_cobrar`
--

INSERT INTO `cuentas_cobrar` (`id_cuenta_cobrar`, `id_venta`, `monto_total`, `monto_pagado`, `fecha`, `estado`) VALUES
(1, 7, '48000.00', '30000.00', '2025-07-09', 'pendiente');

-- --------------------------------------------------------

--
-- Table structure for table `cuentas_contables`
--

CREATE TABLE `cuentas_contables` (
  `id_cuenta` int NOT NULL,
  `codigo` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_general` enum('REAL','NOMINAL','VALUACION') COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_detalle` enum('ACTIVO','PASIVO','PATRIMONIO','INGRESO','EGRESO','VALUACION') COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cuentas_contables`
--

INSERT INTO `cuentas_contables` (`id_cuenta`, `codigo`, `nombre`, `tipo_general`, `tipo_detalle`) VALUES
(1, '1.1.01', 'Caja', 'REAL', 'ACTIVO'),
(2, '1.1.02', 'Caja Chica', 'REAL', 'ACTIVO'),
(3, '1.1.03', 'Bancos', 'REAL', 'ACTIVO'),
(4, '1.1.04', 'Inversiones Temporales (Acciones, Bonos, Inmuebles)', 'REAL', 'ACTIVO'),
(5, '1.1.05', 'Cuentas por Cobrar Comerciales', 'REAL', 'ACTIVO'),
(6, '1.1.06', 'Efectos por Cobrar Comerciales', 'REAL', 'ACTIVO'),
(7, '1.1.07', 'Efectos por Cobrar Comerciales en Gestión de Cobro', 'REAL', 'ACTIVO'),
(8, '1.1.08', 'Efectos por Cobrar Comerciales Descontados', 'REAL', 'ACTIVO'),
(9, '1.1.09', 'Inventario de Mercancías (Final)', 'REAL', 'ACTIVO'),
(10, '1.1.10', 'Suministros de Oficina', 'REAL', 'ACTIVO'),
(11, '1.1.11', 'Seguros Pagados por Anticipado', 'REAL', 'ACTIVO'),
(12, '1.1.12', 'Alquileres Pagados por Anticipado', 'REAL', 'ACTIVO'),
(13, '1.1.13', 'Intereses Pagados por Anticipado', 'REAL', 'ACTIVO'),
(14, '1.1.14', 'Hipotecas por Cobrar', 'REAL', 'ACTIVO'),
(15, '1.1.15', 'Inversiones Permanentes (Acciones, Bonos, Inmuebles)', 'REAL', 'ACTIVO'),
(16, '1.1.16', 'Terrenos', 'REAL', 'ACTIVO'),
(17, '1.1.17', 'Edificios', 'REAL', 'ACTIVO'),
(18, '1.1.18', 'Instalaciones', 'REAL', 'ACTIVO'),
(19, '1.1.19', 'Maquinarias', 'REAL', 'ACTIVO'),
(20, '1.1.20', 'Equipos de Planta (Fábrica)', 'REAL', 'ACTIVO'),
(21, '1.1.21', 'Herramientas', 'REAL', 'ACTIVO'),
(22, '1.1.22', 'Vehículos', 'REAL', 'ACTIVO'),
(23, '1.1.23', 'Equipos de Reparto', 'REAL', 'ACTIVO'),
(24, '1.1.24', 'Equipos de Transporte', 'REAL', 'ACTIVO'),
(25, '1.1.25', 'Mobiliario', 'REAL', 'ACTIVO'),
(26, '1.1.26', 'Equipos de Oficina', 'REAL', 'ACTIVO'),
(27, '1.1.27', 'Equipos de Computación', 'REAL', 'ACTIVO'),
(28, '1.1.28', 'Plusvalía', 'REAL', 'ACTIVO'),
(29, '1.1.29', 'Patentes', 'REAL', 'ACTIVO'),
(30, '1.1.30', 'Marcas de Fábrica', 'REAL', 'ACTIVO'),
(31, '1.1.31', 'Derechos de Autor', 'REAL', 'ACTIVO'),
(32, '1.1.32', 'Franquicias', 'REAL', 'ACTIVO'),
(33, '1.1.33', 'Mejoras a Inmuebles Arrendados', 'REAL', 'ACTIVO'),
(34, '1.1.34', 'Campañas Publicitarias', 'REAL', 'ACTIVO'),
(35, '1.1.35', 'I.V.A. por Compensar', 'REAL', 'ACTIVO'),
(36, '1.1.36', 'I.V.A. Retenido por Terceros', 'REAL', 'ACTIVO'),
(37, '1.1.37', 'I.S.L.R. Retenido por Terceros', 'REAL', 'ACTIVO'),
(38, '1.1.38', 'Crédito Fiscal - I.V.A.', 'REAL', 'ACTIVO'),
(39, '1.1.39', 'Ingresos Acumulados por Cobrar', 'REAL', 'ACTIVO'),
(40, '1.1.40', 'Adelantos Entregados a Cuenta de Contratos', 'REAL', 'ACTIVO'),
(41, '1.1.41', 'Depósitos Dados en Garantía', 'REAL', 'ACTIVO'),
(42, '1.1.42', 'Efectos por Cobrar Impagados', 'REAL', 'ACTIVO'),
(43, '1.1.43', 'Efectos por Cobrar - Litigio', 'REAL', 'ACTIVO'),
(44, '1.1.44', 'Fondos Especiales', 'REAL', 'ACTIVO'),
(45, '2.1.01', 'I.V.A. por Pagar', 'REAL', 'PASIVO'),
(46, '2.1.02', 'I.V.A. Retenido a Proveedores', 'REAL', 'PASIVO'),
(47, '2.1.03', 'I.S.L.R. por Pagar', 'REAL', 'PASIVO'),
(48, '2.1.04', 'I.S.L.R. Retenido a Proveedores', 'REAL', 'PASIVO'),
(49, '2.1.05', 'Débito Fiscal - I.V.A.', 'REAL', 'PASIVO'),
(50, '2.1.06', 'Efectos por Pagar Proveedores', 'REAL', 'PASIVO'),
(51, '2.1.07', 'Cuentas por Pagar Proveedores', 'REAL', 'PASIVO'),
(52, '2.1.08', 'Préstamos Bancarios por Pagar', 'REAL', 'PASIVO'),
(53, '2.1.09', 'Deuda por Efectos Descontados', 'REAL', 'PASIVO'),
(54, '2.1.10', 'Obligaciones ó Bonos por Pagar', 'REAL', 'PASIVO'),
(55, '2.1.11', 'Hipotecas por Pagar', 'REAL', 'PASIVO'),
(56, '2.1.12', 'Provisión para Remuneraciones del Personal', 'REAL', 'PASIVO'),
(57, '2.1.13', 'Provisión para Prestaciones Sociales', 'REAL', 'PASIVO'),
(58, '2.1.14', 'Alquileres Cobrados por Anticipado', 'REAL', 'PASIVO'),
(59, '2.1.15', 'Intereses Cobrados por Anticipado', 'REAL', 'PASIVO'),
(60, '2.1.16', 'Gastos Acumulados por Pagar', 'REAL', 'PASIVO'),
(61, '2.1.17', 'Retención por Pagar (SSO; RPE; FAOV; INCES; ISLR)', 'REAL', 'PASIVO'),
(62, '2.1.18', 'Aportación Patronal por Pagar (SSO; RPE; FAOV; INCES)', 'REAL', 'PASIVO'),
(63, '2.1.19', 'Depósitos Recibidos en Garantía', 'REAL', 'PASIVO'),
(64, '3.1.01', 'Capital', 'REAL', 'PATRIMONIO'),
(65, '3.1.02', 'Reserva Legal', 'REAL', 'PATRIMONIO'),
(66, '3.1.03', 'Reserva Estatutaria', 'REAL', 'PATRIMONIO'),
(67, '3.1.04', 'Reserva Voluntaria', 'REAL', 'PATRIMONIO'),
(68, '3.1.05', 'Utilidad o Pérdida Acumulada (Superávit o Déficit)', 'REAL', 'PATRIMONIO'),
(69, '4.1.01', 'Ventas', 'NOMINAL', 'INGRESO'),
(70, '4.1.02', 'Intereses Ganados', 'NOMINAL', 'INGRESO'),
(71, '4.1.03', 'Alquileres Ganados', 'NOMINAL', 'INGRESO'),
(72, '4.1.04', 'Servicios Prestados', 'NOMINAL', 'INGRESO'),
(73, '4.1.05', 'Ganancias en Ventas de Activos Fijos', 'NOMINAL', 'INGRESO'),
(74, '4.1.06', 'Descuento por Pronto Pago Compras', 'NOMINAL', 'INGRESO'),
(75, '4.1.07', 'Descuento en Compras', 'NOMINAL', 'INGRESO'),
(76, '4.1.08', 'Devoluciones en Compras', 'NOMINAL', 'INGRESO'),
(77, '4.1.09', 'Rebajas en Compras', 'NOMINAL', 'INGRESO'),
(78, '4.1.10', 'Bonificaciones en Compras', 'NOMINAL', 'INGRESO'),
(79, '5.1.01', 'Inventario de Mercancías (Inicial)', 'NOMINAL', 'EGRESO'),
(80, '5.1.02', 'Compras', 'NOMINAL', 'EGRESO'),
(81, '5.1.03', 'Fletes en Compras', 'NOMINAL', 'EGRESO'),
(82, '5.1.04', 'Gastos de Importación (Aduanas)', 'NOMINAL', 'EGRESO'),
(83, '5.1.05', 'Sueldos de Departamento de Ventas', 'NOMINAL', 'EGRESO'),
(84, '5.1.06', 'Sueldos de Departamento de Administración', 'NOMINAL', 'EGRESO'),
(85, '5.1.07', 'Bonificación Alimenticia', 'NOMINAL', 'EGRESO'),
(86, '5.1.08', 'Vacaciones y Bono Vacacional', 'NOMINAL', 'EGRESO'),
(87, '5.1.09', 'Utilidades del Personal', 'NOMINAL', 'EGRESO'),
(88, '5.1.10', 'Comisiones de Vendedores', 'NOMINAL', 'EGRESO'),
(89, '5.1.11', 'Fletes en Ventas', 'NOMINAL', 'EGRESO'),
(90, '5.1.12', 'Gastos de Publicidad y Propaganda', 'NOMINAL', 'EGRESO'),
(91, '5.1.13', 'Gastos de Viaje y Viáticos', 'NOMINAL', 'EGRESO'),
(92, '5.1.14', 'Honorarios Profesionales', 'NOMINAL', 'EGRESO'),
(93, '5.1.15', 'Material de Oficina', 'NOMINAL', 'EGRESO'),
(94, '5.1.16', 'Material de Limpieza', 'NOMINAL', 'EGRESO'),
(95, '5.1.17', 'Mantenimiento y Reparación de Activos', 'NOMINAL', 'EGRESO'),
(96, '5.1.18', 'Servicios Básicos', 'NOMINAL', 'EGRESO'),
(97, '5.1.19', 'Depreciación Activos Fijos', 'NOMINAL', 'EGRESO'),
(98, '5.1.20', 'Amortización Activos Intangibles y Cargos Diferidos', 'NOMINAL', 'EGRESO'),
(99, '5.1.21', 'Descuento por Pronto Pago Ventas', 'NOMINAL', 'EGRESO'),
(100, '5.1.22', 'Pérdidas por Deterioro de Valor de Créditos Comerciales', 'NOMINAL', 'EGRESO'),
(101, '5.1.23', 'Pérdidas por Deterioro de Valor de Inventarios', 'NOMINAL', 'EGRESO'),
(102, '5.1.24', 'Pérdidas por Créditos Comerciales Incobrables', 'NOMINAL', 'EGRESO'),
(103, '5.1.25', 'Pérdidas en Ventas de Activos Fijos', 'NOMINAL', 'EGRESO'),
(104, '5.1.26', 'Gastos por Intereses', 'NOMINAL', 'EGRESO'),
(105, '5.1.27', 'Gastos por Alquileres', 'NOMINAL', 'EGRESO'),
(106, '5.1.28', 'Descuento en Ventas', 'NOMINAL', 'EGRESO'),
(107, '5.1.29', 'Devoluciones en Ventas', 'NOMINAL', 'EGRESO'),
(108, '5.1.30', 'Rebajas en Ventas', 'NOMINAL', 'EGRESO'),
(109, '5.1.31', 'Bonificaciones en Ventas', 'NOMINAL', 'EGRESO'),
(110, '6.1.01', 'Depreciación Acumulada (Propiedad, Planta y Equipos)', 'VALUACION', 'VALUACION'),
(111, '6.1.02', 'Amortización Acumulada (Intangibles; Cargos Diferidos)', 'VALUACION', 'VALUACION'),
(112, '6.1.03', 'Deterioro de Valor de Créditos Comerciales', 'VALUACION', 'VALUACION'),
(113, '6.1.04', 'Deterioro de Valor de Inventarios', 'VALUACION', 'VALUACION');

-- --------------------------------------------------------

--
-- Table structure for table `cuentas_pagar`
--

CREATE TABLE `cuentas_pagar` (
  `id_cuenta_pagar` int NOT NULL,
  `id_compra` int DEFAULT NULL,
  `monto_total` decimal(12,2) DEFAULT '0.00',
  `monto_pagado` decimal(12,2) NOT NULL DEFAULT '0.00',
  `fecha` date DEFAULT NULL,
  `estado` enum('pendiente','pagado') COLLATE utf8mb4_general_ci DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cuentas_pagar`
--

INSERT INTO `cuentas_pagar` (`id_cuenta_pagar`, `id_compra`, `monto_total`, `monto_pagado`, `fecha`, `estado`) VALUES
(5, 25, '1600.00', '1600.00', '2025-07-09', 'pagado');

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
(42, 24, 8, 30, '30000.00'),
(43, 25, 9, 40, '1600.00');

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

--
-- Dumping data for table `detalle_venta`
--

INSERT INTO `detalle_venta` (`id_detalle_venta`, `id_venta`, `id_producto`, `cantidad`, `precio_venta`) VALUES
(13, 6, 8, 20, '23600.00'),
(14, 7, 9, 10, '48000.00');

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
(8, 8, 10),
(9, 9, 30);

-- --------------------------------------------------------

--
-- Table structure for table `pago_compra`
--

CREATE TABLE `pago_compra` (
  `id_pago_compra` int NOT NULL,
  `id_compra` int NOT NULL,
  `fecha` date NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `metodo` enum('BANCARIO','EFECTIVO') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pago_compra`
--

INSERT INTO `pago_compra` (`id_pago_compra`, `id_compra`, `fecha`, `monto`, `metodo`) VALUES
(20, 24, '2025-07-09', '30000.00', 'EFECTIVO'),
(21, 25, '2025-07-09', '800.00', 'BANCARIO'),
(22, 25, '2025-07-09', '800.00', 'EFECTIVO');

-- --------------------------------------------------------

--
-- Table structure for table `pago_venta`
--

CREATE TABLE `pago_venta` (
  `id_pago_venta` int NOT NULL,
  `id_venta` int NOT NULL,
  `fecha` date NOT NULL,
  `monto` decimal(12,2) NOT NULL DEFAULT '0.00',
  `metodo` enum('EFECTIVO','BANCARIO') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pago_venta`
--

INSERT INTO `pago_venta` (`id_pago_venta`, `id_venta`, `fecha`, `monto`, `metodo`) VALUES
(1, 6, '2025-07-09', '23600.00', 'EFECTIVO'),
(2, 7, '2025-07-09', '10000.00', 'BANCARIO'),
(3, 7, '2025-07-09', '20000.00', 'EFECTIVO');

-- --------------------------------------------------------

--
-- Table structure for table `producto`
--

CREATE TABLE `producto` (
  `id_producto` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `porcentaje_ganancia` float NOT NULL,
  `id_categoria` int DEFAULT NULL,
  `id_talla` int DEFAULT NULL,
  `id_proveedor` int NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`, `descripcion`, `precio_unitario`, `porcentaje_ganancia`, `id_categoria`, `id_talla`, `id_proveedor`, `deleted_at`) VALUES
(8, 'Pantalo Pegado', 'Apto para todos', '1000.00', 18, 5, 8, 5, NULL),
(9, 'Nike Jordan', 'You can fly', '4000.00', 20, 6, 9, 6, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rif` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `proveedor`
--

INSERT INTO `proveedor` (`id_proveedor`, `nombre`, `rif`, `direccion`, `telefono`, `correo`, `deleted_at`) VALUES
(5, 'Traki, C.A', 'J-10493045-3', 'Calle 15', '04123453499', 'taki@gmail.com', NULL),
(6, 'Nike, C.A', 'J-30929302-3', 'Calle 15', '04160416576', 'nike@gmail.com', NULL);

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
(5, 1, '2025-07-08 19:03:05', 1);

-- --------------------------------------------------------

--
-- Table structure for table `talla`
--

CREATE TABLE `talla` (
  `id_talla` int NOT NULL,
  `id_categoria` int NOT NULL,
  `descripcion` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `talla`
--

INSERT INTO `talla` (`id_talla`, `id_categoria`, `descripcion`, `deleted_at`) VALUES
(7, 4, 'XL', NULL),
(8, 5, 'XS', NULL),
(9, 6, '42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transacciones`
--

CREATE TABLE `transacciones` (
  `id_transaccion` int NOT NULL,
  `factura` varchar(50) NOT NULL,
  `descripcion` varchar(100) NOT NULL DEFAULT 'transaccion ',
  `fecha` date NOT NULL,
  `id_cuenta` int NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `tipo` enum('DEBITO','CREDITO') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transacciones`
--

INSERT INTO `transacciones` (`id_transaccion`, `factura`, `descripcion`, `fecha`, `id_cuenta`, `monto`, `tipo`) VALUES
(31, 'F-00000024', 'Compra al contado según factura 00000024 por monto de Bs 30,000.00', '2025-07-09', 80, '30000.00', 'DEBITO'),
(32, 'F-00000024', 'Compra al contado según factura F-00000024 por monto de Bs 30,000.00', '2025-07-09', 1, '30000.00', 'CREDITO'),
(33, 'F-00000025', 'Compra a crédito según factura F-00000025 por monto de Bs 1,600.00', '2025-07-09', 80, '1600.00', 'DEBITO'),
(34, 'F-00000025', 'Compra a crédito según factura F-00000025 por monto de Bs 1,600.00', '2025-07-09', 51, '1600.00', 'CREDITO'),
(35, 'F-00000025', 'Pago de deuda por compra F-00000025 por monto de Bs 800.00', '2025-07-09', 51, '800.00', 'DEBITO'),
(36, 'F-00000025', 'Pago de deuda por compra F-00000025 por monto de Bs 800.00', '2025-07-09', 3, '800.00', 'CREDITO'),
(37, 'F-00000025', 'Pago de deuda por compra F-00000025 por monto de Bs 800.00', '2025-07-09', 51, '800.00', 'DEBITO'),
(38, 'F-00000025', 'Pago de deuda por compra F-00000025 por monto de Bs 800.00', '2025-07-09', 1, '800.00', 'CREDITO'),
(39, 'F-00000006', 'Venta de mercacia según F-00000006 por monto de Bs 0.00 al cliente Heiber Morán', '2025-07-09', 1, '23600.00', 'DEBITO'),
(40, 'F-00000006', 'Venta de mercacia según F-00000006 por monto de Bs 0.00 al cliente Heiber Morán', '2025-07-09', 69, '23600.00', 'CREDITO'),
(41, 'F-00000007', 'Venta de mercacia a crédito según F-00000007 por monto de Bs 0.00 al cliente José Figueroa', '2025-07-09', 5, '48000.00', 'DEBITO'),
(42, 'F-00000007', 'Venta de mercacia a crédito según F-00000007 por monto de Bs 0.00 al cliente José Figueroa', '2025-07-09', 69, '48000.00', 'CREDITO'),
(43, 'F-00000007', 'Cliente de la venta a crédito F-00000007 realiza un pago por monto de Bs 10,000.00', '2025-07-09', 3, '10000.00', 'DEBITO'),
(44, 'F-00000007', 'Cliente de la venta a crédito F-00000007 realiza un pago por monto de Bs 10,000.00', '2025-07-09', 5, '10000.00', 'CREDITO'),
(45, 'F-00000007', 'Cliente de la venta a crédito F-00000007 realiza un pago por monto de Bs 20,000.00', '2025-07-09', 1, '20000.00', 'DEBITO'),
(46, 'F-00000007', 'Cliente de la venta a crédito F-00000007 realiza un pago por monto de Bs 20,000.00', '2025-07-09', 5, '20000.00', 'CREDITO');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL,
  `nombre_usuario` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre_personal` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rol` enum('Administrador','Gerente','Comprador','Vendedor','Contador') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Vendedor',
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre_usuario`, `nombre_personal`, `correo`, `rol`, `password`, `activo`, `deleted_at`) VALUES
(1, 'Heiber', 'Heiber Morán', 'heiber@gmail.com', 'Administrador', '$2y$12$qFcmYweF2U8NkuNHhLtBaOQfljnouyiha4QFM7gjikhd9rRJSkpQa', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `venta`
--

CREATE TABLE `venta` (
  `id_venta` int NOT NULL,
  `factura` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha` date NOT NULL,
  `id_cliente` int NOT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `tipo_pago` enum('CONTADO','CREDITO') COLLATE utf8mb4_general_ci NOT NULL,
  `estado` enum('en_proceso','completada','cancelada') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `venta`
--

INSERT INTO `venta` (`id_venta`, `factura`, `fecha`, `id_cliente`, `total`, `tipo_pago`, `estado`) VALUES
(6, 'F-00000006', '2025-07-09', 4, '23600.00', 'CONTADO', 'completada'),
(7, 'F-00000007', '2025-07-09', 5, '48000.00', 'CREDITO', 'completada');

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
-- Indexes for table `cuentas_contables`
--
ALTER TABLE `cuentas_contables`
  ADD PRIMARY KEY (`id_cuenta`);

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
-- Indexes for table `pago_compra`
--
ALTER TABLE `pago_compra`
  ADD PRIMARY KEY (`id_pago_compra`),
  ADD KEY `id_compra` (`id_compra`);

--
-- Indexes for table `pago_venta`
--
ALTER TABLE `pago_venta`
  ADD PRIMARY KEY (`id_pago_venta`),
  ADD KEY `id_venta` (`id_venta`);

--
-- Indexes for table `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_talla` (`id_talla`),
  ADD KEY `id_proveedor` (`id_proveedor`);

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
  ADD PRIMARY KEY (`id_talla`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indexes for table `transacciones`
--
ALTER TABLE `transacciones`
  ADD PRIMARY KEY (`id_transaccion`),
  ADD KEY `id_cuenta` (`id_cuenta`);

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
  ADD KEY `id_cliente` (`id_cliente`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `compra`
--
ALTER TABLE `compra`
  MODIFY `id_compra` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `cuentas_cobrar`
--
ALTER TABLE `cuentas_cobrar`
  MODIFY `id_cuenta_cobrar` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cuentas_contables`
--
ALTER TABLE `cuentas_contables`
  MODIFY `id_cuenta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `cuentas_pagar`
--
ALTER TABLE `cuentas_pagar`
  MODIFY `id_cuenta_pagar` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `detalle_compra`
--
ALTER TABLE `detalle_compra`
  MODIFY `id_detalle_compra` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id_detalle_venta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `devolucion`
--
ALTER TABLE `devolucion`
  MODIFY `id_devolucion` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `pago_compra`
--
ALTER TABLE `pago_compra`
  MODIFY `id_pago_compra` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `pago_venta`
--
ALTER TABLE `pago_venta`
  MODIFY `id_pago_venta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `id_sesion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `talla`
--
ALTER TABLE `talla`
  MODIFY `id_talla` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `transacciones`
--
ALTER TABLE `transacciones`
  MODIFY `id_transaccion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `venta`
--
ALTER TABLE `venta`
  MODIFY `id_venta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- Constraints for table `pago_compra`
--
ALTER TABLE `pago_compra`
  ADD CONSTRAINT `pago_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `pago_venta`
--
ALTER TABLE `pago_venta`
  ADD CONSTRAINT `pago_venta_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`),
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`id_talla`) REFERENCES `talla` (`id_talla`),
  ADD CONSTRAINT `producto_ibfk_3` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`);

--
-- Constraints for table `sesiones`
--
ALTER TABLE `sesiones`
  ADD CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `talla`
--
ALTER TABLE `talla`
  ADD CONSTRAINT `talla_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`);

--
-- Constraints for table `transacciones`
--
ALTER TABLE `transacciones`
  ADD CONSTRAINT `transacciones_ibfk_1` FOREIGN KEY (`id_cuenta`) REFERENCES `cuentas_contables` (`id_cuenta`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
