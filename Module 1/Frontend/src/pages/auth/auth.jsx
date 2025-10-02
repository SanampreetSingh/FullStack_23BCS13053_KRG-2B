import React, { use, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../../feature/auth/authSlice"; 

const Auth = () => {
 const dispatch = useDispatch();
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors }
  } = useForm();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors }
  } = useForm();



  const transele = useRef(null);
  const [Login, setLogin] = useState(false);
  const [section, setSection] = useState("");
  const [otpsection, setOtpsection] = useState(false);
  const [otp, setOtp] = useState("");

  const handleLogin = (data) => {
    dispatch(login({ role: "user" })); // assuming role is 'user' on login
    console.log("Login", data);
  };

  const handletransition = () => {
    setLogin(!Login);
    transele.current.classList.toggle('translate-x-full');
    transele.current.classList.toggle('translate-x-0');
  };

  const handleRegister = (data) => {
    console.log("Register", data);
    setOtpsection(true);
  };

  const handleOtpVerify = (data) => {
    preventDefault();
    console.log("OTP Entered:", data.otp);
  };

  const handleResendOtp = () => {
    console.log("Resend OTP");
  };

  const gotoregister = () => {
    setOtpsection(false);
  };

  return (
    <div className='bg-[#d6d3ce] h-[100vh] w-[100vw] flex justify-center items-center text-[#292321]'>
      <div className='relative flex rounded-3xl h-[80%] w-[70%] shadow-2xl overflow-hidden border-2 border-[#d6d3ce]'>

        {/* Moving panel */}
        <div className='absolute flex h-full w-[50%] bg-amber-50 transition-all duration-500 translate-x-full' ref={transele}>
          <div className='flex flex-col justify-center items-center h-full w-full'>
            <div className='h-full w-9/12 flex justify-center items-center flex-col gap-5'>
              <h1 className='text-5xl'>Student Academic Portal</h1>
              <p className='text-2xl'>Welcome to the Student Academic Portal. Please login or register to continue.</p>
            </div>
          </div>
        </div>

        {/* Register or OTP */}
        {!Login ?(
          otpsection ? (
            <div className='flex-1/2 h-full bg-[#f6f2eb] flex flex-col justify-center items-center gap-5'>
              <h1 className='text-4xl'>Verify OTP</h1>
              <form className='gap-4 flex flex-col justify-center items-center' onSubmit={handleOtpVerify}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2"
                />
                <button type="submit" className="rounded-lg p-2 m-2 bg-[#a3937c] w-30 hover:bg-[#8f806c] active:bg-[#8a7152]">Verify</button>
              </form>
              <p>Didn't receive the OTP? <span className="text-[#8f806c] hover:underline hover:text-[#776b5b] cursor-pointer" onClick={handleResendOtp}>Resend OTP</span></p>
              <p>Want to go <span className="text-[#8f806c] hover:underline hover:text-[#776b5b] cursor-pointer" onClick={gotoregister}>Back?</span></p>
            </div>
          ) : (
            <div className='flex-1/2 h-full bg-[#f6f2eb] flex flex-col justify-center items-center gap-5'>
              <h1 className='text-4xl'>Register</h1>
              <form onSubmit={handleRegisterSubmit(handleRegister)} className='gap-2 flex flex-col justify-center items-center w-full'>
                <input type="text" {...registerRegister("name")} placeholder="Name" className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]" />
                <input type="text" {...registerRegister("Uid")} placeholder="Uid" className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]" />
                <select
                  {...registerRegister("section")}
                  className={`border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%] ${section === "" ? "text-[#8f8a85]" : "text-black"}`}
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                >
                  <option value="" disabled>Select your section</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
                <input type="email" {...registerRegister("email")} placeholder="Email" className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]" />
                <input type="text" {...registerRegister("phone")} placeholder="Phone" className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]" />
                <input type="password" {...registerRegister("password")} placeholder="Password" className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]" autoComplete="current-password" />
                <input type="text" {...registerRegister("confirmpassword")} placeholder="Confirm Password" className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]" />
                <button type="submit" className="rounded-lg p-2 m-2 bg-[#a3937c] w-30 hover:bg-[#8f806c] active:bg-[#8a7152]">Register</button>
              </form>
              <p>Already have an account? <span className="text-[#8f806c] hover:underline hover:text-[#776b5b] cursor-pointer" onClick={handletransition}>Login</span></p>
            </div>
          )
        ):(<div className='flex-1/2 h-full bg-[#f6f2eb] flex flex-col justify-center items-center gap-5'></div>)}

        {/* Login */}
      {Login?(
                  <div className='flex-1/2 h-full bg-[#e8e1d5] flex flex-col justify-center items-center gap-10'>
            <h1 className='text-4xl'>Login</h1>
            <form className='gap-4 flex flex-col justify-center items-center' onSubmit={handleLoginSubmit(handleLogin)}>
              <input type="text" {...registerLogin("Uid", { required: true })} placeholder="Uid" className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2" />
              <input
                type="password"
                {...registerLogin("password", {
                  required: true,
                  validate: (value) => value.length >= 6 || "Password must be at least 6 characters long"
                })}
                placeholder="Password"
                autoComplete="current-password"
                className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2"
              />
              {loginErrors.password && <span className="text-red-500">{loginErrors.password.message}</span>}
              <button type="submit" className="rounded-lg p-2 m-2 bg-[#a3937c] w-30 hover:bg-[#8f806c] active:bg-[#8a7152]">Login</button>
              <p>Didn't have an account? <span className="text-[#8f806c] hover:underline hover:text-[#776b5b] cursor-pointer" onClick={handletransition}>Register</span></p>
            </form>
          </div>
      ):(<div className='flex-1/2 h-full bg-[#f6f2eb] flex flex-col justify-center items-center gap-5'></div>)}

        

      </div>
    </div>
  );
};

export default Auth;
