"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import LatestBlog from "./LatestBlog";

const FeaturedServices = dynamic(() => import("./FeaturedServices"), {
  ssr: false,
});
const WhyChooseUs = dynamic(() => import("./WhyChooseUs"), { ssr: false });
const TechStack = dynamic(() => import("./TechStack"), { ssr: false });
const CTASection = dynamic(() => import("./CTASection"), { ssr: false });
const HomeFAQ = dynamic(() => import("./HomeFAQ"), { ssr: false });

const DeferredHomeSections = ({ initialPosts = [] }) => {
  const [ready, setReady] = useState(false);
  const preloadTarget = useRef(null);

  useEffect(() => {
    if (ready) return undefined;

    const reveal = () => setReady(true);
    const target = preloadTarget.current;
    const observer =
      target && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) reveal();
            },
            { rootMargin: "1000px 0px" },
          )
        : null;

    if (observer && target) observer.observe(target);

    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(reveal, { timeout: 2500 })
        : null;
    const timer = idleId === null ? window.setTimeout(reveal, 1800) : null;

    return () => {
      observer?.disconnect();
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [ready]);

  return (
    <>
      <LatestBlog initialPosts={initialPosts} />
      <div ref={preloadTarget} aria-hidden="true" className="h-px" />
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
