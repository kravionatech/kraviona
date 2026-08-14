import BlogPushSubscribe from "@/components/Blog/BlogPushSubscribe";

export default function BlogLayout({ children }) {
  return (
    <>
      {children}
      <BlogPushSubscribe />
    </>
  );
}
