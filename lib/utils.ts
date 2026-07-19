import { interviewCovers } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Local tech icons from /public
const localTechIcons: Record<string, string> = {
  python: "/python.svg",

  java: "/java.svg",

  javascript: "/javascript.svg",
  js: "/javascript.svg",

  typescript: "/typescript.svg",
  ts: "/typescript.svg",

  react: "/react.svg",

  nextjs: "/nextjs-icon.svg",
  next: "/nextjs-icon.svg",

  nodejs: "/nodejs.svg",
  node: "/nodejs.svg",

  html: "/html-5.svg",
  html5: "/html-5.svg",

  css: "/css-3.svg",
  css3: "/css-3.svg",

  tailwind: "/tailwind.svg",

  sql: "/postgresql.svg",
  postgres: "/postgresql.svg",
  postgresql: "/postgresql.svg",

  git: "/git-icon.svg",
  github: "/github-icon.svg",

  docker: "/docker-icon.svg",

  aws: "/aws.svg",

  pandas: "/pandas-icon.svg",
};
export const getTechLogos = async (techArray: string[]) => {
  return techArray.map((tech) => {
    const key = tech
      .toLowerCase()
      .trim()
      .replace(".js", "")
      .replace(/\s+/g, " ");

    return {
      tech,
      url: localTechIcons[key] || "/tech.svg",
    };
  });
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);

  return `/covers${interviewCovers[randomIndex]}`;
};