import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteLogo from "@/components/SiteLogo";
import { blogListPosts, videos } from "@/lib/content-data";
import { siteUrl } from "@/lib/site";

// SEO-optimized metadata
export const metadata: Metadata = {
  title: "YouTube Automation AI - Complete Guide to Faceless YouTube Channels",
  description:
    "Master YouTube Automation with our comprehensive guide. Learn how to build profitable faceless YouTube channels using AI tools, scripts, and automation strategies.",
  keywords: [
    "YouTube Automation",
    "faceless YouTube channel",
    "AI video creation",
    "passive income",
    "YouTube automation business",
    "YouTube automation course",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "YouTube Automation AI - Complete Guide to Faceless YouTube Channels",
    description:
      "Master YouTube Automation with our comprehensive guide. Learn how to build profitable faceless YouTube channels using AI tools, scripts, and automation strategies.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube Automation AI homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Automation AI - Complete Guide to Faceless YouTube Channels",
    description:
      "Master YouTube Automation with our comprehensive guide. Learn how to build profitable faceless YouTube channels using AI tools, scripts, and automation strategies.",
    images: ["/og-image.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "YouTube Automation AI",
  url: siteUrl,
  logo: `${siteUrl}/logo-512.png`,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "YouTube Automation AI",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <SiteLogo
            href="/"
            className="mb-6"
            textClassName="text-2xl md:text-3xl text-white"
            iconSize={44}
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            YouTube Automation AI
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl">
            Master the art of faceless YouTube channels with AI tools,
            automation strategies, and proven methodologies.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="#videos"
              className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Videos
            </a>
            <a
              href="#blog"
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
            >
              Read Blog
            </a>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-12 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-red-600">13</p>
              <p className="text-gray-600">Curated Videos</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">3</p>
              <p className="text-gray-600">In-Depth Guides</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">10+</p>
              <p className="text-gray-600">AI Tools Covered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">$50K+</p>
              <p className="text-gray-600">Potential Monthly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link
                key={video.id}
                href={`/video/${video.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gray-200 relative">
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
                    width={480}
                    height={270}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 text-xs rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="p-4">
                  <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full mb-2">
                    {video.category}
                  </span>
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{video.channel}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{video.views} views</span>
                    <span>{video.difficulty}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Blog Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogListPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full mb-3">
                  {post.category}
                </span>
                <h3 className="font-bold text-gray-800 mb-3">{post.title}</h3>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Resource</h2>
          <p className="text-gray-700 text-lg mb-8">
            YouTube Automation AI is your comprehensive guide to building profitable
            faceless YouTube channels using artificial intelligence and automation tools.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-xl text-gray-900 mb-3">Learn</h3>
              <p className="text-gray-700 text-sm">
                Master the fundamentals and advanced strategies of YouTube Automation.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-xl text-gray-900 mb-3">Create</h3>
              <p className="text-gray-700 text-sm">
                Use AI tools to produce high-quality content efficiently and at scale.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-xl text-gray-900 mb-3">Earn</h3>
              <p className="text-gray-700 text-sm">
                Build sustainable passive income through automated content creation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 YouTube Automation AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
