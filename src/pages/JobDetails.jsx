import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    axios.get(`/api/jobs/all`)
      .then((res) => {
        const found = res.data.jobs.find(j => j._id === id);
        setJob(found);
      });
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">{job.title}</h2>
      <p className="mt-2"><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p className="mt-4">{job.description}</p>
    </div>
  );
};

export default JobDetails;
