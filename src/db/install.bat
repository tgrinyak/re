echo off
echo creating user and database
psql -U postgres -a -f create_all.sql

echo creating tables
psql -U re_root -d re -f create_tables.sql
