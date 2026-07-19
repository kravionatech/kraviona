"use client"

import Frame from '@/components/Frame/Frame'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Clock, Eye, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

/* ── Reading progress bar ─────────────────────────── */
const ProgressBar = () => {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-gray-100">
      <div
        className="h-full bg-orange-500 transition-all duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* ── Skeleton loader ──────────────────────────────── */
const Skeleton = () => (
  <Frame>
    <ProgressBar />
    <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-6">
      <div className="h-3 w-24 bg-gray-200 rounded" />
      <div className="h-10 w-3/4 bg-gray-200 rounded" />
      <div className="h-10 w-1/2 bg-gray-200 rounded" />
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>
      <div className="h-72 w-full bg-gray-200 rounded-2xl" />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`h-3 bg-gray-200 rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  </Frame>
)

/* ── Not found ────────────────────────────────────── */
const NotFound = () => (
  <Frame>
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
        <span className="text-2xl">📄</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900">Post not found</h2>
      <p className="text-gray-500 text-sm max-w-xs">
        This post may have been moved or deleted.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-sm"
      >
        <ArrowLeft size={15} /> Back to blog
      </Link>
    </div>
  </Frame>
)

/* ── Accordion FAQ ────────────────────────────────── */
const FaqItem = ({ faq }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm pr-4">{faq.question}</span>
        <ChevronRight
          size={16}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
          {faq.answer}
        </div>
      )}
    </div>
  )
}

/* ── Main component ───────────────────────────────── */
const SingleBlogView = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const articleRef = useRef(null)

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${slug}`)
        const data = await res.json()
        if (data.success) setBlog(data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchBlogDetails()
  }, [slug])

  if (loading) return <Skeleton />
  if (!blog) return <NotFound />

  return (
    <Frame>
      <ProgressBar />

      {/* ── Hero image with overlay title ── */}
      {blog.featuredImage?.url ? (
        <div className="relative w-full h-[56vh] min-h-[380px] overflow-hidden">
          <img
            src={blog.featuredImage.url}
            alt={blog.featuredImage.altText || blog.title}
            className="w-full h-full object-cover"
          />
          {/* gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d111780] to-transparent" />

          {/* title on hero */}
          <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 pb-10">
            {blog.category?.name && (
              <span className="inline-block text-xs font-bold tracking-widest text-orange-400 uppercase mb-3">
                {blog.category.name}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>
      ) : (
        /* fallback: no image, plain header */
        <div className="bg-[#1A2B3C] py-16">
          <div className="max-w-3xl mx-auto px-4">
            {blog.category?.name && (
              <span className="inline-block text-xs font-bold tracking-widest text-orange-400 uppercase mb-3">
                {blog.category.name}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>
      )}

      {/* ── Author strip ── */}
      <div className="bg-white border-b border-gray-100 sticky top-[3px] z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          {blog.author?.avatar ? (
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-orange-200">
              {(blog.author?.name || '?')[0].toUpperCase()}
            </div>
          )}
          <span className="text-sm font-semibold text-gray-800">{blog.author?.name || 'Unknown'}</span>

          <div className="flex items-center gap-3 ml-auto text-xs text-gray-400">
            {blog.readingTimeMinutes && (
              <span className="flex items-center gap-1">
                <Clock size={12} /> {blog.readingTimeMinutes} min read
              </span>
            )}
            {blog.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye size={12} /> {blog.views.toLocaleString()} views
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="bg-[#FAFAFA] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-10" ref={articleRef}>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed font-light border-l-4 border-orange-400 pl-5">
              {blog.excerpt}
            </p>
          )}

          {/* Quick Answer */}
          {blog.quickAnswer && (
            <div className="bg-[#FFF7ED] border border-orange-200 rounded-2xl p-6">
              <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-2">Quick Answer</p>
              <p className="text-gray-800 text-sm leading-relaxed">{blog.quickAnswer}</p>
            </div>
          )}

          {/* Key Takeaways */}
          {blog.keyTakeaways?.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Key Takeaways</p>
              <ul className="space-y-3">
                {blog.keyTakeaways.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Table of Contents */}
          {blog.tableOfContents?.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Contents</p>
              <ol className="space-y-2">
                {blog.tableOfContents.map((toc, i) => (
                  <li key={toc._id} className="flex items-start gap-3">
                    <span className="text-xs text-gray-300 font-mono mt-0.5 w-5 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <a
                      href={`#${toc.anchor}`}
                      className="text-sm text-orange-600 hover:text-orange-700 hover:underline underline-offset-2 transition-colors"
                    >
                      {toc.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Main content */}
          {blog.content && (
            <div className="prose prose-gray prose-sm sm:prose max-w-none
              prose-headings:text-[#1A2B3C] prose-headings:font-bold
              prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-orange-400 prose-blockquote:text-gray-600
              prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-1 prose-code:rounded
              prose-img:rounded-xl">
              {/* If content is HTML use dangerouslySetInnerHTML, else render as text */}
              {typeof blog.content === 'string' && blog.content.trim().startsWith('<')
                ? <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                : <p className="text-gray-700 leading-relaxed">{blog.content}</p>
              }
            </div>
          )}

          {/* Gallery */}
          {blog.gallery?.length > 0 && (
            <section>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">Gallery</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blog.gallery.map((image) => (
                  <figure key={image._id} className="group overflow-hidden rounded-xl">
                    <img
                      src={image.url}
                      alt={image.altText}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {image.caption && (
                      <figcaption className="text-xs text-gray-400 mt-2 text-center">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {blog.faqSchema?.length > 0 && (
            <section>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">Frequently Asked</p>
              <div className="space-y-3">
                {blog.faqSchema.map((faq) => (
                  <FaqItem key={faq._id} faq={faq} />
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white border border-gray-200 hover:border-orange-300 hover:text-orange-600 text-gray-600 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="pt-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft size={15} /> Back to all posts
            </Link>
          </div>
        </div>
      </div>
    </Frame>
  )
}

export default SingleBlogView