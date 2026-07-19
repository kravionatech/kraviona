import { permanentRedirect } from "next/navigation";

/**
 * /blogs → /blog (308 permanent redirect)
 *
 * The canonical blog index is /blog.
 * This route exists for backward-compatibility with any external
 * links pointing to /blogs.
 */
export default function BlogsRedirectPage() {
  permanentRedirect("/blog");
}
