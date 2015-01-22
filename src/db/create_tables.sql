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
 address				VARCHAR,
 registrated_service	VARCHAR,
 loan_payment_period	VARCHAR,
 loan_value				VARCHAR,
 PRIMARY KEY (email)
);

INSERT INTO userCredentialsTbl (email, role, password)
 VALUES ('admin', 'admin', 'root');

-- test admin
INSERT INTO userCredentialsTbl (email, role, password)
 VALUES ('adm', 'admin', 'qwe');
-- test users
INSERT INTO userCredentialsTbl (email, role, password, first_name, first_name_furigana, last_name, last_name_furigana, date_of_birth, sex, contact_information, post_number, address, registrated_service, loan_payment_period, loan_value)
 VALUES ('usr', 'user', 'qwe', 'fname', 'fname-fur', 'lname', 'lname-fur', '1980-01-11', 'M', '012-3456-7890', '012-3456', 'address address', 'service', '10', '15000000'),
        ('usr1', 'user', '111', 'fname1', 'fname1fur', 'lname1', 'lname1fur', '1980-01-11', 'M', '123-4567-8901', '123-4567', 'address1 address1', 'service1', '25', '35000000'),
        ('usr2', 'user', '222', 'fname2', 'fname2fur', 'lname2', 'lname2fur', '1985-02-12', 'M', '234-5678-9012', '234-5678', 'address2 address2', 'service2', '15', '45000000'),
        ('usr3', 'user', '333', 'fname3', 'fname3fur', 'lname3', 'lname3fur', '1990-03-13', 'F', '345-6789-0123', '345-6789', 'address3 address3', 'service3', '35', '35000000');

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

