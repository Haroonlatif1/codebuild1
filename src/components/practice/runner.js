// Runs a student's solution against test cases inside a Web Worker, so an infinite loop can be stopped
// and student code never touches the page. JavaScript runs natively; Python uses Pyodide (loaded on demand).

const JS_WORKER = `
onmessage = (e) => {
  const { code, fn, tests } = e.data;
  try {
    const f = new Function(code + "\\n;return typeof " + fn + " === 'function' ? " + fn + " : undefined;")();
    if (!f) return postMessage({ error: "Function " + fn + "() was not found. Keep the function name from the starter code." });
    const res = tests.map(([args, exp]) => {
      try {
        const got = f(...JSON.parse(JSON.stringify(args)));
        return { ok: JSON.stringify(got) === JSON.stringify(exp), got: JSON.stringify(got) };
      } catch (err) { return { ok: false, err: String(err) }; }
    });
    postMessage({ res });
  } catch (err) { postMessage({ error: String(err) }); }
};`;

const PY_WORKER = `
let py = null;
onmessage = async (e) => {
  const { code, fn, tests } = e.data;
  try {
    if (!py) {
      postMessage({ status: "Loading Python (first run only, ~10 MB)…" });
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
      py = await loadPyodide();
      py.runPython(\`
import json
def __cb_run(code, fn, tests):
    ns = {}
    try:
        exec(code, ns)
    except Exception as e:
        return json.dumps({"error": type(e).__name__ + ": " + str(e)})
    f = ns.get(fn)
    if not callable(f):
        return json.dumps({"error": "Function " + fn + "() was not found. Keep the function name from the starter code."})
    out = []
    for args, exp in json.loads(tests):
        try:
            got = f(*args)
            norm = json.loads(json.dumps(got))
            out.append({"ok": norm == exp, "got": json.dumps(norm)})
        except Exception as e:
            out.append({"ok": False, "err": type(e).__name__ + ": " + str(e)})
    return json.dumps({"res": out})
\`);
    }
    py.globals.set("CB_CODE", code); py.globals.set("CB_FN", fn); py.globals.set("CB_TESTS", JSON.stringify(tests));
    postMessage(JSON.parse(py.runPython("__cb_run(CB_CODE, CB_FN, CB_TESTS)")));
  } catch (err) { postMessage({ error: "Could not run Python here: " + String(err) + ". Use the self-check option below instead." }); }
};`;

const workers = {};
const make = (lang) => new Worker(URL.createObjectURL(new Blob([lang === "python" ? PY_WORKER : JS_WORKER], { type: "text/javascript" })));

/** Resolves to { res:[{ok,got,err}] } or { error } */
export function runTests(lang, code, fn, tests, onStatus) {
  return new Promise((resolve) => {
    if (typeof Worker === "undefined") return resolve({ error: "This browser cannot run code here." });
    const w = workers[lang] || (workers[lang] = make(lang));
    const limit = lang === "python" ? 60000 : 4000; // python's first run downloads the runtime
    let timer;
    const done = (v) => { clearTimeout(timer); w.onmessage = null; resolve(v); };
    w.onmessage = (e) => {
      if (e.data.status) { onStatus?.(e.data.status); clearTimeout(timer); timer = setTimeout(timeout, limit); return; }
      done(e.data);
    };
    w.onerror = (e) => done({ error: e.message || "Runtime error" });
    const timeout = () => { w.terminate(); delete workers[lang]; done({ error: lang === "python" ? "Timed out (or the Python runtime could not be downloaded). Check your internet, or use self-check." : "Your code ran for more than 4 seconds — is there an infinite loop?" }); };
    timer = setTimeout(timeout, limit);
    w.postMessage({ code, fn, tests });
  });
}
