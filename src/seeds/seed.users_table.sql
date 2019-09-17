BEGIN;

  TRUNCATE
    users
  RESTART IDENTITY CASCADE;

  INSERT INTO users
    ("user_id", "email", "name")
  VALUES
    ('113938795112280626788', 'andrewyin1994@gmail.com', 'Andrew Yin');

COMMIT;