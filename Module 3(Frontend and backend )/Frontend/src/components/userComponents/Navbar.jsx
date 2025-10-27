import React from 'react'
import { Link } from 'react-router-dom'
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logoutIcon from "../../assets/logout.png"; 
import { logout } from "../../feature/auth/authSlice"; 
const Navbar = () => {
   const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
 const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="bg-[#e8e1d5] shadow flex justify-between items-center overflow-hidden p-10 px-25 h-16   *:transition-all *:duration-300">
      <h1 className='text-xl text-[#292321]'>Student Academic Portal</h1>
      <nav className='flex space-x-4 justify-center items-center *:w-20'>
           
          <NavLink to="/result"  className={({ isActive }) =>
          `  hover:scale-106 flex flex-col justify-center items-center p-2 rounded-2xl text-[#292321] ${isActive?"bg-[#c2b8a8]":""}`
        }  ><img src="src/assets/results.png" className='w-6 h-6' alt="Results" /><span>Result</span></NavLink>

        <NavLink to="/timetable"  className={({ isActive }) =>
  `  hover:scale-106 flex flex-col justify-center items-center p-2 rounded-2xl text-[#292321] ${isActive?"bg-[#c2b8a8]":""}`      }><img src="src/assets/calendar.png" className='w-6 h-6' alt="Timetable" /><span>Timetable</span></NavLink>

        <NavLink to="/" className={({ isActive }) =>
  `  hover:scale-106 flex flex-col justify-center items-center p-2 rounded-2xl text-[#292321] ${isActive?"bg-[#c2b8a8]":""}`        }><img src="src/assets/home.png"  className='w-6 h-6' alt="Home" /><span>Home</span></NavLink>

          <NavLink to="/profile" className={({ isActive }) =>
  `  hover:scale-106 flex flex-col justify-center items-center p-2 rounded-2xl text-[#292321] ${isActive?"bg-[#c2b8a8]":""}`          }><img src="src/assets/profile.png" className='w-6 h-6' alt="Profile" /><span>Profile</span></NavLink>
   <button
          onClick={handleLogout}
          className="hover:scale-106 flex flex-col justify-center items-center p-2 rounded-2xl text-[#292321] transition duration-200"
        >
          <img src={logoutIcon} className=" h-7" alt="Logout" />
          <span>Logout</span>
        </button>
      </nav>

    </div>
  )
}

export default Navbar