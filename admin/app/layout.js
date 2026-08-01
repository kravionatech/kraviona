import "./globals.css";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Kraviona Admin",
  description: "Kraviona CMS Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#1a2e33]"
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
