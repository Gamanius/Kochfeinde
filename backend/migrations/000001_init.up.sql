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
    
    recipe_id uuid NOT NULL REFERENCES "recipes"(id) ON DELETE CASCADE,

    section_name TEXT DEFAULT NULL,
    position int NOT NULL DEFAULT 0,
    description TEXT NOT NULL
);

CREATE TABLE recipe_ingredients (
    id uuid PRIMARY KEY DEFAULT uuidv7(),
    ingredient_id uuid NOT NULL REFERENCES "ingredients" (id) ON DELETE CASCADE,
    recipe_id uuid NOT NULL REFERENCES "recipes" (id) ON DELETE CASCADE,
    recipe_step_id uuid NOT NULL REFERENCES "recipe_step" (id) ON DELETE CASCADE,

    section_name TEXT DEFAULT NULL,
    position int NOT NULL DEFAULT 0,
    amount FLOAT NOT NULL DEFAULT 0
);

