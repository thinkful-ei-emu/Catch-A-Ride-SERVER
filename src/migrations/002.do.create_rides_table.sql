BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table rides (
id uuid primary key default uuid_generate_v4(),
driver_id varchar references users(user_id),
starting text not NULL,
destination text not NULL,
date date not null,
time time not null,
description text not NULL,
capacity integer not null,
p1 varchar references users(user_id) default null,
p2 varchar references users(user_id) default null,
p3 varchar references users(user_id) default null,
p4 varchar references users(user_id) default null,
p5 varchar references users(user_id) default null,
p6 varchar references users(user_id) default null,
p7 varchar references users(user_id) default null
);

COMMIT;