import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "The Future of YouTube Automation with AI",
    excerpt: "Discover how AI is revolutionizing YouTube content creation and channel management.",
    content: `
      Artificial Intelligence is transforming how we create, manage, and grow YouTube channels. 
      
      From AI-powered video editing to automated thumbnail generation, the possibilities are endless. 
      
      In this comprehensive guide, we'll explore the cutting-edge tools and strategies that are changing the game for YouTube creators.
    `,
    date: "January 28, 2026",
    readTime: "8 min read",
    author: "AI Expert Team"
  },
  {
    id: 2,
    title: "10 AI Tools Every YouTuber Needs in 2024",
    excerpt: "A comprehensive guide to the best AI tools for automating your YouTube workflow.",
    content: `
      Whether you're a beginner or a seasoned creator, these AI tools will save you hours of work:
      
      1. ChatGPT - Script writing and idea generation
      2. Midjourney - AI thumbnail creation
      3. Descript - AI video editing
      4. Opus Clip - AI video clipping for Shorts
      5. And more...
    `,
    date: "January 25, 2026",
    readTime: "12 min read",
    author: "Tech Review Team"
  },
  {
    id: 3,
    title: "How to Scale Your YouTube Channel to 100K Subscribers Using AI",
    excerpt: "Step-by-step strategies for growing your channel with AI-powered automation.",
    content: `
      Growing a YouTube channel takes time and consistency. But with AI automation, 
      you can significantly speed up the process.
      
      In this guide, we'll cover:
      - AI-powered content planning
      - Automated publishing schedules
      - AI-driven audience analysis
      - And much more!
    `,
    date: "January 22, 2026",
    readTime: "15 min read",
    author: "Growth Specialist"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
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
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <p className="text-sm text-gray-500 mb-2">{post.date} · {post.readTime}</p>
              <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <p className="text-gray-400 text-sm mb-4">By {post.author}</p>
              <button className="text-red-600 font-semibold hover:text-red-700">
                Read Full Article →
              </button>
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
