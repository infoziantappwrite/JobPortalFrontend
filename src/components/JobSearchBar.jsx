import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JobSearchBar = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [city, setcity] = useState("");
  const [skills, setSkills] = useState("");

  const handleSearch = () => {
  const params = new URLSearchParams();

  if (title.trim()) params.append("title", title);
  if (city.trim()) params.append("city", city);
  if (skills.trim()) params.append("skills", skills);

  const queryString = params.toString();
  navigate(`/jobs${queryString ? `?${queryString}` : ""}`);
};


  return (
    <div className="bg-white rounded-full text-gray-600 shadow-md flex items-center max-w-full px-2 py-2 space-x-10">
      {/* Job Title Input */}
      <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
        <img
          src="https://www.svgrepo.com/show/521826/search.svg"
          alt="Search"
          className="w-5 h-5 opacity-60"
        />
        <input
          type="text"
          placeholder="Job title, keywords, or company"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent outline-none text-sm placeholder-gray-500 w-full"
        />
      </div>

      {/* Divider */}
      <div className="h-12 border-l border-gray-300"></div>

      {/* city Input */}
      <div className="flex items-center space-x-2 flex-1 min-w-[150px]">
        <img
          src="https://raw.githubusercontent.com/feathericons/feather/master/icons/map-pin.svg"
          alt="city"
          className="w-5 h-5 opacity-60"
        />
        <input
          type="text"
          placeholder="City or postcode"
          value={city}
          onChange={(e) => setcity(e.target.value)}
          className="bg-transparent outline-none text-sm placeholder-gray-500 w-full"
        />
      </div>

      {/* Divider */}
      <div className="h-12 border-l border-gray-300"></div>

      {/* Skills Input */}
      <div className="flex items-center space-x-2 flex-1 min-w-[150px]">
        <img
          src="https://raw.githubusercontent.com/feathericons/feather/master/icons/code.svg"
          alt="Skills"
          className="w-5 h-5 opacity-60"
        />
        <input
          type="text"
          placeholder="Skills (e.g., React, Python)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="bg-transparent outline-none text-sm placeholder-gray-500 w-full"
        />
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="ml-4 flex items-center space-x-2 rounded-full px-10 py-5 bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-jost hover:scale-105 transition-transform"
      >
        <span>Find Jobs</span>
      </button>
    </div>
  );
};

export default JobSearchBar;
