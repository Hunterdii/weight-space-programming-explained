"use client";

import { useState } from "react";
import ModuleChrome from "./ModuleChrome";

interface Q {
  q: string;
  options: string[];
  a: number;
  why: string;
}

const QUESTIONS: Q[] = [
  {
    q: "In one sentence - what is weight-space programming?",
    options: [
      "Training a model with a faster optimizer like Muon",
      "An LLM reading, fixing or writing neural-network weights by reasoning, without gradient descent",
      "Compressing model weights so they fit on edge devices",
      "Using an LLM to generate training data for a smaller model",
    ],
    a: 1,
    why: "That is the whole headline: read · fix · write, by reasoning. (🟦)",
  },
  {
    q: "Experiment 8 edited what fraction of Qwen3.5-0.8B’s weights?",
    options: ["3.5%", "0.5%", "0.016%", "0.0001%"],
    a: 2,
    why: "131,072 of ~0.8B weights - two layers × 64 columns × the model’s width. (🟦)",
  },
  {
    q: "Why is the Gemma 3 270M experiment important?",
    options: [
      "It showed WSP works on vision models too",
      "It was the biggest model edited",
      "It is a negative control: the edit did NOT conjure math ability that wasn’t there",
      "It doubled Gemma’s score on MATH-500",
    ],
    a: 2,
    why: "Gemma’s score barely moved (6.8 → 7.0% at 50 passes) - the Qwen edit removed an obstacle, it didn’t add skill. (🟦)",
  },
  {
    q: "In Experiment 1, how many of the four game policies were correctly named?",
    options: ["2 of 4", "3 of 4", "4 of 4", "1 of 4"],
    a: 2,
    why: "All four - with Breakout named at 99% confidence. Still only four trials, though. (🟦)",
  },
  {
    q: "What subtle mistake did the reader make in Experiment 2 (diffusion shapes)?",
    options: [
      "It named the wrong shape for all three models",
      "It described outlines while the models actually draw filled shapes",
      "It needed 50 forward passes",
      "It confused circle with square only",
    ],
    a: 1,
    why: "All three shapes right, but described as outlines - the reading was correct yet lossy. (🟦)",
  },
  {
    q: "The copying-head identification in Exp 3 echoes which known human technique?",
    options: [
      "Lottery-ticket pruning (Frankle & Carbin)",
      "Task-vector arithmetic (Ilharco et al.)",
      "Induction-head composition analysis (Elhage et al.)",
      "LoRA fine-tuning (Hu et al.)",
    ],
    a: 2,
    why: "A two-head chain [A][B]…[A]→B, found via composition scores - the solid part of Exp 3. (🟦🟩)",
  },
  {
    q: "The ramp-car fix (Exp 4) went from…",
    options: ["0/256 → 1,024/1,024", "10/256 → 900/1,024", "0/256 → 500/1,024", "128/256 → 1,024/1,024"],
    a: 0,
    why: "From zero successes to all 1,024, editing 3.5% of the actor’s weights, one shot. (🟦)",
  },
  {
    q: "On MinAtar Breakout, the one-shot WRITTEN policy scored…",
    options: ["about the same as PPO-500M", "517.4 vs PPO-500M’s 25.3", "less than PPO-100M", "zero - it couldn’t play"],
    a: 1,
    why: "517.4 vs 25.3, averaged over 1,000 episodes, with zero training data. Single run per cell. (🟦)",
  },
  {
    q: "What does the Truth filter (key T) hide on this site?",
    options: [
      "Everything written by me (Het)",
      "🟨 teaching schematics and 🟥 speculation - leaving 🟦 paper-reported and 🟩 reviewed claims",
      "All numbers, leaving only prose",
      "Everything not peer-reviewed",
    ],
    a: 1,
    why: "The site’s honesty mechanism: hide invented teaching data and untested predictions on demand.",
  },
  {
    q: "Which badge means “made-up toy data I created to explain an idea”?",
    options: ["🟦 paper-reported", "🟩 independent review", "🟨 teaching schematic", "🟥 speculation"],
    a: 2,
    why: "Yellow, dashed border, watermarked “ILLUSTRATIVE - NOT REAL DATA”. Never presented as measurement.",
  },
  {
    q: "Why does the independent review discount the sycophancy result (Exp 7) despite “3/3 correct”?",
    options: [
      "The models were too small to matter",
      "Three binary picks = 1-in-8 by chance, and the task had to be relaxed to weights + attention patterns",
      "The benchmark was math, not honesty",
      "It wasn’t replicated on Gemma",
    ],
    a: 1,
    why: "Weights alone failed 4/4; with activations it went 3/3 - a hint, not a proof. (🟩)",
  },
  {
    q: "According to the review, what is missing from EVERY experiment?",
    options: [
      "Parameter counts",
      "Baselines, repeated seeds, other LLMs, author-blind tasks",
      "Release of weights",
      "Formulas",
    ],
    a: 1,
    why: "No cheap-alternative baselines, no ≥5 seeds, one LLM, tasks authored by the same team being evaluated. (🟩)",
  },
  {
    q: "The token-limit share (93% → 33% in Exp 8) matters because…",
    options: [
      "It made the model faster at inference",
      "It checks the mechanism: the edit unblocked existing ability by breaking a thought loop",
      "It shows the edit added math knowledge",
      "It reduced the model’s size",
    ],
    a: 1,
    why: "The mechanism check is what makes Exp 8 the strongest evidence in the set. (🟩)",
  },
  {
    q: "What is “WSP-Bench-Lite”?",
    options: [
      "The authors’ released benchmark harness",
      "A community benchmark PROPOSAL by Het: Read/Fix/Write tracks, mandatory baselines, ≥5 seeds, author-blind tasks",
      "A tool for editing weights in the browser",
      "A Lite version of the Qwen model",
    ],
    a: 1,
    why: "My own addition (clearly credited, 🟥 proposal) to answer the review’s gaps. Full spec in Chapter 12 and /lab.",
  },
  {
    q: "Which of these is currently SPECULATION (🟥), not demonstrated?",
    options: [
      "Writing a Go policy that beats an equal-size PPO",
      "Fixing a broken ramp-climbing actor in one shot",
      "Auditing any model for backdoors just by reading its weights",
      "Fixing Qwen’s math overthinking with a 0.016% edit",
    ],
    a: 2,
    why: "Backdoor-auditing is one of the authors’ five predictions - none tested. The others are reported results. (🟥 vs 🟦)",
  },
];

