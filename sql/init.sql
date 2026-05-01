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
-- Market User: Tok Market
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('tok-market@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'market', 'Tok Market', 'Ankara', 'Bilkent', TRUE);

-- Consumer User: John Doe
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('consumer@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'consumer', 'John Doe', 'Ankara', 'Bilkent', TRUE);

-- Consumer 2 (different district): Jane Doe
INSERT INTO users (email, password, role, name, city, district, is_verified) VALUES 
('jane@gmail.com', '$2b$10$dHBl9BdDBs7Y1wE7jP89L.oYi8Q8kH/JwxEl2sP8n7noIiObQs.DC', 'consumer', 'Jane Doe', 'Ankara', 'Cankaya', TRUE);

-- Products (Assuming market user has id=1)
INSERT INTO products (title, stock, normal_price, discounted_price, expiration_date, image_filename, market_id) VALUES 
('Toblerone 100gr', 25, 200.00, 120.00, DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'toblerone.jpg', 1),
('Magnum Ice Cream', 50, 45.00, 30.00, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'magnum.jpg', 1),
('Magnolia Cake', 10, 150.00, 80.00, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'magnolia.jpg', 1),
('Nutmeg Spice', 100, 50.00, 20.00, DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 'nutmeg.jpg', 1),
('Expired Milk 1L', 5, 30.00, 10.00, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'milk.jpg', 1);
