#!/usr/bin/env python3
"""
Builds src/components/practice/practiceData.json and VERIFIES it by really running:
  * every "what is the output?" MCQ  (python3 / node / g++)
  * every task's reference solution against its tests (python3 / node / g++)
Run:  python3 tools/build_practice.py
Edit content in tools/content_*.py, then re-run. The script fails loudly if any answer is wrong.
"""
import json, os, subprocess, sys, tempfile, textwrap

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src/components/practice/practiceData.json")
LV = {"e": "easy", "m": "medium", "h": "hard"}
DATA = {"python": {"mcq": [], "tasks": []}, "cpp": {"mcq": [], "tasks": []}, "js": {"mcq": [], "tasks": []}}
CHECKS = []   # (kind, lang, id, payload)
_counter = {}

def _id(lang, kind, lv):
    k = (lang, kind, lv); _counter[k] = _counter.get(k, 0) + 1
    return f"{lang}-{kind}-{lv}{_counter[k]}"

def _options(correct, wrongs, pos):
    o = list(wrongs); assert len(o) == 3, (correct, wrongs)
    o.insert(pos % 4, correct); return o, pos % 4

def con(lang, lv, question, correct, wrongs, why, code=None):
    """Concept question (not machine-verified)."""
    n = len(DATA[lang]["mcq"]); o, a = _options(correct, wrongs, n * 3 + 1)
    DATA[lang]["mcq"].append({"id": _id(lang, "m", lv), "level": LV[lv], "q": question, "code": code, "o": o, "a": a, "why": why})

def out(lang, lv, code, correct, wrongs, why, q="What is the output?", pre=""):
    """Output question – the correct option is checked by executing the code."""
    n = len(DATA[lang]["mcq"]); o, a = _options(correct, wrongs, n * 3 + 2)
    shown = (pre.strip() + "\n\n" if pre else "") + code.strip()
    mid = _id(lang, "m", lv)
    DATA[lang]["mcq"].append({"id": mid, "level": LV[lv], "q": q, "code": shown, "o": o, "a": a, "why": why})
    CHECKS.append(("out", lang, mid, {"code": code, "pre": pre, "expect": correct}))

def task_fn(lang, lv, title, desc, fn, params, solution, tests, hint):
    """Function task (python / js). tests = [(args_list, expected), ...]"""
    tid = _id(lang, "t", lv)
    starter = (f"def {fn}({', '.join(params)}):\n    # write your code here\n    pass\n" if lang == "python"
               else f"function {fn}({', '.join(params)}) {{\n  // write your code here\n}}\n")
    DATA[lang]["tasks"].append({"id": tid, "level": LV[lv], "title": title, "desc": desc.strip(), "fn": fn, "starter": starter,
        "tests": [{"args": a, "out": e} for a, e in tests], "hint": hint, "solution": solution.strip("\n") + "\n"})
    CHECKS.append(("fn", lang, tid, {"fn": fn, "solution": solution, "tests": tests}))

def task_cpp(lv, title, desc, solution, samples, hint):
    """C++ task: samples = [(stdin, expected_stdout), ...]"""
    tid = _id("cpp", "t", lv)
    starter = "#include <iostream>\nusing namespace std;\n\nint main() {\n    // write your code here\n    return 0;\n}\n"
    DATA["cpp"]["tasks"].append({"id": tid, "level": LV[lv], "title": title, "desc": desc.strip(), "starter": starter,
        "samples": [{"input": i, "output": o} for i, o in samples], "hint": hint, "solution": solution.strip("\n") + "\n"})
    CHECKS.append(("cpp", "cpp", tid, {"solution": solution, "samples": samples}))

# ───────────────────────── content ─────────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import content_python, content_js, content_cpp
for m in (content_python, content_js, content_cpp):
    m.add(sys.modules[__name__])

# ───────────────────────── verification ─────────────────────────
def norm(s): return " ".join(str(s).split())
def run(cmd, inp=None, timeout=20):
    r = subprocess.run(cmd, input=inp, capture_output=True, text=True, timeout=timeout)
    return r.returncode, r.stdout, r.stderr

CPP_HEAD = "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <map>\n#include <set>\n#include <cmath>\nusing namespace std;\n"
failures = []
tmp = tempfile.mkdtemp(prefix="practice_")

