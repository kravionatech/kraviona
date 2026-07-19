"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LineChart,
  Building2,
  HeartPulse,
  ShoppingBag,
  GraduationCap,
  Plane,
  ArrowRight,
  Workflow,
  RefreshCw,
  ShieldAlert,
  Bot,
  Zap,
} from "lucide-react";

// --- Industry Solutions Data ---
const industries = [
  {
    id: "fintech",
    icon: <LineChart className="w-8 h-8" />,
    title: "FinTech & Finance",
    description:
      "Secure, compliant, and lightning-fast financial platforms. We build custom payment gateways, investment dashboards, and robust banking solutions.",
    color: "from-[#d96c4e]/20 to-transparent",
    iconColor: "text-[#d96c4e]",
  },
  {
    id: "ecommerce",
    icon: <ShoppingBag className="w-8 h-8" />,
    title: "E-Commerce & Retail",
    description:
      "Scale your sales with high-converting online stores, automated inventory management, and personalized AI shopping experiences.",
    color: "from-[#53C2B3]/20 to-transparent",
    iconColor: "text-[#53C2B3]",
  },
  {
    id: "healthcare",
    icon: <HeartPulse className="w-8 h-8" />,
    title: "Healthcare & MedTech",
    description:
      "HIPAA-compliant telemedicine apps, patient portals, and clinic management systems that prioritize data security and user accessibility.",
    color: "from-[#f4be78]/20 to-transparent",
    iconColor: "text-[#f4be78]",
  },
  {
    id: "realestate",
    icon: <Building2 className="w-8 h-8" />,
    title: "Real Estate & PropTech",
    description:
      "Immersive property listing platforms, virtual tour integrations, and CRM dashboards that help realtors close deals faster.",
    color: "from-[#295c5e]/20 to-transparent",
    iconColor: "text-[#295c5e]",
  },
  {
    id: "education",
    icon: <GraduationCap className="w-8 h-8" />,
    title: "EdTech & E-Learning",
    description:
      "Interactive learning management systems (LMS), virtual classrooms, and course selling platforms designed for modern education.",
    color: "from-[#d96c4e]/20 to-transparent",
    iconColor: "text-[#d96c4e]",
  },
  {
    id: "logistics",
    icon: <Plane className="w-8 h-8" />,
    title: "Travel & Logistics",
    description:
      "Smart booking engines, fleet tracking dashboards, and supply chain management software to keep your business moving efficiently.",
    color: "from-[#53C2B3]/20 to-transparent",
    iconColor: "text-[#53C2B3]",
  },
];

