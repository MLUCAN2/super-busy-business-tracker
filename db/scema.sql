DROP DATABASE IF EXISTS employee_tracker_db
CREATE DATABASE employee_tracker_db

CREATE TABLE departments (
	id SERIAL PRIMARY KEY,
	department_name VARCHAR(50) NOT NULL
);

CREATE TABLE roles (
	id SERIAL PRIMARY KEY,
	title VARCHAR(50) NOT NULL,
	salary DECIMAL NOT NULL,
	department_id INTEGER NOT NULL,
	FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employee(
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	role_id INTEGER NOT NULL,
	manager_id INTEGER,
	FOREIGN KEY (role_id) REFERENCES roles(id),
	FOREIGN KEY (manager_id) REFERENCES employee(id)
);
