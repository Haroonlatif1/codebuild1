import React, { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "./supabase/SupabaseClient";

/* ─── Video platform detector ─────────────────────────────────────
   Supports: YouTube, YouTube Shorts, Facebook embed, direct mp4/webm
──────────────────────────────────────────────────────────────────── */
const getVideoEmbed = (url = "") => {
  if (!url) return { type: "unknown", src: "" };
  if (url.includes("youtube.com/embed/")) {
    return { type: "youtube", src: url + (url.includes("?") ? "&" : "?") + "autoplay=1&rel=0&modestbranding=1" };
  }
  if (url.includes("youtube.com/watch") || url.includes("youtu.be/") || url.includes("youtube.com/shorts/")) {
    let id = "";
    if (url.includes("youtu.be/"))       id = url.split("youtu.be/")[1]?.split("?")[0];
    else if (url.includes("v="))         id = url.split("v=")[1]?.split("&")[0];
    else if (url.includes("/shorts/"))   id = url.split("/shorts/")[1]?.split("?")[0];
    if (id) return { type: "youtube", src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` };
  }
  if (url.includes("facebook.com/plugins/video")) {
    const u = url.includes("autoplay") ? url : url + (url.includes("?") ? "&autoplay=1" : "?autoplay=1");
    return { type: "facebook", src: u };
  }
  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    const encoded = encodeURIComponent(url);
    return { type: "facebook", src: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&autoplay=1&allowfullscreen=true` };
  }
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
    return { type: "mp4", src: url };
  }
  return { type: "unknown", src: url };
};

const VideoEmbed = ({ url, title = "" }) => {
  const { type, src } = getVideoEmbed(url);
  if (!src) return null;
  if (type === "mp4") {
    return <video src={src} controls autoPlay style={{width:"100%",height:"100%",display:"block"}}/>;
  }
  return (
    <iframe
      src={src}
      title={title}
      style={{width:"100%",height:"100%",border:"none",display:"block"}}
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
      allowFullScreen
      scrolling="no"
      frameBorder="0"
    />
  );
};

const getYTThumb = (url = "") => {
  let id = "";
  if (url.includes("/embed/"))   id = url.split("/embed/")[1]?.split("?")[0];
  if (url.includes("youtu.be/")) id = url.split("youtu.be/")[1]?.split("?")[0];
  if (url.includes("v="))        id = url.split("v=")[1]?.split("&")[0];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};


/* ═══════════════════════════════════════════════════════════════════
   CLASS INSIGHTS  —  CodeBuild Academy
   ✦ Original design 100% preserved
   ✦ Data fetched live from Supabase (lectures table)
   ✦ Click card → detail panel → Watch Lecture → real video modal
   ✦ WebGL nebula + mouse parallax + energy core — all intact
════════════════════════════════════════════════════════════════════ */

/* ─── TAG → EMOJI MAP ─────────────────────────────────────────────── */
const TAG_EMOJI = {
  Backend:"🖥️","AI/ML":"🧠",Security:"🔐",Web3:"⛓️",React:"⚛️",
  Hardware:"🤖",Python:"🐍",Mobile:"📱",Data:"📊",Office:"💼",
  Frontend:"⚡",Blockchain:"🔗",Default:"🎓",
};

/* ─── CSS ─────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dosis:wght@400;500;600;700;800&display=swap');

.ci-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #04040b;
  overflow: hidden;
  font-family: "Dosis", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ci-webgl {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.ci-hdr {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 80px 24px 20px;
  pointer-events: none;
}
.ci-eyebrow {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: #ffa500;
  margin-bottom: 14px;
  opacity: 0;
  animation: ci-fadeup 0.8s ease 0.2s forwards;
}
.ci-h1 {
  font-family: "Bebas Neue", sans-serif;
  font-size: clamp(64px, 10vw, 130px);
  line-height: 0.85;
  letter-spacing: 3px;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255,165,0,0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0;
  animation: ci-fadeup 0.9s ease 0.35s forwards;
}
.ci-sub {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.3);
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.65;
  opacity: 0;
  animation: ci-fadeup 0.9s ease 0.5s forwards;
}

/* loading dots */
.ci-loading {
  position: relative; z-index: 10;
  display: flex; align-items: center; justify-content: center;
  gap: 8px; padding: 80px 24px;
}
.ci-loading span {
  width: 9px; height: 9px; border-radius: 50%;
  background: #ffa500;
  animation: ci-bounce 1.2s ease-in-out infinite;
}
.ci-loading span:nth-child(2){ animation-delay:.2s; }
.ci-loading span:nth-child(3){ animation-delay:.4s; }

