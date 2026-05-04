import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Project from "../src/models/Project.js";
import Experience from "../src/models/Experience.js";
import BentoItem from "../src/models/BentoItem.js";
import NavItem from "../src/models/NavItem.js";
import SocialLink from "../src/models/SocialLink.js";
import ApproachPhase from "../src/models/ApproachPhase.js";
import Section from "../src/models/Section.js";
import Setting from "../src/models/Setting.js";
import User from "../src/models/User.js";
import Achievement from "../src/models/Achievement.js";

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not set in .env.local");
  process.exit(1);
}

const sections = [
  { key: "hero", label: "Hero", order: 1 },
  { key: "grid", label: "Bento Grid (About)", order: 2 },
  { key: "projects", label: "Recent Projects", order: 3 },
  { key: "experience", label: "Work Experience", order: 4 },
  { key: "achievements", label: "Education & Recognition", order: 5 },
  { key: "approach", label: "My Approach", order: 6 },
  { key: "footer", label: "Footer (Contact)", order: 7 },
];

const navItems = [
  { name: "About", link: "#about", order: 1 },
  { name: "Projects", link: "#projects", order: 2 },
  { name: "Experience", link: "#experience", order: 3 },
  { name: "Contact", link: "#contact", order: 4 },
];

const bentoItems = [
  {
    title: "I prioritize client collaboration, fostering open communication ",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    image: "/b1.svg",
    spareImage: "",
    cardType: "default",
    order: 1,
  },
  {
    title: "I'm very flexible with time zone communications",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    image: "",
    spareImage: "",
    cardType: "globe",
    order: 2,
  },
  {
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    image: "",
    spareImage: "",
    cardType: "techStack",
    techStackLeft: ["Next.js", "Typescript"],
    techStackRight: ["MongoDb", "Node.js"],
    order: 3,
  },
  {
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    image: "/grid.svg",
    spareImage: "/b4.svg",
    cardType: "default",
    order: 4,
  },
  {
    title: "Always building, always learning.",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    image: "/b5.svg",
    spareImage: "/grid.svg",
    spareImageClassName: "w-full opacity-80",
    cardType: "default",
    order: 5,
  },
  {
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    image: "",
    spareImage: "",
    cardType: "emailCta",
    emailAddress: "chmjunaidsaleem@gmail.com",
    order: 6,
  },
];

const projects = [
  {
    title: "InspireCraft",
    slug: "inspirecraft",
    description: "A full-stack art platform where artists can share, sell, and engage — built with Next.js, MongoDB, and a clean, user-focused design.",
    image: "/p1.png",
    techIcons: ["/next.svg", "/tail.svg", "/ts.svg", "/mongo.svg", "/shadcn.png"],
    techStack: ["Next.js", "TypeScript", "MongoDB", "Stripe", "AI APIs"],
    tags: ["Full-Stack", "AI", "Marketplace"],
    link: "https://inspire-craft-fyp.vercel.app/",
    body: "Built a full-featured artist marketplace supporting artwork uploads, tutorial posting, and digital product sales. Implemented buying and selling workflows for artwork and tutorials with secure Stripe payment integration. Integrated AI-generated reference image creation to assist artists during the creative process. Designed scalable content management for tutorials, artwork listings, and user transactions.",
    order: 1,
  },
  {
    title: "Question Bank",
    slug: "question-bank",
    description: "Full-stack MERN question-bank platform with topic-tagged questions, role-based access, and an admin workflow.",
    image: "/p2.png",
    techIcons: ["/re.svg", "/tail.svg", "/three.svg", "/c.svg"],
    techStack: ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
    tags: ["Full-Stack", "MERN"],
    link: "https://full-stack-question-bank-mern-stack.vercel.app/",
    body: "A MERN-stack question bank with role-based access (student, teacher, admin), question tagging, search by topic, and a teacher workflow for review and approval before publication.",
    order: 2,
  },
];

const experiences = [
  {
    title: "Associate Software Engineer · Vanar",
    description: "Aug 2025 – Present · Onsite, Pakistan. Build and integrate Retrieval-Augmented Generation (RAG) systems including embedding pipelines and model workflows. Train and fine-tune AI models, ship LLM-based features and streaming responses into live production apps.",
    thumbnail: "/exp1.svg",
    order: 1,
  },
  {
    title: "Full-Stack Developer · CognoRise InfoTech",
    description: "Jan 2024 – Jul 2025 · Remote contract. Built full-stack apps and RESTful APIs, implemented Multi-Factor Authentication and CRUD workflows, integrated AI features and automation logic. Agile delivery across feature planning and production.",
    thumbnail: "/exp2.svg",
    order: 2,
  },
  {
    title: "Frontend Web Developer · Dynmsol",
    description: "Aug 2023 – Dec 2023 · Onsite, Pakistan. Developed responsive UI components for a Laravel-React e-commerce platform. Implemented product listing, navigation, and checkout flows; integrated frontend with backend APIs.",
    thumbnail: "/exp3.svg",
    order: 3,
  },
];

