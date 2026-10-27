import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase/SupabaseClient";
import Practice from "./practice/Practice";
import { useSeo } from "./v2/seo";

// ─── GEMINI KEY ───────────────────────────────────────────────────
const GEMINI_KEY = "AIzaSyCj3Zs39lyYQvKYLdRX42dfcP0irQBrD-0";
// ─────────────────────────────────────────────────────────────────

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dosis:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

.dc-wrap {
  background: #07070f;
  min-height: 100vh;
  font-family: "Dosis", sans-serif;
  padding: 80px 24px 100px;
  position: relative;
  overflow: hidden;
}
.dc-wrap::before {
  content: "";
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);
  pointer-events: none;
  z-index: 0;
}
.dc-inner { max-width: 1000px; margin: 0 auto; position: relative; z-index: 1; }
.dc-header { text-align: center; margin-bottom: 52px; }
.dc-eyebrow {
  font-size: 10px; font-weight: 800; letter-spacing: 5px; text-transform: uppercase;
  color: #ffa500; margin-bottom: 12px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.dc-eyebrow::before,.dc-eyebrow::after { content:""; width:40px; height:1px; }
.dc-eyebrow::before { background: linear-gradient(90deg,transparent,#ffa500); }
.dc-eyebrow::after  { background: linear-gradient(90deg,#ffa500,transparent); }
.dc-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: clamp(52px,8vw,96px); line-height: 0.88; color: #fff; letter-spacing: 3px;
  background: linear-gradient(135deg,#fff 40%,rgba(255,165,0,0.65));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 12px;
}
.dc-subtitle { font-size:14px; font-weight:500; color:rgba(255,255,255,0.32); max-width:440px; margin:0 auto; line-height:1.65; }
.dc-grid { display:grid; grid-template-columns:1fr 380px; gap:20px; align-items:start; }
.dc-card { background:#0c0c1a; border:1px solid rgba(255,255,255,0.07); border-radius:18px; overflow:hidden; }
.dc-card-header { padding:18px 24px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:space-between; gap:12px; }
.dc-card-dots { display:flex; gap:6px; }
.dc-dot { width:10px; height:10px; border-radius:50%; }
.dc-card-date { font-family:"JetBrains Mono",monospace; font-size:10px; color:rgba(255,255,255,0.2); letter-spacing:1px; }
.dc-card-badges { display:flex; gap:6px; }
.dc-badge { font-size:8px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; padding:3px 9px; border-radius:4px; color:#07070f; }
.dc-badge-easy   { background:#22c55e; }
.dc-badge-medium { background:#ffa500; }
.dc-badge-hard   { background:#ef4444; }
.dc-badge-tag    { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.45); }
.dc-card-body { padding:24px; }
.dc-challenge-num { font-family:"JetBrains Mono",monospace; font-size:10px; color:rgba(255,165,0,0.5); letter-spacing:2px; margin-bottom:8px; }
.dc-challenge-title { font-family:"Bebas Neue",sans-serif; font-size:30px; letter-spacing:1px; color:#fff; margin-bottom:16px; line-height:1; }
.dc-challenge-desc { font-size:14px; font-weight:500; color:rgba(255,255,255,0.7); line-height:1.7; margin-bottom:20px; white-space:pre-wrap; }
.dc-code-block {
  background:#050510; border:1px solid rgba(255,255,255,0.06); border-radius:10px;
  padding:16px 18px; font-family:"JetBrains Mono",monospace; font-size:12.5px;
  color:rgba(255,255,255,0.8); line-height:1.7; margin-bottom:20px;
  overflow-x:auto; white-space:pre; position:relative;
}
.dc-code-block::before { content:"code"; position:absolute; top:8px; right:12px; font-size:8px; font-weight:700; letter-spacing:1.5px; color:rgba(255,165,0,0.3); }
.dc-form { margin-top:4px; }
.dc-form-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px; }
.dc-field label { display:block; font-size:9px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:6px; }
.dc-input { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:9px; color:rgba(255,255,255,0.85); font-family:"Dosis",sans-serif; font-size:13px; font-weight:600; padding:11px 14px; outline:none; transition:border-color .2s; box-sizing:border-box; }
.dc-input:focus { border-color:rgba(255,165,0,0.4); }
.dc-input-answer { font-family:"JetBrains Mono",monospace; font-size:13px; letter-spacing:0.5px; }
.dc-input-answer:focus { border-color:rgba(255,165,0,0.5); background:rgba(255,165,0,0.03); }
.dc-hint { background:rgba(255,165,0,0.05); border:1px solid rgba(255,165,0,0.15); border-radius:9px; padding:11px 14px; font-size:12.5px; font-weight:600; color:rgba(255,165,0,0.8); margin-bottom:12px; display:flex; align-items:flex-start; gap:8px; line-height:1.5; animation:dc-fade-in 0.4s ease; }
.dc-hint-icon { font-size:14px; flex-shrink:0; margin-top:1px; }
.dc-feedback { border-radius:10px; padding:14px 16px; margin-bottom:12px; font-size:13px; font-weight:600; line-height:1.55; animation:dc-bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1); }
.dc-feedback-correct { background:rgba(34,197,94,0.07); border:1px solid rgba(34,197,94,0.2); color:#4ade80; }
.dc-feedback-wrong   { background:rgba(239,68,68,0.07);  border:1px solid rgba(239,68,68,0.15); color:#fca5a5; }
.dc-feedback-already { background:rgba(255,165,0,0.07);  border:1px solid rgba(255,165,0,0.2);  color:rgba(255,165,0,0.85); }
.dc-explanation { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:9px; padding:12px 14px; font-size:12px; font-weight:500; color:rgba(255,255,255,0.5); margin-top:8px; line-height:1.6; }

/* ── already solved banner ── */
.dc-solved-banner {
  background: rgba(255,165,0,0.05);
  border: 1px solid rgba(255,165,0,0.18);
  border-radius: 14px;
  padding: 32px 24px;
  text-align: center;
  animation: dc-bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1);
}
.dc-solved-trophy { font-size: 52px; margin-bottom: 14px; line-height: 1; }
.dc-solved-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: 32px; letter-spacing: 2px; color: #ffa500;
  margin-bottom: 8px; line-height: 1;
}
.dc-solved-msg { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.45); line-height: 1.65; margin-bottom: 16px; }
.dc-solved-countdown {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px; padding: 8px 16px;
  font-family: "JetBrains Mono", monospace; font-size: 11px;
  color: rgba(255,255,255,0.3); letter-spacing: 1px;
}
.dc-solved-rank {
  margin-top: 16px; font-size: 11px; font-weight: 700;
  color: rgba(255,165,0,0.5); letter-spacing: 1px;
}

.dc-submit { width:100%; background:#ffa500; color:#07070f; font-family:"Dosis",sans-serif; font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase; border:none; border-radius:9px; padding:13px; cursor:pointer; transition:background .2s,transform .15s; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:4px; }
.dc-submit:hover:not(:disabled) { background:#ffb733; }
.dc-submit:active:not(:disabled) { transform:scale(0.98); }
.dc-submit:disabled { opacity:0.5; cursor:not-allowed; }
.dc-submit-spinner { width:14px; height:14px; border:2px solid rgba(7,7,15,0.25); border-top-color:#07070f; border-radius:50%; animation:dc-spin 0.7s linear infinite; }
.dc-right { display:flex; flex-direction:column; gap:16px; }
.dc-countdown-card { background:#0c0c1a; border:1px solid rgba(255,165,0,0.12); border-radius:14px; padding:20px; text-align:center; }
.dc-countdown-label { font-size:9px; font-weight:800; letter-spacing:2.5px; text-transform:uppercase; color:rgba(255,165,0,0.5); margin-bottom:10px; }
.dc-countdown-time { font-family:"JetBrains Mono",monospace; font-size:32px; font-weight:700; color:#ffa500; letter-spacing:3px; line-height:1; margin-bottom:6px; }
.dc-countdown-sub { font-size:10px; color:rgba(255,255,255,0.2); letter-spacing:1px; }
.dc-stats { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.dc-stat-card { background:#0c0c1a; border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:14px; text-align:center; }
.dc-stat-num { font-family:"Bebas Neue",sans-serif; font-size:34px; letter-spacing:1px; color:#ffa500; line-height:1; margin-bottom:4px; }
.dc-stat-label { font-size:9px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,0.25); }
.dc-winners-card { background:#0c0c1a; border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow:hidden; }
.dc-winners-head { padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:space-between; }
.dc-winners-title { font-family:"Bebas Neue",sans-serif; font-size:18px; letter-spacing:2px; color:#fff; }
.dc-winners-live { display:flex; align-items:center; gap:5px; font-size:9px; font-weight:800; letter-spacing:1.5px; color:#22c55e; }
.dc-live-dot { width:6px; height:6px; border-radius:50%; background:#22c55e; animation:dc-pulse-dot 1.5s ease-in-out infinite; }
.dc-winners-list { padding:8px 0; }
.dc-winner-row { padding:10px 18px; display:flex; align-items:center; gap:12px; border-bottom:1px solid rgba(255,255,255,0.03); animation:dc-fade-in 0.4s ease; }
.dc-winner-row:last-child { border-bottom:none; }
.dc-winner-rank { font-family:"JetBrains Mono",monospace; font-size:11px; font-weight:700; width:22px; text-align:center; flex-shrink:0; }
.dc-rank-1{color:#ffd700;} .dc-rank-2{color:#c0c0c0;} .dc-rank-3{color:#cd7f32;} .dc-rank-n{color:rgba(255,255,255,0.2);}
.dc-winner-avatar { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:#07070f; flex-shrink:0; }
.dc-winner-name { font-size:12.5px; font-weight:700; color:rgba(255,255,255,0.82); flex:1; }
.dc-winner-time { font-family:"JetBrains Mono",monospace; font-size:9.5px; color:rgba(255,255,255,0.2); }
.dc-winners-empty { padding:30px 18px; text-align:center; font-size:12px; color:rgba(255,255,255,0.18); }
.dc-no-challenge { text-align:center; padding:80px 24px; color:rgba(255,255,255,0.2); }
.dc-no-challenge-icon { font-size:48px; margin-bottom:16px; }
.dc-loading { display:flex; align-items:center; justify-content:center; gap:8px; padding:80px 24px; }
.dc-loading span { width:9px; height:9px; border-radius:50%; background:#ffa500; animation:dc-bounce 1.2s ease-in-out infinite; }
.dc-loading span:nth-child(2){animation-delay:.2s;} .dc-loading span:nth-child(3){animation-delay:.4s;}
@keyframes dc-fade-in   { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)}   }
@keyframes dc-bounce-in { from{opacity:0;transform:scale(0.88)}      to{opacity:1;transform:scale(1)}        }
@keyframes dc-bounce    { 0%,80%,100%{transform:scale(.4);opacity:.3} 40%{transform:scale(1);opacity:1}     }
@keyframes dc-spin      { to{transform:rotate(360deg)} }
@keyframes dc-pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(0.7)} }
@media(max-width:860px){
  .dc-grid{grid-template-columns:1fr;}
  .dc-right{order:-1;}
  .dc-stats{grid-template-columns:1fr 1fr 1fr;}
  .dc-countdown-card{padding:14px;}
  .dc-countdown-time{font-size:24px;}
}
@media(max-width:520px){
  .dc-form-row{grid-template-columns:1fr;}
  .dc-stats{grid-template-columns:1fr 1fr;}
}
`;

/* ── Countdown hook ── */
const useCountdown = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date(), next = new Date();
      next.setDate(now.getDate() + 1); next.setHours(0,0,0,0);
      const diff = next - now;
      const h = String(Math.floor(diff/3600000)).padStart(2,"0");
      const m = String(Math.floor((diff%3600000)/60000)).padStart(2,"0");
      const s = String(Math.floor((diff%60000)/1000)).padStart(2,"0");
      setTime(`${h}:${m}:${s}`);
    };
    tick(); const id = setInterval(tick,1000); return ()=>clearInterval(id);
  },[]);
  return time;
};

/* ── Syntax highlight ── */
const CodeBlock = ({ code }) => {
  const h = code
    .replace(/\b(def|return|for|if|else|in|print|range|True|False|None|lambda|import|from|class|and|or|not|while|break|continue|pass|SELECT|FROM|WHERE|COUNT)\b/g,'<span style="color:#ff79c6">$1</span>')
    .replace(/\b(\d+)\b/g,'<span style="color:#bd93f9">$1</span>')
    .replace(/(["'])(.*?)\1/g,'<span style="color:#f1fa8c">$1$2$1</span>')
    .replace(/(#.*$)/gm,'<span style="color:#6272a4">$1</span>');
  return <div className="dc-code-block" dangerouslySetInnerHTML={{__html:h}}/>;
};

const renderDescription = (desc) => {
  const parts = desc.split(/\n\n/);
  return parts.map((part,i) => {
    if (part.includes("\n") && (part.includes("    ")||part.includes("print(")||part.includes("SELECT")||part.includes("console.")))
      return <CodeBlock key={i} code={part}/>;
    return <p key={i} className="dc-challenge-desc">{part}</p>;
  });
};

/* ── localStorage key for today's solved state ── */
const getTodaySolvedKey = (challengeId) => {
  const today = new Date().toISOString().split("T")[0];
  return `dc_solved_${challengeId}_${today}`;
};

/* ── Gemini checker ── */
const checkWithGemini = async (studentAnswer, correctAnswer, questionTitle) => {
  // Daily limit: max 20 Gemini calls per browser per day
  const today = new Date().toISOString().split("T")[0];
  const limitKey = `dc_gemini_calls_${today}`;
  const used = parseInt(localStorage.getItem(limitKey) || "0", 10);
  if (used >= 20) return null; // silently skip, fall back to exact
  localStorage.setItem(limitKey, used + 1);

  try {
    const prompt = `You are a strict coding quiz judge. Reply ONLY with JSON, no markdown.

Question: "${questionTitle}"
Correct answer: "${correctAnswer}"
Student answered: "${studentAnswer}"

{"correct":true,"reason":"short reason"} or {"correct":false,"reason":"short reason"}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 60 },
        }),
      }
    );

    if (!res.ok) {
      const txt = await res.text();
      console.warn("Gemini error:", res.status, txt);
      return null;
    }

    const data = await res.json();
    const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!raw) return null;
    const json = JSON.parse(raw.replace(/```json|```/gi,"").trim());
    return { correct: !!json.correct, reason: json.reason || null };
  } catch(e) {
    console.warn("Gemini failed:", e.message);
    return null;
  }
};

/* ═══ MAIN COMPONENT ════════════════════════════════════════════════ */
const TodaysChallenge = () => {
  const countdown = useCountdown();

  const [challenge,  setChallenge]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [winners,    setWinners]    = useState([]);
  const [totalSubs,  setTotalSubs]  = useState(0);

  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [answer,     setAnswer]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [attempts,   setAttempts]   = useState(0);
  const [feedback,   setFeedback]   = useState(null);
  const [solved,     setSolved]     = useState(false);  // solved this session
  const [alreadyDone,setAlreadyDone]= useState(false);  // solved previously (localStorage)
  const [myRank,     setMyRank]     = useState(null);

  const channelRef = useRef(null);

  /* ── fetch today's challenge ── */
  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("challenges").select("*")
        .eq("active_date", today).eq("is_published", true).single();
      if (data) {
        setChallenge(data);
        // Check if already solved today via localStorage
        const solvedKey = getTodaySolvedKey(data.id);
        if (localStorage.getItem(solvedKey)) {
          setAlreadyDone(true);
          const savedRank = localStorage.getItem(solvedKey + "_rank");
          if (savedRank) setMyRank(parseInt(savedRank, 10));
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  /* ── fetch winners + realtime ── */
  const fetchWinners = useCallback(async () => {
    if (!challenge) return;
    const { data } = await supabase
      .from("challenge_submissions").select("*")
      .eq("challenge_id", challenge.id)
      .order("solved_at", { ascending: true });
    if (data) {
      const correct = data.filter(s => s.is_correct);
      setWinners(correct);
      setTotalSubs(data.length);
    }
  }, [challenge]);

  useEffect(() => {
    if (!challenge) return;
    fetchWinners();
    channelRef.current = supabase
      .channel("challenge_submissions_live")
      .on("postgres_changes",
        { event:"INSERT", schema:"public", table:"challenge_submissions" },
        () => fetchWinners()
      ).subscribe();
    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [challenge, fetchWinners]);

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !answer.trim() || !challenge) return;
    setSubmitting(true);
    setFeedback(null);

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Step 1: exact match
    let isCorrect = answer.trim().toLowerCase() === challenge.answer.trim().toLowerCase();
    let via = "exact";
    let aiFeedback = null;

    // Step 2: if exact fails, try Gemini
    if (!isCorrect) {
      const geminiResult = await checkWithGemini(answer.trim(), challenge.answer, challenge.title);
      if (geminiResult !== null) {
        isCorrect  = geminiResult.correct;
        via        = "gemini";
        aiFeedback = geminiResult.reason;
      }
    }

    if (isCorrect) {
      const { error } = await supabase.from("challenge_submissions").insert({
        challenge_id:  challenge.id,
        student_name:  name.trim(),
        student_email: email.trim() || null,
        answer:        answer.trim(),
        is_correct:    true,
        attempts:      newAttempts,
      });

      if (error && error.code === "23505") {
        // DB duplicate — mark as already done
        setAlreadyDone(true);
      } else {
        // Save solved state to localStorage so page refresh keeps it
        const solvedKey = getTodaySolvedKey(challenge.id);
        localStorage.setItem(solvedKey, "1");

        await fetchWinners();
        // Figure out rank
        const { data: allWinners } = await supabase
          .from("challenge_submissions").select("id")
          .eq("challenge_id", challenge.id).eq("is_correct", true)
          .order("solved_at", { ascending: true });
        const rank = allWinners ? allWinners.length : 1;
        localStorage.setItem(solvedKey + "_rank", rank);
        setMyRank(rank);

        setFeedback({
          type: "correct",
          msg:  `🎉 Correct! Well done, ${name.split(" ")[0]}!${via === "gemini" ? " ✨ AI verified" : ""}`,
          explanation: challenge.explanation,
        });
        setSolved(true);
      }
    } else {
      await supabase.from("challenge_submissions").upsert({
        challenge_id:  challenge.id,
        student_name:  name.trim(),
        student_email: email.trim() || null,
        answer:        answer.trim(),
        is_correct:    false,
        attempts:      newAttempts,
      }, { onConflict:"challenge_id,student_email", ignoreDuplicates:false });

      const showHint = newAttempts >= 2 && challenge.hint;
      setFeedback({
        type: "wrong",
        msg: aiFeedback
          ? `Not quite — ${aiFeedback}`
          : newAttempts === 1 ? "Not quite! Try again."
          : `Still not right. ${showHint ? "Check the hint below." : "Keep trying!"}`,
        showHint,
      });
    }
    setSubmitting(false);
  };

  const today = new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});
  const rankMedal = myRank === 1 ? "🥇" : myRank === 2 ? "🥈" : myRank === 3 ? "🥉" : null;

  /* ── Already solved banner ── */
  const AlreadySolvedBanner = () => (
    <div className="dc-solved-banner">
      <div className="dc-solved-trophy">🏆</div>
      <div className="dc-solved-title">Come Back Tomorrow, Champ!</div>
      <div className="dc-solved-msg">
        You already solved today's challenge.
        {myRank && <><br/>You finished <strong style={{color:"#ffa500"}}>#{myRank} {rankMedal || ""}</strong> on today's winners board.</>}
        <br/>A brand new challenge unlocks at midnight.
      </div>
      <div className="dc-solved-countdown">
        ⏱ Next challenge in &nbsp;<strong style={{color:"#ffa500"}}>{countdown}</strong>
      </div>
      {myRank && (
        <div className="dc-solved-rank">
          {myRank === 1 ? "🔥 You were first to solve it today!" : `You were solver #${myRank} today`}
        </div>
      )}
    </div>
  );

  if (loading) return (
    <><style>{css}</style>
    <div className="dc-wrap"><div className="dc-loading"><span/><span/><span/></div></div></>
  );

  if (!challenge) return (
    <><style>{css}</style>
    <div className="dc-wrap">
      <div className="dc-no-challenge">
        <div className="dc-no-challenge-icon">🔧</div>
        <div style={{fontSize:18,fontWeight:700,marginBottom:8,color:"rgba(255,255,255,0.5)"}}>No challenge today</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.2)"}}>Check back tomorrow.</div>
      </div>
    </div></>
  );

  return (
    <><style>{css}</style>
    <div className="dc-wrap">
      <div className="dc-inner">

        <div className="dc-header">
          <div className="dc-eyebrow">CodeBuild Academy</div>
          <h1 className="dc-title">Daily<br/>Challenge</h1>
          <p className="dc-subtitle">One new challenge every day. Answer correctly to get on the winners board.</p>
        </div>

        <div className="dc-grid">

          {/* ── Challenge card ── */}
          <div className="dc-card">
            <div className="dc-card-header">
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div className="dc-card-dots">
                  <div className="dc-dot" style={{background:"#ff5f57"}}/>
                  <div className="dc-dot" style={{background:"#ffbd2e"}}/>
                  <div className="dc-dot" style={{background:"#28ca41"}}/>
                </div>
                <span className="dc-card-date">{today}</span>
              </div>
              <div className="dc-card-badges">
                <span className={`dc-badge dc-badge-${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
                <span className="dc-badge dc-badge-tag">{challenge.tag}</span>
              </div>
            </div>

            <div className="dc-card-body">
              <div className="dc-challenge-num">// challenge of the day</div>
              <div className="dc-challenge-title">{challenge.title}</div>
              {renderDescription(challenge.description)}

              {/* Already solved — show banner instead of form */}
              {alreadyDone ? (
                <AlreadySolvedBanner />
              ) : (
                <>
                  {feedback?.showHint && challenge.hint && (
                    <div className="dc-hint">
                      <span className="dc-hint-icon">💡</span>
                      <span>{challenge.hint}</span>
                    </div>
                  )}

                  {feedback && (
                    <div className={`dc-feedback dc-feedback-${feedback.type}`}>
                      {feedback.msg}
                      {feedback.explanation && (
                        <div className="dc-explanation">📖 {feedback.explanation}</div>
                      )}
                    </div>
                  )}

                  {!solved ? (
                    <form className="dc-form" onSubmit={handleSubmit}>
                      <div className="dc-form-row">
                        <div className="dc-field">
                          <label>Your name *</label>
                          <input className="dc-input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Ali Khan" required/>
                        </div>
                        <div className="dc-field">
                          <label>Email (optional)</label>
                          <input className="dc-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="For tracking your streak"/>
                        </div>
                      </div>
                      <div className="dc-field" style={{marginBottom:12}}>
                        <label>Your answer *</label>
                        <input className="dc-input dc-input-answer" value={answer} onChange={e=>setAnswer(e.target.value)}
                          placeholder="Type your answer here…" required autoComplete="off" spellCheck="false"/>
                      </div>
                      <button className="dc-submit" type="submit" disabled={submitting||!name.trim()||!answer.trim()}>
                        {submitting ? <><div className="dc-submit-spinner"/> Checking…</> : <>⚡ Submit Answer</>}
                      </button>
                    </form>
                  ) : (
                    /* Just solved this session — show brief success then banner */
                    <AlreadySolvedBanner />
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="dc-right">
            <div className="dc-countdown-card">
              <div className="dc-countdown-label">Next challenge in</div>
              <div className="dc-countdown-time">{countdown}</div>
              <div className="dc-countdown-sub">resets at midnight</div>
            </div>

            <div className="dc-stats">
              <div className="dc-stat-card">
                <div className="dc-stat-num">{winners.length}</div>
                <div className="dc-stat-label">Solved today</div>
              </div>
              <div className="dc-stat-card">
                <div className="dc-stat-num">{totalSubs}</div>
                <div className="dc-stat-label">Attempts</div>
              </div>
            </div>

            <div className="dc-winners-card">
              <div className="dc-winners-head">
                <div className="dc-winners-title">Winners Board</div>
                <div className="dc-winners-live"><div className="dc-live-dot"/>Live</div>
              </div>
              <div className="dc-winners-list">
                {winners.length === 0 ? (
                  <div className="dc-winners-empty">No winners yet — be the first! 🚀</div>
                ) : (
                  winners.slice(0,10).map((w,i) => {
                    const rank = i+1;
                    const initials = w.student_name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
                    const rankClass = rank===1?"dc-rank-1":rank===2?"dc-rank-2":rank===3?"dc-rank-3":"dc-rank-n";
                    const medal = rank===1?"🥇":rank===2?"🥈":rank===3?"🥉":rank;
                    const time = new Date(w.solved_at).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
                    return (
                      <div key={w.id} className="dc-winner-row">
                        <div className={`dc-winner-rank ${rankClass}`}>{medal}</div>
                        <div className="dc-winner-avatar"
                          style={{background:rank<=3
                            ?`linear-gradient(135deg,${rank===1?"#ffd700,#ff8c00":rank===2?"#c0c0c0,#888":"#cd7f32,#8b4513"})`
                            :"linear-gradient(135deg,#ffa500,rgba(255,165,0,0.3))"}}>
                          {initials}
                        </div>
                        <div className="dc-winner-name">{w.student_name}</div>
                        <div className="dc-winner-time">{time}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
};

/* ─── Page shell: "Today's challenge" (original) + new "Practice" tab ─── */
const DailyChallenge = ({ initialView }) => {
  const [view, setView] = useState(() => initialView || (new URLSearchParams(window.location.search).get("tab") === "practice" ? "practice" : "today"));
  useSeo(view === "practice"
    ? { title: "Coding Practice – Python, C++ & JavaScript Quizzes and Tasks", description: "Free coding practice for students: easy, medium and hard MCQs and coding tasks in Python, C++ and JavaScript, with instant feedback.", path: "/practice" }
    : { title: "Daily Coding Challenge", description: "A new coding challenge every day from CodeBuild Academy. Solve it and join the winners board.", path: "/daily-challenge" });
  return (
    <>
      <style>{css}</style>
      <div className="v2 dc-tabs">
        <div className="px-seg" role="tablist" aria-label="Daily challenge sections">
          <button role="tab" aria-selected={view === "today"} className={view === "today" ? "on" : ""} onClick={() => setView("today")}>Today’s challenge</button>
          <button role="tab" aria-selected={view === "practice"} className={view === "practice" ? "on" : ""} onClick={() => setView("practice")}>Practice</button>
        </div>
      </div>
      {view === "practice" ? <Practice /> : <div className="dc-offset"><TodaysChallenge /></div>}
    </>
  );
};

export default DailyChallenge;
