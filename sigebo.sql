
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-05-2025
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Base de datos: `sigebo`
CREATE DATABASE IF NOT EXISTS `sigebo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `sigebo`;

-- ---------------------------------
-- Estructura de las tablas volcadas

-- Estructura de tabla para la tabla `accesos`
DROP TABLE IF EXISTS `accesos`;
CREATE TABLE `accesos` (
  `id_usuario` int(11) NOT NULL,
  `id_bodega` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `analiticas`
DROP TABLE IF EXISTS `analiticas`;
CREATE TABLE `analiticas` (
  `id` int(11) NOT NULL,
  `valores` varchar(128) NOT NULL,
  `fecha` date NOT NULL,
  `id_lote` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `bodegas`
DROP TABLE IF EXISTS `bodegas`;
CREATE TABLE `bodegas` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `administrador` int(10) UNSIGNED NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `contenedores`
DROP TABLE IF EXISTS `contenedores`;
CREATE TABLE `contenedores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `vendor` varchar(32) DEFAULT NULL,
  `purchaseDate` date DEFAULT NULL,
  `manufacturer` varchar(32) DEFAULT NULL,
  `manufacturerDate` date DEFAULT NULL,
  `id_lote` int(11) DEFAULT NULL,
  `nombre_lote` varchar(32) DEFAULT NULL,
  `volumen` int(11) DEFAULT NULL,
  `max_volumen` int(11) NOT NULL,
  `id_bodega` int(11) NOT NULL,
  `tipo` varchar(32) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Estructura de tabla para la tabla `lotes`
DROP TABLE IF EXISTS `lotes`;
CREATE TABLE `lotes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `parcela` int(11) NOT NULL,
  `variedades` varchar(256) NOT NULL,
  `volumen` int(10) UNSIGNED NOT NULL,
  `contenedor` varchar(64) NOT NULL,
  `bodega_id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `operaciones`
DROP TABLE IF EXISTS `operaciones`;
CREATE TABLE `operaciones` (
  `id` int(11) NOT NULL,
  `id_bodega` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_lote_origen` int(11) DEFAULT NULL,
  `id_contenedor_origen` int(11) DEFAULT NULL,
  `id_lote_destino` int(11) DEFAULT NULL,
  `id_contenedor_destino` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `tipo` varchar(32) NOT NULL,
  `volumen` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `parcelas`
DROP TABLE IF EXISTS `parcelas`;
CREATE TABLE `parcelas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `superficie` int(10) UNSIGNED NOT NULL,
  `id_bodega` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `salidas`
DROP TABLE IF EXISTS `salidas`;
CREATE TABLE `salidas` (
  `id` int(11) UNSIGNED NOT NULL,
  `nombre_lote` varchar(32) NOT NULL,
  `id_bodega` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `sessions`

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `usuarios`
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `surname` varchar(32) NOT NULL,
  `surname2` varchar(32) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `variedades`
DROP TABLE IF EXISTS `variedades`;
CREATE TABLE `variedades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Índices para tablas volcadas

-- Indices de la tabla `accesos`
ALTER TABLE `accesos`
  ADD PRIMARY KEY (`id_usuario`,`id_bodega`);

-- Indices de la tabla `analiticas`
ALTER TABLE `analiticas`
  ADD PRIMARY KEY (`id`);

-- Indices de la tabla `bodegas`
ALTER TABLE `bodegas`
  ADD PRIMARY KEY (`id`);

-- Indices de la tabla `contenedores`
ALTER TABLE `contenedores`
  ADD PRIMARY KEY (`id`);

-- Indices de la tabla `lotes`
ALTER TABLE `lotes`
  ADD PRIMARY KEY (`id`);

-- Indices de la tabla `operaciones`
ALTER TABLE `operaciones`
  ADD PRIMARY KEY (`id`);

-- Indices de la tabla `parcelas`
ALTER TABLE `parcelas`
  ADD PRIMARY KEY (`id`);

-- Indices de la tabla `salidas`
ALTER TABLE `salidas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_lote` (`nombre_lote`,`id_bodega`);

-- Indices de la tabla `sessions`
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

-- Indices de la tabla `usuarios`
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_index` (`email`);

-- Indices de la tabla `variedades`
ALTER TABLE `variedades`
  ADD PRIMARY KEY (`id`);

-- -------------------------------------
-- AUTO_INCREMENT de las tablas volcadas

-- AUTO_INCREMENT de la tabla `analiticas`
ALTER TABLE `analiticas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `bodegas`
ALTER TABLE `bodegas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `contenedores`
ALTER TABLE `contenedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `lotes`
ALTER TABLE `lotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `operaciones`
ALTER TABLE `operaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `parcelas`
ALTER TABLE `parcelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `usuarios`
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `variedades`
ALTER TABLE `variedades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
