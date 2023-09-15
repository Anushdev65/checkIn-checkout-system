import { getLevelInfo } from "../localStorage/localStorage.js";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = getLevelInfo();
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