const SELF_CHECK = [
  "Explain to a friend why “the edit removed an obstacle” ≠ “the edit added an ability”, using the Gemma control.",
  "Draw the decision line of a 2-input neuron from memory, then say what turning one knob does.",
  "Name the four ways weights get written, and what makes the fourth one different.",
  "Argue the strongest case AGAINST Exp 5–6 being impressive, then the strongest case FOR it.",
  "Design one READ task for WSP-Bench-Lite that its authors could not have authored themselves.",
];

export default function M15Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  const score = answers.filter(Boolean).length;

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    setAnswers((a) => [...a, idx === QUESTIONS[i].a]);
  };
  const next = () => {
    if (i + 1 >= QUESTIONS.length) setDone(true);
    else {
      setI(i + 1);
      setPicked(null);
    }
  };
  const restart = () => {
    setI(0);
    setPicked(null);
    setAnswers([]);
    setDone(false);
    setStarted(true);
  };

  const q = QUESTIONS[i];

  return (
    <ModuleChrome
      id="m15-quiz"
      badge="schematic"
      title="M15 · The Quiz (15 questions)"
      blurb="from “what’s a weight?” to designing the next experiment"
      transport={false}
      progress={done ? 1 : answers.length / QUESTIONS.length}
      caption={done ? `Finished: ${score}/15 correct.` : `Question ${i + 1} of 15 - answered: ${answers.length}.`}
      levelCaptions={{
        2: "Questions cover every chapter. Wrong answers explain themselves - the explanation is the lesson.",
        3: "Half the questions target the experimental design details (seeds, controls, mechanisms) because those are what separate “sparks” from hype.",
        5: "If you can pass Q11–Q15 and do the self-checks below without peeking, you can already critique the experiments and propose the next one - the stated goal of this guide.",
      }}
      note="Made by me for this guide - answers cite the badge the fact comes from."
    >
      {!done ? (
        <div className="mx-auto max-w-[680px]">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/40">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(answers.length / QUESTIONS.length) * 100}%`,
                  background: "var(--wsp-chrome)",
                }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-muted-foreground shrink-0">
              {answers.length} / {QUESTIONS.length}
            </span>
          </div>

          <p className="font-serif text-xl font-medium leading-snug text-foreground">{q.q}</p>

          <div className="mt-5 space-y-2.5" role="group" aria-label="Answer options">
            {q.options.map((opt, idx) => {
              const isRight = idx === q.a;
              const isPicked = picked === idx;
              const show = picked !== null;
              return (
                <button
                  key={idx}
                  onClick={() => pick(idx)}
                  disabled={show}
                  aria-pressed={isPicked}
                  className={`group flex w-full items-start gap-3 rounded-xl border p-4 text-left font-sans text-sm transition-all duration-200 ${show && isRight
                      ? "border-[var(--wsp-green)] bg-[color-mix(in_oklab,var(--wsp-green)_14%,transparent)] text-foreground shadow-sm"
                      : show && isPicked
                        ? "border-[var(--wsp-red)] bg-[color-mix(in_oklab,var(--wsp-red)_12%,transparent)] text-foreground"
                        : "border-border/70 bg-card hover:border-[var(--wsp-chrome)]/60 hover:bg-accent/40 hover:-translate-y-0.5"
                    }`}
                >
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold ${show && isRight
                        ? "bg-[var(--wsp-green)] text-[#090c12]"
                        : show && isPicked
                          ? "bg-[var(--wsp-red)] text-white"
                          : "border border-border/80 bg-background/80 text-muted-foreground group-hover:border-[var(--wsp-chrome)] group-hover:text-[var(--wsp-chrome)]"
                      }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-5 rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm animate-in fade-in duration-200">
              <p className="font-sans text-sm leading-relaxed">
                {picked === q.a ? (
                  <strong className="text-[var(--wsp-green)]">Correct! </strong>
                ) : (
                  <strong className="text-[var(--wsp-red)]">
                    Not quite - the answer is {String.fromCharCode(65 + q.a)}.{" "}
                  </strong>
                )}
                <span className="text-muted-foreground">{q.why}</span>
              </p>
              <button
                onClick={next}
                className="mt-4 flex h-11 items-center gap-2 rounded-xl bg-[var(--wsp-chrome)] px-6 font-sans text-sm font-bold text-[#090c12] shadow-sm hover:brightness-110 transition-all hover:-translate-y-0.5"
              >
                {i + 1 >= QUESTIONS.length ? "See Score" : "Next Question"} →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-auto max-w-[680px]">
          <div className="rounded-xl border p-6 text-center">
            <p className="font-sans text-5xl font-black" style={{ color: score >= 12 ? "var(--wsp-green)" : score >= 8 ? "var(--wsp-blue)" : "var(--wsp-amber)" }}>
              {score}/15
            </p>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              {score >= 13
                ? "You can now critique the experiments and propose the next one - the goal of this guide."
                : score >= 8
                  ? "Solid. Revisit the Judgement chapters (8–9) for the ones that got you."
                  : "Take the Guide from L2 again - the ladder exists exactly for this."}
            </p>
            <button onClick={restart} className="mt-4 h-11 rounded-lg border bg-card px-5 font-sans text-sm font-semibold hover:bg-accent">
              Retake
            </button>
          </div>
          <div className="mt-6 rounded-xl border border-dashed p-5">
            <p className="font-sans text-sm font-bold">“Explain it back to me” - the five self-checks</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 font-sans text-sm leading-relaxed text-muted-foreground">
              {SELF_CHECK.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
            <p className="mt-3 font-sans text-xs text-muted-foreground">
              If you can do all five out loud, you have finished the reader journey this guide promised.
            </p>
          </div>
        </div>
      )}
    </ModuleChrome>
  );
}
