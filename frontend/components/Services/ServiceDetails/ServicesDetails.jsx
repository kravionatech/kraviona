import React from "react";
import TechStack from "./TechStack";
import Types from "./Types";
import HeroSection from "./HeroSection";
import WhyChooseUs from "../WhyChooseUs";
import CallToAction from "./CallToAction";

const ServicesDetails = () => {
  return (
    <div>
      <HeroSection />
      <TechStack />
      <Types />
      <WhyChooseUs />
      <CallToAction />
    </div>
  );
};

export default ServicesDetails;
