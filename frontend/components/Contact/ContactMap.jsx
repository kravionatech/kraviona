"use client";

import React from "react";
import { motion } from "framer-motion";

const ContactMap = () => {
  return (
    <section className="pb-24 bg-[#fdfdfd] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group relative"
        >
          {/* Default view of New Delhi/East Delhi area */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112061.09262723145!2d77.19940381656894!3d28.632731557375252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1710350000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
          ></iframe>

          {/* Map Overlay Text (Optional, hidden on hover) */}
          <div className="absolute top-6 left-6 pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-[#1b3d3e] text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm border border-white/20">
              Based in New Delhi, India
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactMap;
