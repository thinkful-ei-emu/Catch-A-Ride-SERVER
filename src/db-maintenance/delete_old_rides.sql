delete from rides
where date_time < now() - interval '1 day'