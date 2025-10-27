import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../../feature/auth/authSlice";
import LoginForm from "./loginform";
import SlidingPanel from "./SlidingPanel";
import OtpVerify from "./OtpVerify";
import RegisterForm from "./RegisterForm";

const Auth = () => {
  const dispatch = useDispatch();
  const transele = useRef(null);

  const [Login, setLogin] = useState(true);
  const [section, setSection] = useState("");
  const [sectionsList, setSectionsList] = useState([]); // Dynamic sections from backend
  const [otpsection, setOtpsection] = useState(false);
  const [otp, setOtp] = useState("");
  const [registerData, setRegisterData] = useState({});

  // ✅ Fetch sections from backend
    useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/class/get`);
        setSectionsList(res.data);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // ✅ Toggle login/register panel
  const handletransition = () => {
    setLogin(!Login);
    transele.current.classList.toggle("translate-x-full");
    transele.current.classList.toggle("translate-x-0");
  };

  // ✅ Handle login
  const handleLogin = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        {
          uid: data.uid,
          password: data.password,
        }
      );

      // Dispatch user to Redux
      dispatch(
        login({
          role: response.data.user.role,
          user: response.data.user,
        })
      );

      alert("Login successful!");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // ✅ Handle register (Send OTP)
  const handleRegister = async (data) => {
    try {
      setRegisterData({ ...data, className: section }); // store data + section
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/sendotp`,
        { email: data.email }
      );
      
      alert(response.data.message);
      setOtpsection(true);
    } catch (error) {
      console.error("Send OTP failed:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Send OTP failed");
    }
  };

  // ✅ Handle OTP verification
  const handleOtpVerify = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/verifyotp`,
        { ...registerData, otp }
      );

      alert(response.data.message);

      // Clear all after success
      setRegisterData({});
      setSection("");
      setOtp("");
      setOtpsection(false);

      // Switch to login
      setLogin(true);
      transele.current.classList.remove("translate-x-full");
      transele.current.classList.add("translate-x-0");
    } catch (error) {
      console.error("OTP Verification failed:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  // ✅ Resend OTP
  const handleResendOtp = async () => {
    try {
      if (!registerData.email) {
        alert("Email is missing");
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/resendotp`,
        { email: registerData.email }
      );
      alert(res.data.message);
    } catch (err) {
      console.error("Resend OTP failed:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Resend OTP failed");
    }
  };

  // ✅ Go back to register
  const gotoregister = () => {
    setOtpsection(false);
  };

  return (
    <div className="bg-[#d6d3ce] h-[100vh] w-[100vw] flex justify-center items-center text-[#292321]">
      <div className="relative flex rounded-3xl h-[80%] w-[70%] shadow-2xl overflow-hidden border-2 border-[#d6d3ce]">
        {/* Sliding panel */}
        <SlidingPanel transele={transele} />

        {/* Register or OTP Section */}
        {!Login ? (
          otpsection ? (
            <OtpVerify
              otp={otp}
              setOtp={setOtp}
              onVerify={handleOtpVerify}
              onResend={handleResendOtp}
              onBack={gotoregister}
            />
          ) : (
            <RegisterForm
              section={section}
              setSection={setSection}
              onSubmit={handleRegister}
              onSwitch={handletransition}
              defaultValues={registerData}
              sectionsList={sectionsList}
            />
          )
        ) : (
          <div className="flex-1/2 h-full bg-[#f6f2eb]"></div>
        )}

        {/* Login Section */}
        {Login ? (
          <LoginForm onSubmit={handleLogin} onSwitch={handletransition} />
        ) : (
          <div className="flex-1/2 h-full bg-[#f6f2eb]"></div>
        )}
      </div>
    </div>
  );
};

export default Auth;
