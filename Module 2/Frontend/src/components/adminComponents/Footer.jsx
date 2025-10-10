import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect /admin/ → /admin
  useEffect(() => {
    if (location.pathname === "/admin/") {
      navigate("/admin", { replace: true });
    }
  }, [location, navigate]);

  return (
    <footer className="bg-[#e8e1d5] shadow overflow-hidden p-6 px-6 *:transition-all *:duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        {/* Links */}
        <div className="flex space-x-6 flex-wrap items-center">
          <NavLink
            to="/admin/createclass"
            className={({ isActive }) =>
              `hover:scale-105 ${
                isActive ? "text-[#292321] font-semibold" : "text-[#424141]"
              }`
            }
          >
            Create
          </NavLink>

          <NavLink
            to="/admin/result"
            className={({ isActive }) =>
              `hover:scale-105 ${
                isActive ? "text-[#292321] font-semibold" : "text-[#424141]"
              }`
            }
          >
            Result
          </NavLink>

          <NavLink
            to="/admin/timetable"
            className={({ isActive }) =>
              `hover:scale-105 ${
                isActive ? "text-[#292321] font-semibold" : "text-[#424141]"
              }`
            }
          >
            Timetable
          </NavLink>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `hover:scale-105 ${
                isActive ? "text-[#292321] font-semibold" : "text-[#424141]"
              }`
            }
          >
            Home
          </NavLink>
        </div>

        {/* Copyright */}
        <p className="mt-3 sm:mt-0 text-sm text-[#424141]">
          © {new Date().getFullYear()} Student Academic Portal
        </p>
      </div>
    </footer>
  );
}
