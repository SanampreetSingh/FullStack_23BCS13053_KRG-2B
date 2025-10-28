import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log("Backend URL:", backendUrl);

  // Fetch announcements from backend
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${backendUrl}/announcements`);
      setAnnouncements(res.data.announcements || res.data); // handle different response shapes
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Filter announcements by search
  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase()) ||
      a.by.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-[800px] flex p-10 gap-6">
      {/* Left side - list */}
      <div className="w-1/2 border-2 border-[#292321] rounded-lg shadow-lg p-4 flex flex-col">
        <h1 className="text-4xl font-bold mb-6">Announcements</h1>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 p-2 border rounded-lg outline-none focus:ring-1 focus:ring-[#292321]"
        />

        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((a, index) => (
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
                  {a.body.length > 60 ? a.body.slice(0, 60) + "..." : a.body}
                </p>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>By: {a.by}</span>
                  <span>{a.date} | {a.time}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No announcements found.</p>
          )}
        </div>
      </div>

      {/* Right side - details */}
      <div className="w-1/2 border-2 border-[#292321] rounded-lg shadow-lg p-6">
        {selected ? (
          <div className="flex flex-col justify-between h-full gap-4">
        
            <h2 className="text-3xl font-bold">Subject: {selected.subject}</h2>
            <p className="border-b "></p>
         
             
            <p className="flex-1 text-gray-700 text-1xl">{selected.body}</p>
             <p className="border-b "></p>
            <div className="flex justify-between text-sm text-gray-600">
              <span>By: {selected.by}</span>
              <span>Date: {selected.date}</span>
              <span>Time: {selected.time}</span>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-500">
              Select an announcement to view details
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
