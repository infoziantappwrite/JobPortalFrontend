// import CountUp from "react-countup";
// import client1 from "../assets/clients/1-1.png";
// import client2 from "../assets/clients/1-2.png";
// import client3 from "../assets/clients/1-3.png";
// import client4 from "../assets/clients/1-4.png";
// import client5 from "../assets/clients/1-5.png";
// import client6 from "../assets/clients/1-6.png";
// import img1 from "../assets/avatars/Illustration.png";

// export default function About() {
//   return (
//     <div className="font-jost text-gray-900">
//       {/* ===== Hero Image and Stats ===== */}
//       <div className="bg-white py-12 px-6 md:px-20 text-center">
//         <div className="w-full mb-10">
//           <img
//             src={img1}
//             alt="visual-1"
//             className="w-full object-cover rounded-xl shadow-md"
//           />
//         </div>

//         <div className="flex flex-col md:flex-row justify-around items-center text-center text-lg font-medium text-gray-800">
//           <div className="mb-6 md:mb-0">
//             <div className="text-3xl font-bold text-black">
//               <CountUp end={3000} duration={2.5} suffix="+" />
//             </div>
//             <div>Job Seekers</div>
//           </div>
//           <div className="mb-6 md:mb-0">
//             <div className="text-3xl font-bold text-black">
//               <CountUp end={100} duration={2.5} suffix="+" />
//             </div>
//             <div>Courses</div>
//           </div>
//           <div>
//             <div className="text-3xl font-bold text-black">
//               <CountUp end={1000} duration={2.5} suffix="+" />
//             </div>
//             <div>Recruiters</div>
//           </div>
//         </div>
//       </div>

//       {/* ===== About VTA Section ===== */}
//       <div className="bg-white py-12 px-6 md:px-20">
//         <h2 className="text-2xl md:text-3xl font-jost mb-6 text-left text-black">
//           About VTA
//         </h2>
//         <p className="mb-4 text-[15px] leading-relaxed text-gray-700">
//           Infoziant is at the forefront of transforming the Talent Acquisition
//           and E-learning landscape by leveraging AI-driven, unbiased skill
//           validation, expert mentorship, and strategic career advancement
//           opportunities. Our platform empowers individuals to achieve their
//           professional goals with personalized learning experiences and precise
//           skill assessments.
//         </p>
//         <p className="mb-4 text-[15px] leading-relaxed text-gray-700">
//           Our founders, with a collective experience of over 60 years in
//           education, recruitment, and product development at industry giants
//           such as Symantec, McAfee, EMC, and HCLTech, have designed VTA to meet
//           the evolving needs of a global workforce.
//         </p>
//         <p className="mb-4 text-[15px] leading-relaxed text-gray-700">
//           VTA's reach extends across the globe, having successfully trained
//           individuals from the US, Saudi Arabia, UAE, Australia, Sri Lanka,
//           Malaysia, and India. With a proven track record of educating over
//           28,000+ students online and 19,000+ offline, our team is dedicated to
//           providing top-notch training that equips learners with the skills and
//           knowledge necessary to thrive in today’s competitive job market.
//         </p>
//       </div>

//       {/* ===== Client Logos ===== */}
//       <div className="bg-white py-10">
//         <div className="flex flex-wrap justify-center items-center gap-10 px-6">
//           {[client1, client2, client3, client4, client5, client6].map(
//             (logo, i) => (
//               <img
//                 key={i}
//                 src={logo}
//                 alt={`client-${i}`}
//                 className="h-10 object-contain"
//               />
//             )
//           )}
//         </div>
//       </div>

//       {/* ===== Call to Action Section ===== */}
//       <div className="bg-gradient-to-r from-teal-500 via-indigo-700 to-teal-500 text-white py-16 text-center px-6">
//         <h3 className="text-3xl md:text-4xl font-bold mb-4">
//           Your Dream Jobs Are Waiting
//         </h3>
//         <p className="mb-8 text-lg">
//           Over 1 million interactions, 50,000 success stories. Make yours now.
//         </p>
//         <div className="flex justify-center gap-6 flex-wrap">
//           <button className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
//             Search Job
//           </button>
//           <button className="bg-indigo-400 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition">
//             Post a Job
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import CountUp from "react-countup";
import client1 from "../assets/clients/1-1.png";
import client2 from "../assets/clients/1-2.png";
import client3 from "../assets/clients/1-3.png";
import client4 from "../assets/clients/1-4.png";
import client5 from "../assets/clients/1-5.png";
import client6 from "../assets/clients/1-6.png";
import img1 from "../assets/avatars/Illustration.png";

