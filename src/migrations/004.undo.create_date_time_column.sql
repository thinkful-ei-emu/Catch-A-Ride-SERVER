ALTER TABLE rides DROP COLUMN date_time;

ALTER TABLE rides ADD date date;

ALTER TABLE rides ADD time time;
