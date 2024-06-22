
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    hashed_pw text NOT NULL,
    email text NOT NULL CHECK (position('@' IN email) > 1),
    created_at TIMESTAMP,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
)

CREATE TABLE cars(
    owner_id INTEGER REFERENCES users ON DELETE CASCADE,
    make VARCHAR(20) NOT NULL,
    model VARCHAR(50) NOT NULL,
    model_year INTEGER(4) NOT NULL
)

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    body TEXT(260),
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    created_at TIMESTAMP
)

CREATE TABLE drives (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    description TEXT,
    route_link, TEXT,
    created_at TIMESTAMP
)

CREATE TABLE users_drives(
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    drive_id INTEGER REFERENCES drives ON DELETE CASCADE
)

