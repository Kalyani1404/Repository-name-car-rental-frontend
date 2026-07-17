import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DriverRoute({ children }) {
  const { isLoggedIn, isDriver } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (!isDriver) {
    return <Navigate to="/cars" replace />;
  }

  return children;
}

export default DriverRoute;
