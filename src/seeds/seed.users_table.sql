BEGIN;

  TRUNCATE
    users
  RESTART IDENTITY CASCADE;

  INSERT INTO users
    ("user_id", "email", "name")
  VALUES
    ('113938795112280626788', 'andrewyin1994@gmail.com', 'Andrew Yin'),
    ('103339967984381402998', 'bobsmith3175@gmail.com', 'Bob Smith' ),
    ('112539454699313514648', 'utest6581@gmail.com', 'test user'),
    ('101820519124146512532', 'tuser0763@gmail.com', 'test User');

COMMIT;