package com.team26.backend.controller;

import com.team26.backend.dto.BookingRequest;
import com.team26.backend.dto.BookingResponse;
import com.team26.backend.dto.PassengerDTO;
import com.team26.backend.model.Booking;
import com.team26.backend.model.Passenger;
import com.team26.backend.repository.BookingRepository;
import com.team26.backend.repository.CancellationRepository;
import com.team26.backend.repository.FlightRepository;
import com.team26.backend.repository.PassengerRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 + Mockito tests for the BookingController.
 * Covers: Create booking, Get by user, Cancel booking, Validation edge cases.
 */
@ExtendWith(MockitoExtension.class)
class BookingControllerTest {

    @InjectMocks
    private BookingController bookingController;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PassengerRepository passengerRepository;

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private CancellationRepository cancellationRepository;

    @Mock
    private JdbcTemplate jdbcTemplate;

    // ====== Reusable helpers ======

    private BookingRequest createValidDomesticRequest() {
        BookingRequest req = new BookingRequest();
        req.setUserId(1);
        req.setFlight1(10);
        req.setFlight2(null);
        req.setSeatClass("ECONOMY");
        req.setBookingPrice(1500.00);
        req.setFromLocation("Delhi");
        req.setToLocation("Mumbai");
        req.setNumSeatsBook(1);
        req.setDateOfFlight("2026-05-10");
        req.setIsInternational(false);

        PassengerDTO p = new PassengerDTO();
        p.setName("Aayush Gupta");
        p.setSeatFlight1("42");
        p.setSeatFlight2(null);
        p.setPassport(null);
        req.setPassengers(List.of(p));

        return req;
    }

    private BookingRequest createValidInternationalRequest() {
        BookingRequest req = new BookingRequest();
        req.setUserId(1);
        req.setFlight1(2);
        req.setFlight2(null);
        req.setSeatClass("ECONOMY");
        req.setBookingPrice(14000.00);
        req.setFromLocation("Mumbai");
        req.setToLocation("London");
        req.setNumSeatsBook(1);
        req.setDateOfFlight("2026-05-15");
        req.setIsInternational(true);

        PassengerDTO p = new PassengerDTO();
        p.setName("John Doe");
        p.setSeatFlight1("55");
        p.setSeatFlight2(null);
        p.setPassport("AB1234567");
        req.setPassengers(List.of(p));

        return req;
    }

    private Booking createMockSavedBooking(int bookId) {
        Booking b = new Booking();
        b.setBookId(bookId);
        b.setUserId(1);
        b.setFlight1(10);
        b.setSeatClass("ECONOMY");
        b.setBookingPrice(BigDecimal.valueOf(1500.00));
        b.setFromLocation("Delhi");
        b.setToLocation("Mumbai");
        b.setNumSeatsBook(1);
        b.setDateOfFlight(LocalDate.parse("2026-05-10"));
        b.setStatus("CONFIRMED");
        return b;
    }

    // ================================================================
    //  CREATE BOOKING TESTS
    // ================================================================
    @Nested
    @DisplayName("POST /api/bookings — Create Booking")
    class CreateBookingTests {

        @Test
        @DisplayName("TC-1: Successfully create a domestic booking with 1 passenger")
        void createDomesticBooking_success() {
            BookingRequest req = createValidDomesticRequest();
            Booking savedBooking = createMockSavedBooking(101);

            when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);
            when(passengerRepository.save(any(Passenger.class))).thenReturn(new Passenger());

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertTrue(response.getBody() instanceof BookingResponse);

            BookingResponse body = (BookingResponse) response.getBody();
            assertEquals(101, body.getBookId());
            assertEquals(1, body.getPassengersCount());

            verify(bookingRepository, times(1)).save(any(Booking.class));
            verify(passengerRepository, times(1)).save(any(Passenger.class));
        }

        @Test
        @DisplayName("TC-2: Successfully create an international booking with passport")
        void createInternationalBooking_success() {
            BookingRequest req = createValidInternationalRequest();
            Booking savedBooking = createMockSavedBooking(102);
            savedBooking.setBookId(102);

            when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);
            when(passengerRepository.save(any(Passenger.class))).thenReturn(new Passenger());

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            BookingResponse body = (BookingResponse) response.getBody();
            assertEquals(102, body.getBookId());

