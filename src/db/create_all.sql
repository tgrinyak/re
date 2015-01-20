CREATE USER re_root WITH PASSWORD 'rerootpass';

CREATE DATABASE re OWNER re_root;

GRANT CONNECT ON DATABASE re TO re_root;

-- psql -U re_root -d re


