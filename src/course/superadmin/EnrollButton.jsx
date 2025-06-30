import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";

const EnrollButton = ({ courseId,refetchCourse }) => {
  const { user } = useUser();
  const [enrolled, setEnrolled] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await apiClient.get(`/candidate/course/${courseId}/status`);
      setEnrolled(res.data?.isEnrolled);
    } catch (err) {
      console.error("Fetch status failed", err);
      toast.error("Could not fetch enrollment status");
    }
  };

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await apiClient.post(`/candidate/course/${courseId}/enroll`);
      toast.success("Enrolled successfully");
      setEnrolled(true);
      setShowEnrollModal(false);
     
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    } finally {
        if (refetchCourse) {
            refetchCourse();
        }
      setLoading(false);
    }
  };

  const handleUnenroll = async () => {
    setLoading(true);
    try {
      await apiClient.post(`/candidate/course/${courseId}/unenroll`);
      toast.success("Unenrolled successfully");
      setEnrolled(false);
      setShowUnenrollModal(false);
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Unenrollment failed");
    } finally {
        if (refetchCourse) {
            refetchCourse();
        }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userType === "candidate" && courseId) {
      fetchStatus();
    }
  }, [courseId, user]);

  if (user?.userType !== "candidate" || enrolled === null) return null;

  return (
    <>
      <button
        onClick={() => {
          enrolled ? setShowUnenrollModal(true) : setShowEnrollModal(true);
        }}
        disabled={loading}
        className="ml-auto px-4 py-2 text-sm font-semibold rounded-md shadow transition-all
        text-white bg-gradient-to-r from-teal-500 to-blue-600
        hover:from-teal-600 hover:to-blue-700
        disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Please wait..." : enrolled ? "Unenroll" : "Enroll"}
      </button>

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Choose Enrollment Type
            </h2>
            <div className="space-y-2">
              <button
                onClick={handleEnroll}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Free (Available)
              </button>
              <button
                disabled
                className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
              >
                Paid (Coming Soon)
              </button>
              
            </div>
            <button
              onClick={() => setShowEnrollModal(false)}
              className="mt-4 text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Unenroll Modal */}
      {showUnenrollModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3 text-red-600">
              Are you sure you want to unenroll?
            </h2>
            <p className="text-gray-600 mb-4">
              You will lose all your progress and course data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUnenrollModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUnenroll}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Unenroll
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnrollButton;
