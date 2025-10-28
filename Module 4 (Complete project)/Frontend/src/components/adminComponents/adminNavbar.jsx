import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../feature/auth/authSlice"; 
import resultsIcon from "../../assets/results.png";
import calendarIcon from "../../assets/calendar.png";
import homeIcon from "../../assets/home.png";
import logoutIcon from "../../assets/logout.png"; 
import Create from "../../assets/create.png";
const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redirect if the path ends with a trailing slash
  useEffect(() => {
    if (location.pathname === "/admin/") {
      navigate("/admin", { replace: true });
    }
  }, [location, navigate]);

  // handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="bg-[#e8e1d5] shadow flex justify-between items-center overflow-hidden p-10  h-16 *:transition-all *:duration-300">
      <h1 className="text-xl text-[#292321]">Student Academic Portal</h1>
      <nav className="flex space-x-4 justify-center items-center *:w-20">
        
        <NavLink
          to="/admin/createclass"
          className={({ isActive }) =>
            `hover:scale-106 flex flex-col justify-center items-center p-2 rounded-2xl text-[#292321] ${
              isActive ? "bg-[#c2b8a8]" : ""
            }`
          }
        >
          <img src={Create} className="w-6 h-6" alt="Create Class" />
          <span>Create</span>
        </NavLink>
        <NavLink
          to="/admin/result"
          className={({ isActive }) =>
            `hover:scale-106 flex flex-col justify-center items-center p-2 rounded-2xl text-[#292321] ${
              isActive ? "bg-[#c2b8a8]" : ""
            }`
          }
        >
          <img src={resultsIcon} className="w-6 h-6" alt="Results" />
          <span>Result</span>
        </NavLink>

        <NavLink
          to="/admin/timetable"
          className={({ isActive }) =>
            `hover:scale-106 flex flex-col justify-center items-center p-2 rounded-2xl text-[#292321] ${
              isActive ? "bg-[#c2b8a8]" : ""
            }`
          }
        >
          <img src={calendarIcon} className="w-6 h-6" alt="Timetable" />
          <span>Timetable</span>
        </NavLink>

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `hover:scale-106 flex flex-col justify-center items-center p-2 rounded-2xl text-[#292321] ${
              isActive ? "bg-[#c2b8a8]" : ""
            }`
          }
        >
          <img src={homeIcon} className="w-6 h-6" alt="Home" />
          <span>Home</span>
        </NavLink>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="hover:scale-106 flex flex-col justify-center items-center p-2 rounded-2xl text-[#292321] transition duration-200"
        >
          <img src={logoutIcon} className=" h-7" alt="Logout" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminNavbar;
