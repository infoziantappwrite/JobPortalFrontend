import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import {
  FiMapPin, FiPhone, FiGlobe, FiUsers,
  FiCalendar, FiMail, FiFacebook, FiTwitter, FiLinkedin
} from 'react-icons/fi';
import { FaGooglePlusG } from 'react-icons/fa'; // ✅ correct

import JobsAtCompany from '../components/JobsAtCompany';
import InternalLoader from '../components/InternalLoader';
import EmptyState from '../components/EmptyState';

const DEFAULT_COVER =
  'https://wallpapers.com/images/hd/gears-linkedin-cover-mvrjmcq6p2mfs1sq.jpg';

const CompanyDetails = () => {
  const [searchParams] = useSearchParams();
  const companyID = searchParams.get('id');
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyID) return;

    const fetchCompanyDetails = async () => {
      try {
        const res = await apiClient.get(`/common/company/${companyID}`);
        setCompany(res.data.company[0]);
       // console.log('Company Details:', res.data.company[0]);
      } catch (error) {
        console.error('Failed to fetch company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyID]);

  if (loading) {
    return <InternalLoader text="Loading company details..." />;
  }

  if (!company) {
    return (
      
        <EmptyState
          title="Company Not Found"
          message="We couldn’t find any details for the selected company."
        />
     
    );
  }

  return (
    <div className="">
     {/* Cover Image */}
<div className="relative h-56 w-full  overflow-hidden shadow-md">
  <img
    src={company.coverImage || DEFAULT_COVER}
    alt="Cover"
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-r from-teal-600/30 to-blue-700/30 backdrop-blur-sm"></div>
</div>

{/* Main Card */}
<div className="bg-blue-50 backdrop-blur-xl rounded-t-3xl shadow-xl p-10 mt-[-3rem] z-10 relative border border-blue-100 space-y-8">
  
  {/* Header */}
  <div className="flex flex-col md:flex-row items-center gap-6">
    {company.companyLogo ? (
      <img
        src={company.companyLogo}
        alt={company.name}
        className="w-24 h-24 object-contain rounded-full border shadow-md bg-white p-2"
      />
    ) : (
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-inner">
        {company.name?.charAt(0).toUpperCase() || 'C'}
      </div>
    )}

    <div className="text-center md:text-left">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-500">
        {company.name}
      </h1>
      <p className="text-gray-600 flex items-center justify-center md:justify-start mt-1 text-sm">
        <FiMapPin className="mr-1 text-blue-600" /> {company.location || 'N/A'}
      </p>
      <p className="text-sm text-gray-500 mt-1">{company.primaryIndustry}</p>
    </div>
  </div>

  {/* About Section */}
  {company.about && (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-2">
        🏢 About the Company
      </h2>
      <p className="text-gray-700 leading-relaxed">{company.about}</p>
    </div>
  )}

  {/* Company Info Grid */}
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-800">
    {[
      { label: 'Email', value: company.email, icon: <FiMail className="text-indigo-600" /> },
      { label: 'Phone', value: company.phone, icon: <FiPhone className="text-indigo-600" /> },
      {
        label: 'Website',
        value: company.website,
        icon: <FiGlobe className="text-indigo-600" />,
        isLink: true
      },
      { label: 'Team Size', value: company.teamSize, icon: <FiUsers className="text-indigo-600" /> },
      {
        label: 'Founded',
        value: company.since ? new Date(company.since).toDateString() : 'N/A',
        icon: <FiCalendar className="text-indigo-600" />
      }
    ].map((info, idx) => (
      <div key={idx}>
        <strong className="text-gray-800">{info.label}:</strong>
        <p className="flex items-center gap-2 mt-1 text-gray-700">
          {info.icon}
          {info.isLink && info.value ? (
            <a
              href={info.value.startsWith('http') ? info.value : `https://${info.value}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {info.value}
            </a>
          ) : (
            info.value || 'N/A'
          )}
        </p>
      </div>
    ))}
  </div>

  {/* Categories */}
  {company.categories?.length > 0 && (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-1 mb-2">🏷️ Categories</h2>
      <div className="flex flex-wrap gap-2 mt-1">
        {company.categories.map((cat, idx) => (
          <span
            key={idx}
            className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  )}

  {/* Social Links */}
  {company.socials && (
    <div className="pt-4 border-t border-blue-200 flex flex-wrap gap-5 text-2xl">
      {company.socials.facebook && (
        <a href={company.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-blue-600 hover:text-blue-800 transition">
          <FiFacebook />
        </a>
      )}
      {company.socials.twitter && (
        <a href={company.socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="text-sky-500 hover:text-sky-600 transition">
          <FiTwitter />
        </a>
      )}
      {company.socials.linkedIn && (
        <a href={company.socials.linkedIn} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-blue-700 hover:text-blue-800 transition">
          <FiLinkedin />
        </a>
      )}
      {company.socials.googlePlus && (
        <a href={company.socials.googlePlus} target="_blank" rel="noreferrer" aria-label="Google Plus" className="text-red-600 hover:text-red-700 transition">
          <FaGooglePlusG className="text-3xl" />
        </a>
      )}
    </div>
  )}
</div>


      {/* Jobs At Company */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Jobs at {company.name}
        </h2>
        <JobsAtCompany companyId={companyID} />
      </div>
    </div>
  );
};

export default CompanyDetails;
