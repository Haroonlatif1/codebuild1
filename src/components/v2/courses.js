export const COURSE_GROUPS = [
  { group: "Web Development", options: [
    { label: "Full Stack Web Development", tag: "Popular", cat: "web" },
    { label: "Frontend Web Dev with React", tag: "", cat: "web" } ] },
  { group: "AI & Data Science", options: [
    { label: "Full Stack Web Dev with Artificial Intelligence", tag: "Hot", cat: "web" },
    { label: "Machine Learning from Scratch", tag: "", cat: "ai" },
    { label: "Data Analysis with Python", tag: "", cat: "python" },
    { label: "AI Prompt Engineering", tag: "New", cat: "ai" },
    { label: "AI for kids", tag: "Kids", cat: "kids" },
    { label: "AI for Business", tag: "", cat: "ai" } ] },
  { group: "Emerging Tech", options: [
    { label: "Blockchain Development", tag: "New", cat: "emerging" },
    { label: "Robotics & Automation", tag: "", cat: "emerging" },
    { label: "Internet of Things (IoT)", tag: "New", cat: "emerging" } ] },
  { group: "Mobile & Security", options: [
    { label: "Android App Development", tag: "", cat: "mobile" },
    { label: "Ethical Hacking & Cyber Security", tag: "", cat: "security" },
    { label: "iOS App Development", tag: "", cat: "mobile" } ] },
  { group: "Programming", options: [
    { label: "Python Programming from Zero to Hero", tag: "", cat: "python" },
    { label: "JavaScript Programming from Zero to Hero", tag: "", cat: "web" },
    { label: "C++ Programming from Zero to Hero", tag: "", cat: "cpp" },
    { label: "Data Structures & Algorithms", tag: "", cat: "cpp" } ] },
  { group: "Business & Office", options: [
    { label: "Business Development", tag: "", cat: "business" },
    { label: "MS Office", tag: "", cat: "office" },
    { label: "Digital Marketing", tag: "", cat: "business" },
    { label: "Graphic Design with Adobe", tag: "", cat: "design" } ] },
];
export const ALL_COURSES = COURSE_GROUPS.flatMap(g => g.options);
export const courseCat = (label) => ALL_COURSES.find(c => c.label === label)?.cat || "general";
export const DEFAULT_COURSE = "Full Stack Web Development";

// ─────────────────────────────────────────────────────────────
//  ⚠ THE NUMBERS BELOW ARE SAMPLE PRICES – replace every one with your real fees before going live.
//  COURSE FEES  (edit these – shown on the home enrollment form and the Offered Courses page)
//  original = price before discount, price = price you charge now (both in PKR).
//  Leave a course as null and the site shows "Fee on WhatsApp" instead, so no wrong price is ever shown.
//  Example:  "Python Programming from Zero to Hero": { original: 15000, price: 9999 },
// ─────────────────────────────────────────────────────────────
export const COURSE_PRICES = {
  "Full Stack Web Development": { original: 40000, price: 29999 },
  "Frontend Web Dev with React": { original: 15000, price: 9999 },
  "Full Stack Web Dev with Artificial Intelligence": { original: 50000, price: 34999 },
  "Machine Learning from Scratch": { original: 40000, price: 27999 },
  "Data Analysis with Python": { original: 30000, price: 19999 },
  "AI Prompt Engineering": { original: 15000, price: 9999 },
  "AI for kids": { original: 35000, price: 21000 },
  "AI for Business": { original: 15000, price: 9999 },
  "Blockchain Development": { original: 40000, price: 27999 },
  "Robotics & Automation": { original: 35000, price: 24999 },
  "Internet of Things (IoT)": { original: 30000, price: 19999 },
  "Android App Development": { original: 35000, price: 24999 },
  "Ethical Hacking & Cyber Security": { original: 40000, price: 27999 },
  "iOS App Development": { original: 40000, price: 27999 },
  "Python Programming from Zero to Hero": { original: 20000, price: 12999 },
  "JavaScript Programming from Zero to Hero": { original: 20000, price: 12999 },
  "C++ Programming from Zero to Hero": { original: 20000, price: 12999 },
  "Data Structures & Algorithms": { original: 25000, price: 15999 },
  "Business Development": { original: 15000, price: 9999 },
  "MS Office": { original: 10000, price: 6999 },
  "Digital Marketing": { original: 30000, price: 24000 },
  "Graphic Design with Adobe": { original: 25000, price: 15999 },
};
/** → { original, price, off } or null when no fee is set */
export const priceOf = (label) => {
  const c = COURSE_PRICES[label];
  if (!c || !c.price) return null;
  const original = c.original && c.original > c.price ? c.original : null;
  return { original, price: c.price, off: original ? Math.round(((original - c.price) / original) * 100) : 0 };
};
export const pkr = (n) => `PKR ${Number(n).toLocaleString()}`;