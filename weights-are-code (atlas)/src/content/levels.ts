export type Level = 1 | 2 | 3 | 4 | 5;

/** The audience ladder - pure data, safe to import from server components. */
export const LEVELS: { n: Level; short: string; name: string; blurb: string }[] = [
  { n: 1, short: "L1", name: "Explain like I'm 12", blurb: "Analogies only - no math, just pictures and stories." },
  { n: 2, short: "L2", name: "Curious adult", blurb: "Plain words and small, concrete numbers." },
  { n: 3, short: "L3", name: "Student", blurb: "Shapes, matrices, loss, gradients, residual streams." },
  { n: 4, short: "L4", name: "Practitioner", blurb: "Formulas, code, failure modes, scaling behaviour." },
  { n: 5, short: "L5", name: "Researcher", blurb: "What is and isn't established; critique and next experiments." },
];
