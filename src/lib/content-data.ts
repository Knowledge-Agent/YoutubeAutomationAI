export type VideoItem = {
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
};

export type BlogListItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
};

export type BlogDetailItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  thumbnail: string;
  slug: string;
  content: string;
  relatedVideos: string[];
};

export type VideoDetailItem = VideoItem & {
  fullDescription: string;
  methodology: string[];
  keyTakeaways: string[];
  tools: string[];
  prerequisites: string[];
  estimatedIncome: string;
  chapters: { time: string; title: string }[];
};

export const videos: VideoItem[] = [
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
    description:
      "Romayroh shares his incredible journey of building 4 faceless YouTube channels from scratch and earning over $1.62 million.",
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
    description:
      "The most comprehensive YouTube Automation course available, covering everything from basics to advanced strategies with 37 detailed chapters.",
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
    description:
      "The latest 2026 guide to starting a faceless YouTube channel using AI tools. Practical 13-chapter course with step-by-step instructions.",
  },
  {
    id: "4",
    title:
      "How To Start a Faceless YouTube Channel That Makes Money in 2026 (Beginner Tutorial)",
    channel: "Joshua Mayo",
    youtubeId: "GR0glLLc4SU",
    duration: "33:00",
    publishDate: "2026-01-15",
    category: "Growth",
    views: "100K",
    difficulty: "Beginner",
    cpm: "$10-18",
    description:
      "Joshua Mayo shares his personal one-year experiment results, providing a detailed tutorial on building a profitable faceless channel.",
  },
  {
    id: "5",
    title:
      "How to Start YouTube Automation in 2026 (Step By Step) NO FACE | FREE COURSE",
    channel: "Make Money Matt",
    youtubeId: "J-suhuECjBw",
    duration: "1:36:00",
    publishDate: "2026-01-15",
    category: "Business Model",
    views: "36K",
    difficulty: "Beginner",
    cpm: "$8-15",
    description:
      "A completely free comprehensive course revealing the new approach to YouTube Automation with detailed chapters.",
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
    description:
      "An incredible case study of building a YouTube channel from zero to viral in just 7 days using AI tools.",
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
    description:
      "A practical tutorial on using InVideo AI to create successful faceless YouTube content from prompt to final export.",
  },
  {
    id: "8",
    title:
      "How to Make ORIGINAL Faceless YouTube Channels with AI [FULLY AUTOMATED]",
    channel: "Leo Grundström",
    youtubeId: "YnASDGOMvFo",
    duration: "20:00",
    publishDate: "2024-11-29",
    category: "AI Tools",
    views: "7.8K",
    difficulty: "Advanced",
    cpm: "$10-18",
    description:
      "Advanced guide to creating fully automated, original faceless YouTube channels using cutting-edge AI tools.",
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
    description:
      "Complete guide to creating stunning 3D animation videos using AI tools for YouTube automation.",
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
    description:
      "Lightning-fast tutorial on creating faceless videos in under 5 minutes using AI tools.",
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
    description:
      "Complete step-by-step YouTube Automation course from basics to advanced strategies.",
  },
  {
    id: "12",
    title:
      "Faceless YouTube Automation: How To Make Money Without Showing Your Face",
    channel: "Marketing Tips",
    youtubeId: "EyXNKb2HsfM",
    duration: "10:19",
    publishDate: "2024-09-20",
    category: "Business Model",
    views: "44K",
    difficulty: "Beginner",
    cpm: "$8-12",
    description:
      "Detailed guide on building passive income through faceless YouTube Automation.",
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
    description:
      "Comprehensive review of AI tools that actually work for YouTube Automation.",
  },
];

export const blogListPosts: BlogListItem[] = [
  {
    id: "1",
    title: "What is YouTube Automation? A Complete Beginner's Guide",
    excerpt:
      "Learn everything about YouTube Automation, from basic concepts to advanced strategies.",
    date: "January 28, 2026",
    readTime: "15 min read",
    category: "Getting Started",
  },
  {
    id: "2",
    title: "Best YouTube Automation Niches for 2026 - High CPM Analysis",
    excerpt:
      "Data-driven analysis of the most profitable niches based on CPM and growth potential.",
    date: "January 27, 2026",
    readTime: "12 min read",
    category: "Niches",
  },
  {
    id: "3",
    title: "AI Tools for YouTube Automation - Complete 2026 Guide",
    excerpt:
      "The most comprehensive guide to AI tools that actually work for YouTube Automation.",
    date: "January 26, 2026",
    readTime: "18 min read",
    category: "AI Tools",
  },
];

export const videoIdToYoutubeId: Record<string, string> = Object.fromEntries(
  videos.map((video) => [video.id, video.youtubeId])
);

export const blogIds = blogListPosts.map((post) => post.id);
export const videoIds = videos.map((video) => video.id);
