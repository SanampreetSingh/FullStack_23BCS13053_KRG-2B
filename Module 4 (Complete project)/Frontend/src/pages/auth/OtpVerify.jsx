import React, { useEffect, useState } from "react";

const OtpVerify = ({ otp, setOtp, onVerify, onResend, onBack }) => {
  const [timer, setTimer] = useState(0);

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify({ otp });
  };

  // Handle resend OTP
  const handleResend = () => {
    if (timer === 0) {
      onResend(); // 🔁 call parent resend function
      setTimer(30); // start countdown
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="flex-1/2 h-full bg-[#f6f2eb] flex flex-col justify-center items-center gap-5">
      <h1 className="text-4xl">Verify OTP</h1>

      <form
        className="gap-4 flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength="6"
          className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 text-center tracking-widest"
        />

        <button
          type="submit"
          className="rounded-lg p-2 m-2 bg-[#a3937c] w-30 hover:bg-[#8f806c] active:bg-[#8a7152]"
        >
          Verify
        </button>
      </form>

      {/* Resend OTP section */}
      <p>
        Didn’t receive the OTP?{" "}
        {timer > 0 ? (
          <span className="text-gray-500">Resend in {timer}s</span>
        ) : (
          <span
            className="text-[#8f806c] hover:underline hover:text-[#776b5b] cursor-pointer"
            onClick={handleResend}
          >
            Resend OTP
          </span>
        )}
      </p>

      {/* Back link */}
      <p>
        Want to go{" "}
        <span
          className="text-[#8f806c] hover:underline hover:text-[#776b5b] cursor-pointer"
          onClick={onBack}
        >
          Back?
        </span>
      </p>
    </div>
  );
};

export default OtpVerify;
