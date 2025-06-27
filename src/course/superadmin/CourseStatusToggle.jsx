import React, { useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';

const CourseStatusToggle = ({ courseId, initialStatus }) => {
  const [isPublished, setIsPublished] = useState(initialStatus?.isPublished || false);
  const [featured, setFeatured] = useState(initialStatus?.featured || false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.patch(
        `/superadmin/course/${courseId}`,
        { isPublished, featured },
        { withCredentials: true }
      );
      toast.success('Status saved');
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-blue-50 px-4 py-2 rounded-md border border-blue-200">
      <label className="flex items-center gap-2 text-sm text-blue-700">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="accent-blue-600"
        />
        <span className="font-medium">Published</span>
      </label>

      <label className="flex items-center gap-2 text-sm text-teal-700">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="accent-teal-600"
        />
        <span className="font-medium">Featured</span>
      </label>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm px-4 py-1.5 rounded-md shadow hover:opacity-90 transition"
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default CourseStatusToggle;
