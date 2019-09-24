BEGIN;

  TRUNCATE
    users,
    rides
  RESTART IDENTITY CASCADE;

  INSERT INTO users
    ("user_id", "email", "name")
  VALUES
    ('113938795112280626788', 'andrewyin1994@gmail.com', 'Andrew Yin'),
    ('103339967984381402998', 'bobsmith3175@gmail.com', 'Bob Smith' ),
    ('112539454699313514648', 'utest6581@gmail.com', 'test user'),
    ('101820519124146512532', 'tuser0763@gmail.com', 'test User');


  INSERT INTO rides ("driver_id", "starting", "destination", "date_time", "description", "capacity", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "driver_name")
  VALUES
  (113938795112280626788, 'Blacksburg', 'Virginia Beach', '2019-09-16 08:00:00', '$10 for gas', 4, 112539454699313514648, null, null, null, null, null, null, 'Andrew Yin'),
  (113938795112280626788, 'Virginia Beach', 'Blacksburg', '2019-09-17 14:00:00', '$10 for gas, limited trunk space', 4, 101820519124146512532, 112539454699313514648, null, null, null, null, null, 'Andrew Yin'),
  (103339967984381402998, 'Blacksburg', 'Fairfax', '2019-09-17 18:00:00', 'No charge, hop in', 5, 113938795112280626788, 101820519124146512532, 112539454699313514648, null, null, null, null, 'Bob Smith');

COMMIT;
