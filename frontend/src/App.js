import Home from "./pages/home";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import SignUp from "./pages/UserRegister";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Register route */}
      <Route path="/register" element={<SignUp />} />

      {/* Login route */}
      <Route path="/login" element={<UserLogin />} />

      {/* Protected home route */}
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
