import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';

// Reusable Input
const Input = ({ placeholder, type = 'text', value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
  />
);

const SectionTimeline = ({ title, items, type, fetchData }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  const getInitial = (text) => {
    if (!text) return '?';
    return String(text).trim().charAt(0).toUpperCase() || '?';
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/candidate/info/${type}/${id}`, { withCredentials: true });
      toast.success(`${title} deleted successfully`);
      fetchData();
    } catch {
      toast.error(`Failed to delete ${title}`);
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleSave = async (formData) => {
    try {
      const url = `/candidate/info/${type}${formData._id ? `/${formData._id}` : ''}`;
      const method = formData._id ? 'put' : 'post';
      await apiClient[method](url, formData, { withCredentials: true });
      toast.success(`${title} ${formData._id ? 'updated' : 'added'} successfully`);
      setEditingItem(null);
      fetchData();
    } catch {
      toast.error('Failed to save data');
    }
  };

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-blue-700">{title}</h2>
        <button
          onClick={() => setEditingItem({})}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          <FiPlus className="bg-red-100 p-1 rounded-full" size={20} />
          Add {title}
        </button>
      </div>

      {/* Timeline Items */}
      <div className="border-l-2 border-dashed border-red-300 ml-5 pl-5 space-y-8">
        {items.map((item, index) => {
          const heading = type === 'education' ? item.degree : type === 'experience' ? item.jobTitle : item.title;
          const subHeading = type === 'education' ? item.institution : type === 'experience' ? item.company : item.year;
          const badge =
            type === 'awards'
              ? item.year
              : `${item.startYear} - ${item.endYear === 0 ? 'Present' : item.endYear}`;

          return (
            <div key={index} className="relative group">
              <span className="absolute -left-9 top-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold shadow">
                {getInitial(subHeading)}
              </span>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
  {heading}
  <br className="block md:hidden" />
  <span className="inline-block md:ml-3 mt-1 md:mt-0 bg-red-100 text-red-600 text-sm px-2 py-0.5 rounded-full">
    {badge}
  </span>
</h3>

                  <h4 className="text-md text-blue-600 font-medium mt-1">{subHeading}</h4>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="bg-purple-100 p-2 rounded-full hover:bg-purple-200"
                  >
                    <FiEdit2 className="text-purple-600" size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingItemId(item._id)}
                    className="bg-purple-100 p-2 rounded-full hover:bg-purple-200"
                  >
                    <FiTrash2 className="text-purple-600" size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add/Edit */}
      {editingItem !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-blue-700">
              {editingItem._id ? `Edit ${title}` : `Add ${title}`}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingItem);
              }}
              className="space-y-4"
            >
              {/* Fields based on type */}
              {type === 'education' && (
                <>
                  <Input
                    placeholder="Degree"
                    value={editingItem.degree}
                    onChange={(val) => setEditingItem({ ...editingItem, degree: val })}
                  />
                  <Input
                    placeholder="Institution"
                    value={editingItem.institution}
                    onChange={(val) => setEditingItem({ ...editingItem, institution: val })}
                  />
                </>
              )}
              {type === 'experience' && (
                <>
                  <Input
                    placeholder="Job Title"
                    value={editingItem.jobTitle}
                    onChange={(val) => setEditingItem({ ...editingItem, jobTitle: val })}
                  />
                  <Input
                    placeholder="Company"
                    value={editingItem.company}
                    onChange={(val) => setEditingItem({ ...editingItem, company: val })}
                  />
                </>
              )}
              {type === 'awards' && (
                <Input
                  placeholder="Award Title"
                  value={editingItem.title}
                  onChange={(val) => setEditingItem({ ...editingItem, title: val })}
                />
              )}
              {type !== 'awards' && (
                <>
                  <Input
                    type="number"
                    placeholder="Start Year"
                    value={editingItem.startYear}
                    onChange={(val) => setEditingItem({ ...editingItem, startYear: val })}
                  />
                  <Input
                    type="number"
                    placeholder="End Year (0 for Present)"
                    value={editingItem.endYear}
                    onChange={(val) => setEditingItem({ ...editingItem, endYear: val })}
                  />
                </>
              )}
              {type === 'awards' && (
                <Input
                  type="number"
                  placeholder="Year"
                  value={editingItem.year}
                  onChange={(val) => setEditingItem({ ...editingItem, year: val })}
                />
              )}
              <textarea
                placeholder="Description"
                className="w-full border rounded px-3 py-2 text-sm"
                value={editingItem.description || ''}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, description: e.target.value })
                }
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {editingItem._id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete */}
      {deletingItemId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this {title.toLowerCase()}?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingItemId(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingItemId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionTimeline;
