"use client";

import { ToastContainer } from "react-toastify";

// Third-party browser components must cross the App Router boundary through
// a local client component. Rendering ToastContainer directly from the server
// layout makes Next resolve its named client export as an invalid lazy element.
export default function ToastProvider() {
  return <ToastContainer />;
}
