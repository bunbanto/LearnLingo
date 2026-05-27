import teachersJson from "../teachers.json";
import type { Teacher } from "./types";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const teachersData: Teacher[] = teachersJson.map((teacher, index) => ({
  id: `${slugify(`${teacher.name}-${teacher.surname}`)}-${index + 1}`,
  ...teacher,
}));
