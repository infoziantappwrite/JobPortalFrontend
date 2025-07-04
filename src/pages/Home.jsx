import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Image Imports
import unbiasedGif from "../assets/HomePageImg/unbiased-services.gif";
import learningPathGif from "../assets/HomePageImg/Learning-path.gif";
import projectSupportGif from "../assets/HomePageImg/Project-support.gif";
import processGif from "../assets/HomePageImg/process.gif";
import homeBanner from "../assets/HomePageImg/home-banner.png";

import client1 from "../assets/clients/1-1.png";
import client2 from "../assets/clients/1-2.png";
import client3 from "../assets/clients/1-3.png";
import client4 from "../assets/clients/1-4.png";
import client5 from "../assets/clients/1-5.png";
import client6 from "../assets/clients/1-6.png";
import client7 from "../assets/clients/1-7.png";
import client8 from "../assets/clients/1-8.png";
import client9 from "../assets/clients/1-9.png";
import client10 from "../assets/clients/1-10.png";

import avatar1 from "../assets/avatars/testi-img1.png";
import avatar2 from "../assets/avatars/testi-img2.png";
import avatar3 from "../assets/avatars/testi-img3.png";
import avatar4 from "../assets/avatars/testi-img1.png";
import avatar5 from "../assets/avatars/testi-img1.png";
import Footer from "../components/Footer";
import JobSearchBar from "../components/JobSearchBar";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [visible, setVisible] = useState(false);

