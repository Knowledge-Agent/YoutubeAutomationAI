import Link from "next/link";

// SEO-optimized metadata
export const metadata = {
  title: "YouTube Automation AI - Complete Guide to Faceless YouTube Channels",
  description: "Master YouTube Automation with our comprehensive guide. Learn how to build profitable faceless YouTube channels using AI tools, scripts, and automation strategies.",
  keywords: "YouTube Automation, faceless YouTube channel, AI video creation, passive income, YouTube automation business, YouTube automation course",
};

// Comprehensive YouTube Automation Videos
const videos = [
  {
    id: "1",
    title: "$1,620,985 With 4 Faceless Channels - YouTube Automation Guide For Beginners",
    channel: "Romayroh",
    youtubeId: "lag7d1pPKKs",
    duration: "15:48",
    publishDate: "2024-12-29",
    category: "Getting Started",
    views: "27K",
    difficulty: "Beginner",
    cpm: "$8-15",
    description: "Romayroh shares his incredible journey of building 4 faceless YouTube channels from scratch and earning over $1.62 million.",
  },
  {
    id: "2",
    title: "YouTube Automation Full Course | Complete GUIDE to YouTube Automation",
    channel: "Saad Rashid - YouTube Automation",
    youtubeId: "GKkU1smMGiA",
    duration: "5:30:00",
    publishDate: "2024-10-29",
    category: "Complete Course",
    views: "670K",
    difficulty: "Intermediate",
    cpm: "$10-25",
    description: "The most comprehensive YouTube Automation course available, covering everything from basics to advanced strategies with 37 detailed chapters.",
  },
  {
    id: "3",
    title: "How to Actually Start a Faceless YouTube Channel with AI [2026 FULL COURSE]",
    channel: "Syrax and ProfitProfiles",
    youtubeId: "lmXpX56BkL4",
    duration: "1:10:00",
    publishDate: "2026-01-19",
    category: "AI Tools",
    views: "35K",
    difficulty: "Beginner",
    cpm: "$8-20",
    description: "The latest 2026 guide to starting a faceless YouTube channel using AI tools. Practical 13-chapter course with step-by-step instructions.",
  },
  {
    id: "4",
    title: "How To Start a Faceless YouTube Channel That Makes Money in 2026 (Beginner Tutorial)",
    channel: "Joshua Mayo",
    youtubeId: "GR0glLLc4SU",
    duration: "33:00",
    publishDate: "2026-01-15",
    category: "Growth",
    views: "100K",
    difficulty: "Beginner",
    cpm: "$10-18",
    description: "Joshua Mayo shares his personal one-year experiment results, providing a detailed tutorial on building a profitable faceless channel.",
  },
  {
    id: "5",
    title: "How to Start YouTube Automation in 2026 (Step By Step) NO FACE | FREE COURSE",
    channel: "Make Money Matt",
    youtubeId: "J-suhuECjBw",
    duration: "1:36:00",
    publishDate: "2026-01-15",
    category: "Business Model",
    views: "36K",
    difficulty: "Beginner",
    cpm: "$8-15",
    description: "A completely free comprehensive course revealing the new approach to YouTube Automation with detailed chapters.",
  },
  {
    id: "6",
    title: "I BLEW UP a YouTube Channel in 7 Days with AI",
    channel: "Jack Craig",
    youtubeId: "1r0eyM7suUg",
    duration: "31:00",
    publishDate: "2024-11-29",
    category: "Case Study",
    views: "1.07M",
    difficulty: "Intermediate",
    cpm: "$12-20",
    description: "An incredible case study of building a YouTube channel from zero to viral in just 7 days using AI tools.",
  },
  {
    id: "7",
    title: "How to Start a Faceless YouTube Channel with AI",
    channel: "Youri van Hofwegen",
    youtubeId: "pXPu3hAR2zE",
    duration: "12:54",
    publishDate: "2024-01-29",
    category: "Getting Started",
    views: "340K",
    difficulty: "Beginner",
    cpm: "$6-12",
    description: "A practical tutorial on using InVideo AI to create successful faceless YouTube content from prompt to final export.",
  },
  {
    id: "8",
    title: "How to Make ORIGINAL Faceless YouTube Channels with AI [FULLY AUTOMATED]",
    channel: "Leo Grundström",
    youtubeId: "YnASDGOMvFo",
    duration: "20:00",
    publishDate: "2024-11-29",
    category: "AI Tools",
    views: "7.8K",
    difficulty: "Advanced",
    cpm: "$10-18",
    description: "Advanced guide to creating fully automated, original faceless YouTube channels using cutting-edge AI tools.",
  },
  {
    id: "9",
    title: "How I Create AMAZING 3D Animation Videos Using AI Tools",
    channel: "BigStepsMedia",
    youtubeId: "BA1d3rAPYYE",
    duration: "11:34",
    publishDate: "2024-10-29",
    category: "Video Production",
    views: "120K",
    difficulty: "Intermediate",
    cpm: "$12-25",
    description: "Complete guide to creating stunning 3D animation videos using AI tools for YouTube automation.",
  },
  {
    id: "10",
    title: "How To Use AI To Make Faceless Videos In Less Than 5 Minutes",
    channel: "Anik Singal",
    youtubeId: "O43etudFDBc",
    duration: "1:00",
    publishDate: "2024-01-29",
    category: "Quick Tips",
    views: "1.12M",
    difficulty: "Beginner",
    cpm: "$8-15",
    description: "Lightning-fast tutorial on creating faceless videos in under 5 minutes using AI tools.",
  },
  {
    id: "11",
    title: "YouTube Automation Course - Complete Step By Step Tutorial",
    channel: "Online Business Academy",
    youtubeId: "iLo2aBw0AV8",
    duration: "5:57",
    publishDate: "2024-08-15",
    category: "Complete Course",
    views: "89K",
    difficulty: "Beginner",
    cpm: "$8-15",
    description: "Complete step-by-step YouTube Automation course from basics to advanced strategies.",
  },
  {
    id: "12",
    title: "Faceless YouTube Automation: How To Make Money Without Showing Your Face",
    channel: "Marketing Tips",
    youtubeId: "EyXNKb2HsfM",
    duration: "10:19",
    publishDate: "2024-09-20",
    category: "Business Model",
    views: "44K",
    difficulty: "Beginner",
    cpm: "$8-12",
    description: "Detailed guide on building passive income through faceless YouTube Automation.",
  },
  {
    id: "13",
    title: "AI Tools For YouTube Automation That Actually Work In 2024",
    channel: "Tech Review Pro",
    youtubeId: "pXPu3hAR2zE",
    duration: "18:22",
    publishDate: "2024-07-10",
    category: "AI Tools",
    views: "67K",
    difficulty: "Intermediate",
    cpm: "$10-18",
    description: "Comprehensive review of AI tools that actually work for YouTube Automation.",
  }
];

