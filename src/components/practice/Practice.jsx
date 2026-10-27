import React, { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "../supabase/SupabaseClient";
import "../v2/v2.css";
import PY from "./python.json";
import JS from "./javascript.json";
import CPP from "./cpp.json";
import { runTests } from "./runner";

const LANGS = [
  { id: "python", name: "Python", note: "Beginner-friendly, used in AI & data" },
  { id: "cpp", name: "C++", note: "Fast, close to the machine" },
  { id: "javascript", name: "JavaScript", note: "The language of the web" },
];
const LEVELS = ["easy", "medium", "hard"];
const BUILT_IN = [...PY, ...JS, ...CPP];
const KEY = "cb_practice_v1";

const loadProgress = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const saveProgress = (p) => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* private mode */ } };

// stable shuffle so options keep their position while a question is open
const seeded = (arr, seed) => {
  let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => (h = (h * 1664525 + 1013904223) >>> 0) / 4294967296;
  const a = arr.map((v, i) => ({ v, i })); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a;
};

/* ───────── MCQ quiz ───────── */
const Quiz = ({ items, progress, setProgress, lang, level }) => {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [session, setSession] = useState({});     // id -> true/false for this run
  const [finished, setFinished] = useState(false);
  useEffect(() => { setI(0); setPicked(null); setSession({}); setFinished(false); }, [lang, level, items.length]);

  if (!items.length) return <p className="px-empty">No quiz questions here yet.</p>;
  const q = items[i];
  const opts = seeded(q.options, q.id);
  const correctPos = opts.findIndex(o => o.i === (q.answer || 0));

  const choose = (pos) => {
    if (picked !== null) return;
    setPicked(pos);
    const ok = pos === correctPos;
    setSession(s => ({ ...s, [q.id]: ok }));
    setProgress(p => ({ ...p, mcq: { ...(p.mcq || {}), [q.id]: ok ? 1 : 0 } }));
  };
  const next = () => { if (i + 1 >= items.length) setFinished(true); else { setI(i + 1); setPicked(null); } };

  if (finished) {
    const score = Object.values(session).filter(Boolean).length;
    return (
      <div className="px-card px-result">
        <div className="px-score">{score}<small>/{items.length}</small></div>
        <h3>{score === items.length ? "Perfect round" : score >= items.length * 0.6 ? "Nice work" : "Keep practising"}</h3>
        <p>{score === items.length ? "Every answer correct. Try the next level or switch to coding tasks." : "Review the explanations and try the round again — the options are shuffled each time."}</p>
        <div className="px-actions"><button className="v2-btn" onClick={() => { setI(0); setPicked(null); setSession({}); setFinished(false); }}>Try again</button></div>
      </div>
    );
  }
  return (
    <div className="px-card">
      <div className="px-meta"><span>Question {i + 1} of {items.length}</span><span>{Object.values(session).filter(Boolean).length} correct</span></div>
      <div className="asm-prog"><i style={{ width: `${((i + (picked !== null ? 1 : 0)) / items.length) * 100}%` }} /></div>
      <div className="px-q">{q.q}</div>
      {q.code && <pre className="px-code" tabIndex={0}><code>{q.code}</code></pre>}
      <div role="radiogroup" aria-label="Answers">
        {opts.map((o, pos) => {
          const state = picked === null ? "" : pos === correctPos ? " ok" : pos === picked ? " bad" : " dim";
          return <button key={pos} role="radio" aria-checked={picked === pos} className={`asm-opt${state}`} onClick={() => choose(pos)}><b>{"ABCD"[pos]}</b><span className="px-opt">{o.v}</span></button>;
        })}
      </div>
      {picked !== null && (
        <div className={`px-explain ${picked === correctPos ? "ok" : "bad"}`} role="status">
          <strong>{picked === correctPos ? "Correct." : "Not quite."}</strong> {q.why}
        </div>
      )}
      <div className="asm-nav"><span />
        <button className="v2-btn" disabled={picked === null} onClick={next}>{i + 1 >= items.length ? "Finish" : "Next question"}</button></div>
    </div>
  );
};

