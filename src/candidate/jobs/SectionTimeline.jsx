import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';

const SectionTimeline = ({ title, items, type, fetchData }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

 const getInitial = (text) => {
  if (!text) return '?';
  return String(text).charAt(0).toUpperCase();
};


  const handleDelete = async (id) => {
    try {
        console.log(id);
      await apiClient.delete(`/candidate/info/${type}/${id}`, { withCredentials: true });
      toast.success(`${title} deleted successfully`);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(`Failed to delete ${title}`);
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (formData._id) {
        await apiClient.put(`/candidate/info/${type}/${formData._id}`, formData, { withCredentials: true });
        toast.success(`${title} updated`);
      } else {
        await apiClient.post(`/candidate/info/${type}`, formData, { withCredentials: true });
        toast.success(`${title} added`);
      }
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error('Failed to save data');
    }
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={() => setEditingItem({})}
          className="flex items-center gap-2 text-red-600 hover:underline"
        >
          <FiPlus className="bg-red-100 p-1 rounded-full" size={20} />
          Add {title}
        </button>
      </div>

      <div className="border-l-2 border-dashed border-red-200 ml-5 pl-5 space-y-8">
        {items.map((item, index) => {
          const heading = type === 'education' ? item.degree : type === 'experience' ? item.jobTitle : item.title;
          const subHeading = type === 'education' ? item.institution : type === 'experience' ? item.company : item.year;
          const badge = type === 'awards' ? item.year : `${item.startYear} - ${item.endYear}`;
          const initial = getInitial(subHeading);

          return (
            <div key={index} className="relative group">
              <span className="absolute -left-9 top-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
                {initial}
              </span>
              <h3 className="text-lg font-semibold flex items-center justify-between">
                <span>
                  {heading}
                  <span className="inline-block bg-red-100 text-red-600 px-3 py-1 text-sm rounded-full ml-2">
                    {badge}
                  </span>
                </span>
                <span className="inline-flex gap-2">
                  <button onClick={() => setEditingItem(item)} className="bg-purple-100 p-2 rounded">
                    <FiEdit2 className="text-purple-600" size={16} />
                  </button>
                  <button onClick={() => setDeletingItemId(item._id)} className="bg-purple-100 p-2 rounded">
                    <FiTrash2 className="text-purple-600" size={16} />
                  </button>
                </span>
              </h3>
              <h4 className="text-red-600 text-md">{subHeading}</h4>
              <p className="text-gray-500 mt-2">{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {editingItem !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-2">
            <h2 className="text-lg font-semibold mb-4">
              {editingItem._id ? `Edit ${title}` : `Add ${title}`}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingItem);
              }}
              className="space-y-4"
            >
              {type === 'education' && (
                <>
                  <input
                    type="text"
                    placeholder="Degree"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.degree || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.institution || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                  />
                </>
              )}

              {type === 'experience' && (
                <>
                  <input
                    type="text"
                    placeholder="Job Title"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.jobTitle || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, jobTitle: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.company || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                  />
                </>
              )}

              {type === 'awards' && (
                <input
                  type="text"
                  placeholder="Award Title"
                  className="w-full border rounded px-3 py-2"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              )}

              {/* Common Fields */}
              {type !== 'awards' && (
                <>
                  <input
                    type="number"
                    placeholder="Start Year"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.startYear || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, startYear: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="End Year"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.endYear || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, endYear: e.target.value })}
                  />
                </>
              )}

              {type === 'awards' && (
                <input
                  type="number"
                  placeholder="Year"
                  className="w-full border rounded px-3 py-2"
                  value={editingItem.year || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                />
              )}

              <textarea
                placeholder="Description"
                className="w-full border rounded px-3 py-2"
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              />

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  {editingItem._id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItemId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this {title.toLowerCase()}?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingItemId(null)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingItemId)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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
