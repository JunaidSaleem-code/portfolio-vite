import { connectDB } from "./mongodb";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import BentoItem from "@/models/BentoItem";
import NavItem from "@/models/NavItem";
import SocialLink from "@/models/SocialLink";
import ApproachPhase from "@/models/ApproachPhase";
import Section from "@/models/Section";
import Setting from "@/models/Setting";
import Achievement from "@/models/Achievement";

function serialize(doc) {
  return JSON.parse(JSON.stringify(doc));
}

async function listVisible(Model) {
  await connectDB();
  const docs = await Model.find({ visible: true }).sort({ order: 1, createdAt: 1 }).lean();
  return serialize(docs);
}

async function getSettingValue(key) {
  await connectDB();
  const doc = await Setting.findOne({ key }).lean();
  return doc ? serialize(doc.data) : null;
}

const EMPTY_HOME_DATA = {
  sections: [],
  bentoItems: [],
  projects: [],
  experiences: [],
  achievements: [],
  approachPhases: [],
  navItems: [],
  socialLinks: [],
  settings: { hero: null, footer: null },
};

export async function getHomePageData() {
  try {
    await connectDB();

    const [sections, bentoItems, projects, experiences, achievements, approachPhases, navItems, socialLinks, hero, footer] =
      await Promise.all([
        listVisible(Section),
        listVisible(BentoItem),
        listVisible(Project),
        listVisible(Experience),
        listVisible(Achievement),
        listVisible(ApproachPhase),
        listVisible(NavItem),
        listVisible(SocialLink),
        getSettingValue("hero"),
        getSettingValue("footer"),
      ]);

    return {
      sections,
      bentoItems,
      projects,
      experiences,
      achievements,
      approachPhases,
      navItems,
      socialLinks,
      settings: { hero, footer },
    };
  } catch (err) {
    console.error("[getHomePageData] Failed to load from DB:", err.message);
    return EMPTY_HOME_DATA;
  }
}

export {
  listVisible,
  getSettingValue,
  serialize,
};

export async function getProjectBySlug(slug) {
  try {
    await connectDB();
    const doc = await Project.findOne({ slug, visible: true }).lean();
    return doc ? serialize(doc) : null;
  } catch (err) {
    console.error("[getProjectBySlug] DB error:", err.message);
    return null;
  }
}

export async function getAllProjectSlugs() {
  try {
    await connectDB();
    const docs = await Project.find({ visible: true }).select("slug").lean();
    return docs.map((d) => d.slug);
  } catch {
    return [];
  }
}

export async function getDashboardStats() {
  try {
    await connectDB();
    const [
      projectsTotal,
      projectsHidden,
      experienceTotal,
      bentoTotal,
      achievementsTotal,
      navTotal,
      socialTotal,
      latestProject,
      latestExperience,
    ] = await Promise.all([
      Project.countDocuments({}),
      Project.countDocuments({ visible: false }),
      Experience.countDocuments({}),
      BentoItem.countDocuments({}),
      Achievement.countDocuments({}),
      NavItem.countDocuments({}),
      SocialLink.countDocuments({}),
      Project.findOne({}).sort({ updatedAt: -1 }).select("title updatedAt").lean(),
      Experience.findOne({}).sort({ updatedAt: -1 }).select("title updatedAt").lean(),
    ]);

    return {
      counts: {
        projects: projectsTotal,
        projectsHidden,
        experience: experienceTotal,
        bento: bentoTotal,
        achievements: achievementsTotal,
        nav: navTotal,
        social: socialTotal,
      },
      latestProject: latestProject ? serialize(latestProject) : null,
      latestExperience: latestExperience ? serialize(latestExperience) : null,
      ok: true,
    };
  } catch (err) {
    return { counts: {}, latestProject: null, latestExperience: null, ok: false, error: err.message };
  }
}
