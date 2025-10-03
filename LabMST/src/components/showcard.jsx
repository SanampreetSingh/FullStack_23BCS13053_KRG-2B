import React from 'react'
import StudentCard from './studentcard'
export const ShowCard = () => {
  return (
    <>
    <div className='flex w-full flex-col items-center justify-center'>
        
    <div className='grid   md:grid-cols-2  gap-4 p-4 w-1/2'>
      <StudentCard name="Manjot Singh" age={20} course="Computer Science" />
      <StudentCard name="Himanshu" age={21} course="Computer Science" />
      <StudentCard name="Riya" age={6} course="Kindergarten" />
      <StudentCard name="Raj Kumar" age={20} course="Computer Science" />
    </div>
    
    </div>
    </>

  )
}
