import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from './pages/Home';
import Profile from './pages/Profile';
import MainLayout from "./layouts/MainLayout";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminResources from "./pages/admin/AdminResources";
import AdminOccupancy from "./pages/admin/AdminOccupancy";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminPassengers from "./pages/admin/AdminPassengers";
import AdminCancellations from "./pages/admin/AdminCancellations";

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

        {/* Profile WITH Navbar */}
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />

        {/* Auth pages (no Navbar) */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* =============================================
            ADMIN ROUTES — All protected by AdminRoute
            ============================================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <div className="admin-page-wrapper">
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/resources"
          element={
            <AdminRoute>
              <div className="admin-page-wrapper">
                <MainLayout>
                  <AdminResources />
                </MainLayout>
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/occupancy"
          element={
            <AdminRoute>
              <div className="admin-page-wrapper">
                <MainLayout>
                  <AdminOccupancy />
                </MainLayout>
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/revenue"
          element={
            <AdminRoute>
              <div className="admin-page-wrapper">
                <MainLayout>
                  <AdminRevenue />
                </MainLayout>
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/passengers"
          element={
            <AdminRoute>
              <div className="admin-page-wrapper">
                <MainLayout>
                  <AdminPassengers />
                </MainLayout>
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/cancellations"
          element={
            <AdminRoute>
              <div className="admin-page-wrapper">
                <MainLayout>
                  <AdminCancellations />
                </MainLayout>
              </div>
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;