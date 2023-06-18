CREATE DATABASE  IF NOT EXISTS `iesgsrfp` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `iesgsrfp`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: iesgsrfp
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `eventos_calendario`
--

DROP TABLE IF EXISTS `eventos_calendario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos_calendario` (
  `idevento` int NOT NULL AUTO_INCREMENT,
  `idgrupo` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `evento` varchar(45) NOT NULL,
  PRIMARY KEY (`idevento`),
  KEY `idgrupo_idx` (`idgrupo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos_calendario`
--

LOCK TABLES `eventos_calendario` WRITE;
/*!40000 ALTER TABLE `eventos_calendario` DISABLE KEYS */;
INSERT INTO `eventos_calendario` VALUES (5,4,'2023-06-07','Examen UT5 SOR'),(6,5,'2023-06-15','Entrega actividad UT5 SOR'),(7,7,'2023-06-07','Entrega Actividad UT7 Montaje'),(9,1,'2023-06-12','Evento general'),(10,3,'2023-06-24','Oferta de empleo'),(12,2,'2023-06-14','Evento profesor');
/*!40000 ALTER TABLE `eventos_calendario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupos`
--

DROP TABLE IF EXISTS `grupos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupos` (
  `idgrupo` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  `nombre` varchar(15) NOT NULL,
  PRIMARY KEY (`idgrupo`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupos`
--

LOCK TABLES `grupos` WRITE;
/*!40000 ALTER TABLE `grupos` DISABLE KEYS */;
INSERT INTO `grupos` VALUES (1,'Grupo de todos los usuarios','general'),(2,'Grupo de profesores','profesor'),(3,'Grupo de antiguos alumnos','antiguo'),(4,'FP Básica 1','FPB1'),(5,'FP Básica 2','FPB2'),(6,'SMR1','SMR1'),(7,'SMR2','SMR2');
/*!40000 ALTER TABLE `grupos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajes`
--

DROP TABLE IF EXISTS `mensajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes` (
  `idmensaje` int NOT NULL AUTO_INCREMENT,
  `idorigen` int NOT NULL,
  `iddestino` int NOT NULL,
  `mensaje` varchar(500) NOT NULL,
  `fechahora` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `leido` tinyint DEFAULT '0',
  PRIMARY KEY (`idmensaje`),
  KEY `idorigen_idx` (`idorigen`),
  KEY `iddestino_idx` (`iddestino`),
  CONSTRAINT `iddestino` FOREIGN KEY (`iddestino`) REFERENCES `usuarios` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `idorigen` FOREIGN KEY (`idorigen`) REFERENCES `usuarios` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes`
--

LOCK TABLES `mensajes` WRITE;
/*!40000 ALTER TABLE `mensajes` DISABLE KEYS */;
INSERT INTO `mensajes` VALUES (166,1,55,'Hola  prueba, estoy probando el funcionamiento del chat','2023-06-14 11:32:25',1),(167,1,3,'Hola  Teresa, estoy probando el funcionamiento del chat','2023-06-14 11:32:32',1),(168,1,55,'Solo quiero saber si recibes correctamente mis mensajes','2023-06-14 11:32:43',1),(169,1,3,'Solo quiero saber si recibes correctamente mis mensajes','2023-06-14 11:32:58',1),(170,3,1,'Sí, perfectamente','2023-06-14 11:33:39',1),(171,55,3,'Hola Teresa, soy prueba. ¿Recibes mis mensajes?','2023-06-14 14:26:02',1),(172,55,3,'Espero tu respuesta','2023-06-14 14:26:13',1),(173,55,3,'Y comprobamos','2023-06-14 14:26:44',1),(174,3,55,'Sí, todo perfecto!','2023-06-14 14:27:20',1),(175,3,55,'Vale, muchas gracias','2023-06-14 14:31:19',0);
/*!40000 ALTER TABLE `mensajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notas`
--

DROP TABLE IF EXISTS `notas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notas` (
  `idnota` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(45) DEFAULT NULL,
  `contenido` longtext,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idnota`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas`
--

LOCK TABLES `notas` WRITE;
/*!40000 ALTER TABLE `notas` DISABLE KEYS */;
INSERT INTO `notas` VALUES (2,'Charlas SMR','El día 2 de junio hay una charla de dos alumnos que han estudiado ciclos formativos de grado superior ','2023-05-12 08:46:31'),(3,'Excursión de fin de curso','El próximo día 10 de mayo realizaremos una excursión al Parque Científico de Valladolid a visitar....','2023-05-19 22:00:00'),(18,'Prematrícula  FP','Las fechas de inscripción a los ciclos formativos de grado medio y superior serán del 19 de junio al 7 de julio de 2023 ','2023-06-08 22:00:00');
/*!40000 ALTER TABLE `notas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notas_grupo`
--

DROP TABLE IF EXISTS `notas_grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notas_grupo` (
  `idgrupo` int NOT NULL,
  `idnota` int NOT NULL,
  PRIMARY KEY (`idgrupo`,`idnota`),
  KEY `idnota_idx` (`idnota`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas_grupo`
--

LOCK TABLES `notas_grupo` WRITE;
/*!40000 ALTER TABLE `notas_grupo` DISABLE KEYS */;
INSERT INTO `notas_grupo` VALUES (6,2),(7,2),(1,3),(1,18);
/*!40000 ALTER TABLE `notas_grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noticias`
--

DROP TABLE IF EXISTS `noticias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noticias` (
  `idnoticia` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(45) NOT NULL,
  `fecha` date NOT NULL,
  `contenido` longtext,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idnoticia`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticias`
--

LOCK TABLES `noticias` WRITE;
/*!40000 ALTER TABLE `noticias` DISABLE KEYS */;
INSERT INTO `noticias` VALUES (36,'Admisión alumnado FP','2023-06-05','CURSO ESCOLAR 2023/2024 - MODALIDAD PRESENCIAL Y OFERTA COMPLETA\r\nCumplimentación y presentación de solicitud de admisión: del 19 de junio al 7 de julio de 2023.\r\n','assets/img/news/matricula.jpg'),(38,'Becas MEC y Educacyl','2023-05-15','Abierto el plazo para solicitar las becas del Ministerio y de la Junta de Castilla León.','assets/img/news/becas.jpg'),(39,'Jornada de puertas abiertas','2023-05-08','Visita nuestro centro y los ciclos que tenemos disponibles.\r\nGrado básico en Informática y Comunicaciones\r\nGrado medio en Gestión Administrativa.\r\nGrado medio en Sistemas Microinformáticos y Redes.','assets/img/news/conferencia.jpg');
/*!40000 ALTER TABLE `noticias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `idusuario` int NOT NULL AUTO_INCREMENT,
  `password` varchar(15) NOT NULL,
  `email` varchar(45) NOT NULL,
  `email2` varchar(45) DEFAULT NULL,
  `nombre` varchar(25) NOT NULL,
  `isAdmin` tinyint NOT NULL,
  `ape1` varchar(25) DEFAULT NULL,
  `ape2` varchar(25) DEFAULT NULL,
  `fecha_nac` date DEFAULT NULL,
  `telefono` varchar(9) DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `avatar` varchar(45) DEFAULT NULL,
  `idgrupo` int DEFAULT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `idgrupo_idx` (`idgrupo`),
  CONSTRAINT `idgrupo` FOREIGN KEY (`idgrupo`) REFERENCES `grupos` (`idgrupo`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','admin',NULL,'Administrador',1,'García','López','1984-02-01','12345665',NULL,'assets/img/avatar/ava3-bg.webp',2),(3,'teresa','teresa',NULL,'Teresa',1,'Jiménez ','Nieto','2023-05-31','444444',NULL,'assets/img/avatar/ava5-bg.webp',7),(55,'prueba','prueba',NULL,'Alumno de prueba',0,NULL,NULL,NULL,NULL,NULL,'assets/img/avatar/ava1-bg.webp',5);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-15 16:29:23