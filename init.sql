CREATE TABLE data (
    ID serial PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    due_date VARCHAR(10) NOT NULL);

INSERT INTO data (email, description, due_date)
VALUES ('testing@gmail.com', 'testin testin testing tsetings .....................................................', '2021-11-30');