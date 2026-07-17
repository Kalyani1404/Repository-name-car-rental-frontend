import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DriverRoute from "./components/DriverRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import CarDetails from "./pages/CarDetails";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddCar from "./pages/AddCar";
import DriverDashboard from "./pages/DriverDashboard";
import Notifications from "./pages/Notifications";
import SafetyCenter from "./pages/SafetyCenter";
import AdminOperations from "./pages/AdminOperations";
import "./App.css";

const protectedPage = (page) => <ProtectedRoute>{page}</ProtectedRoute>;

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        <Route path="/cars" element={protectedPage(<UserDashboard />)} />
        <Route path="/cars/:id" element={protectedPage(<CarDetails />)} />
        <Route path="/book/:id" element={protectedPage(<BookingPage />)} />
        <Route path="/my-bookings" element={protectedPage(<MyBookings />)} />
        <Route path="/profile" element={protectedPage(<Profile />)} />
        <Route path="/notifications" element={protectedPage(<Notifications />)} />
        <Route path="/safety" element={protectedPage(<SafetyCenter />)} />

        <Route path="/driver" element={<DriverRoute><DriverDashboard /></DriverRoute>} />

        <Route path="/admin" element={<AdminRoute><OwnerDashboard /></AdminRoute>} />
        <Route path="/admin/add-car" element={<AdminRoute><AddCar /></AdminRoute>} />
        <Route path="/admin/operations" element={<AdminRoute><AdminOperations /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
