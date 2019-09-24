ALTER TABLE rides DROP COLUMN date_time

ALTER TABLE rides ADD date date not null

ALTER TABLE rides ADD time time not null;