export default function About() {
  const clientLogos = [client1, client2, client3, client4, client5, client6];

  return (
    <div className="font-jost text-gray-900 overflow-hidden">
      {/* ===== Hero Image and Stats ===== */}
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 px-6 md:px-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 text-center">
          <div className="w-full mb-16 group">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white p-2">
              <img
                src={img1}
                alt="VTA Illustration"
                className="w-full max-h-[400px] object-cover rounded-2x1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                value: 3000,
                label: "Job Seekers",
                icon: "👥",
                color: "from-blue-500 to-cyan-500",
              },
              {
                value: 100,
                label: "Courses",
                icon: "📚",
                color: "from-purple-500 to-pink-500",
              },
              {
                value: 1000,
                label: "Recruiters",
                icon: "🎯",
                color: "from-green-500 to-teal-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div
                  className={`text-5xl font-black mb-3 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                >
                  <CountUp end={item.value} duration={2.5} suffix="+" />
                </div>
                <div className="text-gray-600 font-semibold text-lg">
                  {item.label}
                </div>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== About Section ===== */}
      <div className="relative bg-white py-24 px-6 md:px-20">
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-96 h-96 bg-gradient-to-l from-blue-100 to-transparent rounded-full opacity-30"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  About Our Company
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  About{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    VTA
                  </span>
                </h2>
              </div>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg border-l-4 border-blue-500 pl-6 bg-blue-50 p-4 rounded-r-lg">
                  <strong className="text-blue-800">Infoziant</strong> is at the
                  forefront of transforming the Talent Acquisition and
                  E-learning landscape by leveraging AI-driven, unbiased skill
                  validation, expert mentorship, and strategic career
                  advancement opportunities.
                </p>
                <p className="text-base">
                  Our founders, with over{" "}
                  <span className="font-bold text-purple-600">60 years</span> of
                  experience at companies like{" "}
                  <span className="font-semibold">
                    Symantec, McAfee, EMC, and HCLTech
                  </span>
                  , built VTA for global workforce needs.
                </p>
                <p className="text-base">
                  We've trained professionals from the{" "}
                  <span className="font-semibold">
                    US, Saudi Arabia, UAE, Australia, Sri Lanka, Malaysia, and
                    India
                  </span>
                  . Over{" "}
                  <span className="font-bold text-green-600">
                    28,000+ online
                  </span>{" "}
                  and{" "}
                  <span className="font-bold text-green-600">
                    19,000+ offline
                  </span>{" "}
                  students trust our training.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-800">
                    Global Reach
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold text-blue-800">
                    AI-Driven Platform
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-3xl p-8 shadow-xl">
                <img
                  src={img1}
                  alt="About VTA"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                  <div className="text-2xl font-bold text-purple-600">60+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                  <div className="text-2xl font-bold text-green-600">47K+</div>
                  <div className="text-sm text-gray-600">Students Trained</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Client Logos Section ===== */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Trusted by Industry Leaders
            </h3>
            <p className="text-gray-600">
              Join thousands of professionals who trust our platform
            </p>
          </div>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {clientLogos.map((src, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <img
                  src={src}
                  alt={`client-${i}`}
                  className="h-16 w-24 object-contain grayscale hover:grayscale-0 transition-all duration-500 transform hover:scale-110 p-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CTA Section ===== */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-700 to-blue-800 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse animation-delay-1000"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-ping"></span>
                Start Your Journey Today
              </div>
              <h3 className="text-4xl md:text-6xl font-black leading-tight">
                Your Dream Jobs Are{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Waiting
                </span>
              </h3>
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Over <span className="font-bold text-yellow-400">1 million</span>{" "}
              interactions,
              <span className="font-bold text-yellow-400"> 50,000</span> success
              stories. Make yours now.
            </p>
            <div className="flex justify-center gap-6 flex-wrap pt-8">
              <button className="group relative bg-white text-blue-700 font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                <span className="relative z-10">Search Job</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">
                  Search Job
                </span>
              </button>
              <button className="group relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <span className="flex items-center">
                  Post a Job
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
