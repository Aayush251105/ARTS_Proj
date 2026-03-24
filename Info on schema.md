### Tables
* **Users:** User accounts with credentials and roles
* **Crew:** Flight crew members
* **Flights:** Flight details with pricing for First/Business/Economy classes
* **Booking:** Bookings with composite PK (BookID, UserID), supports connecting flights via Flight1/Flight2
* **Passengers:** Passenger details linked to bookings with PNR as primary key
* **Cancellations:** Tracks cancelled bookings with refund amounts

### Key relationships implemented
* `Flights.CrewID` → `Crew.CrewID`
* `Booking.UserID` → `Users.UserID`
* `Booking.Flight1/Flight2` → `Flights.FlightID`
* `Passengers` and `Cancellations` → `Booking(BookID, UserID)`

The schema is now in your query file and ready to execute.
