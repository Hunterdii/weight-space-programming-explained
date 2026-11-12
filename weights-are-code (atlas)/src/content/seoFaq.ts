export interface FaqItem {
  question: string;
  answerHtml: string;
  answerPlain: string;
  category: "Fundamentals" | "Techniques" | "Tools & Implementation" | "Compliance";
}

export const SEO_FAQS: FaqItem[] = [
  {
    question: "What is Weight-Space Programming (WSP)?",
    answerHtml:
      "<p><strong>Weight-Space Programming (WSP)</strong> is an AI engineering paradigm in which a language model or researcher directly reads, diagnoses, writes, and edits the numerical parameters (weights) of a neural network around natural-language specifications-operating directly on model weights like source code without relying on gradient descent or traditional training loops.</p>",
    answerPlain:
      "Weight-Space Programming (WSP) is an AI engineering paradigm in which a language model or researcher directly reads, diagnoses, writes, and edits the numerical parameters (weights) of a neural network around natural-language specifications-operating directly on model weights like source code without relying on gradient descent or traditional training loops.",
    category: "Fundamentals",
  },
  {
    question: "Can an AI model identify what a neural network does from its weights alone?",
    answerHtml:
      "<p>Yes. Through weight-space analysis, frontier models and meta-classifiers can inspect unlabeled weight tensors, layer geometries, and activation signatures to infer what task or reinforcement-learning environment a network was trained on, often without executing a standard training pass.</p>",
    answerPlain:
      "Yes. Through weight-space analysis, frontier models and meta-classifiers can inspect unlabeled weight tensors, layer geometries, and activation signatures to infer what task or reinforcement-learning environment a network was trained on, often without executing a standard training pass.",
    category: "Fundamentals",
  },
  {
    question: "How can I edit neural network weights without gradient descent?",
    answerHtml:
      "<p>You can edit weights without gradient descent by following a four-stage surgical workflow: <strong>Observe</strong> forward-pass activations, <strong>Diagnose</strong> the specific hidden-space directions and MLP/attention matrices responsible for a behavior, <strong>Test</strong> counterfactual interventions, and <strong>Edit</strong> the targeted weight columns directly via mathematical projection.</p>",
    answerPlain:
      "You can edit weights without gradient descent by following a four-stage surgical workflow: Observe forward-pass activations, Diagnose the specific hidden-space directions and MLP/attention matrices responsible for a behavior, Test counterfactual interventions, and Edit the targeted weight columns directly via mathematical projection.",
    category: "Techniques",
  },
  {
    question: "How do I inspect which weight matrices control a specific model behavior?",
    answerHtml:
      "<p>By comparing internal hidden-state activations between successful and failing forward passes, you can compute contrast directions and trace them back to specific transformer blocks-such as specific columns in MLP down-projection or gate-projection matrices-to pinpoint where behavioral bottlenecks originate.</p>",
    answerPlain:
      "By comparing internal hidden-state activations between successful and failing forward passes, you can compute contrast directions and trace them back to specific transformer blocks-such as specific columns in MLP down-projection or gate-projection matrices-to pinpoint where behavioral bottlenecks originate.",
    category: "Techniques",
  },
  {
    question: "Can I use an LLM agent to debug and patch another AI model's weights?",
    answerHtml:
      "<p>Yes. In Weight-Space Programming, an AI coding agent can inspect a target model's parameter tensors, run diagnostic probes in Python, locate defective circuits (such as infinite reasoning loops), and apply a compact numerical patch that persists across future deployments.</p>",
    answerPlain:
      "Yes. In Weight-Space Programming, an AI coding agent can inspect a target model's parameter tensors, run diagnostic probes in Python, locate defective circuits (such as infinite reasoning loops), and apply a compact numerical patch that persists across future deployments.",
    category: "Techniques",
  },
  {
    question: "Is there a free interactive lab for Weight-Space Programming?",
    answerHtml:
      "<p>Yes. This platform provides free, browser-based interactive visualizers and pedagogical sandboxes where students, developers, and interpretability researchers can inspect and edit neural weights hands-on.</p>",
    answerPlain:
      "Yes. This platform provides free, browser-based interactive visualizers and pedagogical sandboxes where students, developers, and interpretability researchers can inspect and edit neural weights hands-on.",
    category: "Tools & Implementation",
  },
  {
    question: "How does Weight-Space Programming differ from fine-tuning, LoRA, and ROME?",
    answerHtml:
      "<p>Traditional fine-tuning and LoRA rely on datasets, loss functions, and backpropagation over many GPU hours. Fixed-algorithm editors like ROME target single factual associations. Weight-Space Programming uses iterative diagnostic reasoning to make surgical, low-rank or column-level parameter edits-often modifying less than 0.02% of weights-to repair systemic behavioral flaws.</p>",
    answerPlain:
      "Traditional fine-tuning and LoRA rely on datasets, loss functions, and backpropagation over many GPU hours. Fixed-algorithm editors like ROME target single factual associations. Weight-Space Programming uses iterative diagnostic reasoning to make surgical, low-rank or column-level parameter edits-often modifying less than 0.02% of weights-to repair systemic behavioral flaws.",
    category: "Fundamentals",
  },
  {
    question: "Can I fix repetitive reasoning loops in small open-weights models via weight surgery?",
    answerHtml:
      "<p>Yes. Research demonstrations on compact models like Qwen3.5-0.8B show that modifying roughly 0.016% of parameters across specific middle-layer MLP matrices can suppress repetitive thinking loops and unlock latent mathematical and instruction-following capabilities without retraining.</p>",
    answerPlain:
      "Yes. Research demonstrations on compact models like Qwen3.5-0.8B show that modifying roughly 0.016% of parameters across specific middle-layer MLP matrices can suppress repetitive thinking loops and unlock latent mathematical and instruction-following capabilities without retraining.",
    category: "Techniques",
  },
  {
    question: "Where can I experiment with neural network weight-space geometry?",
    answerHtml:
      "<p>You can explore weight-space geometry directly on our interactive platform. Our modules guide you through visualizing weight matrices, activation subspaces, and parameter diffs in real time.</p>",
    answerPlain:
      "You can explore weight-space geometry directly on our interactive platform. Our modules guide you through visualizing weight matrices, activation subspaces, and parameter diffs in real time.",
    category: "Tools & Implementation",
  },
  {
    question: "How do I isolate a specific activation direction in a transformer MLP layer?",
    answerHtml:
      "<p>You collect residual-stream states during target behaviors (such as token repetition vs. clean completion), extract the dominant principal component or difference-in-means vector, and project that vector against the columns of candidate MLP weight matrices to find the highest-alignment parameters.</p>",
    answerPlain:
      "You collect residual-stream states during target behaviors (such as token repetition vs. clean completion), extract the dominant principal component or difference-in-means vector, and project that vector against the columns of candidate MLP weight matrices to find the highest-alignment parameters.",
    category: "Techniques",
  },
  {
    question: "What hardware and compute resources are required to reproduce zero-gradient weight editing?",
    answerHtml:
      "<p>Unlike pre-training or LoRA fine-tuning which require multi-GPU clusters and backpropagation libraries, the core weight reading experiments (Exps 1–4) run in milliseconds on standard consumer CPUs using basic linear algebra in NumPy. Full parameter surgery on compact language models like Qwen3.5-0.8B (Exp. 8) requires only a single modest GPU (2–4 GB VRAM) to execute diagnostic forward passes and compute rank-1 projection operators-eliminating the need for gradient accumulation, optimizer states, or distributed infrastructure.</p>",
    answerPlain:
      "Unlike pre-training or LoRA fine-tuning which require multi-GPU clusters and backpropagation libraries, the core weight reading experiments (Exps 1–4) run in milliseconds on standard consumer CPUs using basic linear algebra in NumPy. Full parameter surgery on compact language models like Qwen3.5-0.8B (Exp. 8) requires only a single modest GPU (2–4 GB VRAM) to execute diagnostic forward passes and compute rank-1 projection operators-eliminating the need for gradient accumulation, optimizer states, or distributed infrastructure.",
    category: "Techniques",
  },
  {
    question: "Can Weight-Space Programming write a working neural network from scratch?",
    answerHtml:
      "<p>For small control and algorithmic architectures, yes. By translating task rules and geometric constraints directly into weight matrices and biases, an agent can construct functional policy networks from scratch without reinforcement learning rollouts.</p>",
    answerPlain:
      "For small control and algorithmic architectures, yes. By translating task rules and geometric constraints directly into weight matrices and biases, an agent can construct functional policy networks from scratch without reinforcement learning rollouts.",
    category: "Fundamentals",
  },
  {
    question: "Is this Weight-Space Programming platform affiliated with MIT CSAIL or OpenAI?",
    answerHtml:
      "<p><strong>Independent Status:</strong> No. This platform is an independent open educational monograph and interactive lab designed for machine learning researchers and developers. It is not affiliated with, sponsored by, or endorsed by MIT CSAIL or OpenAI.</p>",
    answerPlain:
      "Independent Status: No. This platform is an independent open educational monograph and interactive lab designed for machine learning researchers and developers. It is not affiliated with, sponsored by, or endorsed by MIT CSAIL or OpenAI.",
    category: "Compliance",
  },
];

