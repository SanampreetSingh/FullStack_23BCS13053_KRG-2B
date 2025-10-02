import React from 'react'
import { useState ,useEffect} from 'react';
const timetable1 = {
  Monday: [
    { subject: "Math", time: "9:30 AM - 10:20 AM", teacher: "Mr. Sharma", room: "101" },
    { subject: "English", time: "10:20 AM - 11:10 AM", teacher: "Ms. Kapoor", room: "102" },
    { subject: "Physics", time: "11:10 AM - 12:00 PM", teacher: "Dr. Rao", room: "103" },
    { subject: "Break", time: "12:00 PM - 12:30 PM" },
    { subject: "Computer Science", time: "12:30 PM - 1:20 PM", teacher: "Mr. Verma", room: "104" },
    { subject: "Free", time: "1:20 PM - 2:10 PM" },
    { subject: "Biology", time: "2:10 PM - 3:00 PM", teacher: "Ms. Gupta", room: "105" },
    { subject: "History", time: "3:10 PM - 4:00 PM", teacher: "Mr. Singh", room: "106" },
    { subject: "Class Meeting", time: "4:00 PM - 4:20 PM", teacher: "Class Teacher", room: "107" }
  ],
  Tuesday: [
    { subject: "Chemistry", time: "9:30 AM - 10:20 AM", teacher: "Dr. Mehta", room: "201" },
    { subject: "Math", time: "10:20 AM - 11:10 AM", teacher: "Mr. Sharma", room: "101" },
    { subject: "Free", time: "11:10 AM - 12:00 PM" },
    { subject: "Break", time: "12:00 PM - 12:30 PM" },
    { subject: "Physics", time: "12:30 PM - 1:20 PM", teacher: "Dr. Rao", room: "103" },
    { subject: "Computer Science", time: "1:20 PM - 2:10 PM", teacher: "Mr. Verma", room: "104" },
    { subject: "Geography", time: "2:10 PM - 3:00 PM", teacher: "Mr. Das", room: "202" },
    { subject: "Physical Education", time: "3:10 PM - 4:00 PM", teacher: "Coach Kumar", room: "Sports Hall" },
    { subject: "Class Meeting", time: "4:00 PM - 4:20 PM", teacher: "Class Teacher", room: "107" }
  ],
  Wednesday: [
    { subject: "Biology", time: "9:30 AM - 10:20 AM", teacher: "Ms. Gupta", room: "105" },
    { subject: "Math", time: "10:20 AM - 11:10 AM", teacher: "Mr. Sharma", room: "101" },
    { subject: "English", time: "11:10 AM - 12:00 PM", teacher: "Ms. Kapoor", room: "102" },
    { subject: "Break", time: "12:00 PM - 12:30 PM" },
    { subject: "Free", time: "12:30 PM - 1:20 PM" },
    { subject: "Chemistry", time: "1:20 PM - 2:10 PM", teacher: "Dr. Mehta", room: "201" },
    { subject: "Computer Science", time: "2:10 PM - 3:00 PM", teacher: "Mr. Verma", room: "104" },
    { subject: "History", time: "3:10 PM - 4:00 PM", teacher: "Mr. Singh", room: "106" },
    { subject: "Class Meeting", time: "4:00 PM - 4:20 PM", teacher: "Class Teacher", room: "107" }
  ],
  Thursday: [
    { subject: "Physics", time: "9:30 AM - 10:20 AM", teacher: "Dr. Rao", room: "103" },
    { subject: "Free", time: "10:20 AM - 11:10 AM" },
    { subject: "English", time: "11:10 PM - 12:00 PM", teacher: "Ms. Kapoor", room: "102" },
    { subject: "Break", time: "12:00 PM - 12:30 PM" },
    { subject: "Math", time: "12:30 PM - 1:20 PM", teacher: "Mr. Sharma", room: "101" },
    { subject: "Geography", time: "1:20 PM - 2:10 PM", teacher: "Mr. Das", room: "202" },
    { subject: "Biology", time: "2:10 PM - 3:00 PM", teacher: "Ms. Gupta", room: "105" },
    { subject: "Free", time: "3:10 PM - 4:00 PM" },
    { subject: "Class Meeting", time: "4:00 PM - 4:20 PM", teacher: "Class Teacher", room: "107" }
  ],
  Friday: [
    { subject: "Chemistry", time: "9:30 AM - 10:20 AM", teacher: "Dr. Mehta", room: "201" },
    { subject: "Math", time: "10:20 AM - 11:10 AM", teacher: "Mr. Sharma", room: "101" },
    { subject: "Computer Science", time: "11:10 AM - 12:00 PM", teacher: "Mr. Verma", room: "104" },
    { subject: "Break", time: "12:00 PM - 12:30 PM" },
    { subject: "English", time: "12:30 PM - 1:20 PM", teacher: "Ms. Kapoor", room: "102" },
    { subject: "Free", time: "1:20 PM - 2:10 PM" },
    { subject: "Physics", time: "2:10 PM - 3:00 PM", teacher: "Dr. Rao", room: "103" },
    { subject: "Physical Education", time: "3:10 PM - 4:00 PM", teacher: "Coach Kumar", room: "Sports Hall" },
    { subject: "Class Meeting", time: "4:00 PM - 4:20 PM", teacher: "Class Teacher", room: "107" }
  ]
};


