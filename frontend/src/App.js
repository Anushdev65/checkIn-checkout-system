import Home from "./pages/home";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLoginAuth from "./pages/UserLogin";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="login" element={<UserLoginAuth />} />
      {/* <Route path="/" element={<Navigate to="/login" replace={true} />} /> */}
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
