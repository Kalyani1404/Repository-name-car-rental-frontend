import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/cars" replace />;
  }

  return children;
}

export default AdminRoute;