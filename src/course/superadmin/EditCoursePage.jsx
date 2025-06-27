import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../api/apiClient';

const EditCoursePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;

  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    image: course?.image || '',
    instructor: course?.instructor || '',
    duration: course?.duration || '',
    level: course?.level || '',
    price: course?.price || '',
    tags: course?.tags || [],
    topics: course?.topics || [],
    curriculum: course?.curriculum || [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateCurriculum = (index, newSection) => {
    const updated = [...formData.curriculum];
    updated[index] = newSection;
    setFormData({ ...formData, curriculum: updated });
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: '', lessons: [] }],
    }));
  };

  const addLesson = (sectionIndex) => {
    const updated = [...formData.curriculum];
    updated[sectionIndex].lessons.push({ title: '', duration: '', videoUrl: '' });
    setFormData({ ...formData, curriculum: updated });
  };

  const updateLesson = (sectionIndex, lessonIndex, updatedLesson) => {
    const updated = [...formData.curriculum];
    updated[sectionIndex].lessons[lessonIndex] = updatedLesson;
    setFormData({ ...formData, curriculum: updated });
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    const updated = [...formData.curriculum];
    updated[sectionIndex].lessons.splice(lessonIndex, 1);
    setFormData({ ...formData, curriculum: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.put(`/superadmin/course/${course._id}`, formData, {
        withCredentials: true,
      });
      toast.success('Course updated successfully');
      navigate(-1);
    } catch (err) {
      console.error('Error updating course:', err);
      toast.error('Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 font-semibold">Course data not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-6 border border-teal-200">
      <h1 className="text-2xl font-bold text-teal-700">✏️ Edit Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['title', 'instructor', 'duration', 'level', 'price', 'image'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value.split(',').map((tag) => tag.trim()),
              })
            }
            className="w-full border border-blue-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topics</label>
          <div className="space-y-2">
            {formData.topics.map((topic, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => {
                    const updated = [...formData.topics];
                    updated[idx] = e.target.value;
                    setFormData({ ...formData, topics: updated });
                  }}
                  className="w-full border px-3 py-1 rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      topics: formData.topics.filter((_, i) => i !== idx),
                    })
                  }
                  className="text-red-500 text-sm"
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, topics: [...formData.topics, ''] })}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Topic
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum</label>
          {formData.curriculum.map((section, sIdx) => (
            <div key={sIdx} className="border p-3 rounded mb-4 space-y-3 bg-gray-50">
              <input
                type="text"
                placeholder="Section Title"
                value={section.title}
                onChange={(e) => updateCurriculum(sIdx, { ...section, title: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />

              {section.lessons.map((lesson, lIdx) => (
                <div key={lIdx} className="space-y-1 bg-white p-2 rounded shadow-sm">
                  <input
                    type="text"
                    placeholder="Lesson Title"
                    value={lesson.title}
                    onChange={(e) => updateLesson(sIdx, lIdx, { ...lesson, title: e.target.value })}
                    className="w-full border px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={lesson.duration}
                    onChange={(e) => updateLesson(sIdx, lIdx, { ...lesson, duration: e.target.value })}
                    className="w-full border px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Video URL"
                    value={lesson.videoUrl}
                    onChange={(e) => updateLesson(sIdx, lIdx, { ...lesson, videoUrl: e.target.value })}
                    className="w-full border px-2 py-1 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeLesson(sIdx, lIdx)}
                    className="text-xs text-red-500"
                  >
                    Remove Lesson
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addLesson(sIdx)}
                className="text-sm text-teal-600"
              >
                + Add Lesson
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSection}
            className="mt-2 text-sm text-blue-600"
          >
            + Add Section
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-2 rounded-full font-medium shadow hover:opacity-90 transition"
          >
            {loading ? 'Saving...' : 'Update Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCoursePage;
