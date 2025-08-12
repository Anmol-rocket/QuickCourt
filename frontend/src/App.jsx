import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserDashboard from "./pages/user/UserDashboard";
import VenuesPage from "./pages/user/VenuesPage";
import VenueDetails from "./pages/user/VenueDetails";
import TournamentsPage from "./pages/user/TournamentsPage";
import UserLogin from "./pages/auth/userAuth/UserLogin";
import RegisterPage from "./pages/auth/userAuth/UserRegister";
// import FacilityOwnerLogin from "./pages/auth/facilityOwnerAuth/FacilityOwnerLogin";
// import FacilityOwnerRegister from "./pages/auth/facilityOwnerAuth/FacilityOwnerRegister";
import ProfilePage from "./pages/user/ProfilePage";
//import FacilityOwnerDashboard from './pages/facilityOwner/FacilityOwnerDashboard';
import CourtBooking from "./pages/user/CourtBooking";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import FacilityDashboard from "./pages/admin/FacilityDashboard";
import FacilityApproval from "./pages/admin/FacilityApproval";
import UserManagement from "./pages/admin/UserManagement";
import VenueSportsDetail from "./pages/facilityOwner/VenueSportsDetail";
import UpdateSportsDetails from "./pages/facilityOwner/UpdateSportsDetails";
import Profile from "./pages/facilityOwner/Profile";
import Refund from "./pages/facilityOwner/Refund";
import FacilityOwnerDashboard from "./pages/facilityOwner/FacilityOwnerDashboard";
import MyBooking from "./pages/facilityOwner/MyBooking";
import MyVenue from "./pages/facilityOwner/MyVenue";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const userRole = localStorage.getItem("userRole");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // If specific role required and user doesn't have it, redirect based on their role
    if (userRole === "ROLE_ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === "ROLE_FACILITY_OWNER") {
      return <Navigate to="/facility-owner/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* <Route path="/facility-owner/login" element={<FacilityOwnerLogin />} /> */}
      {/* <Route
        path="/facility-owner/register"
        element={<FacilityOwnerRegister />}
      /> */}

      {/* User Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/venues"
        element={
          <ProtectedRoute>
            <VenuesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tournaments"
        element={
          <ProtectedRoute>
            <TournamentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/venue/:id"
        element={
          <ProtectedRoute>
            <VenueDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/booking"
        element={
          <ProtectedRoute>
            <CourtBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book/:venueId"
        element={
          <ProtectedRoute>
            <CourtBooking />
          </ProtectedRoute>
        }
      />

      {/* Facility Owner Routes
      <Route path="/facility-owner/dashboard" element={
        <ProtectedRoute requiredRole="ROLE_FACILITY_OWNER">
          <FacilityOwnerDashboard />
        </ProtectedRoute>
      } /> */}

      {/*Facility Owner Routes*/}
      <Route
        path="/facility-owner-dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_FACILITY_OWNER">
            <FacilityOwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/facility-owner-dashboard/my-bookings"
        element={
          <ProtectedRoute requiredRole="ROLE_FACILITY_OWNER">
            <MyBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/facility-owner-dashboard/my-bookings/profile"
        element={
          <ProtectedRoute requiredRole="ROLE_FACILITY_OWNER">
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/facility-owner-dashboard/refund"
        element={
          <ProtectedRoute requiredRole="ROLE_FACILITY_OWNER">
            <Refund />
          </ProtectedRoute>
        }
      />

      <Route
        path="/facility-owner-dashboard/my-venues"
        element={
          <ProtectedRoute requiredRole="ROLE_FACILITY_OWNER">
            <MyVenue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/facility-owner-dashboard/my-venues/profile"
        element={
          <ProtectedRoute requiredRole="ROLE_FACILITY_OWNER">
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/facility-owner-dashboard/profile"
        element={
          <ProtectedRoute requiredRole="ROLE_FACILITY_OWNER">
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/facility-owner-dashboard/venuesports"
        element={
          <ProtectedRoute requiredRole="ROLE_FACILITY_OWNER">
            <VenueSportsDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/facility-owner-dashboard/my-venues/update-sports"
        element={
          <ProtectedRoute requiredRole="ROLE_FACILITY_OWNER">
            <UpdateSportsDetails />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/facility-dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <FacilityDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/facility-approval"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <FacilityApproval />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/user-management"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <UserManagement />
          </ProtectedRoute>
        }
      />

      {/* Legacy Routes for Backward Compatibility */}
      <Route
        path="/venues"
        element={<Navigate to="/dashboard/venues" replace />}
      />
      <Route
        path="/booking"
        element={<Navigate to="/dashboard/booking" replace />}
      />
      <Route
        path="/profile"
        element={<Navigate to="/dashboard/profile" replace />}
      />

      {/* Catch All Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
