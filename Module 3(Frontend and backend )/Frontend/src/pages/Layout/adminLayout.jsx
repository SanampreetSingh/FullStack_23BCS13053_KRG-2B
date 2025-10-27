import React from 'react'
import Navbar from '../../components/adminComponents/adminNavbar'
import Footer from '../../components/adminComponents/Footer'
import { Outlet } from 'react-router-dom'
const adminLayout = () => {
  return (
<>
<div className='min-h-[100vh] flex flex-col justify-between overflow-x-hidden'>
<Navbar />
<div className='flex-1 h-full w-full bg-[#d6d3ce]'>
 <div className="  h-full w-full">
          <Outlet />
        </div>
</div>
<Footer />


</div>
    
</>)
}

export default adminLayout