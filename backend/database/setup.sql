CREATE DATABASE nandha_garments;
USE nandha_garments;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('superadmin', 'business', 'individual') NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'blocked') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_status (status)
);

CREATE TABLE business_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    legal_entity_name VARCHAR(255) NOT NULL,
    gst_number VARCHAR(15) NOT NULL,
    pan_number VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    contact_person_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    logo LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_gst (gst_number),
    INDEX idx_pan (pan_number)
);

CREATE TABLE individual_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_name (name)
);

CREATE TABLE measurements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    customer_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    notes TEXT,
    chest DECIMAL(5,2) NOT NULL,
    waist DECIMAL(5,2) NOT NULL,
    seat DECIMAL(5,2) NOT NULL,
    shirtLength DECIMAL(5,2) NOT NULL,
    armLength DECIMAL(5,2) NOT NULL,
    neck DECIMAL(5,2) NOT NULL,
    hip DECIMAL(5,2) NOT NULL,
    poloShirtLength DECIMAL(5,2) NOT NULL,
    shoulderWidth DECIMAL(5,2) NOT NULL,
    wrist DECIMAL(5,2) NOT NULL,
    biceps DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_name (name)
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    images JSON,
    available_sizes JSON,
    specifications JSON,
    status ENUM('active', 'inactive') DEFAULT 'active',
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_status (status),
    INDEX idx_price (selling_price),
    INDEX idx_created_at (created_at)
);

CREATE TABLE cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    size VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product_size (user_id, product_id, size),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'in_progress', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    measurement_id INT,
    payment_method ENUM('cod') DEFAULT 'cod',
    payment_status ENUM('pending', 'paid') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (measurement_id) REFERENCES measurements(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_measurement_id (measurement_id)
);

CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    size VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

INSERT INTO users (email, password_hash, user_type, status) VALUES 
('admin@nandhagarments.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RIY8rN8s6', 'superadmin', 'approved'),
('business@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RIY8rN8s6', 'business', 'approved'),
('individual@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RIY8rN8s6', 'individual', 'approved');

INSERT INTO business_profiles (user_id, legal_entity_name, gst_number, pan_number, address, contact_person_name, contact_number) VALUES 
(2, 'ABC Textiles Pvt Ltd', '22AAAAA0000A1Z5', 'AAAAA0000A', '123 Business Street, Coimbatore, Tamil Nadu, 641001', 'John Doe', '9876543210');

INSERT INTO individual_profiles (user_id, name, contact_number, address) VALUES 
(3, 'Jane Smith', '9876543210', '456 Home Street, Coimbatore, Tamil Nadu, 641002');

INSERT INTO products (name, description, price, selling_price, images, available_sizes, specifications) VALUES 
('Premium Cotton Shirt', 'High-quality cotton shirt perfect for formal occasions', 2000.00, 1500.00, '["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVR"]', '["S", "M", "L", "XL"]', '{"material": "100% Cotton", "care": "Machine washable", "origin": "India"}'),
('Formal Pants', 'Comfortable formal pants for office wear', 3000.00, 2500.00, '["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVR"]', '["30", "32", "34", "36", "38"]', '{"material": "Cotton Blend", "care": "Dry clean", "origin": "India"}'),
('Casual T-Shirt', 'Comfortable casual t-shirt for everyday wear', 800.00, 600.00, '["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVR"]', '["S", "M", "L", "XL", "XXL"]', '{"material": "Cotton", "care": "Machine washable", "origin": "India"}');

INSERT INTO measurements (user_id, customer_id, name, gender, notes, chest, waist, seat, shirtLength, armLength, neck, hip, poloShirtLength, shoulderWidth, wrist, biceps) VALUES 
(2, 'CUST001', 'John Customer', 'male', 'Prefers loose fit', 40.0, 34.0, 38.0, 28.0, 24.0, 15.5, 36.0, 26.0, 18.0, 7.0, 14.0),
(3, NULL, 'My Measurements', 'female', 'Standard fit', 36.0, 28.0, 36.0, 26.0, 22.0, 13.5, 38.0, 24.0, 16.0, 6.5, 12.0);

INSERT INTO orders (user_id, total_amount, status, delivery_address, measurement_id) VALUES 
(2, 4000.00, 'pending', '123 Business Street, Coimbatore, Tamil Nadu, 641001', 1),
(3, 600.00, 'confirmed', '456 Home Street, Coimbatore, Tamil Nadu, 641002', 2);

INSERT INTO order_items (order_id, product_id, product_name, quantity, price, size) VALUES 
(1, 1, 'Premium Cotton Shirt', 2, 1500.00, 'L'),
(1, 2, 'Formal Pants', 1, 2500.00, '34'),
(2, 3, 'Casual T-Shirt', 1, 600.00, 'M');