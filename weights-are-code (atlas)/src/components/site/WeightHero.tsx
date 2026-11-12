"use client";

/**
 * WeightHero - Full-bleed blended landing hero with GPU-accelerated WebGL weight-matrix scene.
 *
 * Architecture:
 * - Hand-written GLSL shaders: animation computed entirely in vertex shader
 * - Zero per-frame JS buffer reallocations (static VBO/IBO on GPU)
 * - Canvas seamlessly blends with the page background (NO enclosing card border!)
 * - Left side: strictly aligned with site container (max-w-[1680px] px-4 sm:px-6 lg:px-10)
 * - Right side: 3D matrix shifted right via camera matrix + smooth alpha mask on canvas
 * - Bottom-right: glassmorphic floating telemetry HUD with interactive phase chips & Inject ΔW
 * - Drag to orbit with momentum damping · hover to raycast cell weight · click to send ΔW pulse
 * - Auto-pauses off-screen (IntersectionObserver + visibilitychange) · DPR capped at 1.75
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Layers,
  FlaskConical,
  Zap,
} from "lucide-react";

/* ─────────────────────────────────────────── types & constants ── */

type PhaseId = "read" | "fix" | "write";
type ThemeId = "dark" | "light";

interface PhaseDef {
  id: PhaseId;
  label: string;
  exp: string;
  caption: string;
}

const PHASES: readonly PhaseDef[] = [
  { id: "read", label: "READ", exp: "Exp 1–3", caption: "Inspect raw weights. No forward pass, no tools." },
  { id: "fix", label: "FIX", exp: "Exp 4 · 8", caption: "W′ = (I − u·uᵀ)W on 64 columns in layers 15 and 19." },
  { id: "write", label: "WRITE", exp: "Exp 5 · 6", caption: "A policy compiled from a spec. Zero gradient steps." },
] as const;

const PHASE_SECONDS: Record<PhaseId, number> = { read: 6, fix: 7, write: 7.5 };
const NEXT: Record<PhaseId, PhaseId> = { read: "fix", fix: "write", write: "read" };

const WORLD_W = 3.4;
const WORLD_D = 2.1;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeInOut = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };

/* ────────────────────────────────────── tiny mat4 toolkit (col-major) ── */

type Vec3 = [number, number, number];
type M4 = Float32Array;

const mul = (a: M4, b: M4): M4 => {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
};

const perspective = (fovy: number, aspect: number, near: number, far: number): M4 => {
  const f = 1 / Math.tan(fovy / 2);
  const o = new Float32Array(16);
  o[0] = f / aspect; o[5] = f;
  o[10] = (far + near) / (near - far); o[11] = -1;
  o[14] = (2 * far * near) / (near - far);
  return o;
};

const lookAt = (eye: Vec3, center: Vec3, up: Vec3): M4 => {
  let zx = eye[0] - center[0], zy = eye[1] - center[1], zz = eye[2] - center[2];
  let l = Math.hypot(zx, zy, zz) || 1; zx /= l; zy /= l; zz /= l;
  let xx = up[1] * zz - up[2] * zy, xy = up[2] * zx - up[0] * zz, xz = up[0] * zy - up[1] * zx;
  l = Math.hypot(xx, xy, xz) || 1; xx /= l; xy /= l; xz /= l;
  const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
  const o = new Float32Array(16);
  o[0] = xx; o[1] = yx; o[2] = zx;
  o[4] = xy; o[5] = yy; o[6] = zy;
  o[8] = xz; o[9] = yz; o[10] = zz;
  o[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]);
  o[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
  o[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
  o[15] = 1;
  return o;
};

const invert = (m: M4): M4 | null => {
  const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = m;
  const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10;
  const b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
  const b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30;
  const b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) return null; det = 1 / det;
  const o = new Float32Array(16);
  o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det; o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det; o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det; o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det; o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det; o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det; o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det; o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det; o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return o;
};

const rayToPlane = (inv: M4, nx: number, ny: number, planeY: number): [number, number] | null => {
  const up = (z: number): Vec3 => {
    const x = inv[0] * nx + inv[4] * ny + inv[8] * z + inv[12];
    const y = inv[1] * nx + inv[5] * ny + inv[9] * z + inv[13];
    const zz = inv[2] * nx + inv[6] * ny + inv[10] * z + inv[14];
    const w = inv[3] * nx + inv[7] * ny + inv[11] * z + inv[15] || 1;
    return [x / w, y / w, zz / w];
  };
  const p0 = up(-1), p1 = up(1);
  const dy = p1[1] - p0[1];
  if (Math.abs(dy) < 1e-6) return null;
  const t = (planeY - p0[1]) / dy;
  return [p0[0] + (p1[0] - p0[0]) * t, p0[2] + (p1[2] - p0[2]) * t];
};

/* ──────────────────────────────────────────────────── GLSL shaders ── */

