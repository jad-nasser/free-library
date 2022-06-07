-- creating a role called database_access and this role will contain all the access permissions on this database
CREATE ROLE database_access
GRANT SELECT, UPDATE, INSERT, DELETE ON SCHEMA :: [dbo] TO database_access
-- creating a user called server_app with its login and then granting this user the created role above
CREATE LOGIN server_login WITH PASSWORD= '1234'
CREATE USER server_app FOR LOGIN server_login
ALTER ROLE database_access ADD MEMBER server_app