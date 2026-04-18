CREATE DATABASE IF NOT EXISTS pizza_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_hungarian_ci;

USE pizza_db;

DROP TABLE IF EXISTS rendeles;
DROP TABLE IF EXISTS pizza;
DROP TABLE IF EXISTS kategoria;

CREATE TABLE kategoria (
  nev VARCHAR(50) NOT NULL,
  ar INT NOT NULL,
  PRIMARY KEY (nev)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE pizza (
  nev VARCHAR(100) NOT NULL,
  kategorianev VARCHAR(50) NOT NULL,
  vegetarianus TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (nev),
  CONSTRAINT fk_pizza_kategoria
    FOREIGN KEY (kategorianev) REFERENCES kategoria(nev)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE rendeles (
  az INT NOT NULL AUTO_INCREMENT,
  pizzanev VARCHAR(100) NOT NULL,
  darab INT NOT NULL,
  felvetel DATETIME NOT NULL,
  kiszallitas DATETIME DEFAULT NULL,
  PRIMARY KEY (az),
  CONSTRAINT fk_rendeles_pizza
    FOREIGN KEY (pizzanev) REFERENCES pizza(nev)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO kategoria (nev, ar) VALUES
('apród', 850),
('főnemes', 950),
('király', 1250),
('lovag', 1150);

INSERT INTO pizza (nev, kategorianev, vegetarianus) VALUES
('Áfonyás', 'király', 0),
('Babos', 'lovag', 0),
('Barbecue chicken', 'lovag', 0),
('Betyáros', 'király', 0),
('Caribi', 'apród', 0),
('Country', 'király', 0),
('Csabesz', 'király', 0),
('Csupa sajt', 'lovag', 1),
('Erdő kapitánya', 'apród', 0),
('Erős János', 'lovag', 0),
('Excellent', 'király', 0),
('Főnök kedvence', 'lovag', 0),
('Francia', 'főnemes', 0),
('Frankfurti', 'király', 0),
('Füstös', 'lovag', 0),
('Gino', 'király', 0),
('Gombás', 'apród', 1),
('Góré', 'lovag', 0),
('Görög', 'király', 0),
('Gyros pizza', 'király', 0),
('HamAndEggs', 'lovag', 0),
('Hamm', 'lovag', 0),
('Hawaii', 'főnemes', 0),
('Hellas', 'király', 0),
('Hercegnő', 'király', 0),
('Ilike', 'lovag', 0),
('Ínyenc', 'lovag', 0),
('Jázmin álma', 'lovag', 0),
('Jobbágy', 'király', 0),
('Juhtúrós', 'lovag', 0),
('Kagylós', 'király', 0),
('Kétszínű', 'lovag', 0),
('Kiadós', 'király', 0),
('Király pizza', 'király', 0),
('Kívánság', 'lovag', 1),
('Kolbászos', 'apród', 0),
('Lagúna', 'király', 1),
('Lecsó', 'király', 0),
('Maffiózó', 'lovag', 0),
('Magvas', 'király', 1),
('Magyaros', 'lovag', 0),
('Máj Fair Lady', 'király', 0),
('Mamma fia', 'király', 0),
('Mexikói', 'főnemes', 0),
('Mixi', 'főnemes', 1),
('Nikó', 'király', 0),
('Nordic', 'király', 0),
('Nyuszó-Muszó', 'király', 0),
('Pacalos', 'lovag', 0),
('Pástétomos', 'király', 0),
('Pásztor', 'lovag', 0),
('Pipis', 'lovag', 0),
('Popey', 'király', 0),
('Quattro', 'király', 0),
('Ráki', 'király', 0),
('Rettenetes magyar', 'lovag', 0),
('Röfi', 'király', 0),
('Sajtos', 'apród', 1),
('So-ku', 'apród', 0),
('Son-go-ku', 'főnemes', 1),
('Sonkás', 'apród', 0),
('Spanyol', 'király', 0),
('Spencer', 'főnemes', 0),
('Szalámis', 'apród', 0),
('Szardíniás', 'lovag', 0),
('Szerzetes', 'király', 0),
('Szőke kapitány', 'király', 0),
('Tenger gyümölcsei', 'király', 0),
('Tonhalas', 'lovag', 0),
('Törperős', 'lovag', 0),
('Tündi kedvence', 'király', 0),
('Tüzes halál', 'király', 0),
('Vega', 'lovag', 1),
('Zöldike', 'főnemes', 1);
