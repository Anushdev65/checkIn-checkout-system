import Home from "./pages/home";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import SignUp from "./pages/UserRegister";
import ProtectedRoute from "./utils/ProtectedRoute";
import TrackingLog from "./pages/TrackingLog";
import "./App.css";
import LogDetailPage from "./pages/logDetail";
import MyProfile from "./components/MyProfile";
// import { QueryClient, QueryClientProvider } from "react-query";

// const queryClient = new QueryClient();

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/home/tracking/log" element={<TrackingLog />} />
        <Route path="log/:date" element={<LogDetailPage />} />
        <Route path="/myprofile" element={<MyProfile />} />
      </Route>
      {/* Register route */}
      <Route path="/register" element={<SignUp />} />

      {/* Login route */}
      <Route path="/login" element={<UserLogin />} />
    </Routes>
  );
}

export default App;
