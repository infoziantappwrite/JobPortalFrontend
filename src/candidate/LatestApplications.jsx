import React from 'react';
import { Download, FileText, MapPinned } from 'lucide-react';

const LatestApplications = ({ latestAppliedJobs }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow mb-10 border border-gray-100">
      <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-4">
        <FileText className="text-blue-500" />
        Latest Applications
      </h2>

      {latestAppliedJobs.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent applications.</p>
      ) : (
        <div className="space-y-4">
          {latestAppliedJobs.map((job) => (
            <div
              key={job.jobID}
              className="flex justify-between items-center border-t pt-3"
            >
              <div>
                <p className="text-gray-800 font-medium">
                  {job.title} <span className="text-gray-500 font-normal">@ {job.company}</span>
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPinned className="w-4 h-4 text-gray-400" />
                  {job.location}
                </p>
              </div>
              <a
                href={job.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
              >
                <Download size={16} /> Resume
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestApplications;
