import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#e8e1d5] shadow  overflow-hidden p-6 px-25   *:transition-all *:duration-300">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
        
        {/* Links */}
        <div className="flex space-x-6">
          <NavLink 
            to="/timetable" 
            className={({ isActive }) =>
              `hover:text-[#292321] hover:scale-x-106  ${isActive ? "text-[#292321] font-semibold" : ""}`
            }
          >
            Timetable
          </NavLink>
          
          <NavLink 
            to="/result" 
            className={({ isActive }) =>
         `hover:text-[#292321] hover:scale-x-106 ${isActive ? "text-[#292321] font-semibold" : ""}`
            }
          >
            Result
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={({ isActive }) =>
              `hover:text-[#292321] hover:scale-x-106 ${isActive ? "text-[#292321] font-semibold" : ""}`
            }
          >
            Profile
          </NavLink>
          
          <NavLink 
            to="/" 
            className={({ isActive }) =>
              `hover:text-[#292321] hover:scale-x-106 ${isActive ? "text-[#292321] font-semibold" : ""}`
            }
          >
            Announcements
          </NavLink>
        </div>

        {/* Copyright */}
        <p className="mt-3 sm:mt-0 text-sm  text-[#424141]">
          © {new Date().getFullYear()} Student Academic Portal
        </p>
      </div>
    </footer>
  );
}
