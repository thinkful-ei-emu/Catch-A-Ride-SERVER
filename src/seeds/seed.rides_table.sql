BEGIN;

TRUNCATE
rides;

INSERT INTO rides ("id", "driver_id", "starting", "destination", "date", "time", "description", "capacity", "p1", "p2", "p3", "p4", "p5", "p6", "p7")
VALUES
(1, 113938795112280626788, 'Blacksburg', 'Virginia Beach', '2019-09-16', '08:00:00', '$10 for gas', 4, 112539454699313514648, null, null, null, null, null, null),
(2, 113938795112280626788, 'Virginia Beach', 'Blacksburg', '2019-09-17', '14:00:00', '$10 for gas, limited trunk space', 4, 112539454699313514648, 101820519124146512532, null, null, null, null, null),
(3, 103339967984381402998, 'Blacksburg', 'Fairfax', '2019-09-17', '18:00:00', 'No charge, hop in', 5, 113938795112280626788, 101820519124146512532, null, null, null, null, null);

COMMIT;