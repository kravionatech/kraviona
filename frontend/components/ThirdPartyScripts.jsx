"use client";

import { useEffect } from "react";

const loadScript = ({ id, src, onLoad }) => {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  script.defer = true;
  if (onLoad) script.onload = onLoad;
  document.body.appendChild(script);
};

function loadAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  loadScript({
    id: "google-analytics-src",
    src: "https://www.googletagmanager.com/gtag/js?id=G-WKDGR26N2Q",
    onLoad: () => {
      window.gtag("js", new Date());
      window.gtag("config", "G-WKDGR26N2Q", {
        page_path: window.location.pathname,
      });
    },
  });

  if (!document.getElementById("google-tag-manager-src")) {
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });

    const script = document.createElement("script");
    script.id = "google-tag-manager-src";
    script.async = true;
    script.defer = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-5LX2JWGD";
    document.body.appendChild(script);
  }
}

// function loadChatbase() {
//   if (document.getElementById("FPeMkwsan4E1m6g8IGtSQ")) return;

//   window.chatbaseConfig = {
//     chatbotId: "FPeMkwsan4E1m6g8IGtSQ",
//     theme: { primaryColor: "#295C5E" },
//     chatWindow: { width: "360px", height: "540px" },
//     launcher: { position: "bottom-right", size: "56px" },
//   };

//   if (!window.chatbase || window.chatbase("getState") !== "initialized") {
//     window.chatbase = (...args) => {
//       window.chatbase.q = window.chatbase.q || [];
//       window.chatbase.q.push(args);
//     };

//     window.chatbase = new Proxy(window.chatbase, {
//       get(target, prop) {
//         if (prop === "q") return target.q;
//         return (...args) => target(prop, ...args);
//       },
//     });
//   }

//   const script = document.createElement("script");
//   script.src = "https://www.chatbase.co/embed.min.js";
//   script.id = "FPeMkwsan4E1m6g8IGtSQ";
//   script.async = true;
//   script.defer = true;
//   document.body.appendChild(script);
// }

function loadGoogleNewsSwg() {
  loadScript({
    id: "google-news-swg",
    src: "https://news.google.com/swg/js/v1/swg-basic.js",
    onLoad: () => {
      window.SWG_BASIC = window.SWG_BASIC || [];
      window.SWG_BASIC.push((basicSubscriptions) => {
        basicSubscriptions.init({
          type: "NewsArticle",
          isPartOfType: ["Product"],
          isPartOfProductId: "CAow_su3DA:openaccess",
          clientOptions: { theme: "light", lang: "en-GB" },
        });
      });
    },
  });
}

export default function ThirdPartyScripts() {
  useEffect(() => {
    const loadAll = () => {
      loadAnalytics();
      // loadChatbase();
      loadGoogleNewsSwg();
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("pointerdown", loadAll);
      window.removeEventListener("keydown", loadAll);
      window.removeEventListener("touchstart", loadAll);
    };

    window.addEventListener("pointerdown", loadAll, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", loadAll, { once: true });
    window.addEventListener("touchstart", loadAll, {
      once: true,
      passive: true,
    });

    return cleanup;
  }, []);

  return null;
}
