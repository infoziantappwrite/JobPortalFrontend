const JobCard = ({ job }) => (
  <div className="border p-4 mb-4">
    <h3 className="text-xl font-semibold">{job.title}</h3>
    <p>{job.company}</p>
    <p>{job.location}</p>
    <Link to={`/jobs/${job.id}`} className="text-blue-500">View Details</Link>
  </div>
);

export default JobCard;
