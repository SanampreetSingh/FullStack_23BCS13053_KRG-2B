import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  // ✅ Get user data from authSlice
  const user = useSelector((state) => state.auth.user);

  // Optional safety check
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-3xl text-gray-600">No user data found.</h2>
      </div>
    );
  }

  return (
    <div className="p-6 w-[100vw] flex flex-col justify-center items-center gap-8 ">
      <div>
        <h1 className="text-5xl font-bold text-[#292321]">User Profile</h1>
      </div>

      <div className="w-8/10 flex justify-center items-center h-[70vh] gap-10 relative">
        {/* Profile Image */}
        <img
          src="src/assets/profile.png"
          className="h-full"
          alt="Profile"
        />

        {/* User Details */}
        <div className="flex-1/2 flex flex-col justify-center items-start gap-5">
          <h2 className="text-4xl font-bold text-[#292321] mb-6">
            {user.name || "N/A"}
          </h2>
          <p className="mt-2 text-3xl text-[#424141]">
            <span className="font-bold">UID: </span> {user.uid || "N/A"}
          </p>
          <p className="mt-2 text-3xl text-[#424141]">
            <span className="font-bold">Class: </span> {user.className || "N/A"}
          </p>
          <p className="mt-2 text-3xl text-[#424141]">
            <span className="font-bold">Email: </span> {user.email || "N/A"}
          </p>
          <p className="mt-2 text-3xl text-[#424141]">
            <span className="font-bold">Phone: </span> {user.phone || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
