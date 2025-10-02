import React from 'react'
import { useState } from 'react'
const profile = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    studentId: "123456",
    section: "A",
    phone: "1234567890",
    address: "123 Main St",
    password: "password",
    
  });
  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleUpdate = () => {
    setIsEditing(false);
  };

  return (
    <div className='p-6 w-[100vw] flex flex-col justify-center items-center gap-8'>
      <div>
      <h1 className='text-5xl font-bold text-[#292321]'>User Profile</h1>
      </div>

 {isEditing?( 
    <>
     <div className='w-8/10 flex justify-center items-center h-[70vh] gap-10 relative'>

             <img src="src/assets/profile.png" className='h-full' alt="Profile" />
        <div className='flex-1/2 flex flex-col justify-center items-start gap-5 '>
            
             <input type="text" value={userData.name} className='text-4xl font-bold text-[#292321] mb-6' onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Email: </span> <input type="text" disabled value={userData.email} className='text-3xl text-[#424141]' onChange={(e) => setUserData({ ...userData, email: e.target.value })} /></p>
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Student ID: </span> <input type="text" disabled value={userData.studentId} className='text-3xl text-[#424141]' onChange={(e) => setUserData({ ...userData, studentId: e.target.value })} /></p>
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Section: </span> <input type="text" disabled value={userData.section} className='text-3xl text-[#424141]' onChange={(e) => setUserData({ ...userData, section: e.target.value })} /></p>
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Phone: </span> <input type="text" disabled value={userData.phone} className='text-3xl text-[#424141]' onChange={(e) => setUserData({ ...userData, phone: e.target.value })} /></p>
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Address: </span> <input type="text" disabled value={userData.address} className='text-3xl text-[#424141]' onChange={(e) => setUserData({ ...userData, address: e.target.value })} /></p>
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Password: </span> <input type="text" value={userData.password} className='text-3xl text-[#424141]' onChange={(e) => setUserData({ ...userData, password: e.target.value })} /></p>
             
        </div>
          {/* <div className='flex justify-center items-center flex-col gap-5'>
            <button className='bg-[#a3937c] w-30 rounded-2xl p-4' onClick={handleUpdate}>Update</button>
            <button className='bg-[#a3937c] w-30 rounded-2xl p-4' onClick={() => setIsEditing(false)}>Cancel</button>
          </div> */}
       </div>
              <button onClick={handleUpdate} className='bg-blue-500  p-3 rounded-full overflow-hidden flex gap-5 justify-center items-center fixed bottom-5 right-5'><img src="src/assets/refresh.png" className='h-5 w-5' alt="Update" /> <span>Update</span></button>

       </>):(  <>
       <div className='w-8/10 flex justify-center items-center h-[70vh] gap-10 relative'>

             <img src="src/assets/profile.png" className='h-full' alt="Profile" />
        <div className='flex-1/2 flex flex-col justify-center items-start gap-5 '>
             <h2 className='text-4xl font-bold text-[#292321] mb-6'>John Doe</h2>
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Email: </span> {userData.email}</p>
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Student ID: </span> {userData.studentId}</p>
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Section: </span> {userData.section}</p>
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Phone: </span> {userData.phone}</p>
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Address: </span> {userData.address}</p>
             <p className='mt-2 text-3xl text-[#424141]'><span className='font-bold'>Password: </span> {userData.password}</p>

        </div>
       </div>
      <button onClick={handleEdit} className='bg-blue-500  p-3 rounded-full overflow-hidden flex gap-5 justify-center items-center fixed bottom-5 right-5'><img src="src/assets/pencil.png" className='h-5 w-5' alt="Edit" /> <span>Edit</span></button>
       </>

      )}

    

   
      </div>
    
  )
}

export default profile