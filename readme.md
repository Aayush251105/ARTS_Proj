<!-- steps to install -->
1. pull the repo
./mvnw clean install
./mvnw spring-boot:run

frontend
npm install


Note: to ensure the dummy data is inserted properly, in src/main/resources/application.properties, do spring.sql.init.mode=always
when running springboot and then for any restarts change it to spring.sql.init.mode=never i guess that should work

# Seat class logic
consider 100 seats
first 20% - first class (1 - 20)
next 20% - business class (21 - 40)
rest 40% - economy class (41 - 100)