def verify_out(lang, mid, p):
    if lang == "python":
        f = os.path.join(tmp, "a.py"); open(f, "w").write((p["pre"] + "\n" + p["code"]))
        rc, so, se = run([sys.executable, "-I", f])
    elif lang == "js":
        f = os.path.join(tmp, "a.js"); open(f, "w").write(p["pre"] + "\n" + p["code"])
        rc, so, se = run(["node", f])
    else:
        f = os.path.join(tmp, "a.cpp"); open(f, "w").write(CPP_HEAD + p["pre"] + "\nint main(){\n" + p["code"] + "\nreturn 0;}\n")
        rc, so, se = run(["g++", "-std=c++17", "-w", f, "-o", os.path.join(tmp, "a.out")])
        if rc == 0: rc, so, se = run([os.path.join(tmp, "a.out")])
    if rc != 0: failures.append(f"{mid}: did not run: {se[:200]}")
    elif norm(so) != norm(p["expect"]): failures.append(f"{mid}: output {norm(so)!r} != option {norm(p['expect'])!r}")

def jeq(a, b):
    if isinstance(a, dict) and isinstance(b, dict): return a.keys() == b.keys() and all(jeq(a[k], b[k]) for k in a)
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)): return len(a) == len(b) and all(jeq(x, y) for x, y in zip(a, b))
    if isinstance(a, (int, float)) and isinstance(b, (int, float)) and not isinstance(a, bool) and not isinstance(b, bool): return abs(a - b) < 1e-9
    return a == b

def verify_fn(lang, tid, p):
    args = json.dumps([a for a, _ in p["tests"]])
    if lang == "python":
        code = p["solution"] + "\nimport json\n_t=json.loads(%r)\nprint(json.dumps([%s(*a) for a in _t]))\n" % (args, p["fn"])
        f = os.path.join(tmp, "s.py"); open(f, "w").write(code); rc, so, se = run([sys.executable, "-I", f])
    else:
        code = p["solution"] + "\nconst _t=%s;console.log(JSON.stringify(_t.map(a=>%s(...a))));\n" % (args, p["fn"])
        f = os.path.join(tmp, "s.js"); open(f, "w").write(code); rc, so, se = run(["node", f])
    if rc != 0: return failures.append(f"{tid}: solution crashed: {se[:300]}")
    got = json.loads(so)
    for i, ((a, exp), g) in enumerate(zip(p["tests"], got)):
        if not jeq(g, exp): failures.append(f"{tid}: test {i} args={a} expected {exp!r} got {g!r}")

def verify_cpp(tid, p):
    f = os.path.join(tmp, "c.cpp"); open(f, "w").write(p["solution"])
    rc, so, se = run(["g++", "-std=c++17", "-w", f, "-o", os.path.join(tmp, "c.out")])
    if rc != 0: return failures.append(f"{tid}: compile error {se[:300]}")
    for i, (inp, exp) in enumerate(p["samples"]):
        rc, so, se = run([os.path.join(tmp, "c.out")], inp)
        if norm(so) != norm(exp): failures.append(f"{tid}: sample {i} expected {norm(exp)!r} got {norm(so)!r}")

for kind, lang, cid, p in CHECKS:
    {"out": lambda: verify_out(lang, cid, p), "fn": lambda: verify_fn(lang, cid, p), "cpp": lambda: verify_cpp(cid, p)}[kind]()

# structure checks
for lang, d in DATA.items():
    for lv in ("easy", "medium", "hard"):
        nm = sum(1 for x in d["mcq"] if x["level"] == lv); nt = sum(1 for x in d["tasks"] if x["level"] == lv)
        print(f"{lang:7s} {lv:7s} mcq={nm} tasks={nt}")
        if nm < 8 or nt < 4: failures.append(f"{lang}/{lv}: needs >=8 MCQs and >=4 tasks (has {nm}/{nt})")
    ids = [x["id"] for x in d["mcq"] + d["tasks"]]
    if len(ids) != len(set(ids)): failures.append(f"{lang}: duplicate ids")
    for x in d["mcq"]:
        if len(set(x["o"])) != 4: failures.append(f"{x['id']}: duplicate options {x['o']}")

if failures:
    print("\nVERIFICATION FAILED:"); [print(" -", f) for f in failures]; sys.exit(1)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(DATA, open(OUT, "w"), ensure_ascii=False, indent=1)
print(f"\nOK – {len(CHECKS)} items executed and verified → {os.path.relpath(OUT, ROOT)}")
