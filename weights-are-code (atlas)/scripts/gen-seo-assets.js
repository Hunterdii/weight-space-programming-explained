/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function main() {
  const publicDir = path.resolve(__dirname, "../public");

  // Base icon SVG for 192, 512, apple-touch, favicon
  const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#0b0e14"/>
  <rect x="48" y="48" width="416" height="416" rx="80" fill="none" stroke="#a78bfa" stroke-width="24"/>
  <text x="256" y="360" font-family="Georgia, Cambria, 'Times New Roman', serif" font-size="300" font-weight="bold" text-anchor="middle" fill="#a78bfa">θ</text>
</svg>
`;

  console.log("Generating icon-192.png...");
  await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, "icon-192.png"));

  console.log("Generating icon-512.png...");
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, "icon-512.png"));

  console.log("Generating apple-touch-icon.png...");
  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"));

  console.log("Generating favicon.ico (32x32 PNG format)...");
  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, "favicon.ico"));

  // 1200x630 OpenGraph Image
  const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="glow1" cx="20%" cy="20%" r="50%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0b0e14" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="80%" cy="80%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0b0e14" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#161b26" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0f131c" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#0b0e14"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Subtle border outline -->
  <rect x="20" y="20" width="1160" height="590" rx="20" fill="none" stroke="#262c3a" stroke-width="2"/>

  <!-- Logo Theta Badge -->
  <rect x="80" y="70" width="84" height="84" rx="20" fill="#141824" stroke="#a78bfa" stroke-width="3"/>
  <text x="122" y="132" font-family="Georgia, Cambria, serif" font-size="60" font-weight="bold" text-anchor="middle" fill="#a78bfa">θ</text>

  <!-- Title & Kicker -->
  <text x="186" y="112" font-family="Georgia, Cambria, serif" font-size="44" font-weight="bold" fill="#f8fafc">Weight-Space Programming</text>
  <text x="186" y="146" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="bold" fill="#a78bfa" letter-spacing="2">AN INDEPENDENT INTERACTIVE FIELD GUIDE</text>

  <!-- Subtitle Paragraph -->
  <text x="80" y="210" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#cbd5e1">From zero to frontier: how LLMs read, fix, and write neural-network weights by reasoning.</text>
  <text x="80" y="244" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#94a3b8">13 chapters × 5 audience levels · 15 interactive simulation modules · Runnable Python labs · Whitepaper</text>

  <!-- Feature Cards -->
  <!-- Card 1: FIX -->
  <g transform="translate(80, 290)">
    <rect width="320" height="180" rx="16" fill="url(#cardGrad)" stroke="#f59e0b" stroke-width="2"/>
    <text x="24" y="42" font-family="Consolas, monospace" font-size="14" font-weight="bold" fill="#f59e0b">FIX · 0.016% SURGERY</text>
    <text x="24" y="80" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#f8fafc">7.9% → 48.1%</text>
    <text x="24" y="112" font-family="Arial, sans-serif" font-size="15" fill="#94a3b8">MATH-500 recovery on Qwen3.5-0.8B</text>
    <text x="24" y="142" font-family="Consolas, monospace" font-size="13" fill="#cbd5e1">131,072 / 800,000,000 weights</text>
  </g>

  <!-- Card 2: READ -->
  <g transform="translate(430, 290)">
    <rect width="320" height="180" rx="16" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="2"/>
    <text x="24" y="42" font-family="Consolas, monospace" font-size="14" font-weight="bold" fill="#38bdf8">READ · CIRCUIT LOCALISATION</text>
    <text x="24" y="80" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#f8fafc">100% Exact Match</text>
    <text x="24" y="112" font-family="Arial, sans-serif" font-size="15" fill="#94a3b8">Attention copying heads discovered</text>
    <text x="24" y="142" font-family="Consolas, monospace" font-size="13" fill="#cbd5e1">Read directly from raw weights</text>
  </g>

  <!-- Card 3: TRUTH CONTRACT -->
  <g transform="translate(780, 290)">
    <rect width="340" height="180" rx="16" fill="url(#cardGrad)" stroke="#34d399" stroke-width="2"/>
    <text x="24" y="42" font-family="Consolas, monospace" font-size="14" font-weight="bold" fill="#34d399">THE TRUTH CONTRACT</text>
    <text x="24" y="80" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#f8fafc">Badge-Honest</text>
    <text x="24" y="112" font-family="Arial, sans-serif" font-size="15" fill="#94a3b8">Paper · Review · Schematic · Toy</text>
    <text x="24" y="142" font-family="Consolas, monospace" font-size="13" fill="#cbd5e1">Zero speculation unflagged</text>
  </g>

  <!-- Footer Line -->
  <line x1="80" y1="520" x2="1120" y2="520" stroke="#262c3a" stroke-width="1.5"/>
  <text x="80" y="560" font-family="Consolas, monospace" font-size="15" fill="#94a3b8">Authored by Het Patel (Hunterdii) · Based on MIT CSAIL report (Takehi, Teoh, Zhang, Khattab, Nov 2026)</text>
  <text x="1120" y="560" font-family="Consolas, monospace" font-size="15" font-weight="bold" text-anchor="end" fill="#a78bfa">weight-space-programming.vercel.app</text>
</svg>
`;

  console.log("Generating og-image.png...");
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, "og-image.png"));

  console.log("All SEO assets generated successfully!");
}

main().catch((err) => {
  console.error("Failed to generate SEO assets:", err);
  process.exit(1);
});
