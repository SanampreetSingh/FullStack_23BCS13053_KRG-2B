import React from 'react'

const StudentCard = (props) => {
  return (
    <div className='h-80 w-80 bg-gray-200 p-4 rounded-3xl m-4 flex flex-col items-center justify-center gap-6 shadow-lg hover:scale-105 transition-transform'>
      <h2 className='text-3xl'>{props.name}</h2>
      <p className='text-xl '>Age: {props.age}</p>
      <p className='text-xl'>Course: {props.course}</p>
    </div>
  )
}

export default StudentCard