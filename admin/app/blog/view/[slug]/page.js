"use client"

import Frame from '@/components/Frame/Frame'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Pencil,
} from 'lucide-react'
import Link from 'next/link'

const ProgressBar = () => {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const page = document.documentElement
      const total = page.scrollHeight - page.clientHeight
      setPct(total > 0 ? Math.min(100, (page.scrollTop / total) * 100) : 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 lg:left-64 z-50 h-[3px] bg-[#0f5960]/20">
      <div
        className="h-full bg-[#e8622a] transition-[width] duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

const Skeleton = () => (
  <Frame>
    <ProgressBar />
    <div className="min-h-screen bg-[#edf5f4] px-4 py-8 animate-pulse">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex justify-between gap-4">
          <div className="h-9 w-28 rounded-lg bg-gray-200" />
          <div className="h-9 w-24 rounded-lg bg-gray-200" />
        </div>
        <div className="h-[380px] w-full rounded-lg bg-gray-200" />
        <div className="mx-auto max-w-4xl space-y-4 py-5">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-4/5 rounded bg-gray-200" />
          <div className="h-48 w-full rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  </Frame>
)

const NotFound = () => (
  <Frame>
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <FileText size={26} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Post not found</h2>
      <p className="text-gray-500 text-sm max-w-xs">
        This post may have been moved or deleted.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-[#e8622a] hover:text-[#b94b31] font-semibold text-sm"
      >
        <ArrowLeft size={15} /> Back to posts
      </Link>
    </div>
  </Frame>
)

const AuthorAvatar = ({ author }) => {
  const [imageFailed, setImageFailed] = useState(false)
  const initial = (author?.name || '?').trim().charAt(0).toUpperCase()

  if (author?.avatar && !imageFailed) {
    return (
      <img
        src={author.avatar}
        alt={author.name || 'Post author'}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-[#e8622a]/25"
        onError={() => setImageFailed(true)}
      />
    )
  }

  return (
    <div className="h-9 w-9 rounded-full bg-[#0f5960] flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#0f5960]/15">
      {initial}
    </div>
  )
}

const FaqItem = ({ faq }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm">{faq.question}</span>
        <ChevronRight
          size={17}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-gray-100 px-5 py-4 text-gray-600 text-sm leading-relaxed">
          {faq.answer}
        </div>
      )}
    </div>
  )
}

const formatDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const SingleBlogView = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const isPostId = /^[a-f\d]{24}$/i.test(slug)
        const endpoint = isPostId
          ? `${process.env.NEXT_PUBLIC_API_URL}/private/post/${slug}`
          : `${process.env.NEXT_PUBLIC_API_URL}/post/${slug}`
        const res = await fetch(endpoint, {
          credentials: isPostId ? 'include' : 'same-origin',
        })
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

  const postDate = formatDate(blog.publishedAt || blog.createdAt)

  return (
    <Frame>
      <ProgressBar />

      <div className="post-preview-page min-h-screen bg-[#edf5f4] pb-16">
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex min-h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0f5960] transition-colors"
            >
              <ArrowLeft size={16} /> All posts
            </Link>
            {blog._id && (
              <Link
                href={`/blog/edit/${blog._id}`}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#e8622a] px-4 text-sm font-semibold text-white hover:bg-[#b94b31] transition-colors"
              >
                <Pencil size={15} /> Edit post
              </Link>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
          <header className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {blog.featuredImage?.url ? (
              <div className="relative h-[clamp(280px,42vw,480px)] overflow-hidden">
                <img
                  src={blog.featuredImage.url}
                  alt={blog.featuredImage.altText || blog.title}
                  className="h-full w-full object-cover"
                />
                <div className="post-preview-hero-overlay absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 max-w-4xl px-5 pb-6 sm:px-8 sm:pb-8">
                  {blog.category?.name && (
                    <span className="mb-3 inline-block text-xs font-bold uppercase text-[#ff936c]">
                      {blog.category.name}
                    </span>
                  )}
                  <h1 className="max-w-4xl text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                    {blog.title}
                  </h1>
                </div>
              </div>
            ) : (
              <div className="px-5 py-10 sm:px-8 sm:py-14">
                {blog.category?.name && (
                  <span className="mb-3 inline-block text-xs font-bold uppercase text-[#d85e3d]">
                    {blog.category.name}
                  </span>
                )}
                <h1 className="max-w-4xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
                  {blog.title}
                </h1>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-gray-100 px-5 py-4 sm:px-8">
              <div className="flex items-center gap-3">
                <AuthorAvatar author={blog.author} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{blog.author?.name || 'Unknown author'}</p>
                  <p className="text-xs text-gray-500">Author</p>
                </div>
              </div>

              <div className="ml-auto flex flex-wrap items-center gap-4 text-xs text-gray-500">
                {postDate && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} /> {postDate}
                  </span>
                )}
                {blog.readingTimeMinutes && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {blog.readingTimeMinutes} min read
                  </span>
                )}
                {blog.views !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} /> {blog.views.toLocaleString()} views
                  </span>
                )}
              </div>
            </div>
          </header>
        </div>

        <main className="mx-auto max-w-4xl space-y-7 px-4 py-8 sm:px-6 sm:py-10">
          {blog.excerpt && (
            <p className="border-l-4 border-[#e8622a] pl-5 text-lg leading-8 text-gray-700">
              {blog.excerpt}
            </p>
          )}

          {blog.quickAnswer && (
            <section className="rounded-lg border border-[#e8622a]/30 bg-[#fff7f2] p-5 sm:p-6">
              <h2 className="mb-2 text-xs font-bold uppercase text-[#b94b31]">Quick answer</h2>
              <p className="text-sm leading-7 text-gray-700">{blog.quickAnswer}</p>
            </section>
          )}

          {blog.keyTakeaways?.length > 0 && (
            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-xs font-bold uppercase text-gray-500">Key takeaways</h2>
              <ul className="space-y-3">
                {blog.keyTakeaways.map((item, index) => (
                  <li key={index} className="flex gap-3 text-sm leading-6 text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#e8622a]/15 text-xs font-bold text-[#b94b31]">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {blog.tableOfContents?.length > 0 && (
            <nav aria-label="Table of contents" className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-xs font-bold uppercase text-gray-500">Contents</h2>
              <ol className="grid gap-2 sm:grid-cols-2 sm:gap-x-8">
                {blog.tableOfContents.map((toc, index) => (
                  <li key={toc._id || toc.anchor} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 flex-shrink-0 font-mono text-xs text-gray-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <a
                      href={`#${toc.anchor}`}
                      className="text-sm leading-6 text-[#d85e3d] hover:text-[#b94b31] hover:underline underline-offset-2"
                    >
                      {toc.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {blog.content && (
            <article className="admin-article-content rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              {typeof blog.content === 'string' && blog.content.trim().startsWith('<')
                ? <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                : <p className="whitespace-pre-wrap">{blog.content}</p>
              }
            </article>
          )}

          {blog.gallery?.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs font-bold uppercase text-gray-500">Gallery</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {blog.gallery.map((image) => (
                  <figure key={image._id || image.url} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <img
                      src={image.url}
                      alt={image.altText || ''}
                      className="h-52 w-full object-cover"
                    />
                    {image.caption && (
                      <figcaption className="px-4 py-3 text-center text-xs text-gray-500">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {blog.faqSchema?.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs font-bold uppercase text-gray-500">Frequently asked</h2>
              <div className="space-y-3">
                {blog.faqSchema.map((faq) => (
                  <FaqItem key={faq._id || faq.question} faq={faq} />
                ))}
              </div>
            </section>
          )}

          {blog.tags?.length > 0 && (
            <section className="border-t border-gray-200 pt-6">
              <h2 className="mb-3 text-xs font-bold uppercase text-gray-500">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0f5960] transition-colors"
          >
            <ArrowLeft size={15} /> Back to all posts
          </Link>
        </main>
      </div>
    </Frame>
  )
}

export default SingleBlogView
