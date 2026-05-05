CREATE DATABASE IF NOT EXISTS test;
USE test;

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role ENUM('market', 'consumer') NOT NULL,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  verification_code VARCHAR(10),
  is_verified BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  stock INT NOT NULL,
  normal_price DECIMAL(10, 2) NOT NULL,
  discounted_price DECIMAL(10, 2) NOT NULL,
  expiration_date DATE NOT NULL,
  image_filename VARCHAR(255) NOT NULL,
  market_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (market_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cart_items (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data (Password is '1234' for all test users)
-- Market User 1: Tok Market
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('tok-market@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'market', 'Tok Market', 'Ankara', 'Bilkent', TRUE);

-- Market User 2: Bim Market
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('bim-market@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'market', 'Bim Market', 'Ankara', 'Cankaya', TRUE);

-- Market User 3: File Market
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('file-market@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'market', 'File Market', 'Ankara', 'Cankaya', TRUE);

-- Market User 4: Target Market
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('target-market@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'market', 'Target Market', 'Ankara', 'Bilkent', TRUE);


-- Consumer 1: John Doe
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('consumer@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'consumer', 'John Doe', 'Ankara', 'Bilkent', TRUE);

-- Consumer 2 (different district): Jane Doe
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('jane@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'consumer', 'Jane Doe', 'Ankara', 'Cankaya', TRUE);

-- Consumer 3: Ali Koca
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('ali@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'consumer', 'Ali Koca', 'Ankara', 'Bilkent', TRUE);

-- Consumer 4: Hasan Kara
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('hasan@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'consumer', 'Hasan Kara', 'Ankara', 'Cankaya', TRUE);

-- Consumer 5: Daniel McDonald
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('daniel@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'consumer', 'Daniel McDonald', 'Ankara', 'Bilkent', TRUE);

-- Consumer 6: Kyra Hopkins
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('kyra@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'consumer', 'Kyra Hopkins', 'Ankara', 'Cankaya', TRUE);

-- Products for (market user has id=1) Tok
INSERT INTO products (title, stock, normal_price, discounted_price, expiration_date, image_filename, market_id) VALUES 
('Toblerone 100gr', 25, 200.00, 120.00, DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'toblerone.jpg', 1),
('Magnum Ice Cream', 50, 45.00, 30.00, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'magnum.jpg', 1),
('Magnolia Cake', 10, 150.00, 80.00, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'magnolia.jpg', 1),
('Nutmeg Spice', 100, 50.00, 20.00, DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 'nutmeg.jpg', 1);

-- Products for (market user has id=2) Bim
INSERT INTO products (title, stock, normal_price, discounted_price, expiration_date, image_filename, market_id) VALUES 
('Milk 1L', 5, 30.00, 10.00, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'milk.jpg', 2),
('Banana 1kg', 40, 60.00, 35.00, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'banana.jpg', 2),
('Apple 1kg', 60, 50.00, 30.00, DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'apple.jpg', 2),
('Cheese', 15, 120.00, 85.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH), 'cheese.jpg', 2);

-- Products for (market user has id=3) File 
INSERT INTO products (title, stock, normal_price, discounted_price, expiration_date, image_filename, market_id) VALUES 
('Tomato 1kg', 30, 40.00, 20.00, DATE_SUB(CURDATE(), INTERVAL 12 DAY), 'tomato.jpg', 3),
('Cucumber 1kg', 70, 35.00, 18.00, DATE_SUB(CURDATE(), INTERVAL 8 DAY), 'cucumber.jpg', 3),
('Orange Juice 1L', 45, 80.00, 55.00, DATE_SUB(CURDATE(), INTERVAL 8 DAY), 'orangejuice.jpg', 3),
('Eggs (12 Pack)', 50, 110.00,75.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH), 'eggs.jpg', 3);

-- Products for (market user has id=4) Target 
INSERT INTO products (title, stock, normal_price, discounted_price, expiration_date, image_filename, market_id) VALUES 
('Nutella', 30, 200.00, 120.00, DATE_SUB(CURDATE(), INTERVAL 25 DAY), 'nutella.jpg', 4),
('Toast Bread', 60, 65.00, 40.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH), 'toast.jpg', 4),
('Yoghurt', 25, 60.00, 40.00, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'yoghurt.jpg', 4),
('Ketchup', 80, 70.00, 35.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH), 'ketchup.jpg', 4);
