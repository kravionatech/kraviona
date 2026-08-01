import "./globals.css";
import ToastProvider from "./ToastProvider";

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
        <ToastProvider />
      </body>
    </html>
  );
}