const timetable2 = {
  Monday: [
    { subject: "Math", time: "9:30 AM - 10:20 AM", teacher: "Mr. Sharma", room: "101" },
    { subject: "English", time: "10:20 AM - 11:10 AM", teacher: "Ms. Kapoor", room: "102" },
    { subject: "Physics", time: "11:10 AM - 12:00 PM", teacher: "Dr. Rao", room: "103" },
    { subject: "Break", time: "12:00 PM - 12:30 PM" },
    { subject: "Computer Science", time: "12:30 PM - 1:20 PM", teacher: "Mr. Verma", room: "104" },
    { subject: "Free", time: "1:20 PM - 2:10 PM" },
    { subject: "Biology", time: "2:10 PM - 3:00 PM", teacher: "Ms. Gupta", room: "105" },
    { subject: "History", time: "3:10 PM - 4:00 PM", teacher: "Mr. Singh", room: "106" },
    { subject: "Class Meeting", time: "4:00 PM - 4:20 PM", teacher: "Class Teacher", room: "107" }
  ],
  Tuesday: [
    { subject: "Chemistry", time: "9:30 AM - 10:20 AM", teacher: "Dr. Mehta", room: "201" },
    { subject: "Math", time: "10:20 AM - 11:10 AM", teacher: "Mr. Sharma", room: "101" },
    { subject: "Free", time: "11:10 AM - 12:00 PM" },
    { subject: "Break", time: "12:00 PM - 12:30 PM" },
    { subject: "Physics", time: "12:30 PM - 1:20 PM", teacher: "Dr. Rao", room: "103" },
    { subject: "Computer Science", time: "1:20 PM - 2:10 PM", teacher: "Mr. Verma", room: "104" },
    { subject: "Geography", time: "2:10 PM - 3:00 PM", teacher: "Mr. Das", room: "202" },
    { subject: "Physical Education", time: "3:10 PM - 4:00 PM", teacher: "Coach Kumar", room: "Sports Hall" },
    { subject: "Class Meeting", time: "4:00 PM - 4:20 PM", teacher: "Class Teacher", room: "107" }
  ],
  Wednesday: [
    { subject: "Biology", time: "9:30 AM - 10:20 AM", teacher: "Ms. Gupta", room: "105" },
    { subject: "Math", time: "10:20 AM - 11:10 AM", teacher: "Mr. Sharma", room: "101" },
    { subject: "English", time: "11:10 AM - 12:00 PM", teacher: "Ms. Kapoor", room: "102" },
    { subject: "Break", time: "12:00 PM - 12:30 PM" },
    { subject: "Free", time: "12:30 PM - 1:20 PM" },
    { subject: "Chemistry", time: "1:20 PM - 2:10 PM", teacher: "Dr. Mehta", room: "201" },
    { subject: "Computer Science", time: "2:10 PM - 3:00 PM", teacher: "Mr. Verma", room: "104" },
    { subject: "History", time: "3:10 PM - 4:00 PM", teacher: "Mr. Singh", room: "106" },
    { subject: "Class Meeting", time: "4:00 PM - 4:20 PM", teacher: "Class Teacher", room: "107" }
  ],
  Thursday: [
    { subject: "Physics", time: "9:30 AM - 10:20 AM", teacher: "Dr. Rao", room: "103" },
    { subject: "Free", time: "10:20 AM - 11:10 AM" },
    { subject: "English", time: "11:10 PM - 12:00 PM", teacher: "Ms. Kapoor", room: "102" },
    { subject: "Break", time: "12:00 PM - 12:30 PM" },
    { subject: "Math", time: "12:30 PM - 1:20 PM", teacher: "Mr. Sharma", room: "101" },
    { subject: "Geography", time: "1:20 PM - 2:10 PM", teacher: "Mr. Das", room: "202" },
    { subject: "Biology", time: "2:10 PM - 3:00 PM", teacher: "Ms. Gupta", room: "105" },
    { subject: "Free", time: "3:10 PM - 4:00 PM" },
    { subject: "Class Meeting", time: "4:00 PM - 4:20 PM", teacher: "Class Teacher", room: "107" }
  ],
  Friday: [
    { subject: "Chemistry", time: "9:30 AM - 10:20 AM", teacher: "Dr. Mehta", room: "201" },
    { subject: "Math", time: "10:20 AM - 11:10 AM", teacher: "Mr. Sharma", room: "101" },
    { subject: "Computer Science", time: "11:10 AM - 12:00 PM", teacher: "Mr. Verma", room: "104" },
    { subject: "Break", time: "12:00 PM - 12:30 PM" },
    { subject: "English", time: "12:30 PM - 1:20 PM", teacher: "Ms. Kapoor", room: "102" },
    { subject: "Free", time: "1:20 PM - 2:10 PM" },
    { subject: "Physics", time: "2:10 PM - 3:00 PM", teacher: "Dr. Rao", room: "103" },
    { subject: "Physical Education", time: "3:10 PM - 4:00 PM", teacher: "Coach Kumar", room: "Sports Hall" },
    { subject: "Class Meeting", time: "4:00 PM - 4:20 PM", teacher: "Class Teacher", room: "107" }
  ],
  Saturday: [
    { subject: "Math Revision", time: "9:30 AM - 10:20 AM", teacher: "Mr. Sharma", room: "Room 101" },
    { subject: "Free", time: "10:20 AM - 11:10 AM" },
    { subject: "Free", time: "11:10 AM - 12:00 PM" },
    { subject: "Break", time: "12:00 PM - 12:30 PM" },
    { subject: "Free", time: "12:30 PM - 1:20 PM" },
    { subject: "Free", time: "1:20 PM - 2:10 PM" },
    { subject: "Free", time: "2:10 PM - 3:00 PM" },
    { subject: "Free", time: "3:10 PM - 4:00 PM" },
    { subject: "Free", time: "4:00 PM - 4:20 PM" }
  ]
};


