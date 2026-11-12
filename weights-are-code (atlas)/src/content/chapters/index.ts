import type { Chapter } from "../types";
import { ch01, ch02 } from "./ch01-02";
import { ch03 } from "./ch03";
import { ch04, ch05 } from "./ch04-05";
import { ch06, ch07 } from "./ch06-07";
import { ch08, ch09 } from "./ch08-09";
import { ch10, ch11 } from "./ch10-11";
import { ch12, ch13 } from "./ch12-13";

export const CHAPTERS: Chapter[] = [
  ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11, ch12, ch13,
];

export const PARTS: { n: 1 | 2 | 3 | 4; title: string; blurb: string }[] = [
  { n: 1, title: "Part I · Foundations", blurb: "What weights are, how they get written today, and the family of cousin methods." },
  { n: 2, title: "Part II · The Experiments", blurb: "Read, fix, write - all eight experiments, and how the reasoning actually worked." },
  { n: 3, title: "Part III · Judgement", blurb: "Measured vs anecdote, and who benefits - the reviewer’s toolkit." },
  { n: 4, title: "Part IV · Futures & Risks", blurb: "Predictions, the risk atlas, Het’s Lab, and the library." },
];

export const chapterBySlug = (slug: string) => CHAPTERS.find((c) => c.slug === slug);
