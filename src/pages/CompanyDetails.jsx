import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/apiClient';

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
        //console.log(res.data.company[0]);
      } catch (error) {
        console.error('Failed to fetch company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyID]);
  console.log(company);

  if (loading) return <div className="p-6 text-center text-indigo-600">Loading company details...</div>;
  if (!company) return <div className="p-6 text-center text-red-500">Company not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover image */}
      {company.coverImage && (
        <div className="h-52 w-full mb-[-4rem] rounded-b-xl overflow-hidden">
          <img
            src={company.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          {company.companyLogo && (
            <img
              src={company.companyLogo}
              alt={company.name}
              className="w-24 h-24 object-contain rounded border"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">{company.name}</h1>
            <p className="text-gray-500">{company.location}</p>
            <p className="text-sm text-gray-400 mt-1">{company.primaryIndustry}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          {company.about && (
            <p><strong>About:</strong> {company.about}</p>
          )}
          <p><strong>Email:</strong> {company.email}</p>
          <p><strong>Phone:</strong> {company.phone}</p>
          <p>
            <strong>Website:</strong>{' '}
            <a
              href={company.website}
              className="text-blue-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              {company.website || 'N/A'}
            </a>
          </p>
          <p><strong>Team Size:</strong> {company.teamSize}</p>
          <p><strong>Founded:</strong> {new Date(company.since).toDateString()}</p>
          {company.categories?.length > 0 && (
            <p><strong>Categories:</strong> {company.categories.join(', ')}</p>
          )}
        </div>

        {/* Social Links */}
        {company.socials && (
          <div className="mt-4 space-x-4 text-sm">
            {company.socials.facebook && (
              <a
                href={company.socials.facebook}
                className="text-blue-700 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            )}
            {company.socials.twitter && (
              <a
                href={company.socials.twitter}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
            )}
            {company.socials.linkedIn && (
              <a
                href={company.socials.linkedIn}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;
