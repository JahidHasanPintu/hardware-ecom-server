-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 03, 2024 at 06:05 AM
-- Server version: 10.5.20-MariaDB-cll-lve
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `genicjrg_duttahardware`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `blog_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `user_id`, `title`, `details`, `created_at`, `updated_at`, `blog_id`) VALUES
(1, 1, 'My Blog', 'Blog details', '2023-06-23 03:22:00', '2023-06-23 03:22:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `blog_images`
--

CREATE TABLE `blog_images` (
  `id` int(11) NOT NULL,
  `blog_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_images`
--

INSERT INTO `blog_images` (`id`, `blog_id`, `image_url`) VALUES
(1, 1, 'https://example.com/image1.jpg'),
(2, 1, 'https://example.com/image2.jpg'),
(3, 1, 'https://example.com/image3.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `brand_name` varchar(255) NOT NULL,
  `brand_image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL,
  `product_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `brand_name`, `brand_image`, `status`, `product_count`) VALUES
(0, 'N/A', 'N/A', 'active', 1),
(1, 'Asian Paint', 'images\\asianpaint-brand_image-1692532549544.png', 'active', 42),
(7, 'Milwaukee', 'images\\milwaukeetool_logo-brand_image-1692532582728.jpg', 'active', 8),
(8, 'Ryobi', 'images\\Ryobi-Logo-brand_image-1692532603620.png', 'active', 7),
(9, 'Makita', 'images\\makitalogo-brand_image-1692532614735.png', 'active', 0),
(10, 'Dewalt', 'images\\DeWalt_Logo-brand_image-1692532627305.png', 'active', 0),
(11, 'Werner', 'images\\werner-logo-brand_image-1692532646311.png', 'active', 0);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `cat_name` varchar(255) NOT NULL,
  `cat_image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `product_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `cat_name`, `cat_image`, `status`, `product_count`) VALUES
(0, 'N/A', 'N/A', 'active', 1),
(1, 'Power Tools', 'images\\Tools-cat_image-1692533152500.PNG', 'active', 27),
(29, 'Appliances', 'images\\hp-sbc-appliances-cat_image-1692533164227.svg', 'active', 5),
(30, 'Bath and Faucets', 'images\\hp-sbc-bath-faucets-cat_image-1692533178525.svg', 'active', 22),
(31, 'Building Material', 'images\\hp-sbc-building-materials-cat_image-1692533187377.svg', 'active', 2),
(32, 'Decor and Furniture', 'images\\hp-sbc-decor-furniture-cat_image-1692533200267.svg', 'active', 0),
(33, 'Doors and Windows', 'images\\hp-sbc-doors-windows-cat_image-1692533208886.svg', 'active', 0),
(34, 'Electrical', 'images\\hp-sbc-electrical-cat_image-1692533220384.svg', 'active', 0),
(35, 'Flooring Area and Rugs', 'images\\hp-sbc-flooring-area-rugs-cat_image-1692533229405.svg', 'active', 0),
(36, 'Hardware', 'images\\hp-sbc-hardware-cat_image-1692533238828.svg', 'active', 0),
(37, 'Heating and Cooling', 'images\\hp-sbc-heating-cooling-cat_image-1692533249720.svg', 'active', 0),
(38, 'Kitchen', 'images\\hp-sbc-kitchen-cat_image-1692533263229.svg', 'active', 1),
(39, 'Lawn and Garden', 'images\\hp-sbc-lawn-garden-cat_image-1692533275360.svg', 'active', 0),
(40, 'Lighting and Ceiling', 'images\\hp-sbc-lighting-ceiling-fans-cat_image-1692533290524.svg', 'active', 0),
(41, 'Outdoor Living', 'images\\hp-sbc-outdoor-living-cat_image-1692533301709.svg', 'active', 0),
(42, 'Paints', 'images\\hp-sbc-paint-cat_image-1692533313304.svg', 'active', 0),
(43, 'Plumbing', 'images\\hp-sbc-plumbing-cat_image-1692533323414.svg', 'active', 0),
(44, 'Storage Organization', 'images\\hp-sbc-storage-organization-cat_image-1692533334834.svg', 'active', 0),
(45, 'Tools', 'images\\hp-sbc-tools-cat_image-1692533345305.svg', 'active', 0);

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `id` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `discount` decimal(5,2) NOT NULL,
  `expiry_date` date NOT NULL,
  `max_uses` int(11) NOT NULL,
  `used_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon`
--

INSERT INTO `coupon` (`id`, `code`, `discount`, `expiry_date`, `max_uses`, `used_count`, `created_at`) VALUES
(2, 'WINTER2024', 15.00, '2023-08-25', 200, 17, '2023-07-15 06:58:01'),
(3, 'WINTER2023', 20.00, '2023-08-30', 80, 0, '2023-07-15 06:58:12'),
(5, 'NEW32', 32.00, '2023-08-26', 50, 0, '2023-07-16 16:25:06'),
(6, 'DH25', 25.00, '2023-11-30', 15, 3, '2023-08-20 11:40:09');

-- --------------------------------------------------------

--
-- Table structure for table `offer_date`
--

CREATE TABLE `offer_date` (
  `id` int(11) NOT NULL,
  `expire_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offer_date`
--

INSERT INTO `offer_date` (`id`, `expire_date`) VALUES
(1, '2023-11-30 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `order_data`
--

CREATE TABLE `order_data` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `order_status` varchar(255) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `applied_cupon` varchar(100) NOT NULL,
  `order_notes` varchar(100) NOT NULL,
  `comments` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_data`
