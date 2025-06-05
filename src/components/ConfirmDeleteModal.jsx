import React from 'react';

const ConfirmDeleteModal = ({ onConfirm, onCancel, count }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
        <h4 className="text-lg font-semibold mb-4 text-red-600">Confirm Deletion</h4>
        <p>Are you sure you want to delete {count > 1 ? `${count} jobs` : `this job`}?</p>
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