// Blog posts data
const blogPosts = [
  {
    id: "1",
    title: "What is YouTube Automation? A Complete Beginner's Guide",
    excerpt: "Learn everything about YouTube Automation, from basic concepts to advanced strategies.",
    date: "January 28, 2026",
    readTime: "15 min read",
    category: "Getting Started"
  },
  {
    id: "2",
    title: "Best YouTube Automation Niches for 2026 - High CPM Analysis",
    excerpt: "Data-driven analysis of the most profitable niches based on CPM and growth potential.",
    date: "January 27, 2026",
    readTime: "12 min read",
    category: "Niches"
  },
  {
    id: "3",
    title: "AI Tools for YouTube Automation - Complete 2026 Guide",
    excerpt: "The most comprehensive guide to AI tools that actually work for YouTube Automation.",
    date: "January 26, 2026",
    readTime: "18 min read",
    category: "AI Tools"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            YouTube Automation AI
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl">
            Master the art of faceless YouTube channels with AI tools, 
            automation strategies, and proven methodologies.
          </p>
          <div className="flex gap-4">
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
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
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
                  <div className="flex justify-between text-xs text-gray-400">
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
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.id}`}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full mb-3">
                  {post.category}
                </span>
                <h3 className="font-bold text-gray-800 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between text-xs text-gray-400">
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
          <h2 className="text-3xl font-bold mb-6">About This Resource</h2>
          <p className="text-gray-600 text-lg mb-8">
            YouTube Automation AI is your comprehensive guide to building profitable 
            faceless YouTube channels using artificial intelligence and automation tools.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-xl mb-3">Learn</h3>
              <p className="text-gray-600 text-sm">
                Master the fundamentals and advanced strategies of YouTube Automation.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-xl mb-3">Create</h3>
              <p className="text-gray-600 text-sm">
                Use AI tools to produce high-quality content efficiently and at scale.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-xl mb-3">Earn</h3>
              <p className="text-gray-600 text-sm">
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
          <p className="text-gray-500 text-sm mt-2">
            Built with Next.js and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
