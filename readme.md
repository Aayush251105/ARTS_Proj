<!-- steps to install -->
1. pull the repo
./mvnw clean install
./mvnw spring-boot:run

frontend
npm install


Note: to ensure the dummy data is inserted properly, in src/main/resources/application.properties, do spring.sql.init.mode=always
when running springboot and then for any restarts change it to spring.sql.init.mode=never i guess that should work


Also try running the following SQL code before doing .\mvnw clean spring-boot:run

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;