const testimonials = [
    {
      avatar: avatar1,
      name: "Arun Pandi",
      role: "Lead Web Developer",
      title: "Great quality!",
      message:
        "VTA has been a game-changer for my career. The AI-powered job recommendations helped me land my dream job, and the skill assessment guided me in upskilling effectively.",
    },
    {
      avatar: avatar2,
      name: "Shruthi Raj",
      role: "UI/UX Designer",
      title: "User-friendly & helpful!",
      message:
        "The VTA platform makes job searching so simple and efficient. I was able to get instant feedback on my portfolio through the mentorship system.",
    },
    {
      avatar: avatar3,
      name: "Praveen Kumar",
      role: "Data Analyst",
      title: "Insightful features!",
      message:
        "I loved how VTA tailored learning paths for me. The analytics were especially helpful in knowing what skills I should improve on.",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10); // Slight delay
    return () => clearTimeout(timer);
  }, []);

    const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  const sectionVariants = [
    {
      image: {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0 },
      },
      text: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
      },
    },
    {
      image: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
      },
      text: {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
      },
    },
    {
      image: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
      },
      text: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
      },
    },
  ];

  const sections = [
    {
      title: "Unique Learning Path",
      gif: learningPathGif,
      reverse: false,
      points: [
        "Chart your course to success",
        "Learn at your own pace, master in-demand skills",
        "Achieve your career goals with personalized guidance",
      ],
    },
    {
      title: "Optimize Your Hiring Process",
      gif: projectSupportGif,
      reverse: true,
      points: [
        "Hire top talent faster with AI-powered insights",
        "Streamline your recruitment, from sourcing to onboarding",
        "Reduce time-to-hire and improve candidate experience",
      ],
    },
    {
      title: "Project Support and Ideation",
      gif: processGif,
      reverse: false,
      points: [
        "Transform your ideas into reality",
        "Get expert guidance and support",
        "Achieve your career goals with personalized guidance",
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Trending", "Design", "Marketing", "Health"];

  const jobs = [
    {
      id: 1,
      title: "Software Engineer (Android), Libraries",
      company: "Segment",
      location: "London, UK",
      time: "11 hours ago",
      salary: "$35k - $45k",
      type: "Full Time",
      level: "Private",
      urgency: "Urgent",
      logo: "src/assets/company-logo/1-1.png",
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Dribble",
      location: "Remote",
      time: "1 day ago",
      salary: "$25k - $35k",
      type: "Part Time",
      level: "Startup",
      urgency: "Hiring Fast",
      logo: "src/assets/company-logo/1-6.png",
    },
    {
      id: 3,
      title: "Product Manager",
      company: "Airbnb",
      location: "San Francisco, CA",
      time: "3 days ago",
      salary: "$60k - $75k",
      type: "Full Time",
      level: "Public",
      urgency: "Urgent",
      logo: "src/assets/company-logo/1-2.png",
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "Spotify",
      location: "Berlin, Germany",
      time: "5 hours ago",
      salary: "$50k - $65k",
      type: "Remote",
      level: "Private",
      urgency: "Actively Hiring",
      logo: "src/assets/company-logo/1-3.png",
    },
    {
      id: 5,
      title: "Frontend Developer",
      company: "Google",
      location: "New York, NY",
      time: "10 hours ago",
      salary: "$45k - $55k",
      type: "Contract",
      level: "Public",
      urgency: "New",
      logo: "src/assets/company-logo/1-4.png",
    },
   {
      id: 6,
      title: "CyberSecurity Analyst",
      company: "Airbnb",
      location: "San Francisco, CA",
      time: "3 days ago",
      salary: "$60k - $75k",
      type: "Full Time",
      level: "Public",
      urgency: "Urgent",
      logo: "src/assets/company-logo/1-7.png",
    },
  ];

  return (
    <div className="bg-white">
      <div className="relative w-full overflow-hidden">
        {/* Shifted image */}
        <img
          src={homeBanner}
          alt="Banner"
          className="w-full object-cover"
          style={{
            position: "relative",
            top: "-150px", // Adjust this value to "crop" more or less of the top
          }}
        />

        {/* Content on top of image */}
        <div className="absolute inset-0 flex flex-col items-center mt-10 text-white">
          {/* Your content here */}

          {/* Header Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-jost text-center leading-tight mb-4  drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Elevate Your Career with{" "}
            <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent font-semibold">
              Infoziant
            </span>{" "}
            - All in one <br /> Career Catalyst
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            className="text-lg md:text-xl font-jost text-center mt-2 mb-5 text-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <Typewriter
              options={{
                strings: [
                  "Empowering Individuals and Transforming Organizations",
                ],
                autoStart: true,
                loop: true,
                delay: 40,
                deleteSpeed: 25,
              }}
            />
          </motion.div>
          <div >
            {/* Job Title Input */}
            <JobSearchBar />

            {/* Search Button */}
          </div>

          {/* Floating Bubbles */}
          <motion.div
            className="relative w-full max-w-6xl h-[310px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            {[
              { text: "Boost Your Skills", x: "3%", y: "26%" },
              { text: "Elevate Your Profile", x: "24.8%", y: "-3%" },
              { text: "AI - Powered Job Matching", x: "46.3%", y: "8%" },
              { text: "Mentor Connect", x: "67%", y: "36%" },
              { text: "Hiring Reimagined", x: "88%", y: "-3%" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="absolute flex flex-col items-center justify-center w-[85px] h-[85px] rounded-full bg-gray-200 text-black text-center text-xs shadow-xl border-4 border-white hover:bg-purple-600 hover:text-white transition duration-500"
                style={{
                  left: item.x,
                  top: item.y,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.2, duration: 0.8 }}
              >
                <p className="px-3 font-jost">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 👇 Separate Scroll Section Starts Here — AFTER full background */}
      <div className="w-full mb-10 -mt-24 bg-white  overflow-hidden">
        <div className="flex gap-20 px-4 whitespace-nowrap animate-marquee">
          {[...Array(2)].flatMap((_, repeatIdx) =>
            [
              client1,
              client2,
              client3,
              client4,
              client5,
              client6,
              client7,
              client8,
              client9,
              client10,
            ].map((logo, idx) => (
              <img
                key={`${repeatIdx}-${idx}`}
                src={logo}
                alt={`Client ${idx + 1}`}
                className="h-8 inline-block object-contain"
              />
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-16 bg-violet-950 text-white">
        {/* Left Image */}
        <div
          className={`w-full md:w-1/2 transform transition-all duration-1000 ease-in-out ${
            visible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
          }`}
        >
          <img
            src={unbiasedGif}
            alt="Career Services"
            className="w-full h-auto transition-transform duration-500 ease-in-out hover:scale-105"
          />
        </div>

        {/* Right Content */}
        <div
          className={`w-full md:w-1/2 transform transition-all duration-1000 ease-in-out ${
            visible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
          }`}
        >
          <h2 className="text-4xl font-jost mb-8 transition-opacity duration-700 ease-in-out hover:text-purple-300">
            Unbiased Services to Unlock Your Career Potential
          </h2>

          {/* Steps */}
          <div className="space-y-8 relative">
            {[
              {
                number: 1,
                title: "AI-Powered Job Matching",
                desc: "Find your perfect career fit with our advanced matching algorithms.",
              },
              {
                number: 2,
                title: "Comprehensive Skill Assessments",
                desc: "Identify your strengths and areas for growth.",
              },
              {
                number: 3,
                title: "Expert Mentorship",
                desc: "Gain insights from industry leaders and accelerate your career.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex items-start group transition-all duration-700 ease-in-out hover:scale-[1.03]"
              >
                <div className="flex flex-col items-center mr-4">
                  <div className="w-8 h-8 bg-white text-black font-jost rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-lg cursor-pointer">
                    {step.number}
                  </div>
                  {index < 2 && (
                    <div className="w-px h-16 bg-white mt-1 transition-all duration-300 group-hover:bg-purple-400"></div>
                  )}
                </div>
                <div className="transition-all duration-500 group-hover:text-purple-300">
                  <h3 className="text-xl font-jost transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm opacity-80 mt-1 transition-opacity duration-300 group-hover:opacity-100">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="mt-10 px-6 py-3 rounded-lg bg-white text-black font-jost transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-700 hover:text-white shadow-md hover:shadow-xl">
            Get Started Now →
          </button>
        </div>
      </div>

      <>
        {sections.map((sec, idx) => (
          <section key={idx} className="w-full bg-white">
            <div
              className={`flex flex-col ${
                sec.reverse ? "md:flex-row-reverse" : "md:flex-row"
              } items-center justify-between py-16 px-6 md:px-20 gap-32 max-w-7xl mx-auto`}
            >
              {/* Image */}
              <motion.div
                className="flex-1"
                initial={sectionVariants[idx].image.initial}
                whileInView={sectionVariants[idx].image.animate}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <img
                  src={sec.gif}
                  alt={sec.title}
                  className="w-full h-auto object-contain"
                />
              </motion.div>

              {/* Text Content */}
              <motion.div
                className="flex-1"
                initial={sectionVariants[idx].text.initial}
                whileInView={sectionVariants[idx].text.animate}
                transition={{ duration: 0.7, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-jost text-[#2a0052] mb-6">
                  {sec.title}
                </h2>
                <ul className="space-y-4 text-gray-700">
                  {sec.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-xl text-green-600">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 px-6 py-3 bg-black text-white rounded-lg font-jost">
                  Discover More
                </button>
              </motion.div>
            </div>
          </section>
        ))}
      </>

      <section className="w-full bg-violet-950 text-white py-16 px-6 md:px-20 transition-all duration-500">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-jost mb-12 transition-opacity duration-700">
            Unlock Your Career Potential with Our Comprehensive Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Internship and Placements",
                desc: "Gain experience and enhance your skills with top companies.",
              },
              {
                title: "AI-Driven Career Insights",
                desc: "Leverage AI for trends, market data, and tailored career advice.",
              },
              {
                title: "Empowering Institutions",
                desc: "Provide institutions with tools for student achievement.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="border border-white rounded-lg p-6 transition-transform duration-300 hover:scale-105 hover:bg-violet-900 shadow-md"
              >
                <h3 className="text-xl font-jost mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-white w-full text-black py-16 px-8">
        <div className="text-center mb-12">
          <h2 className="text-lg md:text-4xl font-sans">Most Popular Jobs</h2>
          <p className="text-sm text-gray-500 mt-2">
            Know your worth and find the job that qualify your life
          </p>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg transition font-jost ${
                  activeCategory === cat
                    ? "bg-purple-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-lg p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-jost">{job.title}</h3>
                 <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
  {/* Company */}
  <div className="flex items-center gap-1">
    <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4H20V20H4V4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 20V9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 20V14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>{job.company}</span>
  </div>

  {/* Location */}
  <div className="flex items-center gap-1">
    <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12V21" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span>{job.location}</span>
  </div>

  {/* Time */}
  <div className="flex items-center gap-1">
    <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6V12L16 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>{job.time}</span>
  </div>

  {/* Salary */}
  <div className="flex items-center gap-1">
    <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 1V23" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 5H9.5C7.015 5 5 7.015 5 9.5C5 11.985 7.015 14 9.5 14H14.5C16.985 14 19 16.015 19 18.5C19 20.985 16.985 23 14.5 23H7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span>{job.salary}</span>
  </div>
</div>

                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap mt-2">
                <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                  {job.type}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                  {job.level}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                  {job.urgency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>



      <div className="animate-fade-in-up">
        <section className="bg-gradient-to-b from-purple-900 to-purple-950 text-white py-16 px-6">
  <div className="max-w-7xl mx-auto">
    {/* Centered title at the top */}
    <div className="text-center mb-12">
      <h2 className="text-3xl font-jost">Browse by Category</h2>
      <p className="text-sm text-purple-200 mt-2">
        2020 jobs live • 293 added today
      </p>
    </div>

    {/* Grid of category cards */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {[
        {
          title: "Marketing",
          count: 86,
          img: "https://img.icons8.com/fluency-systems-regular/48/000000/marketing.png",
        },
        {
          title: "Design",
          count: 43,
          img: "https://img.icons8.com/fluency-systems-regular/48/000000/design.png",
        },
        {
          title: "Development",
          count: 12,
          img: "https://img.icons8.com/fluency-systems-regular/48/000000/source-code.png",
        },
        {
          title: "Customer Service",
          count: 72,
          img: "https://img.icons8.com/fluency-systems-regular/48/000000/customer-support.png",
        },
        {
          title: "Health and Care",
          count: 25,
          img: "https://img.icons8.com/fluency-systems-regular/48/000000/heart-health.png",
        },
        {
          title: "Automotive Jobs",
          count: 92,
          img: "https://img.icons8.com/fluency-systems-regular/48/000000/car.png",
        },
      ].map((cat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="bg-gradient-to-tr from-white to-purple-100 text-black rounded-2xl p-6 h-48 flex flex-col items-center justify-center shadow-lg transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl group cursor-pointer"
        >
          <div className="mb-4 w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <img
              src={cat.img}
              alt={`${cat.title} icon`}
              className="w-7 h-7 filter grayscale group-hover:grayscale-0 transition duration-300"
            />
          </div>
          <h3 className="font-jost text-base group-hover:text-purple-700 transition duration-300">
            {cat.title}
          </h3>
          <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-800 transition duration-300">
            ({cat.count} open positions)
          </p>
        </motion.div>
      ))}
    </div>

    {/* Optional bottom link */}
    <div className="text-center mt-10">
      <a
        href="#"
        className="text-sm underline hover:text-white transition"
      >
        See all categories ↗
      </a>
    </div>
  </div>
</section>


        {/* Testimonials Section */}
       <section className="py-28 px-4 bg-white text-black relative"> {/* Increased top padding */}
  <div className="text-center mb-12">
    <h2 className="text-2xl font-jost">Testimonials From Our Users</h2>
  </div>

  <div className="relative max-w-4xl mx-auto bg-purple-100 p-10 pt-16 rounded-3xl text-center shadow-md overflow-hidden min-h-[350px]"> 
    {/* Add pt-16 to push content down; min-h to stabilize height */}
    
    {/* Floating Avatar */}
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 transition-all duration-500 z-10">
      <img
        src={testimonials[index].avatar}
        alt="User"
        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
      />
    </div>

    {/* Testimonial Content */}
    <div className="transition-all duration-700 ease-in-out">
      <h3 className="font-jost text-lg mb-2">Great quality!</h3>
      <p className="text-gray-700 text-sm">{testimonials[index].message}</p>
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-jost">{testimonials[index].name}</p>
        <p>{testimonials[index].title}</p>
      </div>
    </div>

    {/* Pagination dots */}
    <div className="mt-6 flex justify-center gap-2">
      {testimonials.map((_, i) => (
        <span
          key={i}
          className={`w-3 h-3 rounded-full inline-block ${
            i === index ? "bg-black" : "bg-gray-300"
          }`}
        ></span>
      ))}
    </div>
  </div>

  {/* Floating avatars around the card */}
  <div className="absolute inset-0 pointer-events-none">
    {[
      { src: avatar2, className: "top-1/4 left-10" },
      { src: avatar3, className: "top-2/3 left-20" },
      { src: avatar4, className: "top-1/2 right-10" },
      { src: avatar5, className: "bottom-20 right-20" },
    ].map((avt, idx) => (
      <img
        key={idx}
        src={avt.src}
        alt={`Avatar ${idx}`}
        className={`w-10 h-10 rounded-full shadow-lg absolute ${avt.className}`}
      />
    ))}
  </div>
</section>

      </div>
    </div>
  );
};

export default Home;
