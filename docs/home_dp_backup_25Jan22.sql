-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 25, 2022 at 03:27 PM
-- Server version: 5.5.8
-- PHP Version: 5.3.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `home_dp`
--

-- --------------------------------------------------------

--
-- Table structure for table `car_shopkeepers`
--

DROP TABLE IF EXISTS `car_shopkeepers`;
CREATE TABLE IF NOT EXISTS `car_shopkeepers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `SK_USER_NAME` varchar(30) NOT NULL,
  `SK_DISPLAY_NAME` varchar(30) NOT NULL,
  `SK_PWD` varchar(45) NOT NULL,
  `SK_EMAIL` varchar(255) NOT NULL,
  `SK_PHONE` varchar(25) NOT NULL,
  `USER_TOKEN` varchar(255) NOT NULL,
  `USER_OTP` varchar(6) NOT NULL,
  `USER_OTP_EXPIRE` datetime NOT NULL,
  `USER_LAST_LOGGED` datetime NOT NULL,
  `USER_STATUS` enum('Y','N') NOT NULL,
  `SK_ADDRESS` varchar(300) NOT NULL,
  `SK_CITY` varchar(100) NOT NULL,
  `SK_STATE` varchar(100) NOT NULL,
  `SK_COUNTRY` varchar(100) NOT NULL,
  `SK_PINCODE` int(10) NOT NULL,
  `SK_CREATED` datetime NOT NULL,
  `USER_TYPE` varchar(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `car_shopkeepers`
--

INSERT INTO `car_shopkeepers` (`ID`, `SK_USER_NAME`, `SK_DISPLAY_NAME`, `SK_PWD`, `SK_EMAIL`, `SK_PHONE`, `USER_TOKEN`, `USER_OTP`, `USER_OTP_EXPIRE`, `USER_LAST_LOGGED`, `USER_STATUS`, `SK_ADDRESS`, `SK_CITY`, `SK_STATE`, `SK_COUNTRY`, `SK_PINCODE`, `SK_CREATED`, `USER_TYPE`) VALUES
(1, 'test', 'test', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'rinku.sharma.yash@gmail.com', '07841956875', 'f4b10fc2-ae3c-473e-9a98-9bcbce57ae40', '611499', '2022-01-21 09:19:34', '2022-01-21 08:51:29', 'Y', 'C-601,Gini Bellissimo, Dhanori Road, Vishrantwadi', 'PUNE', 'Maharashtra', 'India', 411015, '2022-01-21 08:51:29', 'A'),
(2, 'test2', 'test2', '109f4b3c50d7b0df729d299bc6f8e9ef9066971f', 'rjkrishna2015@gmail.com', '841-003-5262', '32e62198-bc3a-4310-ae81-41363d1a9ce7', '856501', '2022-01-21 09:08:45', '2022-01-21 08:58:28', 'Y', '957 Tessie Field', 'South Wayne', 'Arkansas', 'Anguilla', 339, '2022-01-21 08:58:28', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `car_users`
--

DROP TABLE IF EXISTS `car_users`;
CREATE TABLE IF NOT EXISTS `car_users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `USER_NAME` varchar(255) NOT NULL,
  `USER_DISPLAY_NAME` varchar(255) NOT NULL,
  `USER_PWD` varchar(255) NOT NULL,
  `USER_EMAIL` varchar(255) NOT NULL,
  `USER_TOKEN` varchar(255) NOT NULL,
  `USER_OTP` int(11) NOT NULL,
  `USER_OTP_EXPIRE` datetime NOT NULL,
  `USER_LAST_LOGIN` datetime NOT NULL,
  `USER_TYPE` varchar(11) NOT NULL,
  `USER_STATUS` enum('Y','N') NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `car_users`
--

INSERT INTO `car_users` (`ID`, `USER_NAME`, `USER_DISPLAY_NAME`, `USER_PWD`, `USER_EMAIL`, `USER_TOKEN`, `USER_OTP`, `USER_OTP_EXPIRE`, `USER_LAST_LOGIN`, `USER_TYPE`, `USER_STATUS`) VALUES
(1, 'yash', 'Yash Sharma', '3dded7259cacb37ef39c9cd408b525abacfed488', 'yashsharma.karate@gmail.com', 'c1e8bbf6-5fde-4e71-9c34-44edd239c454', 340360, '2022-01-21 09:19:00', '2022-01-10 14:29:56', 'SA', 'Y');
