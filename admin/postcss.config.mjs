const config = {
  plugins: {
    "@tailwindcss/postcss": {
      colors: {
    surface: {
      DEFAULT: "#0b1322", // page background
      raised: "#0e1830",  // sidebar / topbar
      card: "#121d33",    // panels, editor shell
      soft: "#16223c",    // input fields, toolbar buttons (idle)
    },
    border: {
      DEFAULT: "#1f2c47",
      soft: "#243150",
    },
    accent: {
      DEFAULT: "#fb7a3c", // primary orange (Add post, Publish)
      hover: "#f0651f",
      soft: "#fb7a3c1a",
    },
    ink: {
      DEFAULT: "#e7ecf6", // headings
      muted: "#8d9bb8",   // body / secondary text
      faint: "#5d6c8c",   // placeholders, counters
    },
    status: {
      published: "#34d399",
      draft: "#fbbf24",
      archived: "#94a3b8",
    },
    mark: {
      yellow: "#fde68a",
      green: "#bbf7d0",
      blue: "#bfdbfe",
      pink: "#fbcfe8",
      purple: "#ddd6fe",
      orange: "#fed7aa",
    },
  },
    },
  },
};

export default config;