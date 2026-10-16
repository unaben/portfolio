import { describe, expect, it } from "vitest";
import {
  parseStack,
  sortProjects,
  validateProjectInput,
} from "./Project.utils";
import type { ProjectData } from "./Project.types";

const baseProjectFields = {
  title: "Project title",
  summary: "Project summary",
  stack: [],
  featured: false,
};

function buildProject(
  id: string,
  featured: boolean,
  createdAt: string,
): ProjectData {
  return {
    ...baseProjectFields,
    id,
    featured,
    createdAt,
    updatedAt: createdAt,
  };
}

describe("project utils", () => {
  describe("parseStack", () => {
    it("trims, drops empties and dedupes", () => {
      const parsedStack = parseStack(" React, Next.js,, React ");

      expect(parsedStack).toEqual(["React", "Next.js"]);
    });
  });

  describe("validateProjectInput", () => {
    it("accepts a minimal valid project", () => {
      const validationResult = validateProjectInput({
        title: "Portfolio",
        summary: "My portfolio site",
      });

      expect(validationResult.ok).toBe(true);
      if (validationResult.ok) {
        expect(validationResult.value).toMatchObject({
          title: "Portfolio",
          stack: [],
          featured: false,
        });
      }
    });

    it("rejects missing fields and bad URLs", () => {
      const validationResult = validateProjectInput({
        title: "",
        summary: "",
        liveUrl: "javascript:alert(1)",
      });

      expect(validationResult.ok).toBe(false);
      if (!validationResult.ok) {
        expect(validationResult.errors).toHaveLength(3);
      }
    });

    it("accepts a comma string or array for stack", () => {
      const resultFromString = validateProjectInput({
        title: "Portfolio",
        summary: "My portfolio site",
        stack: "react, next",
      });
      const resultFromArray = validateProjectInput({
        title: "Portfolio",
        summary: "My portfolio site",
        stack: ["react", "next"],
      });

      expect(resultFromString.ok && resultFromString.value.stack).toEqual([
        "react",
        "next",
      ]);
      expect(resultFromArray.ok && resultFromArray.value.stack).toEqual([
        "react",
        "next",
      ]);
    });
  });

  describe("sortProjects", () => {
    it("puts featured first, then newest", () => {
      const olderProject = buildProject("older", false, "2026-01-01");
      const newerProject = buildProject("newer", false, "2026-02-01");
      const featuredProject = buildProject("featured", true, "2025-01-01");

      const sortedProjects = sortProjects([
        olderProject,
        newerProject,
        featuredProject,
      ]);

      expect(sortedProjects.map((project) => project.id)).toEqual([
        "featured",
        "newer",
        "older",
      ]);
    });
  });
});