const VERT = /* glsl */`
precision highp float;
attribute vec2 aG;
uniform mat4 uVP;
uniform vec2 uDim;
uniform float uT,uRead,uFix,uWrite,uPtScale,uDpr,uPass,uPtrOn;
uniform vec2 uPtr;
uniform vec3 uPulse;
varying float vH,vScan,vDef,vHeal,vWr,vCur,vEdge,vRead,vRow;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vnoise(vec2 p){
  vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
float box(float x,float lo,float hi,float s){return smoothstep(lo-s,lo,x)*(1.0-smoothstep(hi,hi+s,x));}

float pattern(vec2 g,float t){
  float bx=0.5+0.34*sin(t*0.9),by=0.60+0.17*sin(t*1.45+1.0),px=0.5+0.34*sin(t*0.9-0.28);
  float brickCols=step(0.07,g.x)*step(g.x,0.93)*step(fract((g.x-0.07)/0.1075),0.80);
  float brickRows=step(0.10,g.y)*step(g.y,0.315)*step(fract((g.y-0.10)/0.072),0.62);
  float ball=1.0-smoothstep(0.075,0.105,length((g-vec2(bx,by))*vec2(${WORLD_W.toFixed(1)},${WORLD_D.toFixed(1)})));
  float paddle=box(g.x,px-0.095,px+0.095,0.004)*box(g.y,0.835,0.885,0.004);
  return max(max(brickCols*brickRows*0.78,ball*1.0),paddle*0.9);
}

void main(){
  vec2 g=aG, cell=floor(g*uDim+0.5);
  float n=0.5*vnoise(g*vec2(5.0,3.4)+vec2(uT*0.025,0.0))+0.5*hash(cell*0.37+7.1);
  float base=max(n-0.12,0.0)*0.62+0.035*sin(uT*0.8+g.x*6.0+g.y*4.0);

  float bandA=box(g.x,0.285,0.335,0.004), bandB=box(g.x,0.665,0.715,0.004), band=max(bandA,bandB);
  float amp=(0.55+0.45*hash(vec2(cell.y,3.0+floor(g.x*2.0))))*(1.15+0.35*sin(uT*5.0+g.y*18.0));
  float front=uFix*1.32-0.14, remain=smoothstep(front-0.07,front+0.07,g.y);
  float flash=band*exp(-pow((g.y-front)/0.06,2.0))*step(0.001,uFix)*(1.0-step(0.999,uFix));
  float h=mix(base,base*0.55,band*(1.0-remain))+band*amp*remain*0.58;

  float sx=uRead*1.12-0.06, d=g.x-sx, live=step(0.001,uRead)*(1.0-step(0.999,uRead));
  float beam=exp(-pow(d*26.0,2.0))*live, trail=step(d,0.0)*exp(d*3.2)*0.35*live;
  float readTint=step(g.x,sx)*(1.0-uFix)*0.35;
  float rowAmt=smoothstep(0.78,1.0,uRead)*(1.0-uFix);
  vRow=exp(-pow((g.y-0.86)*34.0,2.0))*rowAmt;
  h+=beam*0.16+vRow*0.28;

  float rev=smoothstep(0.0,0.1,uWrite*1.25-g.y*0.95-hash(cell+3.7)*0.12);
  float pat=pattern(g,uT);
  h=mix(h*(1.0-0.7*rev),pat*0.6+0.03,rev);

  float dc=length((g-uPtr)*vec2(${WORLD_W.toFixed(1)},${WORLD_D.toFixed(1)}));
  float cur=exp(-dc*dc*16.0)*uPtrOn;
  float age=uT-uPulse.z, ring=0.0;
  if(age>0.0&&age<3.0){
    float rd=length((g-uPulse.xy)*vec2(${WORLD_W.toFixed(1)},${WORLD_D.toFixed(1)}));
    ring=exp(-pow((rd-age*1.5)*7.0,2.0))*exp(-age*1.25);
  }
  h+=cur*0.1+ring*0.3;

  vH=clamp(h*1.25,0.0,1.4); vScan=clamp(beam+trail+ring*0.7,0.0,1.0);
  vRead=readTint; vDef=band*remain*(1.0-rev);
  vHeal=clamp(flash*1.4+band*(1.0-remain)*0.45*(1.0-rev),0.0,1.0);
  vWr=clamp(rev*pat,0.0,1.0); vCur=cur;
  vEdge=1.0-smoothstep(0.80,1.0,max(abs(g.x-0.5),abs(g.y-0.5))*2.0);

  vec3 pos=vec3((g.x-0.5)*${WORLD_W.toFixed(1)},h*0.85,(g.y-0.5)*${WORLD_D.toFixed(1)});
  gl_Position=uVP*vec4(pos,1.0);
  float sz=2.1+2.4*vH+6.0*max(vScan,max(vDef,vWr))+4.0*vCur+4.0*vRow;
  gl_PointSize=sz*uDpr*uPtScale/max(gl_Position.w,0.1);
}`;

