import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import FlightList from "./pages/FlightList";
import MainLayout from "./layouts/MainLayout";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home WITH Navbar */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        {/* 2. Add Profile WITH Navbar */}
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Flight List */}
        <Route
          path="/flights"
          element={
            <MainLayout>
              <FlightList />
            </MainLayout>
          }
        />

        <Route
          path="/seat-selection"
          element={
            <MainLayout>
              <SeatSelection />
            </MainLayout>
          }
        />

        <Route
          path="/payment"
          element={
            <MainLayout>
              <Payment />
            </MainLayout>
          }
        />

        <Route
          path="/confirmation"
          element={
            <MainLayout>
              <Confirmation />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
