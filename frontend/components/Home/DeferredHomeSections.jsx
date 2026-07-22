"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LatestBlog = dynamic(() => import("./LatestBlog").then((mod) => mod.default), {
  ssr: false,
});
const FeaturedServices = dynamic(() => import("./FeaturedServices"), {
  ssr: false,
});
const WhyChooseUs = dynamic(() => import("./WhyChooseUs"), { ssr: false });
const TechStack = dynamic(() => import("./TechStack"), { ssr: false });
const CTASection = dynamic(() => import("./CTASection"), { ssr: false });
const HomeFAQ = dynamic(() => import("./HomeFAQ"), { ssr: false });

const DeferredHomeSections = ({ initialPosts = [] }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setReady(true), {
        timeout: 6000,
      });

      return () => window.cancelIdleCallback(idleId);
    }

    const timer = window.setTimeout(() => setReady(true), 4500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <LatestBlog initialPosts={initialPosts} />
      {ready && (
        <>
          <FeaturedServices />
          <WhyChooseUs />
          <TechStack />
          <CTASection />
          <HomeFAQ />
        </>
      )}
    </>
  );
};

export default DeferredHomeSections;