// --- Business Challenges Data ---
const challenges = [
  {
    icon: <RefreshCw />,
    title: "Legacy System Modernization",
    description:
      "Stuck with old, slow software? We seamlessly migrate your legacy systems to modern, fast MERN stack architectures without losing your data.",
  },
  {
    icon: <Workflow />,
    title: "Workflow Automation",
    description:
      "Stop wasting time on manual tasks. We build custom internal tools that automate your business processes, saving you hundreds of hours.",
  },
  {
    icon: <Bot />,
    title: "AI Integration & Scaling",
    description:
      "Ready for the future? We integrate smart AI chatbots and predictive algorithms into your existing platforms to scale your operations.",
  },
  {
    icon: <ShieldAlert />,
    title: "Data Security & Compliance",
    description:
      "Protecting your business from cyber threats with enterprise-grade security protocols, encryption, and safe cloud infrastructures.",
  },
];

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function Solutions() {
  return (
    <div className="min-h-screen bg-[#fcfdfd] font-sans selection:bg-[#d96c4e] selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 bg-[#1b3d3e] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-[#295c5e]/50 border border-white/10 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#f4be78] animate-pulse"></span>
              <span className="text-white font-semibold tracking-widest text-xs uppercase">
                Industry-Tailored Solutions
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8"
            >
              Technology That Solves <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96c4e] via-[#f4be78] to-[#d96c4e] animate-gradient-x">
                Real Business Problems.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto font-light"
            >
              We don&apos;t believe in one-size-fits-all. We engineer custom
              digital solutions designed specifically around your
              industry&apos;s unique challenges, workflows, and growth targets.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. INDUSTRIES WE TRANSFORM */}
      <section className="py-24 relative z-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1b3d3e] mb-6">
              Industries We Transform
            </h2>
            <p className="text-gray-500 text-lg">
              From high-security financial platforms to engaging e-commerce
              experiences, we have the domain expertise to build software that
              dominates your market.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {industries.map((industry) => (
              <motion.div
                key={industry.id}
                variants={fadeUp}
                className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(41,92,94,0.08)] transition-all duration-500 overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${industry.color} rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>
                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${industry.iconColor}`}
                  >
                    {industry.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#1b3d3e] mb-4">
                    {industry.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-6">
                    {industry.description}
                  </p>
                  <Link
                    href={`/contact?interest=${industry.id}`}
                    className="inline-flex items-center gap-2 font-bold text-[#1b3d3e] group-hover:text-[#d96c4e] transition-colors"
                  >
                    Discuss Your Project{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. BUSINESS CHALLENGES */}
      <section className="py-24 bg-[#1b3d3e] relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#295c5e] blur-[150px] rounded-full opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="lg:w-1/3"
            >
              <span className="text-[#f4be78] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">
                Overcoming Obstacles
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                Not Just Code. <br />{" "}
                <span className="text-[#d96c4e]">Business Solutions.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                You bring the operational bottlenecks; we bring the
                technological solutions. We analyze your pain points and build
                digital infrastructure that saves time, cuts costs, and
                multiplies revenue.
              </p>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-[#1b3d3e] rounded-full font-bold hover:bg-[#d96c4e] hover:text-white transition-colors shadow-lg inline-flex items-center gap-2"
              >
                Consult With Us
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {challenges.map((challenge, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#295c5e] text-[#53C2B3] rounded-xl flex items-center justify-center mb-6">
                    {challenge.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {challenge.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. THE KRAVIONA APPROACH */}
      <section className="py-24 bg-[#f8fafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1b3d3e] mb-6">
              Our Blueprint for Success
            </h2>
            <p className="text-gray-500 text-lg">
              Why do businesses trust us to build their core systems? Because we
              don&apos;t skip steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-[#1b3d3e] mb-4">
                1. Deep Technical Discovery
              </h3>
              <p className="text-gray-500 text-lg">
                We don&apos;t write a single line of code until we fully
                understand your business logic, user personas, and long-term
                scaling goals. We map out the entire architecture first.
              </p>
            </div>
            <div className="bg-[#1b3d3e] p-10 rounded-[2rem] text-white flex flex-col justify-center items-start">
              <div className="w-12 h-12 bg-[#d96c4e] rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Grade</h3>
              <p className="text-gray-300">
                Built to handle thousands of concurrent users safely.
              </p>
            </div>
            <div className="bg-[#d96c4e] p-10 rounded-[2rem] text-white flex flex-col justify-center items-start">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <Zap className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Agile Delivery</h3>
              <p className="text-white/80">
                Continuous updates and transparent sprint cycles.
              </p>
            </div>
            <div className="md:col-span-2 bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-[#1b3d3e] mb-4">
                2. Scalable Execution
              </h3>
              <p className="text-gray-500 text-lg">
                Using React, Next.js, and Node.js, we build modular systems.
                This means as your business grows, your software easily adapts
                without needing a complete rewrite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-tr from-[#1b3d3e] via-[#295c5e] to-[#1b3d3e] text-center border-t border-[#53C2B3]/20">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Ready to Disrupt <br className="hidden md:block" /> Your Industry?
          </h2>
          <p className="text-xl text-gray-300 mb-10 font-light">
            Stop letting outdated technology hold your business back. Partner
            with Kraviona to build the digital infrastructure of tomorrow.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-[#1b3d3e] rounded-full font-bold text-lg hover:bg-[#d96c4e] hover:text-white transition-all duration-300 shadow-2xl hover:-translate-y-1"
          >
            Schedule a Strategy Call <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
