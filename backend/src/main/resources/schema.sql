-- Flight Booking System Schema
DROP TABLE IF EXISTS Cancellations, Passengers, Booking, Flights, Crew, City, Users CASCADE;

-- Drop existing tables to recreate with correct schema
DROP TABLE IF EXISTS Cancellations;
DROP TABLE IF EXISTS Passengers;
DROP TABLE IF EXISTS Booking;
DROP TABLE IF EXISTS Flights;
DROP TABLE IF EXISTS Crew;
DROP TABLE IF EXISTS City;
DROP TABLE IF EXISTS Users;

-- Users table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Role VARCHAR(50) NOT NULL DEFAULT 'PASSENGER' CHECK (Role IN ('ADMIN', 'PASSENGER'))
);

-- City table
CREATE TABLE City (
    CityID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    IsInternational BOOLEAN NOT NULL DEFAULT FALSE
);

-- Crew table
CREATE TABLE Crew (
    CrewID SERIAL PRIMARY KEY,
    CrewCapacity INT NOT NULL
);

-- Flights table
CREATE TABLE Flights (
    FlightID SERIAL PRIMARY KEY,
    FromLocation VARCHAR(100) NOT NULL,
    ToLocation VARCHAR(100) NOT NULL,
    NumSeats INT NOT NULL,
    PFirst DECIMAL(10, 2) NOT NULL,
    PBusiness DECIMAL(10, 2) NOT NULL,
    PEcon DECIMAL(10, 2) NOT NULL,
    TakeoffT TIME NOT NULL,
    LandingT TIME NOT NULL,
    CrewID INT REFERENCES Crew(CrewID)
);

-- Booking table
CREATE TABLE Booking (
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
    DateOfFlight DATE NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED' CHECK (Status IN ('CONFIRMED', 'CANCELLED'))
);

-- Passengers table
CREATE TABLE Passengers (
    PNR SERIAL PRIMARY KEY,
    BookingID INT NOT NULL REFERENCES Booking(BookID),
    PassName VARCHAR(200) NOT NULL,
    Seat1 VARCHAR(10),
    Seat2 VARCHAR(10),
    Passport TEXT -- Encrypted passport details
);

-- Cancellations table
CREATE TABLE Cancellations (
    CancellationID SERIAL PRIMARY KEY,
    BookID INT NOT NULL REFERENCES Booking(BookID),
    CancellationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    RefundAmt DECIMAL(10, 2) NOT NULL
);