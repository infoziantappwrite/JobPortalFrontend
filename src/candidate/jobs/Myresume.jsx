import React from 'react';
import {
    FiEdit2,
    FiTrash2,
    FiPlus,
    FiPhone,
    FiMapPin,
    FiHome,
    FiBriefcase,
    FiBookOpen,
    FiDollarSign,
    FiGlobe,
    FiLinkedin,
    FiTwitter,
    FiFacebook,
    FiInstagram,
    FiUser,
} from 'react-icons/fi';
import CVSection from './CVSection';
import { HiOutlineDocumentText } from 'react-icons/hi';

const candidateInfo = {
    name: 'Murali',
    email: 'example.gmail.com',
    profileImageURL: 'https://www.w3schools.com/howto/img_avatar.png',
    profileDescription: 'Experienced web developer with a passion for frontend design and user experience.',
    phone: '9876543210',
    age: 26,
    country: 'India',
    city: 'Chennai',
    fullAddress: '123 Anna Salai, Chennai, Tamil Nadu, India',
    jobTitle: 'Frontend Developer',
    currentSalary: '4-6LPA',
    expectedSalary: '6-8LPA',
    education: 'B.Tech in Computer Science',
    yearsOfExp: '2-3',
    languages: ['English', 'Tamil'],
    categories: ['Web Development', 'Frontend'],
    socials: {
        linkedin: 'https://linkedin.com/in/murali',
        twitter: 'https://twitter.com/murali_dev',
        facebook: 'https://facebook.com/murali',
        instagram: 'https://instagram.com/murali',
        website: 'https://murali.dev',
    }
    ,
    educationHistory: [
        {
            institution: 'Anna University',
            degree: 'B.Tech in Computer Science',
            startYear: 2017,
            endYear: 2021,
            description: 'Graduated with First Class and participated in coding competitions.',
        },
        {
            institution: 'Anna University',
            degree: 'M.Tech in Computer Science',
            startYear: 2022,
            endYear: 2024,
            description: 'Graduated with First Class and participated in coding competitions.',
        },
    ],
    workExperience: [
        {
            company: 'Infoziant',
            jobTitle: 'Frontend Developer',
            startYear: 2021,
            endYear: 2024,
            description: 'Built and maintained React-based enterprise dashboards.',
        },
    ],
    awards: [
        {
            title: 'Best Developer Award',
            year: 2023,
            description: 'Recognized for outstanding performance in frontend architecture.',
        },
    ],
    CV: [
        {
            fileName: 'Murali_Resume.pdf',
            fileURL: 'https://example.com/murali_resume.pdf',
            uploadedAt: '2024-06-01',
        },
        {
            fileName: 'Murali_Resume1.pdf',
            fileURL: 'https://example.com/murali_resume.pdf',
            uploadedAt: '2024-06-01',
        },
        {
            fileName: 'Murali_Resume2.pdf',
            fileURL: 'https://example.com/murali_resume.pdf',
            uploadedAt: '2024-06-01',
        },
    ],
};

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

const Myresume = () => {
    const {
        name,
        profileImageURL,
        profileDescription,
        phone,
        age,
        country,
        city,
        fullAddress,
        jobTitle,
        currentSalary,
        expectedSalary,
        education,
        yearsOfExp,
        languages,
        categories,
        socials,
        CV,
    } = candidateInfo;

    return (
        <div className='bg-blue-100 min-h-screen p-10'>
            <div className="p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto space-y-10">
                <h2 className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
                    <HiOutlineDocumentText className="text-blue-600 text-3xl " />
                    <span className="border-b-2 border-blue-600 pb-1">My Resume</span>
                </h2>
                {/* Profile Header */}
                <div className="flex items-center gap-6">
                    <img
                        src={profileImageURL}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover"
                    />
                    <div className="text-center md:text-left space-y-2 mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                            {name}
                        </h1>
                        <h2 className="text-2xl font-semibold text-blue-600">
                            {jobTitle}
                        </h2>
                        <div className="max-w-2xl mx-auto md:mx-0">
                            <p className="text-gray-600 text-md leading-relaxed border-l-4 border-indigo-400 pl-4">
                                {profileDescription}
                            </p>
                        </div>
                    </div>

                </div>
                <hr />

                {/* Contact & Job Info */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                        <FiPhone className="text-teal-600" />
                        <strong>Phone:</strong> {phone}
                    </div>
                    <div className="flex items-center gap-2">
                        <FiUser className="text-blue-600" />
                        <strong>Age:</strong> {age}
                    </div>
                    <div className="flex items-center gap-2">
                        <FiMapPin className="text-teal-600" />
                        <strong>Location:</strong> {city}, {country}
                    </div>
                    <div className="flex items-center gap-2">
                        <FiHome className="text-blue-600" />
                        <strong>Address:</strong> {fullAddress}
                    </div>
                    <div className="flex items-center gap-2">
                        <FiDollarSign className="text-teal-600" />
                        <strong>Current Salary:</strong> {currentSalary}
                    </div>
                    <div className="flex items-center gap-2">
                        <FiDollarSign className="text-blue-600" />
                        <strong>Expected Salary:</strong> {expectedSalary}
                    </div>
                    <div className="flex items-center gap-2">
                        <FiBookOpen className="text-teal-600" />
                        <strong>Education:</strong> {education}
                    </div>
                    <div className="flex items-center gap-2">
                        <FiBriefcase className="text-blue-600" />
                        <strong>Experience:</strong> {yearsOfExp} years
                    </div>
                </div>

                {/* Skills & Socials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-100 p-6 rounded-lg mt-8">
                    {/* Languages */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
                        <div className="flex gap-2 flex-wrap">
                            {languages.map((lang, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
                                >
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Categories</h3>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((cat, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="md:col-span-2">
                        <h3 className="font-semibold text-gray-800 mb-2">Social Links</h3>
                        <div className="flex flex-wrap gap-4 items-center">
                            {socials.linkedin && (
                                <a
                                    href={socials.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-700 hover:underline"
                                >
                                    <FiLinkedin className="text-xl" />
                                    LinkedIn
                                </a>
                            )}
                            {socials.twitter && (
                                <a
                                    href={socials.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sky-500 hover:underline"
                                >
                                    <FiTwitter className="text-xl" />
                                    Twitter
                                </a>
                            )}
                            {socials.facebook && (
                                <a
                                    href={socials.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:underline"
                                >
                                    <FiFacebook className="text-xl" />
                                    Facebook
                                </a>
                            )}
                            {socials.instagram && (
                                <a
                                    href={socials.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-pink-500 hover:underline"
                                >
                                    <FiInstagram className="text-xl" />
                                    Instagram
                                </a>
                            )}
                            {socials.website && (
                                <a
                                    href={socials.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-teal-600 hover:underline"
                                >
                                    <FiGlobe className="text-xl" />
                                    Website
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Education */}
                <SectionTimeline
                    title="Education"
                    items={candidateInfo.educationHistory}
                    type="education"
                />
                <hr />

                {/* Experience */}
                <SectionTimeline
                    title="Experience"
                    items={candidateInfo.workExperience}
                    type="experience"
                />
                <hr />

                {/* Awards */}
                <SectionTimeline
                    title="Awards"
                    items={candidateInfo.awards}
                    type="awards"
                />
                <hr />

                {/* CV Download */}
                <CVSection initialCVs={candidateInfo.CV} />
            </div>
        </div>
    );
};

export default Myresume;
