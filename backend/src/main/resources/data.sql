-- 1. Users (Using UNIQUE Username to prevent duplicates)
INSERT INTO Users (Username, Password, Email, Role) VALUES 
('admin_neil', 'pass123', 'neil@snu.edu.in', 'ADMIN'),
('travel_pro', 'fly789', 'passenger@example.com', 'PASSENGER'),
('guy_who_made_dummy_data', 'god', 'god@heaven.com', 'ADMIN'),
('rat_bastard', '69420', 'vikram@example.com', 'PASSENGER'),
('scooter_jesus', 'admin123', 'pikachu@pokemon.com', 'ADMIN')
ON CONFLICT (Username) DO NOTHING;

-- 2. Cities
INSERT INTO City (Name, IsInternational) VALUES 
('Delhi', FALSE), ('Mumbai', FALSE), ('Bangalore', FALSE),
('London', TRUE), ('New York', TRUE), ('Singapore', TRUE), 
('Tokyo', TRUE), ('Paris', TRUE)
ON CONFLICT DO NOTHING;

-- 3. Crew
INSERT INTO Crew (CrewCapacity) VALUES (10), (15), (20), (25), (12), (18)
ON CONFLICT DO NOTHING;

-- 4. Flights (Linking to Crew IDs 1 through 5)
INSERT INTO Flights (FromLocation, ToLocation, NumSeats, PFirst, PBusiness, PEcon, TakeoffT, LandingT, CrewID) VALUES 
('Delhi', 'Mumbai', 180, 5000.00, 3000.00, 1500.00, '2026-04-01 10:00:00', '2026-04-01 12:30:00', 1),
('Mumbai', 'London', 250, 50000.00, 30000.00, 12000.00, '2026-04-02 14:00:00', '2026-04-03 02:00:00', 2),
('Delhi', 'Bangalore', 200, 6000.00, 3500.00, 1800.00, '2026-04-05 08:00:00', '2026-04-05 10:15:00', 3),
('Mumbai', 'Singapore', 300, 55000.00, 32000.00, 14000.00, '2026-04-06 15:30:00', '2026-04-07 05:00:00', 4),
('London', 'New York', 280, 45000.00, 28000.00, 10000.00, '2026-04-07 18:00:00', '2026-04-08 08:00:00', 5)
ON CONFLICT DO NOTHING;

-- 5 & 6. Combined Bookings and Passengers using CTEs
-- This is the ONLY way to ensure the IDs match perfectly every time.

WITH new_booking AS (
  INSERT INTO Booking (UserID, Flight1, SeatClass, BookingPrice, FromLocation, ToLocation, NumSeatsBook, DateOfFlight)
  VALUES (
    (SELECT UserID FROM Users WHERE Username = 'travel_pro' LIMIT 1), 
    (SELECT FlightID FROM Flights WHERE FromLocation = 'Delhi' AND ToLocation = 'Mumbai' LIMIT 1), 
    'Economy', 1500.00, 'Delhi', 'Mumbai', 1, '2026-04-01'
  ) RETURNING BookID
)
INSERT INTO Passengers (BookingID, PassName, Seat1, Passport)
SELECT BookID, 'Randy Orton', 'A', 'B' FROM new_booking;

WITH second_booking AS (
  INSERT INTO Booking (UserID, Flight1, SeatClass, BookingPrice, FromLocation, ToLocation, NumSeatsBook, DateOfFlight)
  VALUES (
    (SELECT UserID FROM Users WHERE Username = 'scooter_jesus' LIMIT 1), 
    (SELECT FlightID FROM Flights WHERE FromLocation = 'London' AND ToLocation = 'New York' LIMIT 1), 
    'Economy', 10000.00, 'London', 'New York', 1, '2026-04-07'
  ) RETURNING BookID
)
INSERT INTO Passengers (BookingID, PassName, Seat1, Passport)
SELECT BookID, 'Scooter Jesus', 'C', 'D' FROM second_booking;

-- 7. Cancellations
INSERT INTO Cancellations (BookID, RefundAmt) VALUES 
((SELECT BookID FROM Booking WHERE FromLocation = 'Delhi' AND ToLocation = 'Mumbai' LIMIT 1), 1200.00)
ON CONFLICT DO NOTHING;