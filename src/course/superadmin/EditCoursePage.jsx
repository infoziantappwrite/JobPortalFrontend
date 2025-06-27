import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../api/apiClient';
import { PencilLine } from 'lucide-react';
import CourseStatusToggle from './CourseStatusToggle';


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
    level: course?.level || 'beginner',
    price: course?.price || 'free',
    tags: course?.tags || [],
    topics: course?.topics || [],
    curriculum: course?.curriculum || [],
    enrollmentCount: course?.enrollmentCount || 0,
    rating: course?.rating || 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateCurriculum = (index, newSection) => {
    const updated = [...formData.curriculum];
    updated[index] = newSection;
    setFormData({ ...formData, curriculum: updated });
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: '', lessons: [{ title: '', duration: '', videoUrl: '' }] }],
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
      await apiClient.put(`/superadmin/course/${course._id}`, formData, { withCredentials: true });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-700">
          <PencilLine className="w-7 h-7 text-blue-600" />
          Edit Course
        </h2>


        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Inputs */}
          <div className="grid md:grid-cols-2 gap-6">
            {['title', 'instructor', 'duration', 'image',"enrollmentCount","rating"].map((field) => (
              <div key={field}>
                <label className="block text-[15px] font-medium text-blue-600 mb-1 capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-sm rounded-lg border border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                />
              </div>
            ))}
            <div>
              <label className="block text-[15px] font-medium text-blue-600 mb-1">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm rounded-lg border border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-[15px] font-medium text-blue-600 mb-1">Price</label>
              <select
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm rounded-lg border border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[15px] font-medium text-blue-600 mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm rounded-lg border border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              placeholder="Write a brief course description..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[15px] font-medium text-blue-600 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(',').map((tag) => tag.trim()),
                })
              }
              className="w-full px-4 py-2 text-sm rounded-lg border border-blue-300 bg-blue-50"
            />
          </div>

          {/* Topics */}
          <div>
            <label className="block text-[15px] font-medium text-blue-600 mb-1">Topics</label>
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
                    className="w-full px-4 py-2 text-sm rounded-lg border border-blue-300 bg-blue-50"
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

          {/* Curriculum */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Curriculum</h3>
            {formData.curriculum.map((section, sIdx) => (
              <div key={sIdx} className="border border-blue-200 p-4 rounded-md space-y-4 bg-blue-50">
                <input
                  type="text"
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) => updateCurriculum(sIdx, { ...section, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                />

                {section.lessons.map((lesson, lIdx) => (
                  <div key={lIdx} className="grid md:grid-cols-3 gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) =>
                        updateLesson(sIdx, lIdx, { ...lesson, title: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={lesson.duration}
                      onChange={(e) =>
                        updateLesson(sIdx, lIdx, { ...lesson, duration: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Video URL"
                        value={lesson.videoUrl}
                        onChange={(e) =>
                          updateLesson(sIdx, lIdx, { ...lesson, videoUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeLesson(sIdx, lIdx)}
                        className="text-red-600"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addLesson(sIdx)}
                  className="text-sm text-blue-700 mt-2 flex items-center gap-1"
                >
                  + Add Lesson
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addSection}
              className="text-sm text-blue-700 flex items-center gap-1"
            >
              + Add Section
            </button>
          </div>

          {/* Submit */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
            <CourseStatusToggle
              courseId={course._id}
              initialStatus={{
                isPublished: course?.isPublished,
                featured: course?.featured,
              }}
            />
            

            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-md shadow hover:shadow-lg text-sm font-medium"
              >
                {loading ? 'Saving...' : 'Update Course'}
              </button>
              
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditCoursePage;