const Timetable = () => {
  const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const currentday = new Date().toLocaleString('default', { weekday: 'long' });
    useEffect(() => {
      const currentIndex = days.indexOf(currentday);
      
      if(timetable2[days[currentIndex]]){
        setSelectedDay(currentIndex);
      }
      else{setSelectedDay(0)}
    }, [currentday]);

    
    const [selectedDay, setSelectedDay] = useState(null);
    const handledayselect = (index) => {
      setSelectedDay(index);
    }

  return (
    <div className='p-6 w-[100vw] flex flex-col justify-center items-center gap-8'>
   <div>
    <h1 className='text-5xl text-[#292321]  font-bold'>Timetable</h1>
   </div>
   <div className='w-full flex justify-center pt-4'>
    <ul className='flex items-center w-[50%] justify-around'>
      {Object.keys(timetable2).map((day, index) => (
        <li  className={`text-[#292321] font-semibold border-2 border-[#292321] p-2 rounded-md w-28 text-center hover:bg-[#292321] hover:text-white cursor-pointer onfocus:bg-[#292321] onactive:text-white ${selectedDay === index ? 'bg-[#292321] text-white' : ''}`} onClick={() => handledayselect(index)}  key={index}>{day}</li>
      ))}
    </ul>
   </div>
    <div>
   <table className='border border-[#292321] border-collapse '>
  <thead>
    <tr >
      <th className='border border-[#292321] p-2'>Time</th>
      <th className='border border-[#292321] p-2'>Subject</th>
      <th className='border border-[#292321] p-2'>Teacher</th>
      <th className='border border-[#292321] p-2'>Room</th>
    </tr>
  </thead>
  <tbody>
    {days[selectedDay]&&timetable2[days[selectedDay]].map((entry, idx) => (
      <tr key={idx} className='*:text-center *:text-wrap'>
        <td className='border border-[#292321] p-2 w-[200px]'>{entry.time}</td>
        <td className='border border-[#292321] p-2 w-[200px]'>{`${(entry.subject=="Free"||entry.subject=="Break")?" --- ":entry.subject}`}</td>
        <td className='border border-[#292321] p-2 w-[200px]'>{`${(entry.subject=="Free"||entry.subject=="Break")?" --- ":entry.teacher}`}</td>
        <td className='border border-[#292321] p-2 w-[200px]'>{`${(entry.subject=="Free"||entry.subject=="Break")?" --- ":entry.room}`}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
    </div>
  )

}

export default Timetable