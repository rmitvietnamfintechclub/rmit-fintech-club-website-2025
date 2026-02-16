import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "../app/(backend)/models/event"; 

// Load env vars
dotenv.config({ path: ".env" }); 

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const mockEvents = [
  // 1. Flagship Hackathon (Hybrid - Major Event)
  {
    name: "RMIT FinTech Hackathon 2026",
    description: "The largest annual hackathon for students passionate about financial technology. Join us for 48 hours of innovation, coding, and networking to solve real-world financial challenges.",
    // Tech/Coding vibes
    posterUrl: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1000",
    date: new Date("2026-05-20"), 
    startTime: "08:00",
    endTime: "18:00",
    mode: "Hybrid",
    location: "RMIT SGS Campus & Discord",
    audience: ["Students", "Startups", "Developers"],
    agenda: [
      "08:00 - Check-in & Networking",
      "09:00 - Opening Ceremony",
      "10:00 - Hacking Begins",
      "18:00 - Day 1 Wrap up"
    ],
    guest_speaker: [
      {
        name: "Alex Johnson",
        bio: "CTO at TechInno, 10+ years in Blockchain development.",
        avatar_url: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff&size=256",
        linkedIn_url: "https://linkedin.com/in/alexjohnson"
      },
      {
        name: "Sarah Jenkins",
        bio: "Product Manager at GlobalBank.",
        avatar_url: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random&size=256",
      }
    ],
    // Real logos from Wikimedia
    partners: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png"
    ],
    registrationLink: "https://forms.google.com/hackathon2026",
    registrationDeadline: new Date("2026-05-15")
  },

  // 2. Webinar (Online - Educational)
  {
    name: "Webinar: AI in Quantitative Finance",
    description: "Explore how Artificial Intelligence and Machine Learning are reshaping quantitative trading strategies. A deep dive session with industry experts.",
    // AI/Abstract vibes
    posterUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
    date: new Date("2026-03-10"),
    startTime: "19:00",
    endTime: "21:00",
    mode: "Online",
    location: "Zoom Meeting",
    audience: ["Educators", "Students", "Traders"],
    agenda: ["19:00 - Intro", "19:15 - Presentation", "20:30 - Q&A"],
    guest_speaker: [
      {
        name: "Dr. Emily Chen",
        bio: "AI Researcher at RMIT University.",
        avatar_url: "https://ui-avatars.com/api/?name=Emily+Chen&background=ffb6b9&color=fff&size=256",
        linkedIn_url: "https://linkedin.com/in/emilychen"
      }
    ],
    partners: [], // No partners for this small event
    registrationLink: "https://zoom.us/webinar/register/123",
    registrationDeadline: new Date("2026-03-09")
  },

  // 3. Workshop (Offline - Career)
  {
    name: "Workshop: Building Your FinTech Portfolio",
    description: "Learn how to showcase your projects and skills to top FinTech employers. We will cover GitHub optimization, project documentation, and interview tips.",
    // Workspace/Notebook vibes
    posterUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
    date: new Date("2026-04-15"), 
    startTime: "14:00",
    endTime: "16:00",
    mode: "Offline",
    location: "Room 1.2.04, Building 1, RMIT SGS",
    audience: ["Freshmen", "Sophomores"],
    agenda: ["14:00 - Portfolio Structure", "15:00 - Peer Review"],
    guest_speaker: [], 
    partners: [],
  },

  // 4. Summit (Offline - Corporate/Formal)
  {
    name: "Future of Banking Summit 2026",
    description: "An exclusive gathering of banking executives and tech leaders discussing the future of digital banking, open banking APIs, and regulatory changes.",
    // Corporate/Skyscraper vibes
    posterUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000",
    date: new Date("2026-11-20"),
    startTime: "09:00",
    endTime: "17:00",
    mode: "Offline",
    location: "Gem Center, District 1",
    audience: ["Public", "Investors", "Bankers"],
    guest_speaker: [
        {
            name: "Michael Ross",
            bio: "Director of Digital Transformation, VCB.",
            avatar_url: "https://ui-avatars.com/api/?name=Michael+Ross&background=333&color=fff&size=256",
        }
    ],
    // Microsoft Logo
    partners: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1280px-Microsoft_logo_%282012%29.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
    ]
  },

  // 5. Past Event (To test filtering)
  {
    name: "Crypto 101: Beginners Guide",
    description: "A starter guide to understanding Bitcoin, Ethereum, and how blockchain works underneath.",
    posterUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=1000",
    date: new Date("2025-12-10"), // Past date
    startTime: "10:00",
    endTime: "12:00",
    mode: "Online",
    location: "Google Meet",
    audience: ["Students"],
    guest_speaker: [],
    partners: []
  }
];

async function seed() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Connected.");

    // Clean old data
    console.log("🧹 Clearing old events...");
    await Event.deleteMany({});
    
    // Insert new data
    console.log("🌱 Seeding new events...");
    await Event.insertMany(mockEvents);

    console.log("🎉 Seed data inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seed();