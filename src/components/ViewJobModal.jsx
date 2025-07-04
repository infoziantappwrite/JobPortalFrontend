import React from 'react';

const ViewJobModal = ({ job, onClose }) => {
 // console.log('ViewJobModal job:', job);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-400 hover:text-red-500 text-xl">&times;</button>
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">Job Details</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Title:</strong> {job.title}</p>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Description:</strong> {job.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewJobModal;