/* empty state */
.ci-empty {
  position: relative; z-index: 10;
  text-align: center; padding: 60px 24px;
  color: rgba(255,255,255,0.2); font-size: 13px;
}
.ci-empty-icon { font-size: 36px; margin-bottom: 12px; }

.ci-stage {
  position: relative;
  z-index: 5;
  width: 100%;
  height: 560px;
  perspective: 900px;
  perspective-origin: 50% 50%;
  cursor: crosshair;
  flex-shrink: 0;
}
.ci-scene {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.08s linear;
  position: relative;
}
.ci-core {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%) translateZ(0px);
  width: 80px; height: 80px;
  pointer-events: none;
  z-index: 2;
}
.ci-core-inner {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, #fff8e0 0%, #ffa500 30%, rgba(255,100,0,0.4) 65%, transparent 100%);
  animation: ci-pulse 2.4s ease-in-out infinite;
  box-shadow: 0 0 20px #ffa500, 0 0 60px rgba(255,165,0,0.6), 0 0 120px rgba(255,100,0,0.3);
}
.ci-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255,165,0,0.25);
  top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  animation: ci-ring-expand 2.4s ease-out infinite;
}
.ci-ring:nth-child(2){ animation-delay:0.8s; }
.ci-ring:nth-child(3){ animation-delay:1.6s; }

