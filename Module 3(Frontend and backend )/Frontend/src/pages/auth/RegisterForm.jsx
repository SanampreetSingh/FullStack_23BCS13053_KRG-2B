import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const RegisterForm = ({
  section,
  setSection,
  onSubmit,
  onSwitch,
  defaultValues,
  sectionsList = [],
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {},
  });

  const password = watch("password"); // 👈 watch live value of password

  // Prefill when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => setValue(key, defaultValues[key]));
      if (defaultValues.section) setSection(defaultValues.section);
    }
  }, [defaultValues, setValue, setSection]);

  // Reset form when section changes
  useEffect(() => {
    if (Object.keys(defaultValues).length === 0) reset();
  }, [defaultValues, reset]);

  // ✅ Custom submit handler that removes +91 or spaces
  const handleRegisterSubmit = (data) => {
    // remove +91 or leading spaces if present
    let cleanPhone = data.phone.replace(/^\+91\s?/, ""); // remove +91 with or without space
    cleanPhone = cleanPhone.replace(/\s+/g, ""); // remove spaces
    data.phone = cleanPhone; // assign back cleaned value

    onSubmit(data); // call parent submit
  };

  return (
    <div className="flex-1/2 h-full bg-[#f6f2eb] flex flex-col justify-center items-center gap-5">
      <h1 className="text-4xl">Register</h1>

      <form
        onSubmit={handleSubmit(handleRegisterSubmit)} // ✅ use cleaned submit
        className="gap-2 flex flex-col justify-center items-center w-full"
        autoComplete="on"
      >
        {/* Name */}
        <input
          id="name"
          type="text"
          {...register("name", { required: "Name is required" })}
          placeholder="Name"
          className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]"
        />

        {/* UID */}
        <input
          id="uid"
          type="text"
          {...register("uid", { required: "UID is required" })}
          placeholder="UID"
          className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]"
        />

        {/* Section */}
        <select
          id="section"
          {...register("section", { required: "Section is required" })}
          className={`border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%] ${
            section === "" ? "text-[#8f8a85]" : "text-black"
          }`}
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          <option value="" disabled>
            Select your section
          </option>
          {sectionsList.length > 0 ? (
            sectionsList.map((cls) => (
              <option key={cls._id} value={cls.className}>
                {cls.className}
              </option>
            ))
          ) : (
            <option disabled>Loading sections...</option>
          )}
        </select>

        {/* Email */}
        <input
          id="email"
          type="email"
          {...register("email", { required: "Email is required" })}
          placeholder="Email"
          className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]"
        />

        {/* Phone */}
        <input
          id="phone"
          type="text"
          {...register("phone", {
            required: "Phone is required",
            pattern: {
              value: /^\+?(\d{0,3})?\s?\d{10}$/,
              message: "Enter a valid phone number",
            },
          })}
          placeholder="Phone"
          className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}

        {/* Password */}
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
          placeholder="Password"
          className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]"
        />

        {/* Confirm Password */}
        <input
          id="confirmpassword"
          type="password"
          {...register("confirmpassword", {
            required: "Confirm Password is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
          placeholder="Confirm Password"
          className="border-2 border-[#d6d3ce] rounded-lg p-2 m-2 w-[40%]"
        />
        {errors.confirmpassword && (
          <p className="text-red-500 text-sm">{errors.confirmpassword.message}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="rounded-lg p-2 m-2 bg-[#a3937c] w-30 hover:bg-[#8f806c] active:bg-[#8a7152]"
        >
          Register
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <span
          className="text-[#8f806c] hover:underline hover:text-[#776b5b] cursor-pointer"
          onClick={onSwitch}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;
