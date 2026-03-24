-- Flight Booking System Schema

-- Users table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Role VARCHAR(50) NOT NULL
);

-- Crew table
CREATE TABLE Crew (
    CrewID SERIAL PRIMARY KEY
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
    TakeoffT TIMESTAMP NOT NULL,
    LandingT TIMESTAMP NOT NULL,
    CrewID INT REFERENCES Crew(CrewID)
);

-- Booking table
CREATE TABLE Booking (
    BookID SERIAL,
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
    PRIMARY KEY (BookID, UserID)
);

-- Passengers table
CREATE TABLE Passengers (
    PNR SERIAL PRIMARY KEY,
    BookingID INT NOT NULL,
    UserID INT NOT NULL,
    PassName VARCHAR(200) NOT NULL,
    Seat1 VARCHAR(10),
    Seat2 VARCHAR(10),
    Passport VARCHAR(50) NOT NULL,
    FOREIGN KEY (BookingID, UserID) REFERENCES Booking(BookID, UserID)
);

-- Cancellations table
CREATE TABLE Cancellations (
    CancellationID SERIAL PRIMARY KEY,
    BookID INT NOT NULL,
    UserID INT NOT NULL,
    CancellationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    RefundAmt DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (BookID, UserID) REFERENCES Booking(BookID, UserID)
);
