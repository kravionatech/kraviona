export const menuList = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Services",
    path: "/services",
    hasMegaMenu: true,
  },
  {
    name: "Insights",
    path: "/blog",
    subMenu: [
      { name: "All Articles", path: "/blog" },
      { name: "MERN Stack", path: "/blog?category=mern-stack" },
      { name: "Technical SEO", path: "/blog?category=technical-seo" },
      { name: "Web Performance", path: "/blog?category=web-performance" },
    ],
  },
  {
    name: "Company",
    subMenu: [
      { name: "About Us", path: "/about" },
      { name: "Portfolio", path: "/gallery" },
      { name: "Pricing", path: "/pricing" },
    ],
  },
  {
    name: "Contact",
    path: "/contact",
  },
];
