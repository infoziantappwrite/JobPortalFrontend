import { useEffect, useState } from 'react';
import Modal from './Modal'; // make sure this path is correct
import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';
import { useUser } from '../../contexts/UserContext';

const ApplyButton = ({ jobId, jobTitle, applications }) => {
  const [openModal, setOpenModal] = useState(false);
  const [cvs, setCvs] = useState([]);
  const [selectedURL, setSelectedURL] = useState(null);
  const { user } = useUser();
  console.log(user, applications);

  const fetchCVs = async () => {
    try {
      const { data } = await apiClient.get('/candidate/cv');
      setCvs(data.CVs || []);
    } catch {
      toast.error('Failed to fetch resumes');
    }
  };

  const handleApply = async () => {
    if (!selectedURL) return toast.warn('Please select a resume');

    try {
      await apiClient.post(`/candidate/job/${jobId}/apply`, {
        resumeURL: selectedURL,
      });
      toast.success('Applied successfully');
      setOpenModal(false);
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'Failed to apply. Try again later.'
      );
    }
  };

  useEffect(() => {
    if (openModal) fetchCVs();
  }, [openModal]);

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        disabled={applications.some(app => app.candidateID === user.id)}
        className={`px-6 py-2 rounded-lg transition font-medium ${applications.some(app => app.candidateID === user.id)
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700'
          }`}
      >
        {applications.some(app => app.candidateID === user.id)
          ? 'Already Applied'
          : 'Apply'}
      </button>


      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} title={`Apply for ${jobTitle}`}>
        {cvs.length === 0 ? (
          <p className="text-gray-600">No resumes uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {cvs.map((cv) => (
              <div
                key={cv._id}
                className={`p-3 border rounded-lg cursor-pointer ${selectedURL === cv.fileURL
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
                  }`}
                onClick={() => setSelectedURL(cv.fileURL)}
              >
                {cv.fileName}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => setOpenModal(false)}
            className="px-4 py-2 text-white border bg-red-500 rounded hover:bg-red-400"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2  rounded bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700"
          >
            Submit Application
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ApplyButton;
