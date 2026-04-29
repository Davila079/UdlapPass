USE `infsoft_db`;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS administrators;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS access_logs;
CREATE TABLE users (
  id            INT PRIMARY KEY,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('estudiante', 'empleado', 'administrador') NOT NULL
);

CREATE TABLE students (
  user_id       INT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  career        VARCHAR(100) NOT NULL,
  semester      INT NOT NULL CHECK (semester BETWEEN 1 AND 12),
  scholarship   VARCHAR(100) NOT NULL,
  is_enrolled   BOOLEAN DEFAULT TRUE,
  is_resident   BOOLEAN DEFAULT FALSE,
  residence     VARCHAR(100) DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE employees (
  user_id       INT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  area          VARCHAR(100) NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE administrators (
  user_id       INT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  area          VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE access_logs (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  type        ENUM('entrada', 'salida') NOT NULL,
  method      VARCHAR(50) NOT NULL,
  location    VARCHAR(100) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO users (id, email, password_hash, role) VALUES
  (183112, 'david.medina@universidad.edu',   '$2b$10$bInRqxulgXLFv1t/UfknAuYKDk.IhAxjz.UqJ7AyairiN0ZI5n/96', 'estudiante'),
  (183913, 'elisa.mendoza@universidad.edu',  '$2b$10$bInRqxulgXLFv1t/UfknAuYKDk.IhAxjz.UqJ7AyairiN0ZI5n/96', 'estudiante'),
  (2, 'carlos.ruiz@universidad.edu',    '$2b$10$bInRqxulgXLFv1t/UfknAuYKDk.IhAxjz.UqJ7AyairiN0ZI5n/96', 'empleado'),
  (1, 'anellisse@universidad.edu',          '$2b$10$bInRqxulgXLFv1t/UfknAuYKDk.IhAxjz.UqJ7AyairiN0ZI5n/96', 'administrador'),
   (183604, 'mafer@correo.com',   '$2b$10$bInRqxulgXLFv1t/UfknAuYKDk.IhAxjz.UqJ7AyairiN0ZI5n/96', 'estudiante');

INSERT INTO students (user_id, full_name, career, semester, scholarship, is_enrolled, is_resident, residence) VALUES
  (183112, 'David Miguel Medina Raymundo', 'Ingeniería en Sistemas Computacionales', 5, 'Académica', TRUE, TRUE,  'Gaos'),
  (183913, 'Elisa Mendoza Cárdenas',       'Historia del Arte y Curaduría',          4, 'Sin Beca',  TRUE, FALSE, NULL),
  (183604, 'Maria Fernanda Morales Hernandez', 'Ingeniería en Sistemas Computacionales', 4, 'Académica', TRUE, FALSE,  NULL);

INSERT INTO employees (user_id, full_name, area, is_active) VALUES
  (2, 'Carlos Ruiz Pérez', 'Servicios Escolares', TRUE);

INSERT INTO administrators (user_id, full_name, area) VALUES
  (1, 'Anellisse Herrera Maldonado', 'Dirección');
  
INSERT INTO access_logs (user_id, type, method, location, created_at) VALUES
  (1,      'entrada',  'QR',         'Proveedores',  '2026-04-15 07:32:00'),
  (1,      'salida',   'QR',         'Recta',  '2026-04-15 14:15:00'),
  (2,      'entrada',  'Credencial', 'Recta',  '2026-04-15 06:45:00'),
  (2,      'entrada',  'QR',         'Gaos',      '2026-04-15 06:00:00'),
  (183112, 'entrada',  'Vehicular',  'Recta',  '2026-04-14 08:10:00'),
  (2,      'salida',   'QR',         'Periferico',  '2026-04-14 17:30:00'),
  (183112, 'entrada',  'QR',         'Proveedores',  '2026-04-13 09:00:00'),
  (183112, 'salida',   'QR',         'Gaos',  '2026-04-13 13:45:00'),
  (2,      'entrada',  'Credencial', 'Periferico',  '2026-04-13 07:00:00'),
  (2,      'entrada',  'QR',         'Periferico',      '2026-04-13 06:00:00'),
  (183913, 'entrada',  'QR',         'Recta',  '2026-04-12 07:50:00'),
  (183913, 'salida',   'QR',         'Proveedores',  '2026-04-12 15:20:00');