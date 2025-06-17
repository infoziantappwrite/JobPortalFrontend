/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { FiEdit, FiTrash, FiUploadCloud } from 'react-icons/fi';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';

const CVManager = () => {
  const [cvs, setCvs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const fetchCVs = async () => {
    try {
      const { data } = await apiClient.get('/candidate/cv');
      setCvs(data.CVs || []);
    } catch (err) {
      toast.error('Failed to load CVs');
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cv', file);

    try {
      setUploading(true);
      await apiClient.post('/candidate/cv/upload-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Resume uploaded successfully');
      fetchCVs();
    } catch (error) {
        console.error(error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (cvId) => {
    try {
      await apiClient.delete(`/candidate/cv/delete-cv/${cvId}`);
      toast.success('CV deleted');
      fetchCVs();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
     <div className="bg-blue-100 min-h-screen p-10 ">
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto space-y-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">CV Manager</h2>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8">
        <label className="block text-indigo-700 font-semibold text-lg mb-1">
          Drop files here to upload
        </label>
        <p className="text-gray-500 text-sm mb-4">
          Max 5MB — .doc, .docx, .pdf only
        </p>

        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-white text-indigo-600 font-semibold border border-indigo-400 px-4 py-2 rounded-md hover:bg-indigo-50 transition"
          >
            Choose File
          </button>

          <button
            disabled={uploading}
            onClick={() => fileInputRef.current.click()}
            className={`px-6 py-2 rounded-md text-white font-semibold flex items-center justify-center gap-2 transition-all ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:scale-105'
            }`}
          >
            <FiUploadCloud className="text-lg" />
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>
      </div>

      {/* CV Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cvs.map((cv) => (
          <div
            key={cv._id}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center shadow-sm"
          >
            <h3 className="text-gray-800 font-medium">Sample CV</h3>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => window.open(cv.fileUrl, '_blank')}
                className="p-2 bg-teal-100 text-teal-600 rounded hover:bg-teal-200"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => handleDelete(cv._id)}
                className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                <FiTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default CVManager;