.ci-card-wrap {
  position: absolute;
  top: 50%; left: 50%;
  transform-style: preserve-3d;
  pointer-events: all;
  cursor: pointer;
}
.ci-card-3d {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 210px;
  background: rgba(8,8,20,0.88);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  overflow: hidden;
  backdrop-filter: blur(12px);
  transition: border-color 0.35s ease, box-shadow 0.35s ease;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
.ci-card-3d:hover { border-color: rgba(255,165,0,0.4); }
.ci-card-3d.active-card {
  border-color: #ffa500 !important;
  box-shadow: 0 0 0 1px rgba(255,165,0,0.3), 0 30px 80px rgba(0,0,0,0.9), 0 0 60px rgba(255,165,0,0.15) !important;
}
.ci-card-top {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  position: relative;
  overflow: hidden;
}
.ci-card-thumb {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  filter: brightness(0.45) saturate(0.7);
  transition: filter 0.3s;
}
.ci-card-3d:hover .ci-card-thumb { filter: brightness(0.6) saturate(0.9); }
.ci-card-top::before {
  content:"";
  position:absolute; inset:0;
  background: linear-gradient(135deg, var(--cc) 0%, rgba(0,0,0,0.5) 100%);
  opacity:0.35;
  z-index:1;
}
.ci-card-top-emoji { position:relative; z-index:2; filter:drop-shadow(0 0 12px var(--cc)); }
.ci-card-tag {
  position:absolute; top:8px; left:8px;
  font-size:7px; font-weight:800;
  letter-spacing:1.5px; text-transform:uppercase;
  background: var(--cc); color:#050510;
  padding:2px 7px; border-radius:3px; z-index:3;
}
.ci-card-dur {
  position:absolute; bottom:8px; right:8px;
  font-size:9px; font-weight:700;
  color:rgba(255,255,255,0.75);
  background:rgba(0,0,0,0.55);
  padding:2px 6px; border-radius:3px; z-index:3;
}
.ci-card-body { padding:12px 13px 13px; }
.ci-card-course {
  font-size:8px; font-weight:800; letter-spacing:2px;
  text-transform:uppercase; color:var(--cc); margin-bottom:4px;
}
.ci-card-topic {
  font-size:11.5px; font-weight:700;
  color:rgba(255,255,255,0.88);
  line-height:1.38; margin-bottom:8px;
}
.ci-card-foot { display:flex; align-items:center; justify-content:space-between; }
.ci-card-instr { font-size:9.5px; font-weight:600; color:rgba(255,255,255,0.3); }
.ci-card-views { font-size:9px; font-weight:700; color:rgba(255,255,255,0.22); }

.ci-card-play {
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
  background: rgba(4,4,11,0.72);
  opacity:0; transition:opacity 0.25s ease;
  z-index:10; border-radius:14px;
}
.ci-card-3d:hover .ci-card-play { opacity:1; }
.ci-play-circle {
  width:46px; height:46px; border-radius:50%;
  background: #ffa500;
  display:flex; align-items:center; justify-content:center;
  box-shadow: 0 0 30px rgba(255,165,0,0.6);
  transform:scale(0.8); transition:transform 0.25s ease;
}
.ci-card-3d:hover .ci-play-circle { transform:scale(1); }
.ci-play-circle svg { width:18px; height:18px; fill:#050510; margin-left:3px; }

/* ── detail panel ── */
.ci-detail {
  position: relative; z-index: 10;
  width: 90%; max-width: 480px;
  margin: 0 auto 40px;
  background: rgba(8,8,20,0.9);
  border: 1px solid rgba(255,165,0,0.2);
  border-radius: 16px;
  padding: 24px 28px;
  backdrop-filter: blur(20px);
  box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,165,0,0.05);
  opacity:0; transform:translateY(20px);
  transition:opacity 0.4s ease, transform 0.4s ease;
  pointer-events:none;
}
.ci-detail.visible { opacity:1; transform:translateY(0); pointer-events:all; }
.ci-detail-course {
  font-size:8.5px; font-weight:800; letter-spacing:2.5px;
  text-transform:uppercase; color:var(--dc); margin-bottom:6px;
}
.ci-detail-topic {
  font-family:"Bebas Neue",sans-serif;
  font-size:28px; letter-spacing:1px;
  color:#fff; margin-bottom:6px; line-height:1;
}
.ci-detail-desc {
  font-size:12px; font-weight:500;
  color:rgba(255,255,255,0.35);
  line-height:1.6; margin-bottom:12px;
}
.ci-detail-meta {
  display:flex; gap:16px; margin-bottom:16px;
  font-size:11px; font-weight:600;
  color:rgba(255,255,255,0.38);
  flex-wrap: wrap;
}
.ci-detail-btns { display:flex; gap:10px; flex-wrap:wrap; }
.ci-detail-cta {
  display:inline-flex; align-items:center; gap:8px;
  background:#ffa500; color:#050510;
  font-family:"Dosis",sans-serif;
  font-size:10px; font-weight:800;
  letter-spacing:2px; text-transform:uppercase;
  border:none; border-radius:5px;
  padding:9px 20px; cursor:pointer;
  transition:background 0.2s, transform 0.2s;
}
.ci-detail-cta:hover { background:#ffb733; transform:scale(1.03); }
.ci-detail-cta svg { width:13px; height:13px; fill:#050510; }
.ci-detail-close {
  display:inline-flex; align-items:center; gap:6px;
  background:transparent;
  border:1px solid rgba(255,165,0,0.25);
  color:rgba(255,165,0,0.7);
  font-family:"Dosis",sans-serif;
  font-size:10px; font-weight:800;
  letter-spacing:2px; text-transform:uppercase;
  border-radius:5px; padding:9px 18px; cursor:pointer;
  transition:background 0.2s, border-color 0.2s;
}
.ci-detail-close:hover { background:rgba(255,165,0,0.07); border-color:rgba(255,165,0,0.4); }

.ci-hint {
  position:relative; z-index:10;
  text-align:center;
  font-size:9.5px; font-weight:700; letter-spacing:2px;
  text-transform:uppercase;
  color:rgba(255,255,255,0.14);
  margin-top:-20px; margin-bottom:50px;
  animation:ci-blink 2.5s ease-in-out infinite;
}

/* ── VIDEO MODAL ── */
.ci-modal-overlay {
  position:fixed; inset:0;
  background:rgba(0,0,0,0.93);
  backdrop-filter:blur(16px);
  z-index:9999;
  display:flex; align-items:center; justify-content:center;
  padding:20px;
  animation:ci-fadein 0.22s ease;
}
.ci-modal-box {
  background:#08080f;
  border:1px solid rgba(255,165,0,0.15);
  border-radius:18px;
  width:100%; max-width:900px;
  overflow:hidden;
  box-shadow:0 50px 120px rgba(0,0,0,0.98), 0 0 0 1px rgba(255,165,0,0.06);
  animation:ci-modal-in 0.32s cubic-bezier(0.22,1,0.36,1);
}
.ci-modal-video {
  position:relative;
  width:100%; aspect-ratio:16/9;
  background:#000;
}
.ci-modal-video iframe,
.ci-modal-video video {
  width:100%; height:100%; border:none; display:block;
}
.ci-modal-close-btn {
  position:absolute; top:12px; right:12px;
  width:36px; height:36px; border-radius:50%;
  background:rgba(0,0,0,0.8);
  border:1px solid rgba(255,255,255,0.12);
  color:rgba(255,255,255,0.65);
  font-size:15px; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  z-index:2; transition:background 0.2s, color 0.2s;
  font-family:sans-serif; line-height:1;
}
.ci-modal-close-btn:hover { background:rgba(220,40,40,0.7); color:#fff; }
.ci-modal-info {
  padding:18px 26px 22px;
  display:flex; align-items:flex-start; gap:14px;
  border-top:1px solid rgba(255,255,255,0.04);
}
.ci-modal-dot {
  width:10px; height:10px; border-radius:50%;
  flex-shrink:0; margin-top:6px;
}
.ci-modal-course {
  font-size:8.5px; font-weight:800; letter-spacing:2px;
  text-transform:uppercase; margin-bottom:4px;
}
.ci-modal-title {
  font-family:"Bebas Neue",sans-serif;
  font-size:22px; color:rgba(255,255,255,0.92);
  margin-bottom:5px; line-height:1.15;
}
.ci-modal-meta {
  font-size:11.5px; font-weight:600; color:rgba(255,255,255,0.3);
}

/* ── keyframes ── */
@keyframes ci-fadeup {
  from{opacity:0;transform:translateY(24px);}
  to{opacity:1;transform:translateY(0);}
}
@keyframes ci-pulse {
  0%,100%{transform:scale(1);opacity:1;}
  50%{transform:scale(1.18);opacity:0.85;}
}
@keyframes ci-ring-expand {
  0%{width:80px;height:80px;opacity:0.7;}
  100%{width:300px;height:300px;opacity:0;}
}
@keyframes ci-blink {
  0%,100%{opacity:0.14;} 50%{opacity:0.35;}
}
@keyframes ci-bounce {
  0%,80%,100%{transform:scale(.5);opacity:.4}
  40%{transform:scale(1);opacity:1}
}
@keyframes ci-fadein { from{opacity:0} to{opacity:1} }
@keyframes ci-modal-in {
  from{opacity:0;transform:scale(0.93) translateY(22px)}
  to{opacity:1;transform:scale(1) translateY(0)}
}

@media(max-width:600px){
  .ci-stage{height:420px;perspective:600px;}
  .ci-card-3d{width:160px;}
  .ci-card-top{height:68px;font-size:28px;}
  .ci-card-topic{font-size:10px;}
  .ci-h1{font-size:56px;}
  .ci-modal-box{border-radius:12px;}
  .ci-modal-info{padding:12px 16px 18px;}
  .ci-detail{padding:18px 20px;}
}
`;

/* ═══ WebGL NEBULA ═══════════════════════════════════════════════════ */
const NebulaCanvas = ({ mouseRef }) => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let W, H;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const gl = canvas.getContext("webgl", { alpha: false, antialias: true });
    if (!gl) return;

    const vs = `
      attribute vec2 a_pos; attribute float a_size; attribute vec3 a_col; attribute float a_alpha;
      uniform vec2 u_res; varying vec3 v_col; varying float v_alpha;
      void main(){
        vec2 clip = (a_pos / u_res) * 2.0 - 1.0; clip.y = -clip.y;
        gl_Position = vec4(clip, 0.0, 1.0); gl_PointSize = a_size; v_col = a_col; v_alpha = a_alpha;
      }`;
    const fs = `
      precision mediump float; varying vec3 v_col; varying float v_alpha;
      void main(){
        float d = length(gl_PointCoord - 0.5) * 2.0; if(d > 1.0) discard;
        float s = 1.0 - smoothstep(0.0, 1.0, d); gl_FragColor = vec4(v_col, v_alpha * s);
      }`;

    const mkSh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, mkSh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, mkSh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);

    const aPos=gl.getAttribLocation(prog,"a_pos"), aSize=gl.getAttribLocation(prog,"a_size");
    const aCol=gl.getAttribLocation(prog,"a_col"), aAlpha=gl.getAttribLocation(prog,"a_alpha");
    const uRes=gl.getUniformLocation(prog,"u_res");

    const N=3000;
    const pos=new Float32Array(N*2), vel=new Float32Array(N*2), size=new Float32Array(N);
    const col=new Float32Array(N*3), alpha=new Float32Array(N), home=new Float32Array(N*2), phase=new Float32Array(N);
    const palette=[[1.0,0.42,0.0],[1.0,0.65,0.0],[1.0,0.9,0.7],[0.0,0.78,0.9],[0.6,0.2,1.0]];

    for(let i=0;i<N;i++){
      const arm=Math.floor(Math.random()*3), t=Math.random();
      const radius=80+t*Math.min(W||800,H||600)*0.42;
      const angle=arm*(Math.PI*2/3)+t*Math.PI*3+Math.random()*0.8;
      const jitter=(Math.random()-0.5)*60*(1-t*0.5);
      home[i*2]=pos[i*2]=(W||800)/2+Math.cos(angle)*radius+jitter;
      home[i*2+1]=pos[i*2+1]=(H||600)/2+Math.sin(angle)*radius*0.55+jitter;
      vel[i*2]=(Math.random()-.5)*.3; vel[i*2+1]=(Math.random()-.5)*.3;
      const pc=palette[Math.floor(Math.random()*palette.length)];
      col[i*3]=pc[0]; col[i*3+1]=pc[1]; col[i*3+2]=pc[2];
      size[i]=Math.random()*2.8+0.8; alpha[i]=Math.random()*0.6+0.2; phase[i]=Math.random()*Math.PI*2;
    }

    const mkBuf=(data)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);return b;};
    const posBuf=mkBuf(pos),sizeBuf=mkBuf(size),colBuf=mkBuf(col),alphaBuf=mkBuf(alpha);

    const bindAttr=(buf,loc,sz,data)=>{
      gl.bindBuffer(gl.ARRAY_BUFFER,buf);
      gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc,sz,gl.FLOAT,false,0,0);
    };

    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
    let t=0,raf;
    const draw=()=>{
      t+=0.012;
      const cx=W/2+Math.sin(t*0.18)*40, cy=H/2+Math.cos(t*0.13)*25;
      const mx=mouseRef.current?mouseRef.current.x:cx, my=mouseRef.current?mouseRef.current.y:cy;
      for(let i=0;i<N;i++){
        let x=pos[i*2],y=pos[i*2+1];
        const dx=x-cx,dy=y-cy,dist=Math.sqrt(dx*dx+dy*dy)+0.1;
        const spin=0.0008*(1-Math.min(dist,300)/300)*2;
        const nx=dx*Math.cos(spin)-dy*Math.sin(spin),ny=dx*Math.sin(spin)+dy*Math.cos(spin);
        x=cx+nx; y=cy+ny;
        const mdx=x-mx,mdy=y-my,mdist=Math.sqrt(mdx*mdx+mdy*mdy)+1;
        const force=Math.min(2200/(mdist*mdist),2.5);
        vel[i*2]+=(mdx/mdist)*force*0.015; vel[i*2+1]+=(mdy/mdist)*force*0.015;
        vel[i*2]+=(home[i*2]-x)*0.0008; vel[i*2+1]+=(home[i*2+1]-y)*0.0008;
        vel[i*2]*=0.97; vel[i*2+1]*=0.97;
        pos[i*2]=x+vel[i*2]; pos[i*2+1]=y+vel[i*2+1];
        alpha[i]=0.2+Math.sin(t*1.2+phase[i])*0.15+0.25;
      }
      if(!W||!H){raf=requestAnimationFrame(draw);return;}
      gl.viewport(0,0,W,H); gl.clearColor(0.016,0.016,0.043,1); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes,W,H);
      bindAttr(posBuf,aPos,2,pos); bindAttr(sizeBuf,aSize,1,size); bindAttr(colBuf,aCol,3,col); bindAttr(alphaBuf,aAlpha,1,alpha);
      gl.drawArrays(gl.POINTS,0,N);
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} className="ci-webgl" style={{width:"100%",height:"100%"}}/>;
};

/* ═══ VIDEO MODAL ════════════════════════════════════════════════════ */
const VideoModal = ({ clip, onClose }) => {
  const isYT = clip.video_url?.includes("youtube.com") || clip.video_url?.includes("youtu.be");
  // ensure autoplay
  const src = isYT
    ? `${clip.video_url}${clip.video_url.includes("?")?"&":"?"}autoplay=1&rel=0&modestbranding=1`
    : clip.video_url;

  useEffect(() => {
    const fn = (e) => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="ci-modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="ci-modal-box">
        <div className="ci-modal-video">
          <VideoEmbed url={clip.video_url} title={clip.title}/>
          <button className="ci-modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="ci-modal-info">
          <div className="ci-modal-dot" style={{background:clip.color||"#ffa500"}}/>
          <div>
            <div className="ci-modal-course" style={{color:clip.color||"#ffa500"}}>{clip.course}</div>
            <div className="ci-modal-title">{clip.title}</div>
            <div className="ci-modal-meta">
              🎓 {clip.instructor}&nbsp;&nbsp;·&nbsp;&nbsp;⏱ {clip.duration}&nbsp;&nbsp;·&nbsp;&nbsp;👁 {clip.students} watching
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══ ORBIT CONFIG ═══════════════════════════════════════════════════ */
const ORBIT_RADIUS_X = 320;
const ORBIT_RADIUS_Y = 80;
const ORBIT_Z_SCALE  = 180;

function get3DPos(index, total, time) {
  const base  = (index / total) * Math.PI * 2;
  const angle = base + time * 0.28;
  return {
    x: Math.cos(angle) * ORBIT_RADIUS_X,
    y: Math.sin(angle) * ORBIT_RADIUS_Y,
    z: Math.sin(angle) * ORBIT_Z_SCALE,
  };
}

/* ═══ MAIN COMPONENT ════════════════════════════════════════════════ */
const ClassInsights = () => {
  const mouseRef  = useRef({ x: 0, y: 0 });
  const sceneRef  = useRef(null);
  const stageRef  = useRef(null);
  const timeRef   = useRef(0);
  const rafRef    = useRef(null);
  const cardRefs  = useRef([]);

  const [clips,     setClips]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeIdx, setActiveIdx] = useState(null);
  const [playing,   setPlaying]   = useState(null); // clip to show in modal

  /* ── Fetch from Supabase ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (!error && data) setClips(data);
      setLoading(false);
    };
    load();
  }, []);

  /* ── Mouse ── */
  useEffect(() => {
    const fn = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  useEffect(() => {
    const fn = (e) => { if(e.touches[0]) mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    window.addEventListener("touchmove", fn, { passive: true });
    return () => window.removeEventListener("touchmove", fn);
  }, []);

  /* ── Animation loop ── */
  const animate = useCallback(() => {
    timeRef.current += 0.016;
    const t = timeRef.current;
    const stage = stageRef.current, scene = sceneRef.current;
    if (!stage || !scene || clips.length === 0) { rafRef.current = requestAnimationFrame(animate); return; }

    const rect  = stage.getBoundingClientRect();
    const mx    = mouseRef.current.x - rect.left  - rect.width  / 2;
    const my    = mouseRef.current.y - rect.top   - rect.height / 2;
    const tiltX = (my / (rect.height / 2)) * -12;
    const tiltY = (mx / (rect.width  / 2)) *  12;
    scene.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    cardRefs.current.forEach((wrap, i) => {
      if (!wrap || i >= clips.length) return;
      let pos;
      if (activeIdx === i) {
        pos = { x: 0, y: 0, z: 200 };
      } else if (activeIdx !== null) {
        const base  = (i / clips.length) * Math.PI * 2;
        const angle = base + t * 0.28;
        pos = { x: Math.cos(angle)*ORBIT_RADIUS_X*1.3, y: Math.sin(angle)*ORBIT_RADIUS_Y*1.3, z: Math.sin(angle)*ORBIT_Z_SCALE-80 };
      } else {
        pos = get3DPos(i, clips.length, t);
      }
      const scale   = 0.72 + (pos.z + ORBIT_Z_SCALE) / (ORBIT_Z_SCALE * 2) * 0.42;
      const opacity = 0.45 + (pos.z + ORBIT_Z_SCALE) / (ORBIT_Z_SCALE * 2) * 0.55;
      wrap.style.transform = `translate3d(${pos.x}px,${pos.y}px,${pos.z}px) scale(${scale})`;
      wrap.style.opacity   = opacity;
      wrap.style.zIndex    = Math.round((pos.z + ORBIT_Z_SCALE) * 10);
    });

    rafRef.current = requestAnimationFrame(animate);
  }, [activeIdx, clips.length]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const handleCardClick = (i) => setActiveIdx(prev => prev === i ? null : i);
  const activeClip = activeIdx !== null ? clips[activeIdx] : null;

  return (
    <>
      <style>{css}</style>
      <section className="ci-section">
        <NebulaCanvas mouseRef={mouseRef} />

        {/* Header */}
        <div className="ci-hdr">
          <div className="ci-eyebrow">Live From The Classroom</div>
          <h2 className="ci-h1">CLASS<br/>INSIGHTS</h2>
          <p className="ci-sub">
            Peek inside the sessions shaping careers across 20+ countries.
            Real instructors. Real skills. Real results.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="ci-loading"><span/><span/><span/></div>
        )}

        {/* Empty */}
        {!loading && clips.length === 0 && (
          <div className="ci-empty">
            <div className="ci-empty-icon">🎬</div>
            No lectures published yet.
          </div>
        )}

        {/* 3D Stage */}
        {!loading && clips.length > 0 && (
          <div className="ci-stage" ref={stageRef}>
            <div
              className="ci-scene"
              ref={sceneRef}
              style={{transformStyle:"preserve-3d",position:"relative",width:"100%",height:"100%"}}
            >
              {/* Energy core */}
              <div className="ci-core">
                <div className="ci-core-inner"/>
                <div className="ci-ring"/>
                <div className="ci-ring"/>
                <div className="ci-ring"/>
              </div>

              {/* Cards */}
              {clips.map((clip, i) => (
                <div
                  key={clip.id}
                  ref={el => cardRefs.current[i] = el}
                  className="ci-card-wrap"
                  style={{transformStyle:"preserve-3d",transition:"transform 0.6s cubic-bezier(0.23,1,0.32,1), opacity 0.6s ease"}}
                  onClick={() => handleCardClick(i)}
                >
                  <div
                    className={`ci-card-3d${activeIdx===i?" active-card":""}`}
                    style={{"--cc": clip.color || "#ffa500"}}
                  >
                    <div className="ci-card-top">
                      {clip.thumb_url && <img className="ci-card-thumb" src={clip.thumb_url} alt=""/>}
                      <div className="ci-card-tag">{clip.tag}</div>
                      <span className="ci-card-top-emoji">
                        {TAG_EMOJI[clip.tag] || TAG_EMOJI.Default}
                      </span>
                      <div className="ci-card-dur">{clip.duration}</div>
                    </div>
                    <div className="ci-card-body">
                      <div className="ci-card-course">{clip.course}</div>
                      <div className="ci-card-topic">{clip.title}</div>
                      <div className="ci-card-foot">
                        <div className="ci-card-instr">{clip.instructor}</div>
                        <div className="ci-card-views">👁 {clip.students}</div>
                      </div>
                    </div>
                    <div className="ci-card-play">
                      <div className="ci-play-circle">
                        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hint */}
        {!loading && clips.length > 0 && activeIdx === null && (
          <div className="ci-hint">↑ Click any card to explore the lecture</div>
        )}

        {/* Detail panel */}
        <div
          className={`ci-detail${activeClip?" visible":""}`}
          style={{"--dc": activeClip?.color || "#ffa500"}}
        >
          {activeClip && (
            <>
              <div className="ci-detail-course">{activeClip.course} · {activeClip.tag}</div>
              <div className="ci-detail-topic">{activeClip.title}</div>
              {activeClip.description && (
                <div className="ci-detail-desc">{activeClip.description}</div>
              )}
              <div className="ci-detail-meta">
                <span>🎓 {activeClip.instructor}</span>
                <span>⏱ {activeClip.duration}</span>
                <span>👁 {activeClip.students} watching</span>
              </div>
              <div className="ci-detail-btns">
                <button
                  className="ci-detail-cta"
                  onClick={() => setPlaying(activeClip)}
                >
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Watch Lecture
                </button>
                <button
                  className="ci-detail-close"
                  onClick={() => setActiveIdx(null)}
                >
                  ✕ Close
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Video modal */}
      {playing && <VideoModal clip={playing} onClose={() => setPlaying(null)} />}
    </>
  );
};

export default ClassInsights;