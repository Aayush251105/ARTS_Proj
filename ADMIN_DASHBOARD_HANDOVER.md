# Admin Dashboard — Handover Document

## Table of Contents
1. [Project Structure Overview](#project-structure-overview)
2. [Pages & Components](#pages--components)
3. [Color Variables & Usage](#color-variables--usage)
4. [Authentication Flow](#authentication-flow)
5. [API Endpoints](#api-endpoints)
6. [Current Resources (/admin/resources)](#current-resources-adminresources)
7. [Flight Occupancy Statistics (/admin/occupancy)](#flight-occupancy-statistics-adminoccupancy)
8. [Security Vulnerabilities & Fixes](#security-vulnerabilities--fixes)
9. [Notes for Next Developer](#notes-for-next-developer)

---

## Project Structure Overview

### Files Created

| File | Purpose |
|------|---------|
| **Backend — Auth** | |
| `backend/.../util/JwtUtil.java` | JWT token generation & validation utility |
| **Backend — Models** | |
| `backend/.../model/Flight.java` | Flight JPA entity (all columns from Flights table) |
| `backend/.../model/Crew.java` | Crew JPA entity (crewId, crewCapacity) |
| `backend/.../model/Booking.java` | Booking JPA entity (includes flight1, flight2, via) |
| `backend/.../model/Passenger.java` | Passenger JPA entity (passName, seat assignments) |
| `backend/.../model/Cancellation.java` | Cancellation JPA entity (refundAmt, date) |
| `backend/.../model/City.java` | City JPA entity (uses Lombok) |
| **Backend — Repositories** | |
| `backend/.../repository/FlightRepository.java` | Flight CRUD repository |
| `backend/.../repository/CrewRepository.java` | Crew CRUD repository |
| `backend/.../repository/PassengerRepository.java` | Passenger JPA repo with custom JPQL |
| `backend/.../repository/CancellationRepository.java` | Cancellation JPA repo with custom JPQL |
| **Backend — Controllers** | |
| `backend/.../controller/FlightController.java` | Full CRUD REST API for Flights |
| `backend/.../controller/CrewController.java` | Full CRUD REST API for Crews |
| **Frontend — Styles** | |
| `frontend/src/styles/admin.css` | All admin CSS variables, layout, tabs, modals, occupancy styles |
| **Frontend — Components** | |
| `frontend/src/components/AdminRoute.jsx` | Route guard — validates JWT before rendering admin pages |
| `frontend/src/layouts/AdminLayout.jsx` | Sidebar + content area layout wrapper |
| **Frontend — Pages** | |
| `frontend/src/pages/admin/AdminDashboard.jsx` | Main dashboard with 5 nav cards and 2 stat cards |
| `frontend/src/pages/admin/AdminResources.jsx` | 3-tab CRUD manager (Flights, Cities, Crews) with modals |
| `frontend/src/pages/admin/AdminOccupancy.jsx` | Flight occupancy stats with selector, date range, class breakdown |
| `frontend/src/pages/admin/AdminRevenue.jsx` | Revenue Reports API integration and stat grids |
| `frontend/src/pages/admin/AdminPassengers.jsx` | Passenger Lists flight search and directory |
| `frontend/src/pages/admin/AdminCancellations.jsx` | Cancellations & Refunds API integration and stats |
| **Documentation** | |
| `ADMIN_DASHBOARD_HANDOVER.md` | This file |

### Files Modified

| File | Changes |
|------|---------|
| `backend/pom.xml` | Added JJWT dependencies (jjwt-api, jjwt-impl, jjwt-jackson v0.12.6) |
| `backend/.env` | Added `JWT_SECRET` environment variable |
| `backend/.../application.properties` | Added `jwt.secret=${JWT_SECRET}` config property |
| `backend/.../controller/AuthController.java` | Login returns JSON with JWT; added `/api/auth/validate` |
| `backend/.../controller/CityController.java` | Expanded from GET-only to full CRUD |
| `backend/.../controller/BookingController.java` | Added `/count/today` and `/occupancy` endpoints |
| `backend/.../repository/BookingRepository.java` | Added `countByDateOfFlight`, `findByFlightAndDateRange` queries |
| `backend/.../resources/schema.sql` | Changed TakeoffT/LandingT from `TIMESTAMP` to `TIME` |
| `backend/.../resources/data.sql` | Updated flight seed data to time-only values |
| `frontend/index.html` | Added Font Awesome 6 CDN, Google Fonts (Inter) |
| `frontend/src/App.css` | Removed `overflow: hidden` from global reset |
| `frontend/src/index.css` | Added `#root:has(.admin-page-wrapper)` full-width override |
| `frontend/src/App.jsx` | Added 6 protected admin routes |
| `frontend/src/components/Navbar.jsx` | Added Home, Profile, Dashboard links |
| `frontend/src/styles/navbar.css` | Styled new nav links |
| `frontend/src/pages/Login.jsx` | Fixed JSON parsing, JWT storage, admin redirect |

---

## Pages & Components

### Main Dashboard (`/admin`)
- Welcome header with username from localStorage
- **2 stat cards**: Total Flights (hardcoded), Bookings Today (live from API)
- **5 navigation cards** linking to sub-pages

### Current Resources (`/admin/resources`)
- **3 tabs**: Flights, Cities, Crews
- **Each tab**: scrollable card list + "Add New" button
- **Click any card**: opens edit modal with all fields
- **Modals**: shared Add/Edit with Save Changes / Create buttons
- All data fetched from real API endpoints (CRUD operations)

### Flight Occupancy (`/admin/occupancy`)
- **Flight dropdown**: all flights from DB with route info
- **Date range inputs**: Start Date + End Date (default: today)
- **Analyze button**: triggers occupancy calculation
- **3 overview stat cards**: Total Available, Total Occupied, Occupancy Rate
- **3 class breakdown cards**: First (20%), Business (20%), Economy (60%)
- Each class card shows available/occupied/rate with color-coded progress bars

### Revenue Reports (`/admin/revenue`)
- **Date Inputs**: From Date & To Date (defaults to today).
- **Functionality**: Aggregates booking price for confirmed bookings. Provides True Total and Class Breakdowns.
- **Route Logic**: Implements Multi-Segment Route mapping. If a booking has a `Via` location, its total revenue is displayed concurrently across 3 separate route variations (`from->to`, `from->via`, `via->to`) in the detailed list, while maintaining accurate overarching totals.

### Passenger Lists (`/admin/passengers`)
- **Inputs**: Flight ID dropdown + Date Range.
- **Functionality**: Joins `Passengers` table with `Booking` table using JPQL.
- **Seat Mapping**: Dynamically selects `seat1` or `seat2` based on whether the selected Flight ID matched `Flight1` or `Flight2` on the booking.
- **Display**: Grouped by travel date, showing name, seat, class, and booking ID without exposing sensitive passport details.

### Cancellation & Refund Statistics (`/admin/cancellations`)
- **Date Inputs**: From Date & To Date.
- **Functionality**: Aggregates `RefundAmt` from the Cancellations table using JPQL for cancelled bookings within the range.
- **Display**: Total Refunded, Class-specific refunds, and Multi-Segment route attribution mirroring the Revenue page logic.

---

## Color Variables & Usage

All admin CSS custom properties are in `frontend/src/styles/admin.css`:

| Variable | Value | Usage |
|----------|-------|-------|
| `--sidebar-bg` | `#1E3A8A` | Sidebar background |
| `--sidebar-hover` | `#3B82F6` | Sidebar link hover |
| `--admin-bg` | `#F9FAFB` | Content area background |
| `--card-bg` | `#FFFFFF` | Card backgrounds |
| `--text-dark` | `#111827` | Primary text |
| `--text-light` | `#6B7280` | Secondary text |
| `--border-color` | `#E5E7EB` | Borders, dividers |
| `--success` | `#10B981` | Positive values (green) |
| `--danger` | `#EF4444` | Negative values (red) |
| `--blue-50` to `--blue-900` | Various | Extended palette for UI elements |

**Rule: No hardcoded color values. Everything uses CSS variables.**

---

## Authentication Flow

### Login
1. `POST /api/auth/login` → returns `{ status, token, userId, role, username }`
2. Frontend stores in localStorage: `token`, `userId`, `role`, `username`
3. Admin users → redirect to `/admin`; others → `/`

### Admin Page Access
1. `AdminRoute` component → reads `token` from localStorage
2. Calls `GET /api/auth/validate` with `Authorization: Bearer <token>`
3. Server validates JWT (HMAC-SHA256, 24h expiry)
4. Valid + Admin → renders page; otherwise → redirect `/login`

---

## API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/login` | Login, returns JWT token |
| POST | `/api/auth/signup` | Register new user |
| GET | `/api/auth/validate` | Validate JWT token (requires Bearer header) |

### Flights — Full CRUD
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/flights` | Get all flights |
| GET | `/api/flights/{id}` | Get flight by ID |
| POST | `/api/flights` | Create new flight |
| PUT | `/api/flights/{id}` | Update flight |
| DELETE | `/api/flights/{id}` | Delete flight |

### Cities — Full CRUD
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/cities` | Get all cities |
| GET | `/api/cities/{id}` | Get city by ID |
| POST | `/api/cities` | Create new city |
| PUT | `/api/cities/{id}` | Update city |
| DELETE | `/api/cities/{id}` | Delete city |

### Crews — Full CRUD
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/crews` | Get all crews |
| GET | `/api/crews/{id}` | Get crew by ID |
| POST | `/api/crews` | Create new crew |
| PUT | `/api/crews/{id}` | Update crew |
| DELETE | `/api/crews/{id}` | Delete crew |

### Bookings
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/bookings/user/{userId}` | Get bookings by user |
| DELETE | `/api/bookings/{bookId}` | Delete a booking |
| GET | `/api/bookings/count/today` | Count bookings with today's date |
| GET | `/api/bookings/occupancy?flightId=&startDate=&endDate=` | Occupancy statistics |
| GET | `/api/bookings/revenue?startDate=&endDate=` | Aggregate revenue and route splits |
| GET | `/api/bookings/passengers?flightId=&startDate=&endDate=` | Return filtered passenger manifestations |
| GET | `/api/bookings/cancellations/stats?startDate=&endDate=` | Aggregate cancel/refund statistics |

---

## Current Resources (/admin/resources)

### Flights Tab
- **List**: All flights as cards showing `FL-{id} — {from} → {to}`, takeoff/landing times (12h format), seat count, crew ID, economy price
- **Edit Modal**: Click any card → popup with all editable fields:
  - From Location, To Location, Number of Seats
  - Price First Class (₹), Price Business (₹), Price Economy (₹)
  - Takeoff Time (`<input type="time">`), Landing Time (`<input type="time">`)
  - Crew ID
- **Add Modal**: "Add New Flight" button → same fields, creates via `POST /api/flights`
- **Save**: `PUT /api/flights/{id}` → list refreshes automatically

### Cities Tab
- **List**: All cities showing name, ID, and Domestic/International badge
- **Edit Modal**: Name, Type (Domestic/International dropdown)
- **Add Modal**: Same fields → `POST /api/cities`

### Crews Tab
- **List**: All crews showing ID and capacity
- **Edit Modal**: Crew Capacity only
- **Add Modal**: Same field → `POST /api/crews`

### Known Bug Fix — `@JsonProperty`
The Flight model's price fields (`pFirst`, `pBusiness`, `pEcon`) required `@JsonProperty` annotations because Jackson's JavaBeans convention treats `getPFirst()` → `PFirst` (not `pFirst`) when the first two characters after "get" are uppercase. Without the annotation, the JSON keys were `PFirst` etc., causing `₹NaN` on the frontend.

---

## Flight Occupancy Statistics (/admin/occupancy)

### Input Controls
- **Flight Selector** (required): Dropdown of all flights, format: `FL-{id} — {from} → {to} ({seats} seats)`
- **Start Date** (required): Date input, defaults to today
- **End Date** (required): Date input, defaults to today
- **Analyze Button**: Triggers `GET /api/bookings/occupancy`

### Query Logic
1. Backend finds all bookings where `flight1 = flightId OR flight2 = flightId` AND `dateOfFlight BETWEEN startDate AND endDate`
2. Calculates seat class distribution from total flight capacity (`numSeats`):
   - First Class = 20% of numSeats
   - Business Class = 20% of numSeats
   - Economy Class = remaining 60% of numSeats
3. Multi-day: total pool = `numSeats × N days` (e.g. 100 seats × 2 days = 200 total)
4. Sums `numSeatsBook` per `seatClass` from matching bookings

### Stats Displayed
1. **Total Seats Available** (numSeats × days)
2. **Total Seats Occupied** (sum of numSeatsBook)
3. **Overall Occupancy Rate** (%)
4. **First Class** — Available | Occupied | Occupancy %
5. **Business Class** — Available | Occupied | Occupancy %
6. **Economy Class** — Available | Occupied | Occupancy %

### Visual Elements
- Color-coded values: ≥70% green (`--success`), 30-69% blue, <30% red (`--danger`)
- Animated progress bars for each class
- All styled with admin CSS variables

---

## Security Vulnerabilities & Fixes

### 🔴 CRITICAL

| Issue | Fix |
|-------|-----|
| Passwords in plain text (`AuthService.java`) | Use BCrypt hashing |
| JWT secret in .env (check .gitignore) | Env vars in production, rotate key |

### 🟡 MEDIUM

| Issue | Fix |
|-------|-----|
| No CSRF protection | Spring Security CSRF tokens |
| Tokens in localStorage (XSS risk) | HttpOnly cookies |
| No login rate limiting | Rate limiter (bucket4j) |
| API endpoints unprotected server-side | JWT filter on all APIs |

### 🟢 LOW

| Issue | Fix |
|-------|-----|
| Verbose auth error messages | Generic "Invalid credentials" |
| No input sanitization | Validation layer |

---

## Notes for Next Developer

### Getting Started
1. **Backend**: `.\mvnw spring-boot:run` from `backend/` (PostgreSQL with `airline_db` required)
2. **Frontend**: `npm run dev` from `frontend/` (Vite on port 5173)
3. **Admin login**: `neil@snu.edu.in` / `pass123`

### Database Schema Changes
The Flights table uses `TIME` (not `TIMESTAMP`) for `TakeoffT` and `LandingT`. If you need to re-create the schema:
1. Set `spring.jpa.hibernate.ddl-auto=create` and `spring.sql.init.mode=always` in `application.properties`
2. Run the backend once
3. Revert to `ddl-auto=validate` and `init.mode=never`

### Adding New Admin Pages
1. Create component in `frontend/src/pages/admin/`
2. Wrap in `<AdminLayout>` for sidebar
3. Add route in `App.jsx` with `<AdminRoute>` guard
4. Add sidebar link in `AdminLayout.jsx`

### CSS Architecture
- All admin styles in `styles/admin.css` — never hardcode colors
- `admin-page-wrapper` class triggers full-width override in `index.css`

### Jackson Serialization Gotcha
If adding fields like `pXxx` (lowercase then uppercase), add `@JsonProperty("pXxx")` to the field. Jackson's bean convention treats `getPXxx()` as producing key `PXxx` instead of `pXxx`.

---

*Document updated: March 31, 2026*  
*Team 26 — ARTS Flight Booking System*
