import React from 'react';
import {
    Briefcase, Building2, MapPin, Clock, Mail, Tags, DollarSign, User,
    Users, Globe, GraduationCap, Calendar, Locate, BookOpen, X, ClipboardList, FileText
} from 'lucide-react';


const JobDetailsModal = ({ selectedJob, onClose }) => {
    if (!selectedJob) return null;
    //console.log(selectedJob)

    // Helper renderer
    const renderItem = (label, value, Icon) => (
        <div className="flex items-start gap-3 p-3 rounded-md bg-white border border-blue-100 shadow-sm">
            {Icon && <Icon size={16} className="text-blue-600 mt-0.5" />}
            <div className="text-sm">
                <p className="text-gray-500 font-medium">{label}</p>
                <p className="text-gray-800 font-semibold">{value || 'N/A'}</p>
            </div>
        </div>
    );


    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center px-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-lg relative">
                <div className=" overflow-y-auto max-h-[85vh] relative  border-blue-100">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-600 hover:text-black"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                    {/* Job Title & Company */}
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                            <Briefcase className="text-teal-600" size={20} />
                            {selectedJob.title}
                        </h2>
                        <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
                            <Building2 className="text-teal-600" size={16} />
                            {selectedJob.company}
                        </p>
                    </div>

                    {/* Description */}
                    {selectedJob.description && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                                <FileText className="text-teal-600 w-5 h-5" />
                                Job Description
                            </h3>
                            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 shadow-sm">
                                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                                    {selectedJob.description}
                                </p>
                            </div>
                        </div>
                    )}

                    <hr />

                    {/* Job Details */}
                    <div className="mb-8 mt-4">
                        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-teal-600" />
                            Job Details
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            {renderItem('Location', selectedJob.location, MapPin)}
                            {renderItem('Job Type', selectedJob.jobType, Clock)}
                            {renderItem('Email', selectedJob.emailAddress, Mail)}
                            {renderItem('Specialisms', selectedJob.specialisms?.join(', '), Tags)}
                            {renderItem('Salary', selectedJob.offeredSalary, DollarSign)}
                            {renderItem('Career Level', selectedJob.careerLevel, User)}
                            {renderItem('Experience', selectedJob.experience, Clock)}
                            {renderItem('Gender', selectedJob.gender, Users)}
                            {renderItem('Industry', selectedJob.industry, Globe)}
                            {renderItem('Qualification', selectedJob.qualification, GraduationCap)}
                            {renderItem('Posted Date', new Date(selectedJob.postedAt
                            ).toLocaleDateString(), Calendar)}
                            {renderItem('Country', selectedJob.country, Locate)}
                            {renderItem('City', selectedJob.city, MapPin)}
                            {renderItem('Address', selectedJob.address, BookOpen)}
                        </div>
                    </div>


                    {/* Timeline */}
                    {selectedJob.applicationStatus?.length > 0 && (
                        <div className='mt-4 bg-blue-50 p-5 rounded-xl border border-blue-200'>
                            <h3 className="text-lg font-semibold text-blue-700 mb-3">Application Timeline</h3>
                            <hr />
                            <ol className="relative border-l-4 border-blue-300 ml-3 mt-3">
                                {selectedJob.applicationStatus.map((stage) => {
                                    const statusColors = {
                                        applied: {
                                            dot: 'bg-blue-500',
                                            text: 'text-blue-600',
                                        },
                                        shortlisted: {
                                            dot: 'bg-yellow-400',
                                            text: 'text-yellow-600',
                                        },
                                        interviewed: {
                                            dot: 'bg-indigo-500',
                                            text: 'text-indigo-600',
                                        },
                                        offered: {
                                            dot: 'bg-green-500',
                                            text: 'text-green-600',
                                        },
                                        rejected: {
                                            dot: 'bg-red-500',
                                            text: 'text-red-600',
                                        },
                                    };

                                    const status = stage.stage.toLowerCase();
                                    const { dot, text } = statusColors[status] || {
                                        dot: 'bg-gray-400',
                                        text: 'text-gray-600',
                                    };

                                    return (
                                        <li key={stage._id} className="mb-6 ml-3 relative">
                                            {/* Dot */}
                                            <div className={`absolute w-3 h-3 ${dot} rounded-full -left-5 border `} />

                                            {/* Timestamp */}


                                            {/* Stage Name */}
                                            <p className={`text-sm font-semibold capitalize ${text}`}>
                                                {stage.stage}
                                            </p>
                                            <time className="block text-xs text-gray-400 mb-0.5">
                                                {new Date(stage.createdAt).toLocaleString()}
                                            </time>

                                            {/* Optional remarks */}
                                            {stage.remarks && (
                                                <p className="text-sm text-gray-600 mt-1">{stage.remarks}</p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default JobDetailsModal;
