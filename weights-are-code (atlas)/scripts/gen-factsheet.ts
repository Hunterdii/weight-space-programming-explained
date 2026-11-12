/** Exports the structured fact sheet as public/data/fact-sheet.json - the site-wide single source of truth. */
import { writeFileSync } from "node:fs";
import { SOURCE, EXPERIMENTS, MINATAR, QWEN_BUDGET, GEMMA_CONTROL, GO_LOGS, SYCOPHANCY_HEAD, PREDICTIONS, HORIZON, RISKS, UPDATE_LOG } from "../src/content/facts";
import { FORMULAS } from "../src/content/formulas";
import { GLOSSARY } from "../src/content/glossary";
import { REFERENCES, OPEN_ITEMS } from "../src/content/references";

const sheet = {
  $schema_note: "Weight-Space Programming field guide - structured fact sheet. Every chart on the site binds to this file.",
  credits: {
    explainer: "Het Patel (Hunterdii) - independent educational explainer",
    source_post: {
      title: SOURCE.title,
      authors: SOURCE.authors,
      lab: SOURCE.lab,
      date: SOURCE.date,
      url: SOURCE.url,
      affiliation_note: "Not affiliated with MIT CSAIL, OpenAI, or the original authors.",
    },
    licence: { code: "MIT", text_and_figures: "CC BY 4.0" },
    fact_check_date: "5 Nov 2026",
  },
  truth_contract: {
    "🟦 paper-reported": "A number or claim stated in the original post",
    "🟩 independent review": "From a third-party analysis (e.g. Maier, 5 Nov 2026)",
    "🟨 teaching schematic": "Invented toy data - ILLUSTRATIVE, NOT REAL DATA",
    "🟥 speculation": "Predictions about the future, untested, including the authors'",
  },
  experiments: EXPERIMENTS,
  tables: {
    minatar: MINATAR,
    qwen_budget: QWEN_BUDGET,
    gemma_control: GEMMA_CONTROL,
    go_logs: GO_LOGS,
    sycophancy_head_10_2: SYCOPHANCY_HEAD,
  },
  predictions: PREDICTIONS,
  horizon: HORIZON,
  risks: RISKS,
  update_log: UPDATE_LOG,
  formulas: FORMULAS.map((f) => ({ id: f.id, name: f.name, latex: f.latex, plain: f.plain, badge: f.badge })),
  glossary: GLOSSARY,
  references: REFERENCES,
  open_verification_items: OPEN_ITEMS,
};

writeFileSync("public/data/fact-sheet.json", JSON.stringify(sheet, null, 2));
console.log("public/data/fact-sheet.json written:", Object.keys(sheet).length, "top-level keys");
