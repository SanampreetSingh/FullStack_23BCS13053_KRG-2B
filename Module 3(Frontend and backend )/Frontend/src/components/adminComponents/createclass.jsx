import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

export default function CreateClass() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      className: "",
      subjects: [
        {
          name: "",
          type: "Graded",
          credits: "",
          internal: "",
          external: "",
          activities: [{ name: "", total: "" }],
        },
      ],
    },
  });

  const {
    fields: subjectFields,
    append: appendSubject,
    remove: removeSubject,
  } = useFieldArray({
    control,
    name: "subjects",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`${backendURL}/class/`, data);
      setMessage("✅ Class created successfully!");
      reset();
    } catch (error) {
      console.error(error);
      setMessage("❌ Error creating class. " + (error.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Class</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Class Name */}
        <div>
          <label className="block font-semibold mb-1">Class Name</label>
          <input
            type="text"
            name="className"
            id="className"
            placeholder="Enter class name"
            {...register("className", { required: "Class name is required" })}
            className="border p-2 rounded-lg w-full"
          />
          {errors.className && (
            <p className="text-red-500 text-sm mt-1">
              {errors.className.message}
            </p>
          )}
        </div>

        {/* Subjects Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Subjects</h2>
          {subjectFields.map((subject, subjIndex) => (
            <div
              key={subject.id}
              className="border p-4 rounded-lg mb-4 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Subject {subjIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeSubject(subjIndex)}
                  className="text-red-500 font-semibold"
                >
                  ✕ Remove
                </button>
              </div>

              {/* Subject Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name={`subjects.${subjIndex}.name`}
                  id={`subjects.${subjIndex}.name`}
                  placeholder="Subject Name"
                  {...register(`subjects.${subjIndex}.name`, {
                    required: "Subject name is required",
                  })}
                  className="border p-2 rounded-lg"
                />

                <select
                  name={`subjects.${subjIndex}.type`}
                  id={`subjects.${subjIndex}.type`}
                  {...register(`subjects.${subjIndex}.type`)}
                  className="border p-2 rounded-lg"
                >
                  <option value="Graded">Graded</option>
                  <option value="Non-Graded">Non-Graded</option>
                </select>

                {/* Credits (disabled for Non-Graded) */}
                <input
                  type="text"
                  name={`subjects.${subjIndex}.credits`}
                  id={`subjects.${subjIndex}.credits`}
                  placeholder="Credits"
                  disabled={
                    watch(`subjects.${subjIndex}.type`) === "Non-Graded"
                  }
                  {...register(`subjects.${subjIndex}.credits`, {
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only numbers are allowed",
                    },
                  })}
                  className={`border p-2 rounded-lg ${
                    watch(`subjects.${subjIndex}.type`) === "Non-Graded"
                      ? "bg-gray-200 cursor-not-allowed"
                      : ""
                  }`}
                />

                <input
                  type="text"
                  name={`subjects.${subjIndex}.internal`}
                  id={`subjects.${subjIndex}.internal`}
                  placeholder="Internal Marks"
                  {...register(`subjects.${subjIndex}.internal`, {
                    required: "Internal marks are required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only numbers are allowed",
                    },
                  })}
                  className="border p-2 rounded-lg"
                />

                <input
                  type="text"
                  name={`subjects.${subjIndex}.external`}
                  id={`subjects.${subjIndex}.external`}
                  placeholder="External Marks"
                  {...register(`subjects.${subjIndex}.external`, {
                    required: "External marks are required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only numbers are allowed",
                    },
                  })}
                  className="border p-2 rounded-lg"
                />
              </div>

              {/* Activities */}
              <ActivityFields
                control={control}
                register={register}
                subjIndex={subjIndex}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              appendSubject({
                name: "",
                type: "Graded",
                credits: "",
                internal: "",
                external: "",
                activities: [{ name: "", total: "" }],
              })
            }
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            + Add Subject
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Creating..." : "Create Class"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          className={`mt-4 text-center font-semibold ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

// ✅ Separate component for Activities inside Subject
function ActivityFields({ control, register, subjIndex }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `subjects.${subjIndex}.activities`,
  });

  return (
    <div className="mt-4">
      <h4 className="font-medium mb-1">Activities</h4>

      {fields.map((activity, actIndex) => (
        <div
          key={activity.id}
          className="flex gap-2 items-center mb-2 flex-wrap"
        >
          <input
            type="text"
            id="activityName"
            name="activityName"
            placeholder="Activity Name"
            {...register(
              `subjects.${subjIndex}.activities.${actIndex}.name`,
              { required: true }
            )}
            className="border p-2 rounded-lg flex-1"
          />

          <input
            type="text"
            id="activityTotal"
            name="activityTotal"
            placeholder="Total Marks"
            {...register(
              `subjects.${subjIndex}.activities.${actIndex}.total`,
              { required: true, pattern: /^[0-9]+$/ }
            )}
            className="border p-2 rounded-lg flex-1"
          />

          <button
            type="button"
            onClick={() => remove(actIndex)}
            className="text-red-500 font-semibold"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: "", total: "" })}
        className="text-blue-500 mt-2"
      >
        + Add Activity
      </button>
    </div>
  );
}
