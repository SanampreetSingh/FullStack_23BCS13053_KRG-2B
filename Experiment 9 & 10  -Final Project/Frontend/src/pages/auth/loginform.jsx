import React from "react";
import { useForm } from "react-hook-form";

const LoginForm = ({ onSubmit, onSwitch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitForm = (data) => {
    onSubmit(data); // Send UID and password to Auth component
  };

  return (
    <div className="flex-1/2 h-full bg-[#e8e1d5] flex flex-col justify-center items-center gap-10">
      <h1 className="text-4xl">Login</h1>
      <form
        className="gap-4 flex flex-col justify-center items-center"
        onSubmit={handleSubmit(submitForm)}
        autoComplete="on"
      >
        <input
          type="text"
          {...register("uid", { required: "UID is required" })}
          placeholder="Uid"
          autoComplete="username"
          id="uid"
          name="uid"
          className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2"
        />
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
          placeholder="Password"
          autoComplete="current-password"
          id="password"
          name="password"
          className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2"
        />
        {errors.uid && <span className="text-red-500">{errors.uid.message}</span>}
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        <button
          type="submit"
          className="rounded-lg p-2 m-2 bg-[#a3937c] w-30 hover:bg-[#8f806c] active:bg-[#8a7152]"
        >
          Login
        </button>
        <p>
          Didn't have an account?{" "}
          <span
            className="text-[#8f806c] hover:underline hover:text-[#776b5b] cursor-pointer"
            onClick={onSwitch}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