const FRAG = /* glsl */`
precision mediump float;
uniform float uPass,uLight;
uniform vec3 uC0,uC1,uC2,uScanC,uDefC,uHealC,uWrC,uCurC;
varying float vH,vScan,vDef,vHeal,vWr,vCur,vEdge,vRead,vRow;
void main(){
  float disc=1.0;
  if(uPass>0.5){float r=length(gl_PointCoord-0.5);if(r>0.5)discard;disc=smoothstep(0.5,0.12,r);}
  vec3 col=mix(uC0,uC1,smoothstep(0.0,0.55,vH));
  col=mix(col,uC2,smoothstep(0.55,1.1,vH));
  col=mix(col,uScanC,clamp(vScan+vRead+vRow,0.0,1.0));
  col=mix(col,uHealC,clamp(vHeal,0.0,1.0));
  col=mix(col,uDefC, clamp(vDef,0.0,1.0));
  col=mix(col,uWrC,  clamp(vWr,0.0,1.0));
  col=mix(col,uCurC, clamp(vCur,0.0,1.0)*0.75);
  float hot=max(max(vScan,vDef),max(max(vWr,vCur),max(vHeal*0.8,vRow)));
  float a=(uPass>0.5?0.50+0.42*min(vH,1.0):0.07+0.2*min(vH,1.0))+0.5*hot;
  a*=disc*vEdge; a=min(a,uLight>0.5?0.95:0.85);
  gl_FragColor=vec4(col,a);
}`;

type Rgb = [number, number, number];
interface Palette { c0: Rgb; c1: Rgb; c2: Rgb; scan: Rgb; def: Rgb; heal: Rgb; wr: Rgb; cur: Rgb; }

const PALETTE: Record<ThemeId, Palette> = {
  dark: {
    c0: [0.2, 0.27, 0.62], c1: [0.3, 0.55, 0.98], c2: [0.62, 0.86, 1.0],
    scan: [0.2, 0.92, 1.0], def: [1.0, 0.31, 0.27], heal: [0.3, 1.0, 0.62],
    wr: [1.0, 0.76, 0.24], cur: [1.0, 1.0, 1.0]
  },
  light: {
    c0: [0.58, 0.63, 0.82], c1: [0.22, 0.32, 0.78], c2: [0.07, 0.12, 0.42],
    scan: [0.0, 0.52, 0.72], def: [0.86, 0.14, 0.14], heal: [0.02, 0.6, 0.36],
    wr: [0.8, 0.46, 0.0], cur: [0.04, 0.07, 0.2]
  },
};

/* ──────────────────────────────────────── WebGL renderer object ── */

interface FrameState { t: number; read: number; fix: number; write: number; vp: M4; ptr: [number, number] | null; pulse: Vec3; theme: ThemeId; dpr: number; ptScale: number; }
interface Renderer { draw: (s: FrameState) => void; resize: (w: number, h: number, dpr: number) => void; dispose: () => void; }

const compileShader = (gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null => {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src); gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { gl.deleteShader(sh); return null; }
  return sh;
};

const createRenderer = (canvas: HTMLCanvasElement, cols: number, rows: number): Renderer | null => {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, powerPreference: "high-performance" });
  if (!gl) return null;

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs); gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  // Static grid: upload once to GPU
  const verts = new Float32Array(cols * rows * 2);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 2;
      verts[i] = c / (cols - 1); verts[i + 1] = r / (rows - 1);
    }
  const lineIdx: number[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (c < cols - 1) lineIdx.push(i, i + 1);
      if (r < rows - 1) lineIdx.push(i, i + cols);
    }
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const aG = gl.getAttribLocation(prog, "aG");
  gl.enableVertexAttribArray(aG);
  gl.vertexAttribPointer(aG, 2, gl.FLOAT, false, 0, 0);
  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lineIdx), gl.STATIC_DRAW);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const loc = {
    vp: U("uVP"), dim: U("uDim"), t: U("uT"), read: U("uRead"), fix: U("uFix"), write: U("uWrite"),
    ptScale: U("uPtScale"), dpr: U("uDpr"), pass: U("uPass"), ptrOn: U("uPtrOn"), ptr: U("uPtr"),
    pulse: U("uPulse"), light: U("uLight"), c0: U("uC0"), c1: U("uC1"), c2: U("uC2"),
    scan: U("uScanC"), def: U("uDefC"), heal: U("uHealC"), wr: U("uWrC"), cur: U("uCurC")
  };
  gl.uniform2f(loc.dim, cols - 1, rows - 1);
  gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND);

  return {
    resize(w, h, dpr) { canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(h * dpr)); gl.viewport(0, 0, canvas.width, canvas.height); },
    draw(s) {
      const pal = PALETTE[s.theme], light = s.theme === "light";
      if (light) gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      else gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(loc.vp, false, s.vp);
      gl.uniform1f(loc.t, s.t); gl.uniform1f(loc.read, s.read); gl.uniform1f(loc.fix, s.fix);
      gl.uniform1f(loc.write, s.write); gl.uniform1f(loc.ptScale, s.ptScale);
      gl.uniform1f(loc.dpr, s.dpr); gl.uniform1f(loc.ptrOn, s.ptr ? 1 : 0);
      gl.uniform2f(loc.ptr, s.ptr ? s.ptr[0] : -9, s.ptr ? s.ptr[1] : -9);
      gl.uniform3f(loc.pulse, s.pulse[0], s.pulse[1], s.pulse[2]);
      gl.uniform1f(loc.light, light ? 1 : 0);
      gl.uniform3fv(loc.c0, pal.c0); gl.uniform3fv(loc.c1, pal.c1); gl.uniform3fv(loc.c2, pal.c2);
      gl.uniform3fv(loc.scan, pal.scan); gl.uniform3fv(loc.def, pal.def);
      gl.uniform3fv(loc.heal, pal.heal); gl.uniform3fv(loc.wr, pal.wr); gl.uniform3fv(loc.cur, pal.cur);
      gl.uniform1f(loc.pass, 0); gl.drawElements(gl.LINES, lineIdx.length, gl.UNSIGNED_SHORT, 0);
      gl.uniform1f(loc.pass, 1); gl.drawArrays(gl.POINTS, 0, cols * rows);
    },
    dispose() {
      gl.deleteBuffer(vbo); gl.deleteBuffer(ibo);
      gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
};

