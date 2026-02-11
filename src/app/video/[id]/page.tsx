import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteLogo from "@/components/SiteLogo";
import { siteUrl } from "@/lib/site";
import { formatIso8601Duration } from "@/lib/seo";

// Detailed video pages with comprehensive information
const videos: Record<string, {
  id: string;
  title: string;
  channel: string;
  youtubeId: string;
  duration: string;
  publishDate: string;
  category: string;
  views: string;
  difficulty: string;
  cpm: string;
  description: string;
  fullDescription: string;
  methodology: string[];
  keyTakeaways: string[];
  tools: string[];
  prerequisites: string[];
  estimatedIncome: string;
  chapters: { time: string; title: string }[];
}> = {
  "1": {
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
    fullDescription: `In this comprehensive guide, Romayroh reveals the exact strategies and systems he used to build multiple successful faceless YouTube channels. He breaks down his journey from zero to over $1.62 million in earnings.

**What You'll Learn:**
- How to identify profitable niches for faceless content
- The exact setup process for a new automation channel
- AI tools and workflows that scale content production
- How to avoid common mistakes that kill channels
- Strategies for multi-channel diversification`,
    methodology: [
      "Market Research & Niche Selection: Analyze competition, validate demand",
      "Channel Setup & Branding: Create professional channel art, optimize descriptions",
      "Content Strategy Development: Define content pillars, establish posting schedule",
      "AI-Powered Production Pipeline: Implement ChatGPT for scripts, Midjourney for thumbnails",
      "Quality Control & Optimization: Review analytics, A/B test thumbnails"
    ],
    keyTakeaways: [
      "Faceless channels can generate substantial income when executed correctly",
      "AI tools dramatically reduce production time and costs",
      "Niche selection is the single most important factor for success",
      "Consistency and patience are more important than viral hits",
      "Data-driven optimization leads to sustainable growth"
    ],
    tools: ["ChatGPT", "Midjourney", "InVideo AI", "TubeBuddy", "VidIQ", "Canva", "CapCut"],
    prerequisites: ["Basic computer skills", "Willingness to learn", "3-6 months commitment"],
    estimatedIncome: "$1,000-5,000/month after 6 months",
    chapters: [
      { time: "0:00", title: "Introduction & Background" },
      { time: "3:24", title: "Niche Selection Strategy" },
      { time: "7:15", title: "Channel Setup Process" },
      { time: "10:45", title: "AI Tools & Workflow" },
      { time: "13:30", title: "Scaling & Diversification" }
    ]
  },
  "2": {
    id: "2",
    title: "YouTube Automation Full Course | Complete GUIDE to YouTube Automation",
    channel: "Saad Rashid",
    youtubeId: "GKkU1smMGiA",
    duration: "5:30:00",
    publishDate: "2024-10-29",
    category: "Complete Course",
    views: "670K",
    difficulty: "Intermediate",
    cpm: "$10-25",
    description: "The most comprehensive YouTube Automation course available, covering everything from basics to advanced strategies.",
    fullDescription: `This extensive 5.5-hour course covers every aspect of YouTube Automation.

**Course Structure:**

**Module 1: Fundamentals**
- What is YouTube Automation and how it works
- Understanding the YouTube algorithm
- Case studies of successful automation channels

**Module 2: Niche Selection**
- Importance of choosing the right niche
- Niche selection methodology
- Analyzing competitors and market demand

**Module 3: Channel Setup**
- USA-based channel setup for maximum CPM
- Brand identity and channel art
- Optimizing channel sections and playlists`,
    methodology: [
      "Foundation Building: Master the fundamentals before diving into production",
      "Strategic Niche Selection: Data-driven approach to niche selection",
      "Systematic Production: Create standardized templates and workflows",
      "Optimization Loop: Continuously improve based on analytics",
      "Scale and Diversify: Expand to multiple channels and content types"
    ],
    keyTakeaways: [
      "Complete end-to-end YouTube Automation methodology",
      "37 chapters covering all critical topics in depth",
      "Practical tools and resources list with direct application",
      "Detailed discussion on AI content viability"
    ],
    tools: ["ChatGPT", "Midjourney", "CapCut", "TubeBuddy", "Canva", "VidIQ"],
    prerequisites: ["Basic understanding of YouTube", "Commitment to learning"],
    estimatedIncome: "$2,000-10,000/month with dedicated implementation",
    chapters: [
      { time: "0:00", title: "Introduction: What is YouTube Automation" },
      { time: "15:00", title: "Case Studies & Proof" },
      { time: "45:00", title: "Module 1: Fundamentals" },
      { time: "1:15:00", title: "Module 2: Niche Selection" },
      { time: "2:30:00", title: "Module 3: Channel Setup" },
      { time: "3:45:00", title: "Module 4: Video Packaging" }
    ]
  },
  "3": {
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
    description: "The latest 2026 guide to starting a faceless YouTube channel using AI tools.",
    fullDescription: `This cutting-edge course represents the latest thinking in YouTube Automation for 2026.

**What Makes This Course Different:**
- 2026-specific strategies and tool recommendations
- Focus on efficiency and automation
- Practical Discord community support`,
    methodology: [
      "AI-First Approach: Leverage AI tools at every stage",
      "Efficiency Optimization: Design workflows for maximum output",
      "Quality Assurance: Implement review processes",
      "Continuous Learning: Stay updated with AI landscape"
    ],
    keyTakeaways: [
      "2026's most current AI-driven methodologies",
      "Detailed 13-chapter curriculum with actionable steps",
      "Complete beginner's guide from setup to monetization"
    ],
    tools: ["ChatGPT Plus", "Midjourney", "ElevenLabs", "InVideo AI", "Canva AI"],
    prerequisites: ["No prior experience needed", "Basic computer literacy"],
    estimatedIncome: "$500-3,000/month after 3-4 months",
    chapters: [
      { time: "0:00", title: "Welcome & Course Overview" },
      { time: "5:30", title: "AI Tools Landscape 2026" },
      { time: "12:00", title: "Niche Selection Method" },
      { time: "20:00", title: "Channel Setup Guide" },
      { time: "30:00", title: "AI Script Generation" },
      { time: "42:00", title: "Voiceover Options" },
      { time: "52:00", title: "Video Creation Workflow" }
    ]
  },
  "4": {
    id: "4",
    title: "How To Start a Faceless YouTube Channel That Makes Money in 2026",
    channel: "Joshua Mayo",
    youtubeId: "GR0glLLc4SU",
    duration: "33:00",
    publishDate: "2026-01-15",
    category: "Growth",
    views: "100K",
    difficulty: "Beginner",
    cpm: "$10-18",
    description: "Joshua Mayo shares his personal one-year experiment results on building a profitable faceless channel.",
    fullDescription: `This isn't just theory - Joshua Mayo provides actual data from his year-long experiment.

**The Experiment:**
- 12-month timeline with real results
- Honest assessment of challenges faced
- Data-driven decision making process`,
    methodology: [
      "Data-Driven Decision Making: Base every decision on actual performance data",
      "Framework-Based Approach: Use the 3-Question Framework",
      "Iterative Improvement: Continuously refine approach based on results"
    ],
    keyTakeaways: [
      "Real experimental data from a full year of testing",
      "10 different profitable niches explained",
      "Complete thumbnail and title optimization guide"
    ],
    tools: ["ChatGPT", "Midjourney", "Final Cut Pro", "TubeBuddy", "Canva"],
    prerequisites: ["No experience required", "Willingness to experiment"],
    estimatedIncome: "$1,000-4,000/month after consistent 6-month effort",
    chapters: [
      { time: "0:00", title: "Introduction: My 1-Year Experiment" },
      { time: "4:00", title: "The 3-Question Framework" },
      { time: "10:00", title: "10 Profitable Niches" },
      { time: "20:00", title: "Channel Setup" },
      { time: "25:00", title: "5-Step Production Process" }
    ]
  },
  "5": {
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
    description: "A completely free comprehensive course revealing the new approach to YouTube Automation.",
    fullDescription: `Make Money Matt delivers exceptional value with this free course.

**Course Philosophy:**
YouTube Automation is not "set it and forget it." The real skill is building repeatable systems.`,
    methodology: [
      "Business-First Mindset: Treat YouTube Automation as a real business",
      "Systematic Approach: Build systems that produce consistent results",
      "AI Integration: Leverage AI for efficiency"
    ],
    keyTakeaways: [
      "11 comprehensive chapters of free content",
      "2026's most current strategies and methods",
      "Complete Q&A section"
    ],
    tools: ["AI Tools Suite", "YouTube Studio", "Analytics", "ChatGPT"],
    prerequisites: ["Basic motivation", "Willingness to learn"],
    estimatedIncome: "$500-2,000/month after 4-6 months",
    chapters: [
      { time: "0:00", title: "Starting a Faceless Business" },
      { time: "12:00", title: "A Different Approach" },
      { time: "40:00", title: "Secret 1: Best Business" },
      { time: "55:00", title: "Secret 2: Best Niches" },
      { time: "85:00", title: "Monetization" }
    ]
  },
  "6": {
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
    fullDescription: `Jack Craig documents his remarkable journey of building a faceless YouTube channel from complete scratch to viral success in just one week.`,
    methodology: [
      "Rapid Validation: Test concepts quickly before full commitment",
      "AI-Powered Speed: Use AI tools to compress production timeline",
      "Trend Leverage: Capitalize on current trends and topics"
    ],
    keyTakeaways: [
      "7-day viral case study with real results",
      "Complete walkthrough from zero to viral",
      "AI animation techniques that work"
    ],
    tools: ["AI Animation Tools", "Video Editing Software", "Analytics", "ChatGPT"],
    prerequisites: ["Some content creation experience", "Fast implementation capability"],
    estimatedIncome: "Varies by channel performance",
    chapters: [
      { time: "0:00", title: "Day 1: Starting from Zero" },
      { time: "5:00", title: "Niche Validation" },
      { time: "10:00", title: "Channel Setup" },
      { time: "15:00", title: "Day 2-4: Production Sprint" },
      { time: "22:00", title: "AI Animation Techniques" },
      { time: "27:00", title: "Day 5-6: Optimization" }
    ]
  },
  "7": {
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
    description: "A practical tutorial on using InVideo AI to create successful faceless YouTube content.",
    fullDescription: `Youri van Hofwegen provides a hands-on demonstration of using InVideo AI to create faceless YouTube videos.`,
    methodology: [
      "Tool Mastery: Deep understanding of InVideo AI capabilities",
      "Prompt Engineering: Crafting effective prompts",
      "Iterative Refinement: Improving AI output through editing"
    ],
    keyTakeaways: [
      "Complete InVideo AI tutorial from start to finish",
      "Clear step-by-step process",
      "Beginner-friendly approach"
    ],
    tools: ["InVideo AI", "ChatGPT", "Video Editing Tools"],
    prerequisites: ["No prior experience needed"],
    estimatedIncome: "$200-1,000/month with consistent effort",
    chapters: [
      { time: "0:00", title: "Introduction" },
      { time: "2:00", title: "InVideo AI Setup" },
      { time: "5:00", title: "Prompt Engineering" },
      { time: "8:00", title: "Customization" },
      { time: "11:00", title: "Export & Publish" }
    ]
  },
  "8": {
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
    fullDescription: `Leo Grundström takes YouTube Automation to the next level with this fully automated approach.`,
    methodology: [
      "Full Automation: Implement truly automated content production pipeline",
      "Originality Focus: Ensure AI-generated content provides unique value",
      "Scalable Systems: Design workflows that grow with your channel"
    ],
    keyTakeaways: [
      "Fully automated production methodology",
      "One-click video generation techniques",
      "Originality at scale approach"
    ],
    tools: ["AI Video Generators", "Thumbnail Design Services", "Team Collaboration"],
    prerequisites: ["Intermediate YouTube experience", "Basic AI tool knowledge"],
    estimatedIncome: "$2,000-8,000/month with full automation",
    chapters: [
      { time: "0:00", title: "Introduction" },
      { time: "5:00", title: "The New AI Tool" },
      { time: "10:00", title: "Original Content Creation" },
      { time: "15:00", title: "Scaling with Team" }
    ]
  },
  "9": {
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
    fullDescription: `BigStepsMedia reveals the secrets behind creating professional-quality 3D animation videos using AI tools.`,
    methodology: [
      "Visual Excellence: Prioritize stunning visuals to stand out",
      "Niche Discovery: Find profitable 3D animation topics",
      "Professional Quality: Apply industry-standard polish"
    ],
    keyTakeaways: [
      "8 detailed chapters of 3D animation mastery",
      "Professional 3D video creation techniques",
      "Niche discovery methodology"
    ],
    tools: ["3D AI Tools", "Videotok", "Canva", "Video Editing Software"],
    prerequisites: ["Basic video editing skills", "Understanding of visual aesthetics"],
    estimatedIncome: "$1,500-5,000/month with professional 3D content",
    chapters: [
      { time: "0:00", title: "Viral Niche Discovery" },
      { time: "3:00", title: "What You'll Learn" },
      { time: "5:00", title: "My Niche Journey" },
      { time: "8:00", title: "Channel Setup" },
      { time: "10:00", title: "Video Creation" }
    ]
  },
  "10": {
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
    fullDescription: `Anik Singal demonstrates the incredible speed at which AI tools can create faceless YouTube content.`,
    methodology: [
      "Speed Optimization: Design workflow for maximum efficiency",
      "Minimal Viable Product: Create acceptable quality in shortest time"
    ],
    keyTakeaways: [
      "5-minute video creation speed",
      "Perfect for rapid testing",
      "Shorts format optimization"
    ],
    tools: ["AI Video Tools", "Shorts Optimization", "Quick Editing Tools"],
    prerequisites: ["No experience needed"],
    estimatedIncome: "Varies by niche and volume",
    chapters: [
      { time: "0:00", title: "The 5-Minute Method" },
      { time: "30s", title: "Tool Setup" },
      { time: "1:00", title: "Complete Demo" }
    ]
  },
  "11": {
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
    fullDescription: `A comprehensive course covering all aspects of YouTube Automation from initial setup to advanced optimization.`,
    methodology: [
      "Structured Learning: Progressive skill building from fundamentals to advanced",
      "Practical Application: Every concept tied to actionable implementation"
    ],
    keyTakeaways: [
      "Complete end-to-end tutorial",
      "Suitable for complete beginners",
      "Step-by-step implementation"
    ],
    tools: ["YouTube Studio", "AI Tools", "Analytics"],
    prerequisites: ["No prior knowledge"],
    estimatedIncome: "$500-2,000/month",
    chapters: [
      { time: "0:00", title: "Introduction" },
      { time: "1:00", title: "What is YouTube Automation" },
      { time: "2:00", title: "Getting Started" },
      { time: "3:00", title: "Channel Setup" },
      { time: "4:00", title: "Content Creation" }
    ]
  },
  "12": {
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
    fullDescription: `Learn how to build a sustainable passive income stream using YouTube Automation.`,
    methodology: [
      "Systematic Design: Build sustainable, self-running content operations",
      "Automation Priority: Minimize active time while maintaining output"
    ],
    keyTakeaways: [
      "Passive income model explained",
      "Systematic operations approach",
      "Long-term sustainability focus"
    ],
    tools: ["Analytics", "Monetization Tools", "Automation Software"],
    prerequisites: ["Basic understanding", "Patience for setup"],
    estimatedIncome: "$1,000-3,000/month passive",
    chapters: [
      { time: "0:00", title: "Passive Income Model" },
      { time: "3:00", title: "System Building" },
      { time: "6:00", title: "Monetization" },
      { time: "9:00", title: "Long-term Success" }
    ]
  },
  "13": {
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
    fullDescription: `A practical review of AI tools available for YouTube Automation in 2024.`,
    methodology: [
      "Honest Assessment: Real evaluation of tool capabilities and limitations",
      "Practical Testing: Hands-on experience with each tool"
    ],
    keyTakeaways: [
      "Practical tool recommendations",
      "Avoiding expensive mistakes",
      "Selection guidance"
    ],
    tools: ["ChatGPT", "Midjourney", "InVideo AI", "CapCut", "ElevenLabs"],
    prerequisites: ["Basic tech skills"],
    estimatedIncome: "Tools efficiency impact only",
    chapters: [
      { time: "0:00", title: "Tool Landscape" },
      { time: "5:00", title: "Script Tools" },
      { time: "10:00", title: "Video Tools" },
      { time: "15:00", title: "Voice & Thumbnail" }
    ]
  }
};

