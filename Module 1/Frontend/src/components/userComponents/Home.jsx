import React, { useState } from "react";

const announcements = [
  {
    subject: "Exam Schedule Released",
    body: "The final exam schedule has been published. Please check the notice board or portal for details.",
    by: "Admin Office",
    date: "2025-09-10",
    time: "10:30 AM",
  },
  {
    subject: "Holiday Notice",
    body: "The institute will remain closed on 15th September due to a regional festival.",
    by: "Principal",
    date: "2025-09-09",
    time: "05:00 PM",
  },
  {
    subject: "Workshop on AI",
    body: "A hands-on workshop on Artificial Intelligence will be held on 20th September. Registration is open now.",
    by: "Computer Science Department",
    date: "2025-09-08",
    time: "03:15 PM",
  },
  {
    subject: "Library Timings Update",
    body: "The library will now remain open until 8:00 PM on weekdays for student convenience.",
    by: "Library Staff",
    date: "2025-09-07",
    time: "01:00 PM",
  },
  {
    subject: "Sports Meet Registration",
    body: "Students interested in participating in the Annual Sports Meet can register at the sports office.",
    by: "Sports Committee",
    date: "2025-09-06",
    time: "11:45 AM",
  },
  {
    subject: "New Cafeteria Menu",
    body: "The cafeteria has updated its menu with new healthy meal options. Feedback is welcome.",
    by: "Cafeteria Management",
    date: "2025-09-05",
    time: "09:30 AM",
  },
  {
    subject: "Scholarship Applications",
    body: "Applications for merit-based scholarships are open until 25th September. Submit online through the portal.",
    by: "Scholarship Cell",
    date: "2025-09-04",
    time: "04:00 PM",
  },
  {
    subject: "Blood Donation Camp",
    body: "A blood donation camp will be organized on campus on 18th September. Volunteers are encouraged to join.",
    by: "NSS Unit",
    date: "2025-09-03",
    time: "02:20 PM",
  },
  {
    subject: "Wi-Fi Maintenance",
    body: "Campus Wi-Fi will undergo maintenance on 12th September from 2:00 AM to 6:00 AM. Service may be unavailable.",
    by: "IT Department",
    date: "2025-09-02",
    time: "06:45 PM",
  },
  {
    subject: "Cultural Fest Announcement",
    body: "The annual cultural fest will be held from 5th to 7th October. Auditions for performances start next week.",
    by: "Cultural Committee",
    date: "2025-09-01",
    time: "12:10 PM",
  },
];

const Home = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full h-[800px] flex p-10 gap-6">
      {/* Left side - list */}
      <div className="w-1/2 border-2 border-[#292321] rounded-lg shadow-lg p-4 flex flex-col">
        <h1 className="text-3xl font-bold mb-4">Announcements</h1>
        <div className="flex-1 overflow-y-scroll pr-2 space-y-3">
          {announcements.map((a, index) => (
            <div
              key={index}
              onClick={() => setSelected(a)}
              className={`cursor-pointer border rounded-lg p-3 shadow-md transition ${
                selected?.subject === a.subject
                  ? "bg-[#f5e8d8] border-[#292321]"
                  : "hover:bg-gray-100"
              }`}
            >
              <h2 className="text-lg font-semibold">{a.subject}</h2>
              <p className="text-sm text-gray-700">
                {a.body.length > 40 ? a.body.slice(0, 40) + "..." : a.body}
              </p>
              <span className="text-xs text-gray-500">By: {a.by}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - details */}
      <div className="w-1/2 border-2 border-[#292321] rounded-lg shadow-lg p-6">
        {selected ? (
          <>
            <h2 className="text-2xl font-bold mb-2">{selected.subject}</h2>
            <p className="mb-4">{selected.body}</p>
            <div className="text-sm text-gray-600">
              <span>By: {selected.by}</span> |{" "}
              <span>Date: {selected.date}</span> |{" "}
              <span>Time: {selected.time}</span>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-500">
              Welcome to Student Portal
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
