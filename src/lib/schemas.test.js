import { describe, expect, it } from "vitest";
import {
  projectSchema,
  experienceSchema,
  contactSchema,
  subscribeSchema,
  passwordChangeSchema,
  sectionSchema,
  bentoItemSchema,
  achievementSchema,
  reorderSchema,
} from "./schemas";

describe("projectSchema", () => {
  const valid = {
    title: "AI Tool Hub",
    slug: "ai-tool-hub",
    description: "Auto-discovers tools.",
    image: "https://res.cloudinary.com/x/image.png",
    link: "https://example.com",
  };

  it("accepts a minimal valid project", () => {
    const result = projectSchema.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data.tags).toEqual([]);
    expect(result.data.body).toBe("");
  });

  it("rejects an invalid slug (uppercase or space)", () => {
    expect(projectSchema.safeParse({ ...valid, slug: "Ai Tool Hub" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...valid, slug: "AiToolHub" }).success).toBe(false);
  });

  it("requires image", () => {
    const { image, ...rest } = valid;
    expect(projectSchema.safeParse(rest).success).toBe(false);
  });

  it("requires link", () => {
    const { link, ...rest } = valid;
    expect(projectSchema.safeParse(rest).success).toBe(false);
  });
});

describe("experienceSchema", () => {
  it("requires title, description, thumbnail", () => {
    expect(
      experienceSchema.safeParse({ title: "x", description: "y", thumbnail: "/z.svg" }).success
    ).toBe(true);
    expect(experienceSchema.safeParse({ title: "x", description: "y" }).success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("accepts a well-formed message", () => {
    const result = contactSchema.safeParse({
      name: "Junaid",
      email: "j@example.com",
      message: "Hi there, I have a project idea for you.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects messages under 10 chars", () => {
    expect(
      contactSchema.safeParse({ name: "J", email: "j@example.com", message: "short" }).success
    ).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(
      contactSchema.safeParse({ name: "J", email: "not-an-email", message: "Long enough message." })
        .success
    ).toBe(false);
  });
});

describe("subscribeSchema", () => {
  it("accepts an email and defaults source to 'footer'", () => {
    const result = subscribeSchema.safeParse({ email: "j@example.com" });
    expect(result.success).toBe(true);
    expect(result.data.source).toBe("footer");
    expect(result.data.name).toBe("");
  });

  it("rejects invalid email", () => {
    expect(subscribeSchema.safeParse({ email: "bad" }).success).toBe(false);
  });
});

describe("passwordChangeSchema", () => {
  it("requires newPassword to be at least 8 chars", () => {
    expect(
      passwordChangeSchema.safeParse({ currentPassword: "x", newPassword: "short" }).success
    ).toBe(false);
    expect(
      passwordChangeSchema.safeParse({ currentPassword: "x", newPassword: "longenough" }).success
    ).toBe(true);
  });
});

describe("sectionSchema", () => {
  it("only allows enumerated keys", () => {
    expect(sectionSchema.safeParse({ key: "hero", label: "Hero" }).success).toBe(true);
    expect(sectionSchema.safeParse({ key: "blog", label: "Blog" }).success).toBe(false);
  });
});

describe("bentoItemSchema", () => {
  it("defaults cardType to 'default'", () => {
    const result = bentoItemSchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.data.cardType).toBe("default");
  });

  it("only allows enumerated cardType values", () => {
    expect(bentoItemSchema.safeParse({ cardType: "globe" }).success).toBe(true);
    expect(bentoItemSchema.safeParse({ cardType: "carousel" }).success).toBe(false);
  });
});

describe("achievementSchema", () => {
  it("defaults type to 'recognition'", () => {
    const result = achievementSchema.safeParse({ title: "Mentor" });
    expect(result.success).toBe(true);
    expect(result.data.type).toBe("recognition");
  });

  it("rejects unknown type", () => {
    expect(achievementSchema.safeParse({ title: "x", type: "award" }).success).toBe(false);
  });
});

describe("reorderSchema", () => {
  it("requires at least one id", () => {
    expect(reorderSchema.safeParse({ ids: [] }).success).toBe(false);
    expect(reorderSchema.safeParse({ ids: ["abc"] }).success).toBe(true);
  });
});
