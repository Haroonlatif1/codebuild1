// Verifies the practice question bank by actually running every code snippet and reference solution.
// Usage:  node scripts/verify-practice.mjs     (needs python3, node and g++ on your machine)
import fs from "fs"; import os from "os"; import path from "path"; import { spawnSync } from "child_process";
const dir = new URL("../src/components/practice/", import.meta.url).pathname;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "prac-"));
let bad = 0, checked = 0;
const fail = (id, msg) => { bad++; console.log(`✗ ${id}: ${msg}`); };
const norm = (s) => s.trim().replace(/\r?\n/g, " / ");

for (const lang of ["python", "javascript", "cpp"]) {
  const items = JSON.parse(fs.readFileSync(dir + lang + ".json", "utf8"));
  for (const it of items) {
    if (it.kind === "mcq") {
      if (it.options.length !== 4 || new Set(it.options).size !== 4) fail(it.id, "needs 4 unique options");
      if (!it.verify) continue;
      let out;
      if (lang === "python") out = spawnSync("python3", ["-c", it.code], { encoding: "utf8" });
      else if (lang === "javascript") out = spawnSync("node", ["-e", it.code], { encoding: "utf8" });
      else {
        const f = path.join(tmp, "a.cpp"); fs.writeFileSync(f, it.code);
        const c = spawnSync("g++", ["-std=c++17", "-o", path.join(tmp, "a"), f], { encoding: "utf8" });
        if (c.status) { fail(it.id, "does not compile\n" + c.stderr); continue; }
        out = spawnSync(path.join(tmp, "a"), { encoding: "utf8" });
      }
      checked++;
      if (norm(out.stdout) !== it.options[it.answer]) fail(it.id, `prints "${norm(out.stdout)}" but the answer says "${it.options[it.answer]}"`);
    } else if (lang === "javascript") {
      const f = new Function(it.solution + `; return ${it.fn};`)();
      for (const [args, expected] of it.tests) {
        checked++;
        if (JSON.stringify(f(...args)) !== JSON.stringify(expected)) fail(it.id, `solution fails ${JSON.stringify(args)}`);
      }
    } else if (lang === "cpp") {
      const f = path.join(tmp, "s.cpp"); fs.writeFileSync(f, it.solution);
      const c = spawnSync("g++", ["-std=c++17", "-O2", "-o", path.join(tmp, "s"), f], { encoding: "utf8" });
      if (c.status) { fail(it.id, "solution does not compile"); continue; }
      for (const t of it.tests) {
        checked++;
        const r = spawnSync(path.join(tmp, "s"), { input: t.input + "\n", encoding: "utf8" });
        if (r.stdout.trim() !== t.output) fail(it.id, `input "${t.input}" gives "${r.stdout.trim()}", expected "${t.output}"`);
      }
    } else { // python tasks: run the solution against stored tests
      for (const [args, expected] of it.tests) {
        checked++;
        const prog = `${it.solution}\nimport json,sys\nprint(json.dumps(${it.fn}(*json.loads(sys.stdin.read()))))`;
        const r = spawnSync("python3", ["-c", prog], { input: JSON.stringify(args), encoding: "utf8" });
        if (JSON.stringify(JSON.parse(r.stdout || "null")) !== JSON.stringify(expected)) fail(it.id, `solution fails ${JSON.stringify(args)}`);
      }
    }
  }
}
console.log(bad ? `\n${bad} problem(s) found` : `\nAll ${checked} checks passed ✓`);
process.exit(bad ? 1 : 0);
