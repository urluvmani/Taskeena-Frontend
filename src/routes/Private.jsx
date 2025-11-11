// routes/Private.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/context/authContext";

const PrivateRoute = () => {
  const { auth } = useAuth();

  // ✅ if not logged in → redirect to /login
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ if logged in → allow access to child route
  return <Outlet />;
};

export default PrivateRoute;
