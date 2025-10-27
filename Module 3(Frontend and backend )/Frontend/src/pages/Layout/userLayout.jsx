import React from 'react'
import Navbar from '../../components/userComponents/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/userComponents/Footer'
const userLayout = () => {
  return (
<>
<div className='h-[100vh] flex flex-col justify-between overflow-x-hidden'>
<Navbar />
<div className=' h-full w-full bg-[#d6d3ce]'>
 <div className="h-full w-full">
          <Outlet />
        </div>
</div>
<Footer />


</div>
    
</>
  )
}

export default userLayout