/* ─────────────────────────────────────────── theme detection ── */

const detectTheme = (): ThemeId => {
  if (typeof document === "undefined") return "dark";
  if (document.documentElement.classList.contains("dark")) return "dark";
  const m = getComputedStyle(document.body).color.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    const lum = (0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2]) / 255;
    return lum > 0.55 ? "dark" : "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const pseudoWeight = (r: number, c: number): number => {
  const x = Math.sin(r * 127.1 + c * 311.7) * 43758.5453;
  return (x - Math.floor(x)) - 0.5;
};

/* ─────────────────────────────────────────────────── component ── */

export default function WeightHero({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accRef = useRef<HTMLSpanElement>(null);
  const tokRef = useRef<HTMLSpanElement>(null);
  const editRef = useRef<HTMLSpanElement>(null);
  const cellRef = useRef<HTMLSpanElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const goRef = useRef<(p: PhaseId) => void>(() => undefined);

  const [phase, setPhase] = useState<PhaseId>("read");
  const [theme, setTheme] = useState<ThemeId>("dark");
  const [failed, setFailed] = useState(false);

  const jump = useCallback((p: PhaseId) => goRef.current(p), []);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!root || !stage || !canvas) return;

    /* ── theme ── */
    let themeNow: ThemeId = detectTheme();
    setTheme(themeNow);
    const refreshTheme = () => {
      const next = detectTheme();
      if (next !== themeNow) { themeNow = next; setTheme(next); requestFrame(); }
    };
    const mo = new MutationObserver(() => { refreshTheme(); window.setTimeout(refreshTheme, 250); });
    mo.observe(document.documentElement, { attributes: true });
    mo.observe(document.body, { attributes: true });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", refreshTheme);

    /* ── renderer ── */
    const small = window.innerWidth < 700;
    const cols = small ? 72 : 96;
    const rows = small ? 44 : 56;
    const maxDpr = small ? 1.5 : 1.75;
    let renderer: Renderer | null = createRenderer(canvas, cols, rows);
    if (!renderer) {
      setFailed(true);
      return () => { mo.disconnect(); mq.removeEventListener("change", refreshTheme); };
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── mutable state ── */
    let phaseId: PhaseId = "read", phaseT = 0, holdUntil = 0;
    const cur = { read: 0, fix: 0, write: 0 };
    let yaw = -0.42, pitch = 0.62, yawTarget = yaw, pitchTarget = pitch;
    let parX = 0, parY = 0;
    let ptrNdc: [number, number] | null = null;
    let ptrGrid: [number, number] | null = null;
    const pulse: Vec3 = [0.5, 0.5, -99];
    let t = 0, w = 1, h = 1, dpr = 1, aspect = 1;
    let vp: M4 = new Float32Array(16), inv: M4 | null = null;
    let raf = 0, last = 0, inView = true, hidden = document.hidden;
    let fpsEma = 60, framesSeen = 0, hudClock = 0;
    let drag: { x: number; y: number; yaw: number; pitch: number; moved: boolean } | null = null;

    const targets = (id: PhaseId, p: number) => {
      if (id === "read") return { read: easeInOut(p / 0.8), fix: 0, write: 0 };
      if (id === "fix") return { read: 1, fix: easeInOut((p - 0.18) / 0.62), write: 0 };
      return { read: 1, fix: 1, write: easeInOut((p - 0.08) / 0.7) };
    };

    const buildCamera = () => {
      const wide = window.innerWidth >= 900 && aspect > 1.25;
      const dist = wide ? 4.9 : 4.6 / Math.min(1, aspect * 0.92 + 0.12);
      const eye: Vec3 = [
        dist * Math.cos(pitch) * Math.sin(yaw),
        dist * Math.sin(pitch) + 0.12,
        dist * Math.cos(pitch) * Math.cos(yaw)
      ];
      const view = lookAt(eye, [0, 0.12, 0], [0, 1, 0]);
      const proj = perspective((wide ? 33 : 38) * (Math.PI / 180), aspect, 0.1, 40);
      const shift = new Float32Array(16);
      shift[0] = shift[5] = shift[10] = shift[15] = 1;
      // Push the 3D scene cleanly to the right so the editorial text occupies the left
      shift[12] = wide ? 0.32 : 0;
      shift[13] = wide ? -0.02 : 0;
      vp = mul(shift, mul(proj, view));
      inv = invert(vp);
    };

    const updatePointer = () => {
      if (!ptrNdc || !inv) { ptrGrid = null; return; }
      const hit = rayToPlane(inv, ptrNdc[0], ptrNdc[1], 0.2);
      if (!hit) { ptrGrid = null; return; }
      const gx = hit[0] / WORLD_W + 0.5, gy = hit[1] / WORLD_D + 0.5;
      ptrGrid = gx >= 0 && gx <= 1 && gy >= 0 && gy <= 1 ? [gx, gy] : null;
    };

    const draw = () => {
      if (!renderer) return;
      renderer.draw({
        t, read: cur.read, fix: cur.fix, write: cur.write,
        vp, ptr: ptrGrid, pulse, theme: themeNow, dpr,
        ptScale: 4.4 * Math.min(1.3, Math.max(0.55, h / 760))
      });
    };

    const writeHud = () => {
      const f = cur.fix;
      if (accRef.current) accRef.current.textContent = `${(7.9 + 40.2 * f).toFixed(1)}%`;
      if (tokRef.current) tokRef.current.textContent = `${(93.0 - 59.9 * f).toFixed(1)}%`;
      if (editRef.current) editRef.current.textContent = Math.round(131072 * f).toLocaleString("en-US");
      if (cellRef.current) {
        if (ptrGrid) {
          const c = Math.round(ptrGrid[0] * (cols - 1)), r = Math.round(ptrGrid[1] * (rows - 1));
          const v = pseudoWeight(r, c);
          cellRef.current.textContent = `θ[r${r}, c${c}] = ${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(3)}`;
        } else {
          cellRef.current.textContent = "hover the matrix to read a weight";
        }
      }
      if (fpsRef.current) fpsRef.current.textContent = framesSeen > 30 ? `${Math.round(fpsEma)} fps` : "60 fps";
    };

    const step = (dt: number) => {
      t += dt; phaseT += dt;
      const len = PHASE_SECONDS[phaseId];
      if (phaseT >= len) {
        if (t < holdUntil) { phaseT = len; }
        else { phaseId = NEXT[phaseId]; phaseT = 0; setPhase(phaseId); }
      }
      const tg = targets(phaseId, phaseT / len);
      (["read", "fix", "write"] as const).forEach(k => {
        const rate = tg[k] > cur[k] ? 9 : 5;
        cur[k] += (tg[k] - cur[k]) * (1 - Math.exp(-dt * rate));
        if (Math.abs(tg[k] - cur[k]) < 0.0004) cur[k] = tg[k];
      });
      const driftYaw = reduced ? 0 : Math.sin(t * 0.13) * 0.1;
      yaw += (yawTarget + driftYaw + parX * 0.1 - yaw) * (1 - Math.exp(-dt * 4));
      pitch += (pitchTarget + parY * 0.04 - pitch) * (1 - Math.exp(-dt * 4));
      buildCamera(); updatePointer();
    };

    const running = () => !reduced && inView && !hidden;
    const schedule = () => { if (!raf && running()) raf = requestAnimationFrame(frame); };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now; framesSeen++;
      fpsEma = framesSeen === 1 ? Math.min(120, 1 / dt) : fpsEma + (Math.min(120, 1 / dt) - fpsEma) * 0.05;
      step(dt); draw();
      hudClock += dt;
      if (hudClock > 0.1) { hudClock = 0; writeHud(); }
      schedule();
    };

    function requestFrame() {
      if (running()) { schedule(); return; }
      step(0.0001); draw(); writeHud();
    }

    goRef.current = (p: PhaseId) => {
      phaseId = p; phaseT = 0; holdUntil = t + 16; setPhase(p);
      if (reduced) { phaseT = PHASE_SECONDS[p] * 0.95; for (let i = 0; i < 60; i++) step(0.05); phaseT = PHASE_SECONDS[p] * 0.95; }
      requestFrame();
    };

    /* ── resize ── */
    const resize = () => {
      const rect = stage.getBoundingClientRect();
      w = Math.max(1, rect.width); h = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr); aspect = w / h;
      renderer?.resize(w, h, dpr); buildCamera(); requestFrame();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    /* ── visibility ── */
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) { last = performance.now(); schedule(); }
    }, { threshold: 0.02 });
    io.observe(root);
    const onVis = () => { hidden = document.hidden; if (!hidden) { last = performance.now(); schedule(); } };
    document.addEventListener("visibilitychange", onVis);

    /* ── pointer ── */
    const toNdc = (e: PointerEvent): [number, number] => {
      const r = canvas.getBoundingClientRect();
      return [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)];
    };
    const onMove = (e: PointerEvent) => {
      ptrNdc = toNdc(e); parX = ptrNdc[0]; parY = ptrNdc[1];
      if (drag) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
        yawTarget = drag.yaw - dx * 0.006;
        pitchTarget = Math.min(1.1, Math.max(0.22, drag.pitch + dy * 0.004));
      }
      if (!running()) requestFrame();
    };
    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, yaw: yawTarget, pitch: pitchTarget, moved: false };
      ptrNdc = toNdc(e);
    };
    const onUp = (e: PointerEvent) => {
      if (drag && !drag.moved && ptrGrid) {
        pulse[0] = ptrGrid[0]; pulse[1] = ptrGrid[1]; pulse[2] = t;
        holdUntil = Math.max(holdUntil, t + 6);
      }
      drag = null;
      if (e.pointerType !== "mouse") ptrNdc = null;
      if (!running()) requestFrame();
    };
    const onLeave = () => { if (drag) return; ptrNdc = null; parX = 0; parY = 0; if (!running()) requestFrame(); };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    /* ── context loss ── */
    const onLost = (e: Event) => { e.preventDefault(); if (raf) cancelAnimationFrame(raf); raf = 0; };
    const onRestored = () => { renderer = createRenderer(canvas, cols, rows); if (!renderer) { setFailed(true); return; } resize(); last = performance.now(); schedule(); };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    if (reduced) { phaseId = "fix"; phaseT = PHASE_SECONDS.fix * 0.95; setPhase("fix"); for (let i = 0; i < 80; i++) step(0.05); }
    resize(); last = performance.now(); schedule();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      mo.disconnect(); mq.removeEventListener("change", refreshTheme);
      ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      renderer?.dispose(); renderer = null;
    };
  }, []);

  const active = PHASES.find(p => p.id === phase) ?? PHASES[0];

  return (
    <section
      ref={rootRef}
      className={`relative border-b border-border/70 bg-background overflow-hidden min-h-[480px] lg:min-h-[560px] flex flex-col justify-start ${className}`}
      data-wsp-theme={theme}
      aria-labelledby="wsp-hero-title"
    >
      <style>{CSS}</style>

      {/* Grid-paper texture from the rest of the site */}
      <div className="grid-paper absolute inset-0 opacity-[var(--grid-opacity,0.06)] pointer-events-none" aria-hidden="true" />

      {/* ── 3D WEBGL SCENE (FULL-BLEED, BLENDED INTO BACKGROUND WITHOUT ANY CARD BOX) ── */}
      <div className="wsp-stage absolute inset-0 pointer-events-auto">
        <div className="wsp-view w-full h-full" ref={stageRef}>
          <canvas ref={canvasRef} className="wsp-canvas w-full h-full block" aria-hidden="true" />
          {failed && <div className="wsp-fallback absolute inset-0" aria-hidden="true" />}
        </div>
      </div>

      {/* ── EDITORIAL CONTENT (LEFT-ALIGNED WITH SITE CONTAINER) ── */}
      <div className="relative z-10 mx-auto max-w-[1680px] w-full px-4 sm:px-6 lg:px-10 pt-2 sm:pt-3 lg:pt-4 pb-6 sm:pb-8 lg:pb-10 pointer-events-none">
        <div className="max-w-2xl lg:max-w-[700px] space-y-5 pointer-events-auto">
          {/* Provenance Status Pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-mono tracking-wider shadow-sm">
            <span className="size-2 rounded-full bg-[var(--wsp-green)] animate-ping" aria-hidden="true" />
            <span className="font-bold text-foreground">INDEPENDENT RESEARCH MONOGRAPH</span>
            <span className="text-muted-foreground hidden sm:inline">· MIT CSAIL &amp; MAIER AUDIT</span>
          </div>

          {/* Master Headline */}
          <h1 id="wsp-hero-title" className="font-serif text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.06]">
            Weight-Space
            <br />
            <span className="font-sans font-black text-[var(--wsp-chrome)] dark:text-sky-400 tracking-tight">
              Programming
            </span>
          </h1>

          {/* Editorial Lead */}
          <p className="font-serif text-base sm:text-lg leading-relaxed text-muted-foreground max-w-[62ch]">
            A general-purpose LLM can inspect, repair, and synthesize raw neural-network weights through symbolic reasoning alone-completely bypassing gradient descent. An empirical breakdown from first principles to frontier replication.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/read/1-pile-of-numbers"
              prefetch={false}
              className="group relative flex h-11 items-center gap-2.5 rounded-xl px-6 font-sans text-xs sm:text-sm font-bold bg-[var(--wsp-chrome)] text-white dark:bg-sky-500 dark:text-slate-950 shadow-md shadow-sky-500/20 hover:shadow-sky-500/35 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span className="size-1.5 rounded-full bg-white dark:bg-slate-950 animate-pulse" aria-hidden="true" />
              <span>Begin Field Guide</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/prologue"
              prefetch={false}
              className="flex h-11 items-center gap-2 rounded-xl border border-border/80 bg-card/85 px-4 font-sans text-xs sm:text-sm font-semibold text-foreground transition-all duration-200 hover:bg-accent/70 hover:border-foreground/30 hover:-translate-y-0.5 shadow-xs"
            >
              <Sparkles className="size-4 text-[var(--wsp-chrome)]" />
              <span>Prologue</span>
            </Link>
            <Link
              href="/experiments"
              prefetch={false}
              className="flex h-11 items-center gap-2 rounded-xl border border-border/80 bg-card/85 px-4 font-sans text-xs sm:text-sm font-semibold text-foreground transition-all duration-200 hover:bg-accent/70 hover:border-foreground/30 hover:-translate-y-0.5 shadow-xs"
            >
              <Layers className="size-4 text-[var(--wsp-blue)]" />
              <span>8 Experiments</span>
            </Link>
            <Link
              href="/lab"
              prefetch={false}
              className="flex h-11 items-center gap-2 rounded-xl border border-border/80 bg-card/60 px-4 font-sans text-xs sm:text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/40 hover:-translate-y-0.5"
            >
              <FlaskConical className="size-4 text-[var(--wsp-amber)]" />
              <span>Python Labs</span>
            </Link>
          </div>

          {/* Forge UI Quick Experiment Telemetry Plaques */}
          <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4 max-w-2xl">
            {[
              {
                id: "exp4",
                tag: "Exp 4 · Ramp",
                stat: "1,024 / 1,024",
                label: "Ramp Clearance (100%)",
                badge: "paper" as const,
                color: "var(--wsp-cyan)",
                glowColor: "color-mix(in oklab, var(--wsp-cyan) 25%, transparent)",
                borderColor: "color-mix(in oklab, var(--wsp-cyan) 55%, transparent)",
                href: "/read/5-fix",
              },
              {
                id: "exp6",
                tag: "Exp 6 · Go",
                stat: "0-Shot Gen",
                label: "1.48M Params Synthesized",
                badge: "review" as const,
                color: "var(--wsp-green)",
                glowColor: "color-mix(in oklab, var(--wsp-green) 25%, transparent)",
                borderColor: "color-mix(in oklab, var(--wsp-green) 55%, transparent)",
                href: "/read/6-write",
              },
              {
                id: "exp8",
                tag: "Exp 8 · Qwen",
                stat: "0.016% Surgery",
                label: "0.016% Weights Edited",
                badge: "paper" as const,
                color: "var(--wsp-chrome)",
                glowColor: "color-mix(in oklab, var(--wsp-chrome) 25%, transparent)",
                borderColor: "color-mix(in oklab, var(--wsp-chrome) 55%, transparent)",
                href: "/read/5-fix",
              },
              {
                id: "truth",
                tag: "Truth Contract",
                stat: "4 Provenance Tiers",
                label: "44 Citations Verified",
                badge: "review" as const,
                color: "var(--wsp-amber)",
                glowColor: "color-mix(in oklab, var(--wsp-amber) 25%, transparent)",
                borderColor: "color-mix(in oklab, var(--wsp-amber) 55%, transparent)",
                href: "#truth-contract",
              },
            ].map((item) => (
              <Link
                key={item.id}
                href={item.href}
                prefetch={false}
                className="group relative rounded-xl border border-border/80 bg-card/75 p-3.5 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={
                  {
                    "--plaque-color": item.color,
                    "--plaque-glow": item.glowColor,
                    "--plaque-border": item.borderColor,
                  } as CSSProperties
                }
              >
                {/* Hover Glow Background Wash */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${item.glowColor}, transparent 75%)`,
                    boxShadow: `0 12px 28px -6px ${item.glowColor}, inset 0 0 0 1px ${item.borderColor}`,
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                      {item.tag}
                    </span>
                    <span
                      className="size-2 rounded-full transition-all duration-300 opacity-60 group-hover:opacity-100 group-hover:scale-125"
                      style={{
                        background: item.color,
                        boxShadow: `0 0 10px ${item.color}`,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="block font-mono text-sm sm:text-base font-black text-foreground tabular-nums tracking-tight">
                    {item.stat}
                  </span>
                  <span className="block font-sans text-[11px] text-muted-foreground mt-0.5 truncate group-hover:text-foreground transition-colors">
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLOATING TELEMETRY HUD (BOTTOM-RIGHT GLASS PANEL AS IN REFERENCE IMAGE) ── */}
      <div className="wsp-hud-wrap relative z-20 pointer-events-auto mx-4 mb-4 sm:mx-6 sm:mb-6 lg:absolute lg:right-6 lg:bottom-6 xl:right-10 xl:bottom-8 lg:m-0">
        <div className="wsp-hud" role="group" aria-label="Weight-space simulation controls">
          {/* Top Status */}
          <div className="wsp-hud-top">
            <span className="wsp-live">
              <i aria-hidden="true" />
              3D θ-SPACE · LAYER 15 · MLP W_gate
            </span>
            <span className="wsp-fps" ref={fpsRef} aria-hidden="true">60 fps</span>
          </div>

          {/* Phase Switcher Chips + Inject Action */}
          <div className="wsp-chips">
            {PHASES.map((p) => (
              <button
                key={p.id}
                type="button"
                className="wsp-chip"
                data-phase={p.id}
                aria-pressed={phase === p.id}
                onClick={() => jump(p.id)}
              >
                <b>{p.label}</b>
                <small>{p.exp}</small>
              </button>
            ))}
            <button
              type="button"
              className="wsp-inject"
              onClick={() => jump("fix")}
              title="Inject surgical rank-1 edit: W' = (I - uuᵀ)W"
            >
              Inject ΔW
            </button>
          </div>

          {/* Phase Caption */}
          <p className="wsp-caption" aria-live="polite">{active.caption}</p>

          {/* Quantitative Metrics */}
          <dl className="wsp-metrics">
            <div>
              <dt>MATH-500</dt>
              <dd><span ref={accRef}>7.9%</span></dd>
            </div>
            <div>
              <dt>Token-limit hits</dt>
              <dd><span ref={tokRef}>93.0%</span></dd>
            </div>
            <div>
              <dt>Params edited</dt>
              <dd><span ref={editRef}>0</span><em> / 800M</em></dd>
            </div>
          </dl>

          {/* Foot Note & Cell Inspection */}
          <div className="wsp-foot">
            <span ref={cellRef} className="wsp-cell">hover the matrix to read a weight</span>
            <span className="wsp-badge">Teaching schematic · figures paper-reported (Exp 8)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── scoped styles ── */

const CSS = /* css */`
.wsp-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  touch-action: pan-y;
  cursor: grab;
}
.wsp-canvas:active {
  cursor: grabbing;
}

/* On desktop, canvas fades out on the left half so text is 100% crisp & legible */
@media (min-width: 900px) {
  .wsp-canvas {
    -webkit-mask-image: linear-gradient(90deg,
      transparent 0%,
      transparent 28%,
      rgba(0,0,0,0.25) 44%,
      #000 64%
    );
    mask-image: linear-gradient(90deg,
      transparent 0%,
      transparent 28%,
      rgba(0,0,0,0.25) 44%,
      #000 64%
    );
  }
}

.wsp-hud {
  width: 100%;
  max-width: 480px;
  display: grid;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 14px;
  background: rgba(9, 13, 22, 0.78);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  font: 500 12px/1.35 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

:root:not(.dark) .wsp-hud {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(20, 30, 70, 0.15);
  box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.12);
}

.wsp-hud-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  letter-spacing: .08em;
  font-size: 10.5px;
  color: var(--muted-foreground, #94a3b8);
}

.wsp-live i {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 6px;
  border-radius: 50%;
  background: var(--wsp-cyan, #22d3ee);
  animation: wsp-pulse 2s infinite;
}

@keyframes wsp-pulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.6); }
  70%, 100% { box-shadow: 0 0 0 8px transparent; }
}

