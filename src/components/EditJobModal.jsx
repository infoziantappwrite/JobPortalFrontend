import React from 'react';

const EditJobModal = ({ formData, onChange, onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-400 hover:text-red-500 text-xl">&times;</button>
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">Edit Job</h3>
        <div className="space-y-4">
          <input className="w-full p-2 border rounded" name="title" value={formData.title} onChange={onChange} placeholder="Job Title" />
          <input className="w-full p-2 border rounded" name="company" value={formData.company} onChange={onChange} placeholder="Company" />
          <input className="w-full p-2 border rounded" name="location" value={formData.location} onChange={onChange} placeholder="Location" />
          <textarea className="w-full p-2 border rounded" name="description" value={formData.description} onChange={onChange} placeholder="Description" />
          <div className="flex justify-end">
            <button onClick={onSubmit} className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-4 py-2 rounded shadow hover:opacity-90">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