--

INSERT INTO `order_data` (`id`, `user_id`, `order_number`, `order_status`, `total`, `applied_cupon`, `order_notes`, `comments`, `created_at`) VALUES
(42, 9, 'DH-20230805181549c992f0bc', 'pending', 80.00, '', '', '', '2023-08-05 12:15:49'),
(54, 15, 'DH-20230825101952d1077879', 'ontheway', 42.00, '', '', '', '2023-08-25 14:19:52'),
(55, 19, 'DH-202309140504479271c14a', 'pending', 60.00, '', 'hi', '', '2023-09-14 09:04:47'),
(56, 19, 'DH-20230914050447b08d6e54', 'pending', 60.00, '', 'hi', '', '2023-09-14 09:04:47'),
(57, 9, 'DH-20230929145025139c356e', 'pending', 60.00, '', '', '', '2023-09-29 18:50:25');

--
-- Triggers `order_data`
--
DELIMITER $$
CREATE TRIGGER `update_product_quantity_and_sale_count_on_cancel` AFTER UPDATE ON `order_data` FOR EACH ROW BEGIN
  IF NEW.order_status = 'cancelled' THEN
    UPDATE products AS p
    JOIN order_items AS oi ON p.id = oi.product_id
    SET 
      p.quantity = p.quantity + oi.quantity,
      p.sale_count = p.sale_count - oi.quantity
    WHERE oi.order_id = NEW.id;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `order_color` varchar(20) DEFAULT NULL,
  `order_size` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `order_color`, `order_size`) VALUES
(126, 42, 85, 3, 20.00, NULL, NULL),
(143, 54, 85, 1, 22.00, ' ', ' '),
(144, 55, 83, 1, 20.00, ' ', ' '),
(145, 55, 23, 1, 20.00, ' ', ' '),
(146, 56, 83, 1, 20.00, ' ', ' '),
(147, 56, 23, 1, 20.00, ' ', ' '),
(148, 57, 14, 2, 20.00, 'Medium', 'Red');

--
-- Triggers `order_items`
--
DELIMITER $$
CREATE TRIGGER `update_product_quantity_and_sale_count` AFTER INSERT ON `order_items` FOR EACH ROW BEGIN
  UPDATE products AS p
  SET 
    p.quantity = p.quantity - NEW.quantity,
    p.sale_count = p.sale_count + NEW.quantity
  WHERE p.id = NEW.product_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `payment_details`
--

CREATE TABLE `payment_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `payment_status` varchar(255) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_details`
--

