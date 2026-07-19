import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

const PAGE_URL = canonicalUrl("/services/ai-automation");

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "AI Automation",
  description:
    "Intelligent automation using AI and machine learning. LLM integration, chatbots, workflow automation, and AI-powered business processes.",
  provider: { "@id": "https://kraviona.com/#organization" },
  url: PAGE_URL,
  areaServed: [{ "@type": "Country", name: "India" }],
};

export const metadata = {
  title: "AI Automation & LLM Integration Services | Kraviona",
  description:
    "Automate business processes with AI. Kraviona builds intelligent chatbots, LLM-powered applications, and AI workflows that reduce costs and improve efficiency.",
  keywords: [
    "AI Automation",
    "LLM Integration",
    "ChatGPT Integration",
    "Chatbot Development",
    "Workflow Automation",
    "Machine Learning",
    "AI-Powered Applications",
    "Artificial Intelligence Services",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "AI Automation & LLM Integration | Kraviona",
    description:
      "Intelligent automation with ChatGPT, LLMs, and AI. Build smart workflows and chatbots that transform your business.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-web-development.jpg",
        width: 1200,
        height: 630,
        alt: "AI Automation by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    title: "AI Automation & LLM Integration | Kraviona",
    description:
      "Build intelligent chatbots, LLM applications, and AI workflows. Automate with artificial intelligence.",
    images: ["/og-web-development.jpg"],
  },
  robots: defaultRobots,
};

export default function AIAutomationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section className="relative py-28 bg-gradient-to-br from-[#081314] via-[#0f2425] to-[#1b3d3e] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            AI{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Automation
            </span>{" "}
            Services
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            Harness the power of AI to automate processes, reduce costs, and
            unlock new business opportunities. ChatGPT, LLMs, and intelligent
            automation at scale.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-all"
          >
            Explore AI Solutions
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111A1F] mb-12">
            AI Automation Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "LLM Integration",
                desc: "ChatGPT, Claude, and other LLM integration into your applications and workflows.",
              },
              {
                title: "Intelligent Chatbots",
                desc: "Context-aware chatbots that understand user intent and provide meaningful responses.",
              },
              {
                title: "Document Processing",
                desc: "AI-powered document extraction, classification, and intelligent data processing.",
              },
              {
                title: "Workflow Automation",
                desc: "Intelligent automation of repetitive business processes using AI and RPA.",
              },
              {
                title: "Sentiment Analysis",
                desc: "AI-powered sentiment and emotion detection for customer feedback and monitoring.",
              },
              {
                title: "Predictive Analytics",
                desc: "Machine learning models for forecasting, trend analysis, and predictive insights.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-[#FAFCFC] border border-gray-200 rounded-xl"
              >
                <h3 className="font-bold text-[#111A1F] mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f9fafb]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#111A1F] mb-8">
            Why Choose Kraviona for AI?
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#d96c4e] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-[#111A1F] mb-2">
                  Proven AI Expertise
                </h3>
                <p className="text-gray-600">
                  Experience integrating LLMs, ChatGPT, and AI models into
                  production applications.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#d96c4e] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-[#111A1F] mb-2">
                  Custom Solutions
                </h3>
                <p className="text-gray-600">
                  Tailored AI automation solutions for your specific business
                  challenges.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#d96c4e] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-[#111A1F] mb-2">
                  Cost-Effective
                </h3>
                <p className="text-gray-600">
                  Reduce operational costs and improve efficiency with
                  intelligent automation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#FAFCFC] border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-[#111A1F] mb-5">
            Related Services
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              {
                name: "Full-Stack Development",
                href: "/services/full-stack-development",
              },
              {
                name: "Backend Development",
                href: "/services/backend-development",
              },
              { name: "MERN Stack", href: "/services/mern-stack-development" },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-5 py-2.5 border border-[#295c5e]/30 text-[#295c5e] rounded-full font-semibold text-sm hover:bg-[#295c5e] hover:text-white transition-all"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ContactFormDetails />
    </>
  );
}