/* ───────── Coding task ───────── */
const Task = ({ task, lang, progress, setProgress, onBack }) => {
  const key = `cb_practice_code_${task.id}`;
  const [code, setCode] = useState(() => { try { return localStorage.getItem(key) || task.starter || ""; } catch { return task.starter || ""; } });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState(false);
  const [sol, setSol] = useState(false);
  const canRun = lang !== "cpp" && Array.isArray(task.tests) && task.tests.length && task.fn;
  const solved = !!progress.done?.[task.id];

  useEffect(() => { try { localStorage.setItem(key, code); } catch { /* ignore */ } }, [code, key]);
  const markDone = () => setProgress(p => ({ ...p, done: { ...(p.done || {}), [task.id]: 1 } }));

  const run = async () => {
    setBusy(true); setResult(null); setStatus("Running…");
    const r = await runTests(lang, code, task.fn, task.tests, setStatus);
    setBusy(false); setStatus(""); setResult(r);
    if (r.res && r.res.every(x => x.ok)) markDone();
  };
  const onKey = (e) => {
    if (e.key === "Tab") { e.preventDefault(); const t = e.target, s = t.selectionStart; const v = code.slice(0, s) + "    " + code.slice(t.selectionEnd); setCode(v); requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 4; }); }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canRun && !busy) run();
  };
  const passed = result?.res?.filter(x => x.ok).length;

  return (
    <div className="px-task">
      <button className="px-back" onClick={onBack}>← All tasks</button>
      <div className="px-task-grid">
        <div className="px-card">
          <div className="px-tag">{task.level} · coding task {solved && <span className="px-solved">Solved</span>}</div>
          <h3 className="px-title">{task.title}</h3>
          <p className="px-text">{task.statement}</p>
          {task.io && <pre className="px-io">{task.io}</pre>}
          {task.examples?.length > 0 && <>
            <div className="v2-label" style={{ marginTop: 18 }}>Examples</div>
            {task.examples.map((e, k) => e.call
              ? <pre key={k} className="px-io">{e.call}{"\n"}→ {e.out}</pre>
              : <pre key={k} className="px-io">Input:  {e.input}{"\n"}Output: {e.output}</pre>)}
          </>}
          {task.expected && <><div className="v2-label" style={{ marginTop: 18 }}>Expected output</div><pre className="px-io">{task.expected}</pre></>}
          <div className="px-actions" style={{ justifyContent: "flex-start", marginTop: 18 }}>
            {task.hint && <button className="v2-btn ghost" onClick={() => setHint(h => !h)}>{hint ? "Hide hint" : "Show hint"}</button>}
          </div>
          {hint && <div className="px-explain ok" style={{ marginTop: 12 }}>{task.hint}</div>}
        </div>

        <div className="px-card">
          <div className="px-editor-head"><span>{LANGS.find(l => l.id === lang).name}</span>
            <button className="px-link" onClick={() => { setCode(task.starter || ""); setResult(null); }}>Reset code</button></div>
          <textarea className="px-editor" value={code} onChange={e => setCode(e.target.value)} onKeyDown={onKey} spellCheck={false} autoCapitalize="off" autoCorrect="off" aria-label="Code editor" />
          <div className="px-actions" style={{ justifyContent: "flex-start", marginTop: 14 }}>
            {canRun
              ? <button className="v2-btn" onClick={run} disabled={busy}>{busy ? (status || "Running…") : "Run tests"}</button>
              : <button className="v2-btn" onClick={markDone}>{solved ? "Marked as solved" : "I solved it"}</button>}
            <button className="v2-btn ghost" onClick={() => setSol(s => !s)}>{sol ? "Hide solution" : "Reveal solution"}</button>
          </div>
          {!canRun && <p className="px-note">{lang === "cpp" ? "C++ can’t be compiled inside the browser. Run it on your computer or any online C++ compiler, compare with the examples, then mark it solved." : "Check your work against the expected output, then mark it solved."}</p>}
          {result?.error && <div className="px-explain bad" role="alert">{result.error}</div>}
          {result?.res && (
            <div className="px-tests" role="status">
              <div className={`px-summary ${passed === result.res.length ? "ok" : "bad"}`}>{passed === result.res.length ? "All tests passed" : `${passed} of ${result.res.length} tests passed`}</div>
              {result.res.map((r, k) => (
                <div key={k} className={`px-test ${r.ok ? "ok" : "bad"}`}>
                  <b>{r.ok ? "✓" : "✗"}</b> Test {k + 1}{!r.ok && <span> — expected <code>{JSON.stringify(task.tests[k][1])}</code>, got <code>{r.err || r.got}</code></span>}
                </div>))}
            </div>)}
          {sol && <><div className="v2-label" style={{ marginTop: 18 }}>Reference solution</div><pre className="px-code"><code>{task.solution}</code></pre></>}
        </div>
      </div>
    </div>
  );
};

