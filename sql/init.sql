-- MySQL dump 10.13  Distrib 8.0.45, for Linux (aarch64)
--
-- Host: localhost    Database: test
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `stock` int NOT NULL,
  `normal_price` decimal(10,2) NOT NULL,
  `discounted_price` decimal(10,2) NOT NULL,
  `expiration_date` date NOT NULL,
  `image_filename` varchar(255) NOT NULL,
  `market_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `market_id` (`market_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`market_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (20,'Toblerone 100gr',25,200.00,120.00,'2026-06-05','toblerone.jpg',1),(21,'Magnum Ice Cream',50,45.00,30.00,'2026-05-10','magnum.jpg',1),(22,'Magnolia Cake',8,300.00,180.00,'2026-05-10','magnolia.jpg',1),(23,'Nutmeg Spice',100,50.00,20.00,'2027-05-05','nutmeg.jpg',1),(24,'Milk 1L',5,45.00,30.00,'2026-05-10','milk.jpg',2),(25,'Banana 1kg',40,80.00,60.00,'2026-05-10','banana.jpg',2),(26,'Apple 1kg',60,110.00,80.00,'2026-05-10','apple.jpg',2),(27,'Cheese',15,120.00,85.00,'2026-05-10','cheese.jpg',2),(28,'Tomato 1kg',30,60.00,45.00,'2026-05-10','tomato.jpg',3),(29,'Cucumber 1kg',70,60.00,40.00,'2026-05-12','cucumber.jpg',3),(30,'Orange Juice 1L',45,80.00,55.00,'2026-05-13','orangejuice.jpg',3),(31,'Eggs (12 Pack)',50,150.00,100.00,'2026-05-11','eggs.jpg',3),(32,'Nutella',29,200.00,120.00,'2026-05-31','nutella.jpg',4),(33,'Toast Bread',60,65.00,40.00,'2026-05-13','toast.jpg',4),(34,'Yoghurt',24,60.00,40.00,'2026-05-15','yoghurt.jpg',4),(35,'Ketchup',80,70.00,35.00,'2026-05-31','ketchup.jpg',4);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('market','consumer') NOT NULL,
  `name` varchar(100) NOT NULL,
  `city` varchar(50) NOT NULL,
  `district` varchar(50) NOT NULL,
  `verification_code` varchar(10) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'tok-market@gmail.com','$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC','market','Tok Market','Ankara','Çankaya',NULL,1),(2,'bim-market@gmail.com','$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC','market','Bim Market','Ankara','Altındağ',NULL,1),(3,'file-market@gmail.com','$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC','market','File Market','Ankara','Çankaya',NULL,1),(4,'target-market@gmail.com','$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC','market','Target Market','Ankara','Çankaya',NULL,1),(17,'consumer@gmail.com','$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC','consumer','John Doe','Ankara','Çankaya',NULL,1),(18,'jane@gmail.com','$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC','consumer','Jane Doe','Ankara','Çankaya',NULL,1),(19,'ali@gmail.com','$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC','consumer','Ali Koca','Ankara','Çankaya',NULL,1),(20,'hasan@gmail.com','$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC','consumer','Hasan Kara','Ankara','Çankaya',NULL,1),(21,'daniel@gmail.com','$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC','consumer','Daniel McDonald','Ankara','Çankaya',NULL,1),(22,'kyra@gmail.com','$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC','consumer','Kyra Hopkins','Ankara','Çankaya',NULL,1),(25,'altay@gmail.com','$2b$10$ql7Fs3BFsG.bW7rx.aafIeD4eHoDh75ja/lepelWFiNteSBITuv1y','consumer','Altay','Ankara','Altındağ',NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-08 17:23:39
