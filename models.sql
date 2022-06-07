-- creating the Publishers table model
CREATE TABLE Publishers (
	id INT IDENTITY(1,1) PRIMARY KEY,
	first_name NVARCHAR(50) NOT NULL,
	last_name NVARCHAR(50) NOT NULL,
	email NVARCHAR(50) UNIQUE NOT NULL,
	account_password NVARCHAR(50) NOT NULL,
)
-- creating the Books table model
CREATE TABLE Books (
	id INT IDENTITY(1,1) PRIMARY KEY,
	book_name NVARCHAR(50) NOT NULL,
	author NVARCHAR(50) NOT NULL,
	file_path NVARCHAR(100) NOT NULL,
	publisher_id INT FOREIGN KEY REFERENCES Publishers(id) NOT NULL,
)