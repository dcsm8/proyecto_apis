-- Paso 1: Asegurar extensiones y funciones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION public.random_text(length integer)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$function$;

-- Paso 2: Insertar países
INSERT INTO country_entity (id, name)
SELECT
  uuid_generate_v4(),
  'Country_' || substr(md5(random()::text), 1, 8)
FROM generate_series(1, 100000);

-- Paso 3: Insertar categorías (si no lo has hecho)
INSERT INTO category_entity (id, name)
SELECT
  uuid_generate_v4(),
  'Category_' || substr(md5(random()::text), 1, 8)
FROM generate_series(1, 100000);

-- Paso 4: Insertar culturas culinarias
INSERT INTO culinary_culture_entity (id, name, description)
SELECT
  uuid_generate_v4(),
  'CulinaryCulture_' || substr(md5(random()::text), 1, 8),
  random_text(100)
FROM generate_series(1, 100000);

-- Paso 5: Insertar productos
INSERT INTO product_entity (id, name, description, history, "categoryId")
SELECT
  uuid_generate_v4(),
  'Product_' || substr(md5(random()::text), 1, 8),
  random_text(100),
  random_text(200),
  (SELECT id FROM category_entity ORDER BY random() LIMIT 1)
FROM generate_series(1, 100000);

-- Paso 6: Insertar recetas
INSERT INTO recipe_entity (id, name, description, photo, preparation, video, "culinaryCultureId")
SELECT
  uuid_generate_v4(),
  'Recipe_' || substr(md5(random()::text), 1, 8),
  random_text(100),
  'https://example.com/photos/' || substr(md5(random()::text), 1, 8) || '.jpg',
  random_text(200),
  'https://example.com/videos/' || substr(md5(random()::text), 1, 8) || '.mp4',
  (SELECT id FROM culinary_culture_entity ORDER BY random() LIMIT 1)
FROM generate_series(1, 100000);

-- Paso 7: Insertar restaurantes
INSERT INTO restaurant_entity (id, name, city, country, "michelinStars", "michelinStarDate")
SELECT
  uuid_generate_v4(),
  'Restaurant_' || substr(md5(random()::text), 1, 8),
  'City_' || substr(md5(random()::text), 1, 8),
  'Country_' || substr(md5(random()::text), 1, 8),
  CASE WHEN random() > 0.5 THEN floor(random() * 4)::int ELSE NULL END,
  CASE WHEN random() > 0.5 THEN
    timestamp '2021-01-01' + random() * (timestamp '2023-12-31' - timestamp '2021-01-01')
  ELSE NULL END
FROM generate_series(1, 100000);
