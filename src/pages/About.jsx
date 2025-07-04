import React from "react";
import CountUp from "react-countup";
import {
  BriefcaseBusiness,
  GraduationCap,
  Users,
  Globe2,
  Brain,
  Rocket,
} from "lucide-react";
import client1 from "../assets/clients/1-1.png";
import client2 from "../assets/clients/1-2.png";
import client3 from "../assets/clients/1-3.png";
import client4 from "../assets/clients/1-4.png";
import client5 from "../assets/clients/1-5.png";
import client6 from "../assets/clients/1-6.png";
import img1 from "../assets/avatars/Illustration.png";

export default function About() {
  const stats = [
    { label: "Job Seekers", icon: <Users className="text-blue-600 w-6 h-6" />, value: 3000 },
    { label: "Courses", icon: <GraduationCap className="text-teal-600 w-6 h-6" />, value: 100 },
    { label: "Recruiters", icon: <BriefcaseBusiness className="text-indigo-600 w-6 h-6" />, value: 1000 },
  ];

  const clientLogos = [client1, client2, client3, client4, client5, client6];

  return (
    <div className="font-jost text-gray-900">
      <section className="bg-white py-16 px-4 md:px-20 text-center">
        <div className="max-w-4xl mx-auto mb-10">
          <img
            src={img1}
            alt="Infoziant Illustration"
            className="w-full rounded-xl  object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100"
            >
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <div className="text-4xl font-bold text-blue-700">
                <CountUp end={stat.value} duration={2.5} suffix="+" />
              </div>
              <div className="text-gray-700 font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">About Infoziant</h2>
          <p className="text-gray-700 text-lg mb-4">
            <strong>Infoziant</strong> is redefining talent acquisition and e-learning with an AI-powered
            approach to skill validation, mentoring, and career acceleration. We empower professionals
            with real-world training, expert guidance, and personalized paths to career growth.
          </p>
          <p className="text-gray-600 mb-4">
            Our leadership team brings 60+ years of experience from industry leaders like Symantec,
            McAfee, EMC, and HCLTech. This experience informs our mission: to serve the evolving
            workforce across borders.
          </p>
          <p className="text-gray-600 mb-4">
            With a reach across the US, UAE, Saudi Arabia, Australia, Sri Lanka, Malaysia, and India,
            we’ve trained over <strong>28,000+</strong> learners online and <strong>19,000+</strong> offline.
            Infoziant is your trusted partner in skill-building and career transformation.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8 justify-evenly">
            <div className="flex items-center gap-3">
              <Globe2 className="text-blue-500" />
              <span className="text-gray-700 font-semibold">Global Presence</span>
            </div>
            <div className="flex items-center gap-3">
              <Brain className="text-teal-600" />
              <span className="text-gray-700 font-semibold">AI-Driven Learning</span>
            </div>
            <div className="flex items-center gap-3">
              <Rocket className="text-purple-600" />
              <span className="text-gray-700 font-semibold">Career Launchpad</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 px-4 md:px-20">
        <h3 className="text-2xl font-semibold text-center mb-8 text-blue-700">
          Trusted by Leading Organizations
        </h3>
        <div className="flex justify-center items-center flex-wrap gap-10">
          {clientLogos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`client-${index}`}
              className="h-10 object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
