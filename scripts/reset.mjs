// One-shot cleanup + CV-alignment script.
// Run with: npm run reset
//
// What it does:
//   • Projects:     deletes entries with an empty `slug` (the duplicates)
//   • Experience:   wipes & inserts the 3 CV entries (Vanar / CognoRise / Dynmsol)
//   • Approach:     wipes & inserts the 3 CV phases (Discovery / Build / Measure)
//   • Bento:        updates card 3 (tech stack columns) + card 4 (description) by title — leaves order/styling alone
//   • Achievements / Nav / Social / Sections / Hero / Footer: untouched (already correct)
//
// Re-runnable. Idempotent for the destructive steps (Experience / Approach).

import mongoose from "mongoose";

import Project from "../src/models/Project.js";
import Experience from "../src/models/Experience.js";
import BentoItem from "../src/models/BentoItem.js";
import ApproachPhase from "../src/models/ApproachPhase.js";

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not set in .env.local");
  process.exit(1);
}

// -----------------------------------------------------------------------------
// CV-aligned source data
// -----------------------------------------------------------------------------

const experiences = [
  {
    title: "Associate Software Engineer · Vanar",
    description:
      "Aug 2025 – Present · Onsite, Pakistan. Build and integrate Retrieval-Augmented Generation (RAG) systems including embedding pipelines and model workflows. Train and fine-tune AI models, ship LLM-based features and streaming responses into live production apps.",
    thumbnail: "/exp1.svg",
    order: 1,
    visible: true,
  },
  {
    title: "Full-Stack Developer · CognoRise InfoTech",
    description:
      "Jan 2024 – Jul 2025 · Remote contract. Built full-stack apps and RESTful APIs, implemented Multi-Factor Authentication and CRUD workflows, integrated AI features and automation logic. Agile delivery across feature planning and production.",
    thumbnail: "/exp2.svg",
    order: 2,
    visible: true,
  },
  {
    title: "Frontend Web Developer · Dynmsol",
    description:
      "Aug 2023 – Dec 2023 · Onsite, Pakistan. Developed responsive UI components for a Laravel-React e-commerce platform. Implemented product listing, navigation, and checkout flows; integrated frontend with backend APIs.",
    thumbnail: "/exp3.svg",
    order: 3,
    visible: true,
  },
];

const approachPhases = [
  {
    phaseLabel: "Phase 1",
    title: "Discovery & Architecture",
    description:
      "Map the problem to the right pattern — RAG vs fine-tuning vs prompt engineering — and design retrieval pipelines, schemas, and integration points before any code lands.",
    backgroundClass: "bg-emerald-900",
    animationSpeed: 5.1,
    overlay: false,
    order: 1,
    visible: true,
  },
  {
    phaseLabel: "Phase 2",
    title: "Build & Integrate",
    description:
      "Ship the system end-to-end: embedding pipelines, vector search, LLM streaming, full-stack workflows, and the integrations that connect them. Tight feedback loops with the product team.",
    backgroundClass: "bg-lime-50",
    animationSpeed: 3,
    colors: [
      [236, 72, 153],
      [232, 121, 249],
    ],
    dotSize: 3,
    overlay: true,
    order: 2,
    visible: true,
  },
  {
    phaseLabel: "Phase 3",
    title: "Measure & Refine",
    description:
      "Evaluate retrieval accuracy, monitor latency and cost, and iterate on prompts, indexes, and UX. Ship improvements that move real metrics.",
    backgroundClass: "bg-sky-600",
    animationSpeed: 3,
    colors: [[125, 211, 252]],
    overlay: false,
    order: 3,
    visible: true,
  },
];

// Bento updates — by current title. Only specific fields are patched; everything
// else (className, image, order, etc.) is preserved.
const bentoPatches = [
  {
    matchTitle: "My tech stack",
    set: {
      techStackLeft: ["Next.js", "TypeScript", "Python"],
      techStackRight: ["MongoDB", "RAG / LLM", "Capacitor"],
    },
  },
  {
    matchTitle: "Tech enthusiast with a passion for development.",
    set: {
      description:
        "AI-focused Full-Stack Engineer. RAG, LLM integration, end-to-end product delivery.",
    },
  },
];

// -----------------------------------------------------------------------------
// Run
// -----------------------------------------------------------------------------

async function main() {
  console.log("Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\n");

  // 1. Projects: delete entries with empty/missing slug (those are the duplicates)
  const projDeleted = await Project.deleteMany({
    $or: [{ slug: "" }, { slug: { $exists: false } }, { slug: null }],
  });
  console.log(`Projects: removed ${projDeleted.deletedCount} duplicate(s) with empty slug`);

  const remaining = await Project.find().sort({ order: 1 }).select("slug title").lean();
  console.log(`Projects: ${remaining.length} remaining`);
  remaining.forEach((p) => console.log(`   - ${p.slug.padEnd(20)}  ${p.title}`));

  // 2. Experience: wipe + reinsert
  const expDeleted = await Experience.deleteMany({});
  await Experience.insertMany(experiences);
  console.log(
    `\nExperience: replaced ${expDeleted.deletedCount} entries with ${experiences.length} CV entries`
  );

  // 3. Approach phases: wipe + reinsert
  const apDeleted = await ApproachPhase.deleteMany({});
  await ApproachPhase.insertMany(approachPhases);
  console.log(
    `Approach: replaced ${apDeleted.deletedCount} phases with ${approachPhases.length} CV phases`
  );

  // 4. Bento: patch specific cards by title
  console.log("\nBento patches:");
  for (const patch of bentoPatches) {
    const result = await BentoItem.updateOne(
      { title: patch.matchTitle },
      { $set: patch.set }
    );
    if (result.matchedCount === 0) {
      console.log(`   ! no card found with title "${patch.matchTitle}"`);
    } else {
      console.log(`   ✓ "${patch.matchTitle}" updated`);
    }
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
