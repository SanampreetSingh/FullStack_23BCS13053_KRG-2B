import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Auth from "./pages/auth/auth";
import Layout from "./pages/Layout/userLayout";
import Timetable from "./components/userComponents/Timetable";
import Home from "./components/userComponents/Home";
import Result from "./components/userComponents/Result";
import Profile from "./components/userComponents/Profile";


import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    const { role, isAuthenticated } = useSelector((state) => state.auth || {});
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect unknown routes */}
      
        <Route path="*" element={<Navigate to="/login" />} />

        {/* LOGIN route with redirect if already authenticated */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
                <Navigate to="/" replace />
            ) : (
              <Auth />
            )
          }
        />
        
        <Route element={<ProtectedRoute allowedRole="user" />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="result" element={<Result />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

       
        
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
