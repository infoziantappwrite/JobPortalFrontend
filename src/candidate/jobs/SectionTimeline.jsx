// src/components/SectionTimeline.jsx

import React from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const SectionTimeline = ({ title, items, type }) => {
    const getInitial = (text) => text?.charAt(0)?.toUpperCase() || '?';

    return (
        <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button className="flex items-center gap-2 text-red-600 hover:underline">
                    <FiPlus className="bg-red-100 p-1 rounded-full" size={24} />
                    Add {title}
                </button>
            </div>

            <div className="border-l-2 border-dashed border-red-200 ml-5 pl-5 space-y-8">
                {items.map((item, index) => {
                    const heading =
                        type === 'education'
                            ? item.degree
                            : type === 'experience'
                                ? item.jobTitle
                                : item.title;
                    const subHeading =
                        type === 'education'
                            ? item.institution
                            : type === 'experience'
                                ? item.company
                                : `${item.year}`;
                    const badge =
                        type === 'awards' ? item.year : `${item.startYear} - ${item.endYear}`;
                    const initial = getInitial(subHeading);

                    return (
                        <div key={index} className="relative group">
                            <span className="absolute -left-9 top-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
                                {initial}
                            </span>
                            <h3 className="text-lg font-semibold">
                                {heading}{' '}
                                <span className="inline-block bg-red-100 text-red-600 px-3 py-1 text-sm rounded-full ml-2">
                                    {badge}
                                </span>
                                <span className="ml-2 inline-flex gap-4">
                                    <button className="bg-purple-100 p-2 rounded">
                                        <FiEdit2 className="text-purple-600" />
                                    </button>
                                    <button className="bg-purple-100 p-2 rounded">
                                        <FiTrash2 className="text-purple-600" />
                                    </button>
                                </span>
                            </h3>
                            <h4 className="text-red-600 text-md">{subHeading}</h4>
                            <p className="text-gray-500 mt-2">{item.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SectionTimeline;
