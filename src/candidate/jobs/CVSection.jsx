import { useState } from "react";
import { FiDownload, FiUpload, FiTrash2 } from "react-icons/fi";

const CVSection = ({ initialCVs }) => {
  const [cvList, setCvList] = useState(initialCVs || []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate uploading and get a fake URL
    const newCV = {
      fileName: file.name,
      fileURL: URL.createObjectURL(file), // Replace with real upload URL from server
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    setCvList((prev) => [...prev, newCV]);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this CV?");
    if (!confirmDelete) return;
    setCvList(cvList.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">Download / Manage CV</h3>

      {/* CV List */}
      {cvList.map((doc, i) => (
        <div key={i} className="flex items-center gap-4 mb-3 text-blue-600">
          <a
            href={doc.fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 underline"
          >
            <FiDownload />
            {doc.fileName}
          </a>
          <span className="text-gray-500 text-sm">(Uploaded: {doc.uploadedAt})</span>
          <button
            onClick={() => handleDelete(i)}
            className="text-red-500 hover:text-red-700"
            title="Delete CV"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}

      {/* Upload Section */}
      <label className="inline-flex items-center gap-2 text-teal-600 mt-4 cursor-pointer hover:underline">
        <FiUpload />
        <span>Upload New CV</span>
        <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
      </label>
    </div>
  );
};

export default CVSection;
