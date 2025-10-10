import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const roughStudents = [
  { uid: "S001", name: "John Doe", email: "john@example.com", section: "A", time: "09:00 AM" },
  { uid: "S002", name: "Jane Smith", email: "jane@example.com", section: "B", time: "08:30 AM" },
  { uid: "S003", name: "Alice Johnson", email: "alice@example.com", section: "A", time: "09:15 AM" },
];

const Home = () => {
  const [create, setCreate] = useState("create");
  const [announcements, setAnnouncements] = useState([]);
  const [students, setStudents] = useState(roughStudents);
  const [studentSearch, setStudentSearch] = useState("");
  const [announcementSearch, setAnnouncementSearch] = useState("");
  const createbtn = useRef();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { register, handleSubmit, reset } = useForm();

  // Fetch announcements from backend
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${backendUrl}/announcements`);
      setAnnouncements(response.data.announcements || []); // fallback to empty array
      console.log("Fetched announcements:", response.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Submit new announcement
  const onSubmit = async (data) => {
    createbtn.current.disabled = true;
    createbtn.current.innerText = "Creating...";
    try {
      await axios.post(`${backendUrl}/announcements`, {
        subject: data.title,
        body: data.description,
        by: data.author,
      });
      reset();
      fetchAnnouncements();
      console.log("Announcement created:", data);
    } catch (err) {
      console.error("Error creating announcement:", err);
    }
    createbtn.current.disabled = false;
    createbtn.current.innerText = "Create Announcement";
  };

  // Approve / Reject students
  const approveStudent = (uid) => {
    const approvedStudent = students.find((s) => s.uid === uid);
    console.log("Approved Student:", approvedStudent);
    setStudents((prev) => prev.filter((s) => s.uid !== uid));
  };

  const rejectStudent = (uid) => {
    setStudents((prev) => prev.filter((s) => s.uid !== uid));
  };

  // Filter students
  const filteredStudents = students
    .filter(
      (s) =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.uid.toLowerCase().includes(studentSearch.toLowerCase())
    )
    .sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`));

  // Filter announcements
  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.subject.toLowerCase().includes(announcementSearch.toLowerCase()) ||
      a.body.toLowerCase().includes(announcementSearch.toLowerCase()) ||
      a.by.toLowerCase().includes(announcementSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center w-full p-10 rounded-lg">
      <h1 className="text-4xl w-full text-center font-extrabold text-[#292321] mb-10 tracking-wide">
        Welcome to the Admin Portal
      </h1>

      {/* Toggle buttons */}
      <div className="flex w-full justify-center items-center gap-6 mb-8">
        <button
          className={`px-5 py-2 rounded-lg border-2 border-[#292321] font-medium transition duration-200 ${
            create === "accept" ? "bg-[#292321] text-white shadow-md" : "bg-white text-[#292321]"
          }`}
          onClick={() => setCreate("accept")}
        >
          Acceptance Students
        </button>
        <button
          className={`px-5 py-2 rounded-lg border-2 border-[#292321] font-medium transition duration-200 ${
            create === "create" ? "bg-[#292321] text-white shadow-md" : "bg-white text-[#292321]"
          }`}
          onClick={() => setCreate("create")}
        >
          Create Announcement
        </button>
        <button
          className={`px-5 py-2 rounded-lg border-2 border-[#292321] font-medium transition duration-200 ${
            create === "show" ? "bg-[#292321] text-white shadow-md" : "bg-white text-[#292321]"
          }`}
          onClick={() => setCreate("show")}
        >
          Show Announcements
        </button>
      </div>

      {/* ACCEPT Students */}
      {create === "accept" && (
        <div className="bg-white w-full border-2 border-[#292321] p-8 rounded-xl shadow-lg min-h-[300px]">
          <h1 className="text-2xl font-bold text-[#292321] mb-4 text-center">Accept Students</h1>

          <input
            type="text"
            placeholder="Search Students..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="w-full mb-4 border border-gray-300 rounded-lg p-2 outline-none focus:ring-1 focus:ring-[#292321]"
          />

          {filteredStudents.length > 0 && (
            <div className="grid grid-cols-6 gap-4 font-semibold text-[#292321] mb-2 border-b border-gray-300 pb-2">
              <div>UID</div>
              <div>Name</div>
              <div>Email</div>
              <div>Section</div>
              <div>Time</div>
              <div>Actions</div>
            </div>
          )}

          {filteredStudents.length > 0 ? (
            filteredStudents.map((s) => (
              <div
                key={s.uid}
                className="grid grid-cols-6 gap-4 items-center border border-[#292321] p-3 rounded-lg mb-2"
              >
                <span>{s.uid}</span>
                <span>{s.name}</span>
                <span>{s.email}</span>
                <span>{s.section}</span>
                <span>{s.time}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveStudent(s.uid)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    ✔
                  </button>
                  <button
                    onClick={() => rejectStudent(s.uid)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No students currently.</p>
          )}
        </div>
      )}

      {/* Create Announcement Form */}
      {create === "create" && (
        <div className="w-full max-w-2xl bg-white border-2 border-[#292321] p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Title"
              {...register("title", { required: true })}
              className="border border-gray-400 focus:border-[#292321] focus:ring-1 focus:ring-[#292321] p-3 rounded-lg outline-none"
            />
            <textarea
              placeholder="Description"
              {...register("description", { required: true, minLength: 20 })}
              className="border border-gray-400 focus:border-[#292321] focus:ring-1 focus:ring-[#292321] p-3 rounded-lg outline-none h-32"
            />
            <input
              type="text"
              placeholder="Author"
              {...register("author", { required: true })}
              className="border border-gray-400 focus:border-[#292321] focus:ring-1 focus:ring-[#292321] p-3 rounded-lg outline-none"
            />
            <button
              ref={createbtn}
              type="submit"
              className="bg-[#292321] disabled:bg-[#1e1a19] text-white py-3 rounded-lg font-semibold hover:bg-[#1e1a19] transition duration-200 shadow-md"
            >
              Create Announcement
            </button>
          </form>
        </div>
      )}

      {/* Show Announcements */}
      {create === "show" && (
        <div className="w-full max-w-3xl flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search Announcements..."
            value={announcementSearch}
            onChange={(e) => setAnnouncementSearch(e.target.value)}
            className="w-full mb-4 border-2 border-[#292321] rounded-lg p-2 outline-none focus:ring-1 focus:ring-[#292321]"
          />

          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((a, index) => (
              <div
                key={index}
                className="bg-white border border-[#292321] rounded-xl shadow-md p-6 transition hover:shadow-xl"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-[#292321]">{a.subject}</h2>
                  <span className="text-sm text-gray-500">
                    {a.date} | {a.time}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{a.body}</p>
                <span className="text-sm font-medium text-[#292321]">By {a.by}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No announcements found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
