import type { Metadata } from "next";
import Link from "next/link";
import SiteLogo from "@/components/SiteLogo";
import { blogListPosts } from "@/lib/content-data";

export const metadata: Metadata = {
  title: "YouTube Automation Blog",
  description:
    "Read practical YouTube automation articles, AI tool breakdowns, and growth strategies for faceless channels.",
  alternates: {
    canonical: "/blog/",
  },
  openGraph: {
    title: "YouTube Automation Blog",
    description:
      "Read practical YouTube automation articles, AI tool breakdowns, and growth strategies for faceless channels.",
    type: "website",
    url: "/blog/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube Automation Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Automation Blog",
    description:
      "Read practical YouTube automation articles, AI tool breakdowns, and growth strategies for faceless channels.",
    images: ["/og-image.png"],
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <SiteLogo
            href="/"
            className="justify-center mb-4"
            textClassName="text-2xl text-white"
            iconSize={36}
          />
          <Link href="/" className="text-white hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold">Our Blog</h1>
          <p className="mt-4 opacity-90">Latest insights on YouTube automation with AI</p>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogListPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <p className="text-sm text-gray-500 mb-2">
                {post.date} · {post.readTime}
              </p>
              <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <p className="text-gray-500 text-sm mb-4">By YouTube Automation AI Team</p>
              <Link
                href={`/blog/${post.id}`}
                className="text-red-600 font-semibold hover:text-red-700"
              >
                Read Full Article →
              </Link>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 YouTube Automation AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
