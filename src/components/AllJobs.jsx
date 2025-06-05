import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [perPage] = useState(10);
  const [lastSeenId, setLastSeenId] = useState(null);

  useEffect(() => {
    fetchPublicJobs();
  }, []);

  const fetchPublicJobs = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const payload = { perPage };
      if (lastSeenId) payload.lastSeenId = lastSeenId;

      const res = await apiClient.post('/jobs/public/all', payload);
      const newJobs = res.data.jobs || [];

      setJobs((prev) => [...prev, ...newJobs]);

      if (newJobs.length < perPage) {
        setHasMore(false); // No more jobs to load
      } else {
        // Update lastSeenId for next batch
        const lastJob = newJobs[newJobs.length - 1];
        setLastSeenId(lastJob._id);
      }
    } catch (error) {
      console.error('Failed to fetch public jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Available Job Listings</h2>

      {!jobs.length && !loading && <p>No active jobs available at the moment.</p>}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <li
            key={job._id}
            className="border p-5 rounded-lg shadow hover:shadow-md transition duration-200 bg-white"
          >
            <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
            <p className="text-gray-700 mt-1">
              {job.company} • {job.location}
            </p>
            <p className="mt-3 text-gray-600">
              {job.description?.slice(0, 120)}...
            </p>
            <p className="text-sm text-gray-500 mt-2">Type: {job.jobType}</p>
            {job.postedBy && (
              <p className="text-xs text-gray-400 mt-2">
                Posted by: {job.postedBy.name} ({job.postedBy.email})
              </p>
            )}
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={fetchPublicJobs}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AllJobs;
