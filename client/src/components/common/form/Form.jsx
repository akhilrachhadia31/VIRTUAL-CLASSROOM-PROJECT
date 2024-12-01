import React, { useState, useEffect } from "react";

const Form = ({ title, fields, onSubmit, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const checkFormValidity = () => {
      const allFieldsValid = fields.every(field => 
        !field.required || (field.value !== undefined && field.value !== '')
      );
      setIsFormValid(allFieldsValid && !isUploading);
    };

    checkFormValidity();
  }, [fields, isUploading]);

  const handleFileUpload = async (fileUpload, e) => {
    setIsUploading(true);
    await fileUpload(e);
    setIsUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form className="space-y-6" onSubmit={onSubmit}>
          {fields.map((field, index) => (
            <div key={index}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}:
              </label>
              <input
                type={field.type}
                id={field.id}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={field.placeholder}
                value={field.type !== "file" ? field.value : undefined}
                onChange={(e) => {
                  if (field.type === "file") {
                    handleFileUpload(field.onChange, e);
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                required={field.required}
                disabled={field.disabled}
                accept={field.type === "file" ? field.accept : undefined}
              />
            </div>
          ))}
          <button
        type="submit"
        disabled={isUploading}
        className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 ease-in-out ${
          !isUploading 
            ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isUploading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </span>
        ) : (
          "Submit"
        )}
      </button>
        </form>
      </div>
    </div>
  );
};

export default Form;