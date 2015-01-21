CREATE TABLE IF NOT EXISTS userCredentialsTbl(
 email					VARCHAR NOT NULL,
 role					VARCHAR NOT NULL,
 password				VARCHAR NOT NULL,
 first_name				VARCHAR,
 first_name_furigana	VARCHAR,
 last_name				VARCHAR,
 last_name_furigana		VARCHAR,
 date_of_birth			TIMESTAMP,
 sex					VARCHAR,
 contact_information	VARCHAR,
 post_number			VARCHAR,
 address					VARCHAR,
 registrated_service	VARCHAR,
 loan_payment_period	VARCHAR,
 loan_value				VARCHAR,
 PRIMARY KEY (email)
);

INSERT INTO userCredentialsTbl (email, role, password)
 VALUES ('admin', 'admin', 'root'),
        ('adm', 'admin', 'qwe'),
        ('usr', 'user', 'qwe')

--CREATE TABLE IF NOT EXISTS userInfoTabl(
-- first_name				VARCHAR NOT NULL,
-- first_name_furigana	VARCHAR NOT NULL,
-- last_name				VARCHAR NOT NULL,
-- last_name_furigana		VARCHAR NOT NULL,
-- date_of_birth			TIMESTAMP NOT NULL,
-- sex					VARCHAR NOT NULL,
-- contact_information	VARCHAR;
-- post_number			VARCHAR,
-- address					VARCHAR,
-- registrated_service	VARCHAR,
-- loan_payment_period	VARCHAR,
-- loan_value				VARCHAR,
-- email					VARCHAR FOREIGN KEY REFERENCES userCredentialsTbl(email) -- should be UNIQUE
--);

--CREATE TABLE IF NOT EXISTS userServicesTbl(
-- registrated_service	VARCHAR,
-- loan_payment_period	VARCHAR,
-- loan_value				VARCHAR,
-- email					VARCHAR FOREIGN KEY REFERENCES userCredentialsTbl(email)
--);