INSERT INTO `payment_details` (`id`, `order_id`, `payment_method`, `payment_status`, `transaction_id`, `subtotal`, `shipping`, `discount`, `total`, `created_at`) VALUES
(8, 42, 'cash_on_delivery', 'unpaid', '', 60.00, 20.00, 0.00, 80.00, '2023-08-05 12:15:49'),
(20, 54, 'cash_on_delivery', 'paid', '', 22.00, 20.00, 0.00, 42.00, '2023-08-25 14:19:52'),
(21, 55, 'cash_on_delivery', 'unpaid', '', 40.00, 20.00, 0.00, 60.00, '2023-09-14 09:04:47'),
(22, 56, 'cash_on_delivery', 'unpaid', '', 40.00, 20.00, 0.00, 60.00, '2023-09-14 09:04:47'),
(23, 57, 'cash_on_delivery', 'unpaid', '', 40.00, 20.00, 0.00, 60.00, '2023-09-29 18:50:25');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`) VALUES
(1, 'blog.create'),
(3, 'blog.delete'),
(2, 'blog.edit'),
(4, 'blog.view'),
(26, 'brands.create'),
(27, 'brands.delete'),
(28, 'brands.edit'),
(29, 'brands.view'),
(18, 'categories.create'),
(19, 'categories.delete'),
(20, 'categories.edit'),
(21, 'categories.view'),
(34, 'coupons.create'),
(35, 'coupons.delete'),
(36, 'coupons.edit'),
(37, 'coupons.view'),
(6, 'dashboard.create'),
(7, 'dashboard.delete'),
(8, 'dashboard.edit'),
(9, 'dashboard.view'),
(10, 'orders.create'),
(11, 'orders.delete'),
(12, 'orders.edit'),
(13, 'orders.view'),
(14, 'products.create'),
(15, 'products.delete'),
(16, 'products.edit'),
(17, 'products.view'),
(30, 'settings.create'),
(31, 'settings.delete'),
(32, 'settings.edit'),
(33, 'settings.view'),
(22, 'subcategories.create'),
(23, 'subcategories.delete'),
(24, 'subcategories.edit'),
(25, 'subcategories.view'),
(38, 'user.create'),
(39, 'user.delete'),
(40, 'user.edit'),
(41, 'user.view');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT 0.00,
  `quantity` int(11) NOT NULL,
  `sale_count` int(11) DEFAULT 0,
  `warranty` int(11) DEFAULT 0,
  `is_offer` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL,
  `sku` varchar(256) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `cat_id` int(11) DEFAULT NULL,
  `subcat_id` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_name`, `price`, `old_price`, `quantity`, `sale_count`, `warranty`, `is_offer`, `description`, `sku`, `status`, `brand_id`, `cat_id`, `subcat_id`, `created_at`, `updated_at`) VALUES
