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

# Seat class logic
consider 100 seats
first 20% - first class (1 - 20)
next 20% - business class (21 - 40)
rest 40% - economy class (41 - 100)

# Set up an env file with (Recommended not compulsory, you can just leave as raw strings in application.properties file)
inside backend/.env, add 
JWT_SECRET=arts-flight-booking-super-secret-key 
or 
add it here application.properties,
jwt.secret=arts-flight-booking-super-secret-key
