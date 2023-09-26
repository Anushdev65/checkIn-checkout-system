import Home from "./pages/home";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import SignUp from "./pages/UserRegister";
import ProtectedRoute from "./utils/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
      </Route>
      {/* Register route */}
      <Route path="/register" element={<SignUp />} />

      {/* Login route */}
      <Route path="/login" element={<UserLogin />} />
    </Routes>
  );
}

export default App;