(13, 'Dewlat Drywall', 20.00, 30.00, 15, 5, 3, 1, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', 'DH-STPLADDER201', 'active', 10, 31, 6, '2023-07-07 13:55:45', '2023-08-20 13:25:33'),
(14, '3D Art Wall', 20.00, 25.00, 33, 2, 2, 1, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 8, 31, 5, '2023-07-07 13:56:45', '2023-08-20 13:14:06'),
(15, 'Dewalt Miter Saw', 22.00, 32.00, 12, 0, 2, 0, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', 'Dh45k', '', 10, 1, 6, '2023-07-07 13:57:29', '2023-08-20 13:21:44'),
(16, 'Power Drills Dewalt', 20.00, 0.00, 10, 0, NULL, 0, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 10, 1, 5, '2023-07-07 13:58:04', '2023-08-20 13:13:20'),
(17, 'Jeld Wen bay Window', 20.00, 0.00, 10, 0, NULL, NULL, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 11, 33, 9, '2023-07-07 13:58:42', '2023-08-20 12:35:02'),
(18, 'Makita Rotary Hammer', 20.00, 0.00, 10, 0, NULL, 0, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 9, 34, 5, '2023-07-07 13:59:11', '2023-08-20 13:12:29'),
(19, 'Makita Screw Driver', 20.00, 0.00, 10, 0, NULL, 0, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 9, 34, 5, '2023-07-07 13:59:34', '2023-08-20 13:12:42'),
(20, 'Matt Black SingleHole', 20.00, 0.00, 6, 4, NULL, 0, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 7, 30, 5, '2023-07-07 14:00:08', '2023-08-20 13:01:10'),
(21, 'Ryobi Jigsaw', 20.00, 0.00, 10, 0, NULL, 0, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 8, 30, 5, '2023-07-07 14:00:34', '2023-08-20 13:13:01'),
(22, 'Ryobi Power Drills', 20.00, 0.00, 10, 0, NULL, 0, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 8, 1, 5, '2023-07-07 14:01:08', '2023-08-20 13:22:03'),
(23, 'Smudge Proof Stainless', 20.00, 0.00, 8, 2, NULL, 1, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 7, 29, 5, '2023-07-07 14:01:43', '2023-08-20 13:32:57'),
(24, 'Star light Chromeghor', 20.00, 0.00, 6, 4, NULL, 0, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 7, 30, 5, '2023-07-07 14:02:13', '2023-08-20 13:33:09'),
(25, 'Werner Step Ladder', 20.00, 0.00, 8, 2, NULL, 0, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 11, 30, 5, '2023-07-07 14:02:44', '2023-08-20 13:13:39'),
(27, 'White Polished Bathtub', 20.00, 0.00, 7, 3, NULL, 0, '<p>The GROHE Bau Cosmopolitan E Touchless Electronic Faucet is a common-sense solution for a safer, more hygienic bathroom experience. Sleek, modern design has a precise infra-red sensor that detects hand movement and turns the water on automatically without touching the faucet. Faucet turns off automatically when hands are no longer detected, ensuring water runs only when needed, and making it both eco-friendly and economical. Temperature Control Lever can be set to desired water temperature for comfort, eliminating the risk of scalding and optimizing energy savings. Featuring renowned German engineering, this touchless faucet incorporates GROHE Zero, an inner channel that protects water from contact with lead and nickel. In addition, GROHE EcoJoy provides superior efficiency, and a long-life battery ensures dependable performance.</p>', NULL, '', 11, 30, 5, '2023-07-07 14:03:16', '2023-08-20 13:13:57'),
(83, 'Royale Luxury Emulsion Paint Colour for Interior Walls', 20.00, 25.00, 1, 4, 5, 1, '<p><span style=\"color: rgb(77, 81, 86);\">In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a</span><span style=\"color: rgb(230, 0, 0);\"> typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available</span><span style=\"color: rgb(77, 81, 86);\">.</span></p><p><br></p><p><span style=\"color: rgb(77, 81, 86);\">In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.</span></p><blockquote><span style=\"color: rgb(77, 81, 86);\">In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.</span></blockquote><p><br></p><p><span style=\"color: rgb(77, 81, 86);\">In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.</span></p>', '10', '', 1, 1, 3, '2023-08-05 06:25:00', '2023-08-20 13:37:55'),
(85, 'Door White Colors Nice Door', 22.00, 50.00, 2, 13, 6, 1, '<p>Nice description here</p>', 'DH-578SRD', '', 7, 1, 6, '2023-08-05 11:07:43', '2023-08-20 13:35:52'),
(90, 'Crown Fruit Basket', 50.00, 55.00, 21, 9, 2, 1, '<p>Description here</p>', 'Gamin646', '', 1, 38, 3, '2023-08-13 18:23:51', '2023-08-20 13:50:48');

--
-- Triggers `products`
--
DELIMITER $$
CREATE TRIGGER `update_category_product_count` AFTER INSERT ON `products` FOR EACH ROW BEGIN
  UPDATE categories AS c
  SET product_count = product_count + 1
  WHERE c.id = NEW.cat_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_product_count` AFTER INSERT ON `products` FOR EACH ROW BEGIN
  UPDATE brands AS b
  SET product_count = product_count + 1
  WHERE b.id = NEW.brand_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_subcategory_product_count` AFTER INSERT ON `products` FOR EACH ROW BEGIN
  UPDATE subcategories AS sc
  SET product_count = product_count + 1
  WHERE sc.id = NEW.subcat_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `created_at`, `updated_at`) VALUES
(88, 17, 'images\\window jeld-images-1692534901950.png', '2023-08-20 12:35:01', '2023-08-20 12:35:01'),
(89, 20, 'images\\matt black single hole-images-1692536470107.jpg', '2023-08-20 13:01:10', '2023-08-20 13:01:10'),
(90, 18, 'images\\makita rottery hammer-images-1692537149376.png', '2023-08-20 13:12:29', '2023-08-20 13:12:29'),
(91, 19, 'images\\makita screw driver-images-1692537161977.png', '2023-08-20 13:12:42', '2023-08-20 13:12:42'),
(92, 21, 'images\\ryobi jigsaw-images-1692537181336.png', '2023-08-20 13:13:01', '2023-08-20 13:13:01'),
(93, 16, 'images\\dewalt power drill-images-1692537200073.png', '2023-08-20 13:13:20', '2023-08-20 13:13:20'),
(94, 25, 'images\\werner step ladder-images-1692537219858.png', '2023-08-20 13:13:39', '2023-08-20 13:13:39'),
(95, 27, 'images\\white polished batub-images-1692537237099.png', '2023-08-20 13:13:57', '2023-08-20 13:13:57'),
(96, 14, 'images\\3d art wall-images-1692537246638.png', '2023-08-20 13:14:06', '2023-08-20 13:14:06'),
(97, 15, 'images\\dewalt miter saw-images-1692537704494.png', '2023-08-20 13:21:44', '2023-08-20 13:21:44'),
(98, 22, 'images\\ryobi power drill-images-1692537723428.png', '2023-08-20 13:22:03', '2023-08-20 13:22:03'),
(99, 13, 'images\\dewalt power drill-images-1692537933106.png', '2023-08-20 13:25:33', '2023-08-20 13:25:33'),
(100, 90, 'images\\Crown-Fruit-Basket-300x300-images-1692538021032.jpg', '2023-08-20 13:27:01', '2023-08-20 13:27:01'),
(101, 23, 'images\\stainless sink-images-1692538377746.png', '2023-08-20 13:32:57', '2023-08-20 13:32:57'),
(102, 24, 'images\\starlight chrome-images-1692538389661.png', '2023-08-20 13:33:09', '2023-08-20 13:33:09'),
(103, 85, 'images\\door -images-1692538552033.png', '2023-08-20 13:35:52', '2023-08-20 13:35:52'),
(104, 83, 'images\\royal luxary asian paint-images-1692538675745.png', '2023-08-20 13:37:55', '2023-08-20 13:37:55'),
(105, 90, 'images\\Crown-Fruit-Basket-images-1692539448145.jpg', '2023-08-20 13:50:48', '2023-08-20 13:50:48');

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

CREATE TABLE `product_reviews` (
  `id` int(11) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `review_text` text NOT NULL,
  `rating` float NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_reviews`
--

INSERT INTO `product_reviews` (`id`, `product_id`, `user_id`, `review_text`, `rating`, `created_at`, `updated_at`) VALUES
(1, 13, 14, 'Nice product, good quality ', 4.5, '2023-08-01 02:57:51', '2023-08-01 02:57:51'),
(2, 13, 14, 'Nice product, good quality ', 5, '2023-08-01 02:59:34', '2023-08-01 02:59:34'),
(3, 13, 14, 'Nice product, good quality ', 4, '2023-08-01 02:59:41', '2023-08-01 02:59:41'),
(6, 27, 9, 'This is an awsome product. I am using this for 2 month. and I am really satisfied, I reommend everyone to buy this product. Also the service is very good', 5, '2023-08-01 23:27:29', '2023-08-01 23:27:29'),
(7, 27, 9, 'This is an awsome product. I am using this for 2 month. and I am really satisfied, I reommend everyone to buy this product. Also the service is very good', 5, '2023-08-01 23:27:52', '2023-08-01 23:27:52'),
(8, 27, 9, 'This is an awsome product. I am using this for 2 month. and I am really satisfied, I reommend everyone to buy this product. Also the service is very good', 4, '2023-08-01 23:29:42', '2023-08-01 23:29:42'),
(9, 27, 9, 'This is an awsome product. I am using this for 2 month. and I am really satisfied, I reommend everyone to buy this product. Also the service is very good', 3, '2023-08-01 23:29:57', '2023-08-01 23:29:57'),
(10, 25, 14, 'This is an awsome product. I am using this for 2 month. and I am really satisfied, I reommend everyone to buy this product. Also the service is very good', 5, '2023-08-01 23:47:41', '2023-08-01 23:47:41'),
(11, 13, 15, 'Test Review', 3, '2023-08-02 21:03:12', '2023-08-02 21:03:12'),
(12, 20, 15, 'Nice product', 4, '2023-08-04 11:56:13', '2023-08-04 11:56:13');

-- --------------------------------------------------------

--
-- Table structure for table `product_sizes`
--

CREATE TABLE `product_sizes` (
  `id` int(11) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `color_id` int(11) DEFAULT 0,
  `size` varchar(20) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_variations`
--

CREATE TABLE `product_variations` (
  `variation_id` int(11) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` varchar(20) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT NULL,
  `price_variation` decimal(10,2) DEFAULT NULL,
  `weight` decimal(8,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sku` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variations`
--

INSERT INTO `product_variations` (`variation_id`, `product_id`, `color`, `size`, `stock_quantity`, `price_variation`, `weight`, `image`, `sku`) VALUES
(79, 23, 'Black', NULL, 52, 23.00, NULL, NULL, NULL),
(80, 23, 'Black', NULL, 52, 23.00, NULL, NULL, NULL),
(93, 15, 'black', NULL, 5, 24.00, NULL, NULL, NULL),
(99, 16, '', NULL, 0, 0.00, NULL, NULL, NULL),
(100, 90, 'Yellow', NULL, 10, 50.00, NULL, 'images\\Crown-Fruit-Basket-images-1692539417255.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(21, 'Blogger'),
(2, 'customer'),
(24, 'manager'),
(20, 'superadmin'),
(23, 'writer');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `permission_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`) VALUES
(24, 20, 19),
(25, 20, 1),
(26, 20, 3),
(27, 20, 20),
(28, 20, 2),
(29, 20, 4),
(30, 20, 26),
(31, 20, 21),
(32, 20, 27),
(33, 20, 28),
(34, 20, 34),
(35, 20, 29),
(36, 20, 18),
(37, 20, 37),
(38, 20, 35),
(39, 20, 36),
(40, 20, 7),
(41, 20, 6),
(42, 20, 8),
(43, 20, 9),
(44, 20, 10),
(45, 20, 11),
(46, 20, 12),
(47, 20, 14),
(48, 20, 13),
(49, 20, 16),
(50, 20, 15),
(51, 20, 30),
(52, 20, 17),
(53, 20, 32),
(54, 20, 31),
(55, 20, 33),
(56, 20, 22),
(57, 20, 23),
(58, 20, 25),
(59, 20, 24),
(60, 20, 38),
(61, 20, 39),
(62, 20, 40),
(63, 20, 41),
(64, 21, 1),
(65, 21, 3),
(66, 21, 2),
(67, 21, 4),
(68, 23, 3),
(69, 23, 1),
(70, 24, 1),
(71, 24, 3),
(72, 24, 4),
(73, 24, 2),
(111, 1, 2),
(112, 1, 3),
(113, 1, 1),
(114, 1, 26),
(346, 2, 1),
(347, 2, 4),
(348, 2, 2),
(349, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `id` int(11) NOT NULL,
  `cat_id` int(11) DEFAULT 0,
  `subcat_name` varchar(255) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `product_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`id`, `cat_id`, `subcat_name`, `status`, `product_count`) VALUES
(0, 0, 'N/A', 'active', 1),
(3, 1, 'Batteries', 'active', 42),
(5, 1, 'Drills', 'active', 9),
(6, 1, 'Saw', 'active', 6),
(9, 31, 'Ladder', 'active', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `division` varchar(50) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `upazila` varchar(50) NOT NULL,
  `zipcode` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `status` enum('active','inactive','blocked') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `photo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `phone`, `address`, `division`, `city`, `upazila`, `zipcode`, `country`, `status`, `created_at`, `updated_at`, `photo_url`) VALUES
(1, 'John Doe', 'john@example.com', 'password123', '123456789', '123 Main St', '', 'City', '', '12345', 'Country', 'active', '2023-06-23 03:12:31', '2023-06-23 03:12:31', 'https://example.com/photo.jpg'),
(2, 'admin', 'admin@gmail.com', '1234', '123456', 'Dhaka', 'Dhaka', 'Dhaka', 'Keraniganj', '1200', 'BD', 'active', '2023-07-07 04:16:30', '2023-08-20 11:37:02', NULL),
(8, 'karim', 'karim@gmail.com', '1234', '123456', 'khulna', '', 'dhaka', '', '540', 'Bd', 'active', '2023-07-09 10:45:05', '2023-08-20 11:30:42', 'images\\355909826_1912979649087448_1503557125785896010_n-image-1688885105661.jpg'),
(9, 'Jahid Hasan Pintu', 'jahidhasanpintu82@gmail.com', '123456', '01748284223', 'Vagna School Road', 'Dhaka', 'Dhaka', 'Nawabganj', '1325', 'Bangladesh', 'active', '2023-07-14 05:38:26', '2023-07-23 02:50:16', 'https://jahidhasanpintu.netlify.app/images/about/about.png'),
(10, 'duser1', 'duser1@gmail.com', '1234', '017456688', 'daddress for user 1', 'Dhaka', 'Dhaka', 'Keraniganj', '1200', 'Bangladesh', 'blocked', '2023-07-14 06:08:59', '2023-07-17 17:02:48', NULL),
(11, 'duser2@gmail.com', 'duser2@gmail.com', '1234', '0123456', 'dadress2 ', '', 'Khulna', '', '1300', '', 'active', '2023-07-14 06:13:29', '2023-08-20 11:31:45', 'images\\355909826_1912979649087448_1503557125785896010_n-image-1689614277055.jpg'),
(12, 'duser3', 'duser3@gmail.com', 'Duser1234', '012345687', '3daddress here', 'Dhaka', 'Dhaka', 'Keraniganj', '13100', 'Dhaka', 'active', '2023-07-14 06:23:28', '2023-07-17 16:56:17', NULL),
(14, 'Abir Chowdhuri', 'abirchowdhuri54@gmail.com', '$2b$10$5NZbDNSTDur36gBwXP8sWuLxm8aS7I4Qj9zFLJR2un7R.akqQfAU6', '01748284223', 'vangna', '', 'dhaka', '', '1310', NULL, 'active', '2023-07-14 06:30:49', '2023-07-14 10:00:28', 'https://lh3.googleusercontent.com/a/AAcHTtdfEjrojIhKOwQxASQJj-LbCpXR3JUvpof1mgxNrBQ7=s96-c'),
(15, 'Finix Ware', 'finixware@gmail.com', '$2b$10$2efdKhNLBcWQ55tnDlCpKOr6Ngt3w7qCg7DNEpNn8IFTtaT9ChIYW', '0123456879', 'finix palace, finix town', 'Khulna', 'Bagerhat', 'Chitalmari', '9361', NULL, 'active', '2023-07-15 04:01:12', '2023-07-15 04:12:29', 'https://lh3.googleusercontent.com/a/AAcHTtfzMkgYzx-E24mp9FkxZXM1q49LiK8AIKP_nnIlNK5N=s96-c'),
(16, 'duser 5 ', 'duser5@gmail.com', '$2b$10$qGYTc2zjBSFv9l2iwJx7r.CvK23L4EYnBsFwHCoMJC9nAPiR/xdsO', '0326459', 'dplex, datta street', '', 'Dhaka', '', '1200', 'Bangladesh', 'active', '2023-07-17 02:56:23', '2023-07-17 02:56:23', 'images\\355909826_1912979649087448_1503557125785896010_n-image-1689562583296.jpg'),
(17, 'duser6', 'duser6@gmail.com', '$2b$10$7wdxRj5lA0125yrbEXrnSe9QYs79f5Tn69WrigK9cn57nOEaqIRDq', '0456879', 'road, 6 duser city ', 'dhaka', 'dhaka', 'keraniganj', '2300', 'bangladesh', 'active', '2023-07-17 03:12:28', '2023-07-17 03:12:28', 'images\\355909826_1912979649087448_1503557125785896010_n-image-1689563548408.jpg'),
(18, 'duser12', 'duser12@gmail.com', '$2b$10$dw2mX8Zo4EYKUlUScmnrMOMaD.1MZK78DBGaCmbbGSOgLiMQB6YjK', '547896', 'duser12 address', 'Khulna', 'Bagerhat', 'Chitalmari', '9361', 'Bangladesh', 'active', '2023-07-17 17:23:01', '2023-07-17 17:23:01', 'images\\tapcall-image-1689614581704.png'),
(19, 'The Duffer', 'duffferthe420@gmail.com', 'google8483X39874@jh$l#', '01675261140', '32 no narinda,dhaka-1100', 'Dhaka', 'Dhaka', 'Keraniganj', NULL, NULL, 'active', '2023-09-14 09:03:28', '2023-09-14 09:04:46', 'https://lh3.googleusercontent.com/a/ACg8ocKjEVmS0SvFwSRVdWfQksNgbjGuEvR_rjYw9qpdnixurQ=s96-c');

-- --------------------------------------------------------

--
-- Table structure for table `user_coupon`
--

CREATE TABLE `user_coupon` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `coupon_id` int(11) NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role_id`) VALUES
(1, 1, 1),
(5, 2, 20),
(6, 8, 1),
(7, 10, 2),
(9, 12, 2),
(11, 14, 2),
(12, 15, 2),
(13, 16, 2),
(14, 17, 2),
(15, 18, 2),
(16, 9, 2),
(17, 11, 2),
(18, 19, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_shipping_address`
--

CREATE TABLE `user_shipping_address` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  `upzila` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `blog_images`
--
ALTER TABLE `blog_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `blog_id` (`blog_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `offer_date`
--
ALTER TABLE `offer_date`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_data`
--
ALTER TABLE `order_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payment_details`
--
ALTER TABLE `payment_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `cat_id` (`cat_id`),
  ADD KEY `subcat_id` (`subcat_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_product_images_product_id` (`product_id`);

--
-- Indexes for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_variations`
--
ALTER TABLE `product_variations`
  ADD PRIMARY KEY (`variation_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cat_id` (`cat_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_coupon`
--
ALTER TABLE `user_coupon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `coupon_id` (`coupon_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_shipping_address`
--
ALTER TABLE `user_shipping_address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blog_images`
--
ALTER TABLE `blog_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `coupon`
--
ALTER TABLE `coupon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `offer_date`
--
ALTER TABLE `offer_date`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_data`
--
ALTER TABLE `order_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

--
-- AUTO_INCREMENT for table `payment_details`
--
ALTER TABLE `payment_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `product_variations`
--
ALTER TABLE `product_variations`
  MODIFY `variation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=350;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `user_coupon`
--
ALTER TABLE `user_coupon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user_shipping_address`
--
ALTER TABLE `user_shipping_address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `blog_images`
--
ALTER TABLE `blog_images`
  ADD CONSTRAINT `blog_images_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`);

--
-- Constraints for table `order_data`
--
ALTER TABLE `order_data`
  ADD CONSTRAINT `order_data_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order_data` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `payment_details`
--
ALTER TABLE `payment_details`
  ADD CONSTRAINT `payment_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order_data` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`cat_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`subcat_id`) REFERENCES `subcategories` (`id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `fk_product_images_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `product_variations`
--
ALTER TABLE `product_variations`
  ADD CONSTRAINT `product_variations_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`);

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`cat_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_coupon`
--
ALTER TABLE `user_coupon`
  ADD CONSTRAINT `user_coupon_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_coupon_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `user_shipping_address`
--
ALTER TABLE `user_shipping_address`
  ADD CONSTRAINT `user_shipping_address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
