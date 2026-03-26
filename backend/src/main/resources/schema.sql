-- Flight Booking System Schema

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Role VARCHAR(50) NOT NULL DEFAULT 'PASSENGER' CHECK (Role IN ('ADMIN', 'PASSENGER'))
);

-- City table
CREATE TABLE IF NOT EXISTS City (
    CityID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    IsInternational BOOLEAN NOT NULL DEFAULT FALSE
);

-- Crew table
CREATE TABLE IF NOT EXISTS Crew (
    CrewID SERIAL PRIMARY KEY,
    CrewCapacity INT NOT NULL
);

-- Flights table
CREATE TABLE IF NOT EXISTS Flights (
    FlightID SERIAL PRIMARY KEY,
    FromLocation VARCHAR(100) NOT NULL,
    ToLocation VARCHAR(100) NOT NULL,
    NumSeats INT NOT NULL,
    PFirst DECIMAL(10, 2) NOT NULL,
    PBusiness DECIMAL(10, 2) NOT NULL,
    PEcon DECIMAL(10, 2) NOT NULL,
    TakeoffT TIMESTAMP NOT NULL,
    LandingT TIMESTAMP NOT NULL,
    CrewID INT REFERENCES Crew(CrewID)
);

-- Booking table
CREATE TABLE IF NOT EXISTS Booking (
    BookID SERIAL PRIMARY KEY,
    UserID INT REFERENCES Users(UserID),
    Flight1 INT REFERENCES Flights(FlightID),
    Flight2 INT REFERENCES Flights(FlightID),
    SeatClass VARCHAR(20) NOT NULL,
    BookingPrice DECIMAL(10, 2) NOT NULL,
    FromLocation VARCHAR(100) NOT NULL,
    Via VARCHAR(100),
    ToLocation VARCHAR(100) NOT NULL,
    NumSeatsBook INT NOT NULL,
    DateOfFlight DATE NOT NULL
);

-- Passengers table
CREATE TABLE IF NOT EXISTS Passengers (
    PNR SERIAL PRIMARY KEY,
    BookingID INT NOT NULL REFERENCES Booking(BookID),
    PassName VARCHAR(200) NOT NULL,
    Seat1 VARCHAR(10),
    Seat2 VARCHAR(10),
    Passport VARCHAR(50) NOT NULL
);

-- Cancellations table
CREATE TABLE IF NOT EXISTS Cancellations (
    CancellationID SERIAL PRIMARY KEY,
    BookID INT NOT NULL REFERENCES Booking(BookID),
    CancellationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    RefundAmt DECIMAL(10, 2) NOT NULL
);
