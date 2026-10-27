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