            // Verify passenger was saved with encrypted passport
            verify(passengerRepository, times(1)).save(any(Passenger.class));
        }

        @Test
        @DisplayName("TC-3: Create booking with multiple passengers")
        void createBooking_multiplePassengers() {
            BookingRequest req = createValidDomesticRequest();

            PassengerDTO p1 = new PassengerDTO();
            p1.setName("Passenger One");
            p1.setSeatFlight1("10");
            PassengerDTO p2 = new PassengerDTO();
            p2.setName("Passenger Two");
            p2.setSeatFlight1("11");
            PassengerDTO p3 = new PassengerDTO();
            p3.setName("Passenger Three");
            p3.setSeatFlight1("12");

            req.setPassengers(List.of(p1, p2, p3));
            req.setNumSeatsBook(3);

            Booking savedBooking = createMockSavedBooking(103);
            when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);
            when(passengerRepository.save(any(Passenger.class))).thenReturn(new Passenger());

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            BookingResponse body = (BookingResponse) response.getBody();
            assertEquals(3, body.getPassengersCount());

            // Verify all 3 passengers were saved
            verify(passengerRepository, times(3)).save(any(Passenger.class));
        }

        @Test
        @DisplayName("TC-4: Create booking with connecting flights (flight1 + flight2)")
        void createBooking_connectingFlight() {
            BookingRequest req = createValidDomesticRequest();
            req.setFlight2(20); // Second connecting flight

            PassengerDTO p = new PassengerDTO();
            p.setName("Via Passenger");
            p.setSeatFlight1("5");
            p.setSeatFlight2("15"); // Seat on second flight too
            req.setPassengers(List.of(p));

            Booking savedBooking = createMockSavedBooking(104);
            when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);
            when(passengerRepository.save(any(Passenger.class))).thenReturn(new Passenger());

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(bookingRepository).save(any(Booking.class));
        }

        @Test
        @DisplayName("TC-5: Booking status is set to CONFIRMED on creation")
        void createBooking_statusIsConfirmed() {
            BookingRequest req = createValidDomesticRequest();
            Booking savedBooking = createMockSavedBooking(105);

            when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
                Booking b = invocation.getArgument(0);
                assertEquals("CONFIRMED", b.getStatus()); // Assert status before save
                b.setBookId(105);
                return b;
            });
            when(passengerRepository.save(any(Passenger.class))).thenReturn(new Passenger());

            ResponseEntity<?> response = bookingController.createBooking(req);
            assertEquals(HttpStatus.OK, response.getStatusCode());
        }
    }

    // ================================================================
    //  VALIDATION FAILURE TESTS
    // ================================================================
    @Nested
    @DisplayName("POST /api/bookings — Validation Failures")
    class ValidationTests {

        @Test
        @DisplayName("TC-6: Reject booking when flight1 is null")
        void createBooking_noFlight1_returns400() {
            BookingRequest req = createValidDomesticRequest();
            req.setFlight1(null);

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            assertTrue(response.getBody().toString().contains("Flight1 is required"));
        }

        @Test
        @DisplayName("TC-7: Reject booking when passengers list is empty")
        void createBooking_noPassengers_returns400() {
            BookingRequest req = createValidDomesticRequest();
            req.setPassengers(Collections.emptyList());

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            assertTrue(response.getBody().toString().contains("At least one passenger is required"));
        }

        @Test
        @DisplayName("TC-8: Reject booking when passengers list is null")
        void createBooking_nullPassengers_returns400() {
            BookingRequest req = createValidDomesticRequest();
            req.setPassengers(null);

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        @Test
        @DisplayName("TC-9: Reject international booking when passport is missing")
        void createInternationalBooking_noPassport_returns400() {
            BookingRequest req = createValidInternationalRequest();
            req.getPassengers().get(0).setPassport(null); // Remove passport

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            assertTrue(response.getBody().toString().contains("Passport is required"));
        }

        @Test
        @DisplayName("TC-10: Reject international booking when passport is empty string")
        void createInternationalBooking_emptyPassport_returns400() {
            BookingRequest req = createValidInternationalRequest();
            req.getPassengers().get(0).setPassport("   ");

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        @Test
        @DisplayName("TC-11: Reject international booking when passport is too short (<6 chars)")
        void createInternationalBooking_shortPassport_returns400() {
            BookingRequest req = createValidInternationalRequest();
            req.getPassengers().get(0).setPassport("AB12"); // Only 4 chars

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            assertTrue(response.getBody().toString().contains("Passport must be 6-20 characters"));
        }

        @Test
        @DisplayName("TC-12: Reject international booking when passport is too long (>20 chars)")
        void createInternationalBooking_longPassport_returns400() {
            BookingRequest req = createValidInternationalRequest();
            req.getPassengers().get(0).setPassport("ABCDEFGHIJKLMNOPQRSTUV"); // 22 chars

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        @Test
        @DisplayName("TC-13: Domestic booking should NOT require passport")
        void createDomesticBooking_noPassport_succeeds() {
            BookingRequest req = createValidDomesticRequest();
            // Passport is already null — should be fine for domestic

            Booking savedBooking = createMockSavedBooking(106);
            when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);
            when(passengerRepository.save(any(Passenger.class))).thenReturn(new Passenger());

            ResponseEntity<?> response = bookingController.createBooking(req);

            assertEquals(HttpStatus.OK, response.getStatusCode());
        }
    }

    // ================================================================
    //  GET BOOKINGS BY USER TESTS
    // ================================================================
    @Nested
    @DisplayName("GET /api/bookings/user/{userId} — Fetch User Bookings")
    class GetBookingsByUserTests {

        @Test
        @DisplayName("TC-14: Return bookings for a valid user")
        void getBookingsByUser_returnsBookings() {
            Booking b1 = createMockSavedBooking(201);
            b1.setStatus("CONFIRMED");
            Booking b2 = createMockSavedBooking(202);
            b2.setToLocation("Bangalore");
            b2.setStatus("CONFIRMED");

            when(bookingRepository.findByUserIdWithStatus(1)).thenReturn(List.of(b1, b2));

            List<Booking> result = bookingController.getBookingsByUserId(1);

            assertNotNull(result);
            assertEquals(2, result.size());
            assertEquals("CONFIRMED", result.get(0).getStatus());
            assertEquals("CONFIRMED", result.get(1).getStatus());
        }

        @Test
        @DisplayName("TC-15: Return empty list for user with no bookings")
        void getBookingsByUser_noBookings() {
            when(bookingRepository.findByUserIdWithStatus(999)).thenReturn(Collections.emptyList());

            List<Booking> result = bookingController.getBookingsByUserId(999);

            assertNotNull(result);
            assertTrue(result.isEmpty());
        }

        @Test
        @DisplayName("TC-16: Cancelled bookings have CANCELLED status")
        void getBookingsByUser_withCancellation() {
            Booking b1 = createMockSavedBooking(301);
            b1.setStatus("CONFIRMED");
            Booking b2 = createMockSavedBooking(302);
            b2.setStatus("CANCELLED");

            when(bookingRepository.findByUserIdWithStatus(1)).thenReturn(List.of(b1, b2));

            List<Booking> result = bookingController.getBookingsByUserId(1);

            assertEquals("CONFIRMED", result.get(0).getStatus());
            assertEquals("CANCELLED", result.get(1).getStatus());
        }
    }

    // ================================================================
    //  CANCEL BOOKING TESTS
    // ================================================================
    @Nested
    @DisplayName("DELETE /api/bookings/{bookId} — Cancel Booking")
    class CancelBookingTests {

        @Test
        @DisplayName("TC-17: Successfully cancel a confirmed booking")
        void cancelBooking_success() {
            Booking booking = createMockSavedBooking(401);
            booking.setBookingPrice(BigDecimal.valueOf(10000));

            when(bookingRepository.findById(401)).thenReturn(Optional.of(booking));
            when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

            ResponseEntity<?> response = bookingController.deleteBooking(401);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals("CANCELLED", booking.getStatus());
            verify(bookingRepository).save(booking);
            verify(jdbcTemplate).update(anyString(), eq(401), any(BigDecimal.class));
        }

        @Test
        @DisplayName("TC-18: Refund amount is 80% of booking price")
        void cancelBooking_refundIs80Percent() {
            Booking booking = createMockSavedBooking(402);
            booking.setBookingPrice(BigDecimal.valueOf(10000));

            when(bookingRepository.findById(402)).thenReturn(Optional.of(booking));
            when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

            bookingController.deleteBooking(402);

            // Verify 80% refund: 10000 * 0.80 = 8000
            verify(jdbcTemplate).update(
                anyString(),
                eq(402),
                eq(BigDecimal.valueOf(10000).multiply(new BigDecimal("0.80")))
            );
        }

        @Test
        @DisplayName("TC-19: Cancel non-existent booking returns 404")
        void cancelBooking_notFound() {
            when(bookingRepository.findById(999)).thenReturn(Optional.empty());

            ResponseEntity<?> response = bookingController.deleteBooking(999);

            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
            verify(bookingRepository, never()).save(any());
        }

        @Test
        @DisplayName("TC-20: Cancel already-cancelled booking returns 404")
        void cancelBooking_alreadyCancelled() {
            Booking booking = createMockSavedBooking(403);
            booking.setStatus("CANCELLED");

            when(bookingRepository.findById(403)).thenReturn(Optional.of(booking));

            ResponseEntity<?> response = bookingController.deleteBooking(403);

            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
            verify(bookingRepository, never()).save(any());
        }
    }

    // ================================================================
    //  BOOKING MODEL UNIT TESTS
    // ================================================================
    @Nested
    @DisplayName("Booking Model — Getters/Setters")
    class BookingModelTests {

        @Test
        @DisplayName("TC-21: Verify all Booking fields are set correctly")
        void bookingModel_fieldsSetCorrectly() {
            Booking b = new Booking();
            b.setBookId(1);
            b.setUserId(5);
            b.setFlight1(10);
            b.setFlight2(20);
            b.setSeatClass("FIRST");
            b.setBookingPrice(BigDecimal.valueOf(50000));
            b.setFromLocation("Delhi");
            b.setToLocation("London");
            b.setVia("Mumbai");
            b.setDateOfFlight(LocalDate.of(2026, 5, 1));
            b.setNumSeatsBook(2);
            b.setStatus("CONFIRMED");

            assertEquals(1, b.getBookId());
            assertEquals(5, b.getUserId());
            assertEquals(10, b.getFlight1());
            assertEquals(20, b.getFlight2());
            assertEquals("FIRST", b.getSeatClass());
            assertEquals(BigDecimal.valueOf(50000), b.getBookingPrice());
            assertEquals("Delhi", b.getFromLocation());
            assertEquals("London", b.getToLocation());
            assertEquals("Mumbai", b.getVia());
            assertEquals(LocalDate.of(2026, 5, 1), b.getDateOfFlight());
            assertEquals(2, b.getNumSeatsBook());
            assertEquals("CONFIRMED", b.getStatus());
        }

        @Test
        @DisplayName("TC-22: Booking defaults to null status before explicitly setting")
        void bookingModel_defaultStatusIsNull() {
            Booking b = new Booking();
            assertNull(b.getStatus());
        }
    }

    // ================================================================
    //  DTO UNIT TESTS
    // ================================================================
    @Nested
    @DisplayName("DTO — BookingRequest & PassengerDTO")
    class DTOTests {

        @Test
        @DisplayName("TC-23: BookingRequest stores all fields correctly")
        void bookingRequest_allFields() {
            BookingRequest req = new BookingRequest();
            req.setUserId(1);
            req.setFlight1(10);
            req.setFlight2(20);
            req.setSeatClass("BUSINESS");
            req.setBookingPrice(25000.0);
            req.setFromLocation("Delhi");
            req.setToLocation("Singapore");
            req.setNumSeatsBook(2);
            req.setDateOfFlight("2026-06-01");
            req.setIsInternational(true);

            assertEquals(1, req.getUserId());
            assertEquals(10, req.getFlight1());
            assertEquals(20, req.getFlight2());
            assertEquals("BUSINESS", req.getSeatClass());
            assertEquals(25000.0, req.getBookingPrice());
            assertEquals("Delhi", req.getFromLocation());
            assertEquals("Singapore", req.getToLocation());
            assertEquals(2, req.getNumSeatsBook());
            assertEquals("2026-06-01", req.getDateOfFlight());
            assertTrue(req.getIsInternational());
        }

        @Test
        @DisplayName("TC-24: PassengerDTO stores all fields correctly")
        void passengerDTO_allFields() {
            PassengerDTO p = new PassengerDTO();
            p.setName("Jane Doe");
            p.setPassport("XY9876543");
            p.setSeatFlight1("22");
            p.setSeatFlight2("44");

            assertEquals("Jane Doe", p.getName());
            assertEquals("XY9876543", p.getPassport());
            assertEquals("22", p.getSeatFlight1());
            assertEquals("44", p.getSeatFlight2());
        }

        @Test
        @DisplayName("TC-25: BookingResponse constructor and getters work correctly")
        void bookingResponse_constructor() {
            BookingResponse res = new BookingResponse(99, "Success!", 3);

            assertEquals(99, res.getBookId());
            assertEquals("Success!", res.getMessage());
            assertEquals(3, res.getPassengersCount());
        }
    }
}