.wsp-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.wsp-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  background: transparent;
  color: var(--muted-foreground, #94a3b8);
  font: inherit;
  cursor: pointer;
  transition: color .2s, border-color .2s, background .2s;
}

.wsp-chip b {
  font-weight: 700;
  letter-spacing: .06em;
}

.wsp-chip small {
  font-size: 10px;
  opacity: .75;
}

.wsp-chip:hover {
  color: var(--foreground, #f8fafc);
  border-color: rgba(148, 163, 184, 0.45);
}

.wsp-chip[aria-pressed="true"] {
  color: var(--foreground, #f8fafc);
  background: color-mix(in srgb, var(--c) 20%, transparent);
  border-color: var(--c);
}

.wsp-chip[data-phase="read"]  { --c: var(--wsp-cyan,  #22d3ee); }
.wsp-chip[data-phase="fix"]   { --c: var(--wsp-red,   #ef4444); }
.wsp-chip[data-phase="write"] { --c: var(--wsp-amber, #f59e0b); }

.wsp-inject {
  margin-left: auto;
  padding: 6px 12px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  background: var(--wsp-cyan, #22d3ee);
  color: #03151e;
  font: inherit;
  font-weight: 700;
  letter-spacing: .04em;
  transition: filter .15s, transform .15s;
}

.wsp-inject:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.wsp-inject:active {
  transform: translateY(0);
}

.wsp-caption {
  margin: 0;
  color: var(--foreground, #f8fafc);
  font-size: 11.5px;
  min-height: 1.35em;
}

.wsp-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 0;
}

.wsp-metrics div {
  padding: 8px 10px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 10px;
}

.wsp-metrics dt {
  font-size: 9px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--muted-foreground, #94a3b8);
}

.wsp-metrics dd {
  margin: 2px 0 0;
  font-size: 14.5px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--foreground, #f8fafc);
}

.wsp-metrics dd em {
  font-style: normal;
  font-size: 10px;
  font-weight: 500;
  color: var(--muted-foreground, #94a3b8);
}

.wsp-foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 12px;
  font-size: 10px;
  color: var(--muted-foreground, #94a3b8);
}

.wsp-badge {
  padding: 1px 7px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
}
`;
