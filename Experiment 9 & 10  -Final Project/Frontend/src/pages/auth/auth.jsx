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
          role: response.data.role,
          user: response.data,
        })
      );

      alert("Login successful!");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      // backend returns plain string on error (or may return a message), show it
      alert(error.response?.data || error.message || "Login failed");
    }
  };

  // ✅ Handle register (Send OTP)
  const handleRegister = async (data) => {
    try {
      setRegisterData({ ...data, className: section }); // store data + section
      setOtpsection(true);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/sendotp`,
        { email: data.email }
      );

      // backend returns a plain string message, not an object with `message`
      alert(response.data);
    } catch (error) {
      console.error("Send OTP failed:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Send OTP failed");
    }
  };

  // ✅ Handle OTP verification
  const handleOtpVerify = async () => {
    try {
      // The backend expects the OTP in the `password` field for verification
      const verifyRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/verifyotp`,
        { email: registerData.email, password: otp }
      );

      // backend returns a plain string result
      alert(verifyRes.data);

      // If verification succeeded, submit the waiting user entry so admin can approve
      // Build the waiting user payload expected by backend
      const waitingUserPayload = {
        name: registerData.name,
        email: registerData.email,
        uid: registerData.uid,
        phone: Number(registerData.phone),
        password: registerData.password,
        className: section,
      };

      const createRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/createwaitinguser`,
        waitingUserPayload
      );

      // Inform user that registration was submitted (backend returns the saved WaitingUser)
      alert("Registration submitted. Pending admin approval.");

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
      // backend returns a plain string message
      alert(res.data);
    } catch (err) {
      console.error("Resend OTP failed:", err.response?.data || err.message);
      alert(err.response?.data || err.message || "Resend OTP failed");
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
