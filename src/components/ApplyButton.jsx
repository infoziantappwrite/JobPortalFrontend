// components/ApplyButton.jsx
import React from 'react';

const ApplyButton = ({ courseId }) => {
  const handleApply = () => {
    alert(`Applied to course ID: ${courseId}`); // Replace with actual apply logic
  };

  return (
    <button
      onClick={handleApply}
      className="w-full sm:w-auto px-6 py-3 mt-6 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-md shadow hover:opacity-90 transition"
    >
      Apply Now
    </button>
  );
};

export default ApplyButton;
