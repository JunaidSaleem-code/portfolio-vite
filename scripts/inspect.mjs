// Read-only inspector: prints what's currently in each content collection.
// Run with: npm run inspect

import mongoose from "mongoose";

import Project from "../src/models/Project.js";
import Experience from "../src/models/Experience.js";
import BentoItem from "../src/models/BentoItem.js";
import ApproachPhase from "../src/models/ApproachPhase.js";
import Achievement from "../src/models/Achievement.js";
import NavItem from "../src/models/NavItem.js";
import SocialLink from "../src/models/SocialLink.js";
import Section from "../src/models/Section.js";
import Setting from "../src/models/Setting.js";

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not set in .env.local");
  process.exit(1);
}

function pad(s, n) {
  s = String(s ?? "");
  return s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n, " ");
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("\n=== DATABASE INSPECTION ===\n");

  // --- Projects ---
  const projects = await Project.find().sort({ order: 1, createdAt: 1 }).lean();
  console.log(`PROJECTS (${projects.length}):`);
  projects.forEach((p, i) => {
    console.log(
      `  ${pad(i + 1, 3)}${pad(p.slug, 28)}${pad(p.title, 40)}link=${p.link || "(empty)"}`
    );
  });

  // --- Experience ---
  const experiences = await Experience.find().sort({ order: 1, createdAt: 1 }).lean();
  console.log(`\nEXPERIENCE (${experiences.length}):`);
  experiences.forEach((e, i) => {
    console.log(`  ${pad(i + 1, 3)}${pad(e.title, 60)}`);
  });

  // --- Achievements ---
  const achievements = await Achievement.find().sort({ order: 1, createdAt: 1 }).lean();
  console.log(`\nACHIEVEMENTS (${achievements.length}):`);
  achievements.forEach((a, i) => {
    console.log(`  ${pad(i + 1, 3)}[${pad(a.type, 12)}] ${pad(a.title, 50)}`);
  });

  // --- Bento ---
  const bento = await BentoItem.find().sort({ order: 1, createdAt: 1 }).lean();
  console.log(`\nBENTO (${bento.length}):`);
  bento.forEach((b, i) => {
    console.log(
      `  ${pad(i + 1, 3)}[${pad(b.cardType, 10)}] ${pad(b.title, 60)}`
    );
  });

  // --- Approach ---
  const phases = await ApproachPhase.find().sort({ order: 1, createdAt: 1 }).lean();
  console.log(`\nAPPROACH PHASES (${phases.length}):`);
  phases.forEach((p, i) => {
    console.log(`  ${pad(i + 1, 3)}${pad(p.phaseLabel, 12)}${pad(p.title, 50)}`);
  });

  // --- Other (just counts) ---
  const navCount = await NavItem.countDocuments();
  const socialCount = await SocialLink.countDocuments();
  const sectionCount = await Section.countDocuments();
  const heroSetting = await Setting.findOne({ key: "hero" }).lean();
  const footerSetting = await Setting.findOne({ key: "footer" }).lean();

  console.log(`\nOTHER:`);
  console.log(`  NavItems:    ${navCount}`);
  console.log(`  SocialLinks: ${socialCount}`);
  console.log(`  Sections:    ${sectionCount}`);
  console.log(`  Hero setting:   ${heroSetting ? "present" : "MISSING"}`);
  console.log(`  Footer setting: ${footerSetting ? "present" : "MISSING"}`);

  await mongoose.disconnect();
  console.log("\n=== END ===\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
