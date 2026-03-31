-- 1. Reset everything and restart ID sequences at 1
TRUNCATE TABLE Cancellations, Passengers, Booking, Flights, Crew, City, Users RESTART IDENTITY CASCADE;

-- 2. USERS
-- IDs: 1: admin_neil, 2: travel_pro, 3: guy_who..., 4: rat_bastard, 5: scooter_jesus, etc.
INSERT INTO Users (Username, Password, Email, Role) VALUES
('admin_neil', 'pass123', 'neil@snu.edu.in', 'ADMIN'),
('travel_pro', 'fly789', 'passenger@example.com', 'PASSENGER'),
('guy_who_made_dummy_data', 'god', 'god@heaven.com', 'ADMIN'),
('rat_bastard', '69420', 'vikram@example.com', 'PASSENGER'),
('scooter_jesus', 'admin123', 'pikachu@pokemon.com', 'ADMIN'),
('john_doe', 'password', 'john.doe@example.com', 'PASSENGER'),
('jane_doe', 'password', 'jane.doe@example.com', 'PASSENGER'),
('alice', 'password', 'alice@example.com', 'PASSENGER'),
('bob', 'password', 'bob@example.com', 'PASSENGER');

-- 3. CITIES
INSERT INTO City (Name, IsInternational) VALUES
('Delhi', FALSE), ('Mumbai', FALSE), ('Bangalore', FALSE), ('Goa', FALSE),
('London', TRUE), ('New York', TRUE), ('Singapore', TRUE), ('Tokyo', TRUE), 
('Paris', TRUE), ('Sydney', TRUE), ('Mother Russia', TRUE), ('Hong Kong', TRUE), 
('Epstein Island', TRUE), ('Frankfurt', TRUE), ('Diddy Party', TRUE), ('Los Angeles', TRUE);

-- 4. CREW
INSERT INTO Crew (CrewCapacity) VALUES (10), (15), (20), (25), (12), (18);

-- 5. FLIGHTS (IDs 1-8)
INSERT INTO Flights (FromLocation, ToLocation, NumSeats, PFirst, PBusiness, PEcon, TakeoffT, LandingT, CrewID) VALUES
('Delhi', 'Mumbai', 180, 5000.00, 3000.00, 1500.00, '10:00:00', '12:30:00', 1),
('Mumbai', 'London', 250, 50000.00, 30000.00, 12000.00, '14:00:00', '02:00:00', 2),
('Delhi', 'Bangalore', 200, 6000.00, 3500.00, 1800.00, '08:00:00', '10:15:00', 3),
('Mumbai', 'Singapore', 300, 55000.00, 32000.00, 14000.00, '15:30:00', '05:00:00', 4),
('London', 'New York', 280, 45000.00, 28000.00, 10000.00, '18:00:00', '08:00:00', 5),
('Mumbai', 'Bangalore', 180, 4000.00, 2500.00, 1200.00, '10:00:00', '12:30:00', 6),
('Delhi', 'Goa', 150, 7000.00, 4000.00, 2200.00, '14:00:00', '16:45:00', 1),
('Bangalore', 'Delhi', 200, 6500.00, 3800.00, 1900.00, '09:00:00', '11:45:00', 2);

-- 6. BOOKINGS
-- Mapping UserIDs and FlightIDs precisely based on the order above
INSERT INTO Booking (UserID, Flight1, SeatClass, BookingPrice, FromLocation, ToLocation, NumSeatsBook, DateOfFlight, Status) VALUES
(2, 1, 'Economy', 1500.00, 'Delhi', 'Mumbai', 1, '2026-04-01', 'CANCELLED'), -- ID 1
(2, 3, 'Business', 3500.00, 'Delhi', 'Bangalore', 1, '2026-04-05', 'CONFIRMED'), -- ID 2
(2, 6, 'Economy', 1200.00, 'Mumbai', 'Bangalore', 1, '2026-04-10', 'CONFIRMED'), -- ID 3
(2, 7, 'First', 7000.00, 'Delhi', 'Goa', 1, '2026-04-15', 'CONFIRMED'), -- ID 4
(4, 2, 'Economy', 12000.00, 'Mumbai', 'London', 1, '2026-04-02', 'CANCELLED'), -- ID 5
(5, 5, 'Business', 28000.00, 'London', 'New York', 1, '2026-04-07', 'CANCELLED'), -- ID 6
(5, 8, 'Economy', 1900.00, 'Bangalore', 'Delhi', 1, '2026-04-20', 'CONFIRMED'), -- ID 7
(3, 4, 'First', 55000.00, 'Mumbai', 'Singapore', 1, '2026-04-06', 'CONFIRMED'), -- ID 8
(3, 5, 'Business', 28000.00, 'London', 'New York', 1, '2026-04-07', 'CONFIRMED'), -- ID 9
(3, 6, 'Economy', 1200.00, 'Mumbai', 'Bangalore', 1, '2026-04-10', 'CONFIRMED'); -- ID 10

-- 7. PASSENGERS
-- Linked to BookingIDs 1 through 10
INSERT INTO Passengers (BookingID, PassName, Seat1, Passport) VALUES
(1, 'Randy Orton', '12F', 'RKO999'),
(2, 'Neil', '2A', 'SNU2026'),
(3, 'Neil', '14C', 'SNU2026'),
(4, 'Neil', '1A', 'SNU2026'),
(5, 'Vikram', '22B', 'RAT777'),
(6, 'Scooter Jesus', '3D', 'HEAVEN1'),
(7, 'John Doe', '15E', 'JD123456'),
(8, 'Jane Doe', '15F', 'JD654321'),
(9, 'Alice', '10A', 'ALICE123'),
(10, 'Bob', '10B', 'BOB456789');

-- 8. CANCELLATIONS
INSERT INTO Cancellations (BookID, RefundAmt) VALUES
(1, 1200.00),
(5, 10000.00),
(6, 25000.00);