/* ───────── Practice hub ───────── */
const Practice = () => {
  const [lang, setLang] = useState("python");
  const [level, setLevel] = useState("easy");
  const [mode, setMode] = useState("mcq");
  const [openTask, setOpenTask] = useState(null);
  const [progress, setProgressState] = useState(loadProgress);
  const [custom, setCustom] = useState([]);

  const setProgress = useCallback((fn) => setProgressState(p => { const n = typeof fn === "function" ? fn(p) : fn; saveProgress(n); return n; }), []);

  useEffect(() => { // extra questions added by the admin (optional table)
    supabase.from("practice_items").select("*").eq("is_published", true).order("created_at", { ascending: true })
      .then(({ data }) => setCustom((data || []).map(r => ({
        id: `db-${r.id}`, lang: r.language, level: r.level, kind: r.kind, q: r.question, code: r.code || null,
        options: r.options || [], answer: r.answer || 0, why: r.explanation, title: r.title, statement: r.statement,
        starter: r.starter, hint: r.hint, solution: r.solution, expected: r.expected,
      }))), () => {});
  }, []);

  const all = useMemo(() => [...BUILT_IN, ...custom], [custom]);
  const count = (l, lv, kind) => all.filter(i => i.lang === l && (!lv || i.level === lv) && (!kind || i.kind === kind)).length;
  const doneCount = (l) => all.filter(i => i.lang === l && (i.kind === "mcq" ? progress.mcq?.[i.id] === 1 : progress.done?.[i.id])).length;
  const items = all.filter(i => i.lang === lang && i.level === level && i.kind === mode);
  const total = count(lang);

  useEffect(() => setOpenTask(null), [lang, level, mode]);
  const task = openTask && items.find(t => t.id === openTask);

  return (
    <section className="v2 px" aria-labelledby="px-h">
      <div className="v2-wrap">
        <header className="px-head">
          <div className="v2-eyebrow">Practice zone</div>
          <h1 className="v2-h2" id="px-h">Practise coding, at your level</h1>
          <p className="v2-lead">Multiple-choice quizzes and hands-on coding tasks in Python, C++ and JavaScript — easy, medium and hard. Your progress is saved on this device.</p>
        </header>

        <div className="px-langs" role="tablist" aria-label="Language">
          {LANGS.map(l => (
            <button key={l.id} role="tab" aria-selected={lang === l.id} className={`px-lang${lang === l.id ? " on" : ""}`} onClick={() => setLang(l.id)}>
              <strong>{l.name}</strong><span>{l.note}</span>
              <div className="px-bar"><i style={{ width: `${(doneCount(l.id) / Math.max(1, count(l.id))) * 100}%` }} /></div>
              <small>{doneCount(l.id)} of {count(l.id)} done</small>
            </button>))}
        </div>

        <div className="px-controls">
          <div className="px-seg" role="tablist" aria-label="Difficulty">
            {LEVELS.map(lv => <button key={lv} role="tab" aria-selected={level === lv} className={level === lv ? "on" : ""} onClick={() => setLevel(lv)}>{lv}</button>)}
          </div>
          <div className="px-seg" role="tablist" aria-label="Practice type">
            <button role="tab" aria-selected={mode === "mcq"} className={mode === "mcq" ? "on" : ""} onClick={() => setMode("mcq")}>Quiz · {count(lang, level, "mcq")}</button>
            <button role="tab" aria-selected={mode === "task"} className={mode === "task" ? "on" : ""} onClick={() => setMode("task")}>Coding tasks · {count(lang, level, "task")}</button>
          </div>
        </div>

        {mode === "mcq" && <Quiz items={items} progress={progress} setProgress={setProgress} lang={lang} level={level} />}
        {mode === "task" && (task
          ? <Task key={task.id} task={task} lang={lang} progress={progress} setProgress={setProgress} onBack={() => setOpenTask(null)} />
          : items.length === 0 ? <p className="px-empty">No coding tasks here yet.</p>
            : <div className="px-list">{items.map((t, n) => (
              <button key={t.id} className="px-item" onClick={() => setOpenTask(t.id)}>
                <span className="px-n">{String(n + 1).padStart(2, "0")}</span>
                <span><strong>{t.title}</strong><small>{t.statement}</small></span>
                <em className={progress.done?.[t.id] ? "on" : ""}>{progress.done?.[t.id] ? "Solved" : "Open"}</em>
              </button>))}</div>)}
        <p className="px-foot">{total} practice items in {LANGS.find(l => l.id === lang).name}. Stuck? Message us on WhatsApp — a real teacher will help.</p>
      </div>
    </section>
  );
};
export default Practice;
