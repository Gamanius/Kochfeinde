CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),

    password_hash TEXT NOT NULL,
    otp_hash TEXT NOT NULL
);

CREATE TABLE ingredients (
    id uuid PRIMARY KEY DEFAULT uuidv7(),
    slug TEXT UNIQUE NOT NULL,

    title TEXT NOT NULL,

    calories INT NOT NULL DEFAULT 0,
    totalFat INT NOT NULL DEFAULT 0,
    fatUnsaturated INT NOT NULL DEFAULT 0,
    fatSaturated INT NOT NULL DEFAULT 0,
    cholesterol INT NOT NULL DEFAULT 0,
    totalCarbohydrates INT NOT NULL DEFAULT 0,
    totalSugars INT NOT NULL DEFAULT 0,
    dietaryFiber INT NOT NULL DEFAULT 0,
    protein INT NOT NULL DEFAULT 0,
    salt INT NOT NULL DEFAULT 0,
    water INT NOT NULL DEFAULT 0,
    vitaminA INT NOT NULL DEFAULT 0,
    vitaminB12 INT NOT NULL DEFAULT 0,
    vitaminC INT NOT NULL DEFAULT 0,
    vitaminD INT NOT NULL DEFAULT 0,
    potassium INT NOT NULL DEFAULT 0,
    sodium INT NOT NULL DEFAULT 0,
    calcium INT NOT NULL DEFAULT 0,
    iron INT NOT NULL DEFAULT 0,

    density DOUBLE PRECISION DEFAULT NULL,

    keywords TEXT [] NOT NULL 
);

CREATE TABLE recipes (
    id uuid PRIMARY KEY DEFAULT uuidv7(),
    slug TEXT UNIQUE NOT NULL,
    
    title TEXT NOT NULL,
    description TEXT DEFAULT NULL,

    time_taken INT NOT NULL DEFAULT 60,
    time_active INT NOT NULL DEFAULT 60,

    portion_num INT NOT NULL DEFAULT 4,
    portion_string TEXT NOT NULL 
);

CREATE TABLE recipe_step (
    id uuid PRIMARY KEY DEFAULT uuidv7(),
    
    recipe_id uuid NOT NULL REFERENCES "recipes" (id) ON DELETE CASCADE,

    section_name TEXT DEFAULT NULL,
    position int NOT NULL DEFAULT 0,
    description TEXT NOT NULL
);

CREATE TABLE recipe_ingredients (
    id uuid PRIMARY KEY DEFAULT uuidv7(),
    
    ingredient_id uuid  NOT NULL REFERENCES "ingredients" (id) ON DELETE RESTRICT,
    recipe_id uuid      NOT NULL REFERENCES "recipes" (id) ON DELETE CASCADE,
    recipe_step_id uuid NOT NULL REFERENCES "recipe_step" (id) ON DELETE CASCADE,

    section_name TEXT DEFAULT NULL,
    position int NOT NULL DEFAULT 0,
    amount FLOAT NOT NULL DEFAULT 0
);

