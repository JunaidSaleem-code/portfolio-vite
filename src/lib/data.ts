import type { Model } from "mongoose";
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
import Testimonial from "@/models/Testimonial";

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

async function listVisible<T = unknown>(M: Model<any>): Promise<T[]> {
  await connectDB();
  const docs = await M.find({ visible: true }).sort({ order: 1, createdAt: 1 }).lean();
  return serialize(docs) as T[];
}

async function getSettingValue<T = unknown>(key: string): Promise<T | null> {
  await connectDB();
  const doc = await Setting.findOne({ key }).lean<{ data: T } | null>();
  return doc ? (serialize(doc.data) as T) : null;
}

export type HomePageData = {
  sections: any[];
  bentoItems: any[];
  projects: any[];
  experiences: any[];
  achievements: any[];
  testimonials: any[];
  approachPhases: any[];
  navItems: any[];
  socialLinks: any[];
  settings: { hero: any | null; footer: any | null };
};

const EMPTY_HOME_DATA: HomePageData = {
  sections: [],
  bentoItems: [],
  projects: [],
  experiences: [],
  achievements: [],
  testimonials: [],
  approachPhases: [],
  navItems: [],
  socialLinks: [],
  settings: { hero: null, footer: null },
};

export async function getHomePageData(): Promise<HomePageData> {
  try {
    await connectDB();

    const [
      sections,
      bentoItems,
      projects,
      experiences,
      achievements,
      testimonials,
      approachPhases,
      navItems,
      socialLinks,
      hero,
      footer,
    ] = await Promise.all([
      listVisible(Section),
      listVisible(BentoItem),
      listVisible(Project),
      listVisible(Experience),
      listVisible(Achievement),
      listVisible(Testimonial),
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
      testimonials,
      approachPhases,
      navItems,
      socialLinks,
      settings: { hero, footer },
    };
  } catch (err) {
    console.error("[getHomePageData] Failed to load from DB:", (err as Error).message);
    return EMPTY_HOME_DATA;
  }
}

export { listVisible, getSettingValue, serialize };

export async function getProjectBySlug(slug: string): Promise<any | null> {
  try {
    await connectDB();
    const doc = await Project.findOne({ slug, visible: true }).lean();
    return doc ? serialize(doc) : null;
  } catch (err) {
    console.error("[getProjectBySlug] DB error:", (err as Error).message);
    return null;
  }
}

export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    await connectDB();
    const docs = await Project.find({ visible: true }).select("slug").lean<{ slug: string }[]>();
    return docs.map((d) => d.slug);
  } catch {
    return [];
  }
}

export type DashboardStats = {
  counts: {
    projects?: number;
    projectsHidden?: number;
    experience?: number;
    bento?: number;
    achievements?: number;
    testimonials?: number;
    nav?: number;
    social?: number;
  };
  latestProject: any | null;
  latestExperience: any | null;
  ok: boolean;
  error?: string;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    await connectDB();
    const [
      projectsTotal,
      projectsHidden,
      experienceTotal,
      bentoTotal,
      achievementsTotal,
      testimonialsTotal,
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
      Testimonial.countDocuments({}),
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
        testimonials: testimonialsTotal,
        nav: navTotal,
        social: socialTotal,
      },
      latestProject: latestProject ? serialize(latestProject) : null,
      latestExperience: latestExperience ? serialize(latestExperience) : null,
      ok: true,
    };
  } catch (err) {
    return {
      counts: {},
      latestProject: null,
      latestExperience: null,
      ok: false,
      error: (err as Error).message,
    };
  }
}
