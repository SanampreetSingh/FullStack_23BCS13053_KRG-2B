import React from "react";

const SlidingPanel = ({ transele }) => {
  return (
   <div className='absolute flex h-full w-[50%] bg-amber-50 transition-all duration-500 translate-x-0' ref={transele}>
            <div className='flex flex-col justify-center items-center h-full w-full'>
              <div className='h-full w-9/12 flex justify-center items-center flex-col gap-5'>
                <h1 className='text-5xl'>Student Academic Portal</h1>
                <p className='text-2xl'>Welcome to the Student Academic Portal. Please login or register to continue.</p>
              </div>
            </div>
          </div>

  );
};

export default SlidingPanel;