const videoIds = Object.keys(videos);

export const dynamicParams = false;

export function generateStaticParams() {
  return videoIds.map((id) => ({ id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const video = videos[params.id];

  if (!video) {
    return {
      title: "Video Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${video.title} | ${video.channel}`,
    description: video.description,
    alternates: {
      canonical: `/video/${video.id}/`,
    },
    openGraph: {
      type: "video.other",
      title: video.title,
      description: video.description,
      url: `/video/${video.id}/`,
      images: [
        {
          url: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
          alt: video.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.description,
      images: [`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`],
    },
  };
}

export default function VideoPage({ params }: { params: { id: string } }) {
  const video = videos[params.id];
  
  if (!video) {
    notFound();
  }

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    uploadDate: video.publishDate,
    duration: formatIso8601Duration(video.duration),
    thumbnailUrl: [`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`],
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    publisher: {
      "@type": "Organization",
      name: "YouTube Automation AI",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo-512.png`,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-800 text-white py-8">
        <div className="container mx-auto px-4">
          <SiteLogo
            href="/"
            className="mb-4"
            textClassName="text-xl md:text-2xl text-white"
            iconSize={34}
          />
          <Link href="/" className="text-white hover:underline mb-4 inline-block">
            ← Back to Videos
          </Link>
          <span className="inline-block bg-red-500 text-xs px-2 py-1 rounded-full mb-2">
            {video.category}
          </span>
          <p className="text-sm opacity-90">{video.channel} • {video.views} views</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{video.title}</h1>
          <div className="flex gap-4 mt-2 text-sm opacity-90">
            <span>{video.duration}</span>
            <span>•</span>
            <span>{video.publishDate}</span>
            <span>•</span>
            <span>Difficulty: {video.difficulty}</span>
            <span>•</span>
            <span>CPM: {video.cpm}</span>
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-colors"
          >
            Watch on YouTube ↗
          </a>
        </div>
      </header>

      {/* Video Player */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Overview */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">{video.description}</p>
          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <p className="text-gray-700">{video.fullDescription}</p>
          </div>
        </section>

        {/* Course Chapters */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Course Chapters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {video.chapters.map((chapter, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="flex-shrink-0 w-16 h-8 bg-red-600 text-white rounded flex items-center justify-center font-bold text-sm mr-4">
                  {chapter.time}
                </span>
                <span className="text-gray-700">{chapter.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Methodology & Key Steps</h2>
          <div className="space-y-4">
            {video.methodology.map((step, index) => (
              <div key={index} className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  {index + 1}
                </span>
                <p className="text-gray-700 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Key Takeaways</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {video.keyTakeaways.map((takeaway, index) => (
              <div key={index} className="flex items-center">
                <span className="text-red-600 mr-2 text-xl">✓</span>
                <p className="text-gray-700">{takeaway}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Recommended Tools</h2>
          <div className="flex flex-wrap gap-3">
            {video.tools.map((tool, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium"
              >
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* Prerequisites & Income */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Prerequisites</h2>
            <ul className="space-y-2">
              {video.prerequisites?.map((prereq, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="text-red-600 mr-2">•</span>
                  {prereq}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Estimated Income</h2>
            <p className="text-gray-700 text-lg">{video.estimatedIncome}</p>
            <p className="text-gray-500 text-sm mt-2">* Results may vary based on niche, effort, and market conditions</p>
          </section>
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
