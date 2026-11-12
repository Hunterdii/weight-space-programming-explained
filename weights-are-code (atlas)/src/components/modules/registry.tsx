"use client";

import type { ReactNode } from "react";
import M1KnobRoom from "./M1KnobRoom";
import M2TwoWaysToMove from "./M2TwoWaysToMove";
import M3ReadTheNumbers from "./M3ReadTheNumbers";
import M4CompileARule from "./M4CompileARule";
import M5DirectionSurgery from "./M5DirectionSurgery";
import M6BudgetDial from "./M6BudgetDial";
import M7ExperimentGallery from "./M7ExperimentGallery";
import M8CopyingHeadGrid from "./M8CopyingHeadGrid";
import M9WhoWritesWeights from "./M9WhoWritesWeights";
import M10AttentionHeatmap from "./M10AttentionHeatmap";
import M11BlastRadius from "./M11BlastRadius";
import M12RiskRadar from "./M12RiskRadar";
import M13FuturesSlider from "./M13FuturesSlider";
import M14Scoreboard from "./M14Scoreboard";
import M15Quiz from "./M15Quiz";

export const MODULES: Record<string, ReactNode> = {
  "m1-knob-room": <M1KnobRoom />,
  "m2-two-ways": <M2TwoWaysToMove />,
  "m3-read-numbers": <M3ReadTheNumbers />,
  "m4-compile-rule": <M4CompileARule />,
  "m5-direction-surgery": <M5DirectionSurgery />,
  "m6-budget-dial": <M6BudgetDial />,
  "m7-gallery": <M7ExperimentGallery />,
  "m8-head-grid": <M8CopyingHeadGrid />,
  "m9-who-writes": <M9WhoWritesWeights />,
  "m10-attention": <M10AttentionHeatmap />,
  "m11-blast-radius": <M11BlastRadius />,
  "m12-risk-radar": <M12RiskRadar />,
  "m13-futures": <M13FuturesSlider />,
  "m14-scoreboard": <M14Scoreboard />,
  "m15-quiz": <M15Quiz />,
};