const approachPhases = [
  {
    phaseLabel: "Phase 1",
    title: "Planning & Strategy",
    description: "Establishing project goals, defining the scope, and outlining a clear roadmap to ensure a solid foundation for successful development.",
    backgroundClass: "bg-emerald-900",
    animationSpeed: 5.1,
    overlay: false,
    order: 1,
  },
  {
    phaseLabel: "Phase 2",
    title: "Development & Progress Update",
    description: "Developing the project from start to finish, tracking progress and providing regular updates to ensure a smooth and efficient development process.",
    backgroundClass: "bg-lime-50",
    animationSpeed: 3,
    colors: [
      [236, 72, 153],
      [232, 121, 249],
    ],
    dotSize: 3,
    overlay: true,
    order: 2,
  },
  {
    phaseLabel: "Phase 3",
    title: "Deployment and Monitoring",
    description: "Deploying the project to production and providing regular monitoring to ensure a smooth and reliable development experience.",
    backgroundClass: "bg-sky-600",
    animationSpeed: 3,
    colors: [[125, 211, 252]],
    overlay: false,
    order: 3,
  },
];

const socialLinks = [
  { label: "GitHub", icon: "/git.svg", link: "https://github.com/JunaidSaleem-code", order: 1 },
  { label: "LinkedIn", icon: "/link.svg", link: "https://www.linkedin.com/in/junaid-saleem-web-developer/", order: 2 },
];

const achievements = [
  {
    type: "education",
    title: "BS Software Engineering",
    organization: "Lahore Garrison University",
    period: "Graduated 2024",
    description: "Bachelor's degree in Software Engineering with a focus on full-stack and AI-driven systems.",
    order: 1,
  },
  {
    type: "recognition",
    title: "Evaluator — G-TECH Hackathon 2025",
    organization: "Lahore Garrison University",
    period: "2025",
    description: "Evaluated student projects at the G-TECH Hackathon hosted by LGU.",
    order: 1,
  },
  {
    type: "recognition",
    title: "Web Development Mentor",
    organization: "LGU SE-Tech Society",
    period: "Spring 2025",
    description: "Mentored junior students in modern web development through LGU's SE-Tech Society.",
    order: 2,
  },
];

const settings = [
  {
    key: "hero",
    data: {
      tagline: "AI · Full-Stack · LLM Integration",
      headline: "Building AI-powered products that ship",
      subheadline: "I'm Junaid — an AI-focused Full-Stack Engineer specializing in RAG pipelines, LLM integration, and production-grade web & mobile applications.",
      ctaText: "Explore Projects",
      ctaLink: "#projects",
      resumeUrl: "/resume.pdf",
      resumeButtonText: "Download CV",
    },
  },
  {
    key: "footer",
    data: {
      headline: "Ready to take your digital presence to the next level?",
      paragraph: "Reach out to me today and let's discuss how I can help you achieve your goals.",
      ctaText: "Let's get in touch",
      contactEmail: "chmjunaidsaleem@gmail.com",
      copyright: "Copyright © 2024 Junaid",
    },
  },
];

async function seedCollection(Model, docs, { uniqueBy } = {}) {
  if (uniqueBy) {
    for (const doc of docs) {
      await Model.updateOne({ [uniqueBy]: doc[uniqueBy] }, { $set: doc }, { upsert: true });
    }
    return docs.length;
  }
  const existing = await Model.countDocuments();
  if (existing > 0) {
    console.log(`  ↳ ${Model.modelName}: ${existing} docs already present, skipping`);
    return 0;
  }
  await Model.insertMany(docs);
  return docs.length;
}

async function seedAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log("  ↳ User: ADMIN_EMAIL/ADMIN_PASSWORD not set, skipping admin creation");
    return;
  }
  const email = ADMIN_EMAIL.toLowerCase();
  const removed = await User.deleteMany({ email: { $ne: email } });
  if (removed.deletedCount) {
    console.log(`  ↳ User: removed ${removed.deletedCount} stale admin user(s)`);
  }
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.updateOne(
    { email },
    { $set: { email, passwordHash } },
    { upsert: true }
  );
  console.log(`  ↳ User: admin upserted (${email})`);
}

async function main() {
  console.log("Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\nSeeding…");

  const counts = {};
  counts.sections = await seedCollection(Section, sections, { uniqueBy: "key" });
  counts.settings = await seedCollection(Setting, settings, { uniqueBy: "key" });
  counts.navItems = await seedCollection(NavItem, navItems);
  counts.bentoItems = await seedCollection(BentoItem, bentoItems);
  counts.projects = await seedCollection(Project, projects);
  counts.experiences = await seedCollection(Experience, experiences);
  counts.approachPhases = await seedCollection(ApproachPhase, approachPhases);
  counts.socialLinks = await seedCollection(SocialLink, socialLinks);
  counts.achievements = await seedCollection(Achievement, achievements);

  await seedAdmin();

  console.log("\nDone.");
  for (const [k, v] of Object.entries(counts)) {
    console.log(`  ${k}: ${v} inserted`);
  }
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
