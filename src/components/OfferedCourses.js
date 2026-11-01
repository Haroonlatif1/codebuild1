import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faChevronRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import { HeroScene, CountUp, Tilt, Ticker, cfxCss } from './v2/CoursesFx';
import { priceOf, pkr } from './v2/courses';
import { KIDS_OFFER } from '../config/siteConfig';
import { useSeo } from './v2/seo';

/* ─── data ────────────────────────────────────────────────────── */
const courses = [
  {
    name: "Full Stack Web Development", label: "Full Stack Web Development", cat: "Web",
    desc: "Build complete web apps — frontend to backend — with modern frameworks and real deployments.",
    image: "../../webdev.png",
    duration: 6, students: "2.4k", tag: "Popular",
    skills: ["HTML/CSS", "React", "Node.js", "MongoDB"],
    accent: "#1a4a2e",
  },
  {
    name: "Data Science with Python", label: "Data Analysis with Python", cat: "AI & Data",
    desc: "Harness Python for data analysis, visualization, and predictive machine learning models.",
    image: "../../ds.jpg",
    duration: 6, students: "1.8k", tag: "Hot",
    skills: ["Pandas", "NumPy", "Matplotlib", "Sklearn"],
    accent: "#1a2040",
  },
  {
    name: "Full Stack with AI", label: "Full Stack Web Dev with Artificial Intelligence", cat: "AI & Data",
    desc: "Combine full-stack engineering with real AI/ML integrations and LLM-powered features.",
    image: "../../webdev.png",
    duration: 6, students: "1.2k", tag: "Hot",
    skills: ["React", "Python", "OpenAI", "FastAPI"],
    accent: "#2e1a40",
  },
  {
    name: "Machine Learning", label: "Machine Learning from Scratch", cat: "AI & Data",
    desc: "Master ML algorithms, model training, evaluation, and production deployment pipelines.",
    image: "../../ds.jpg",
    duration: 5, students: "980", tag: "",
    skills: ["TensorFlow", "PyTorch", "Scikit", "MLOps"],
    accent: "#3a1a1a",
  },
  {
    name: "Business Development", label: "Business Development", cat: "Business",
    desc: "Strategic thinking and practical tools to scale any business in competitive markets.",
    image: "../../bd.jpg",
    duration: 3, students: "1.5k", tag: "",
    skills: ["Strategy", "Marketing", "Finance", "Sales"],
    accent: "#2e2a10",
  },
  {
    name: "Mobile App Development", label: "Android App Development", cat: "Mobile",
    desc: "Build professional Android & iOS apps with modern cross-platform development tools.",
    image: "../../and.jpg",
    duration: 6, students: "870", tag: "",
    skills: ["Flutter", "Dart", "Firebase", "REST APIs"],
    accent: "#102a2e",
  },
  {
    name: "MS Office Professional", label: "MS Office", cat: "Business",
    desc: "Master Excel, Word, PowerPoint and more for peak productivity in any workplace.",
    image: "../../ms.jpg",
    duration: 3, students: "3.1k", tag: "",
    skills: ["Excel", "Word", "PowerPoint", "Access"],
    accent: "#10102e",
  },
  {
    name: "Cybersecurity & Ethical Hacking", label: "Ethical Hacking & Cyber Security", cat: "Security",
    desc: "Protect systems and networks from real-world threats using offensive and defensive techniques.",
    image: "../../ethical.jpg",
    duration: 6, students: "1.1k", tag: "New",
    skills: ["Kali Linux", "Metasploit", "Wireshark", "OSINT"],
    accent: "#3a1010",
  },
  {
    name: "Frontend with React", label: "Frontend Web Dev with React", cat: "Web",
    desc: "Build dynamic, responsive UIs with React, Redux, and modern JavaScript (ES6+).",
    image: "../../frontend.jpg",
    duration: 3, students: "2.0k", tag: "",
    skills: ["React", "Redux", "Tailwind", "TypeScript"],
    accent: "#102040",
  },
  {
    name: "Python Bootcamp", label: "Python Programming from Zero to Hero", cat: "Programming",
    desc: "Zero to hero — become a Python expert through 50+ real hands-on projects.",
    image: "../../python.jpg",
    duration: 2, students: "4.2k", tag: "Popular",
    skills: ["Python", "OOP", "APIs", "Automation"],
    accent: "#102a1a",
  },
  {
    name: "Blockchain Development", label: "Blockchain Development", cat: "Emerging Tech",
    desc: "Build smart contracts and decentralized apps on Ethereum and modern blockchain networks.",
    image: "../../webdev.png",
    duration: 4, students: "540", tag: "New",
    skills: ["Solidity", "Web3.js", "Hardhat", "IPFS"],
    accent: "#10103a",
  },
  {
    name: "Robotics & Automation", label: "Robotics & Automation", cat: "Emerging Tech",
    desc: "Embedded systems, IoT, and robotic automation with real hardware and software labs.",
    image: "../../ds.jpg",
    duration: 6, students: "320", tag: "New",
    skills: ["Arduino", "ROS", "Python", "CAD"],
    accent: "#2a102a",
  },
];



/* ─── CSS ─────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@400;600;700;800&family=Bebas+Neue&display=swap');

  .coc-wrap {
    background: #09090e;
    min-height: 100vh;
    font-family: "Dosis", sans-serif;
    color: #fff;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
  }
  .coc-wrap *, .coc-wrap *::before, .coc-wrap *::after {
    box-sizing: border-box;
  }

  /* ── hero ── */
  .coc-hero {
    position: relative;
    padding: 80px 32px 60px;
    text-align: center;
    overflow: hidden;
  }
  .coc-hero-glow {
    position: absolute;
    width: 700px; height: 400px;
    background: radial-gradient(ellipse, rgba(255,165,0,0.07) 0%, transparent 70%);
    top: -60px; left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }
  .coc-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #ffa500;
    border: 1px solid rgba(255,165,0,0.22);
    background: rgba(255,165,0,0.05);
    padding: 5px 16px;
    border-radius: 20px;
    margin-bottom: 20px;
  }
  .coc-hero-h1 {
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(50px, 8vw, 96px);
    letter-spacing: 3px;
    line-height: 0.92;
    color: #fff;
    margin-bottom: 18px;
  }
  .coc-hero-h1 em {
    font-style: normal;
    display: block;
    -webkit-text-stroke: 1px #ffa500;
    color: transparent;
  }
  .coc-hero-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.3);
    max-width: 420px;
    margin: 0 auto 36px;
    line-height: 1.75;
  }
  .coc-stats {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 4px;
    overflow: hidden;
    background: #0d0d12;
    max-width: 480px;
    margin: 0 auto;
  }
  .coc-stat {
    flex: 1;
    min-width: 100px;
    padding: 14px 16px;
    border-right: 1px solid rgba(255,255,255,0.07);
    text-align: center;
  }
  .coc-stat:last-child { border-right: none; }
  .coc-stat-n {
    font-family: "Bebas Neue", sans-serif;
    font-size: 22px;
    color: #ffa500;
    letter-spacing: 1px;
    line-height: 1;
  }
  .coc-stat-l {
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    margin-top: 2px;
  }

  /* ── body ── */
  .coc-body {
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 24px 80px;
    width: 100%;
  }
  .coc-section-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .coc-section-label-text {
    font-family: "Bebas Neue", sans-serif;
    font-size: 12px;
    letter-spacing: 4px;
    color: rgba(255,255,255,0.2);
    white-space: nowrap;
  }
  .coc-section-label-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.05);
  }
  .coc-section-label-count {
    font-size: 11px;
    letter-spacing: 1px;
    color: rgba(255,165,0,0.45);
    font-weight: 700;
    white-space: nowrap;
  }

  /* ── grid ── */
  .coc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    width: 100%;
  }

  /* ── card ── */
  .coc-card {
    background: #0f0f15;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .coc-card:hover {
    border-color: rgba(255,165,0,0.3);
    box-shadow:
      0 16px 48px rgba(0,0,0,0.6),
      0 0 0 1px rgba(255,165,0,0.08);
  }

  /* ── image area ── */
  .coc-card-img-wrap {
    position: relative;
    height: 148px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .coc-card-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.75;
    transition: opacity 0.5s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1);
    filter: saturate(0.7) brightness(0.85);
  }
  .coc-card:hover .coc-card-img {
    opacity: 0.9;
    transform: scale(1.05);
    filter: saturate(0.9) brightness(0.95);
  }

  /* gradient vignette over image — blends into card */
  .coc-card-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(9,9,14,0.05) 0%,
      rgba(9,9,14,0.3)  50%,
      rgba(15,15,21,0.95) 100%
    );
    z-index: 1;
  }

  /* tag badge over image */
  .coc-card-tag {
    position: absolute;
    top: 11px;
    right: 11px;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 2px;
    background: rgba(255,165,0,0.18);
    color: #ffa500;
    border: 1px solid rgba(255,165,0,0.3);
    z-index: 2;
    backdrop-filter: blur(4px);
  }

  /* course number watermark */
  .coc-card-num {
    position: absolute;
    bottom: 10px;
    left: 13px;
    font-family: "Bebas Neue", sans-serif;
    font-size: 42px;
    line-height: 1;
    color: rgba(255,255,255,0.06);
    z-index: 2;
    letter-spacing: 2px;
    user-select: none;
  }

  /* ── card body ── */
  .coc-card-body {
    padding: 15px 16px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .coc-card-name {
    font-family: "Bebas Neue", sans-serif;
    font-size: 16px;
    letter-spacing: 1px;
    color: #fff;
    line-height: 1.2;
    transition: color 0.25s;
  }
  .coc-card:hover .coc-card-name { color: #ffa500; }

  .coc-card-desc {
    font-size: 11.5px;
    color: rgba(255,255,255,0.32);
    line-height: 1.65;
    flex: 1;
  }

  /* skill pills */
  .coc-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .coc-skill {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 2px;
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.35);
    border: 1px solid rgba(255,255,255,0.07);
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .coc-card:hover .coc-skill {
    background: rgba(255,165,0,0.07);
    color: rgba(255,165,0,0.65);
    border-color: rgba(255,165,0,0.15);
  }





  /* ── card footer ── */
  .coc-card-footer {
    display: flex;
    margin-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .coc-card-btn {
    flex: 1;
    background: transparent;
    border: none;
    font-family: "Dosis", sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 11px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: background 0.2s, color 0.2s;
    border-right: 1px solid rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.25);
  }
  .coc-card-btn:last-child { border-right: none; }
  .coc-card-btn.primary {
    color: rgba(255,165,0,0.75);
    background: rgba(255,165,0,0.04);
  }
  .coc-card-btn.primary:hover {
    background: #ffa500;
    color: #09090e;
  }
  .coc-card-btn:not(.primary):hover {
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.55);
  }

  /* ── CTA ── */
  .coc-cta {
    text-align: center;
    padding: 56px 24px 72px;
  }
  .coc-cta-line {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, transparent, rgba(255,165,0,0.45));
    margin: 0 auto 26px;
  }
  .coc-cta-h {
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(28px, 4vw, 48px);
    letter-spacing: 3px;
    color: #fff;
    margin-bottom: 8px;
  }
  .coc-cta-h em { color: #ffa500; font-style: normal; }
  .coc-cta-p {
    font-size: 13px;
    color: rgba(255,255,255,0.25);
    margin-bottom: 26px;
  }
  .coc-cta-link {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: "Bebas Neue", sans-serif;
    font-size: 16px;
    letter-spacing: 2.5px;
    background: #ffa500;
    color: #09090e;
    border: 1px solid #ffa500;
    border-radius: 3px;
    padding: 12px 36px;
    text-decoration: none;
    transition: background 0.25s, color 0.25s;
    box-shadow: 0 4px 20px rgba(255,165,0,0.2);
  }
  .coc-cta-link:hover {
    background: transparent;
    color: #ffa500;
    box-shadow: none;
  }

  /* ── responsive ── */
  @media (max-width: 1100px) {
    .coc-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 780px) {
    .coc-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .coc-hero { padding: 60px 20px 48px; }
    .coc-body { padding: 0 16px 60px; }
  }
  @media (max-width: 480px) {
    .coc-grid { grid-template-columns: 1fr; }
    .coc-hero-h1 { font-size: 46px; }
  }

  /* ── v2 improvements: readable text, price, filters, featured offer ── */
  .coc-card-name { font-size: 20px; }
  .coc-card-desc { font-size: 14px; color: rgba(255,255,255,0.55); }
  .coc-skill { font-size: 10.5px; color: rgba(255,255,255,0.55); }
  .coc-card-btn { font-size: 12px; padding: 13px 8px; color: rgba(255,255,255,0.5); }
  .coc-card-tag { font-size: 10px; }
  .coc-meta { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: .6px; color: rgba(255,255,255,0.5); }
  .coc-meta span + span::before { content: ""; display: inline-block; width: 3px; height: 3px; border-radius: 50%; background: #ffa500; margin-right: 12px; vertical-align: middle; }
  .coc-price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px; margin-top: 4px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
  .coc-price s { color: rgba(255,255,255,0.4); font-size: 14px; font-weight: 600; }
  .coc-price b { font-family: "Bebas Neue", sans-serif; font-weight: 400; font-size: 28px; letter-spacing: 1px; color: #fff; line-height: 1; }
  .coc-price em { font-style: normal; font-size: 10.5px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; background: #3ecf8e; color: #06281a; padding: 3px 8px; border-radius: 2px; }
  .coc-price.ask { color: rgba(255,255,255,0.5); font-size: 14px; font-weight: 700; }
  .coc-pills { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 22px; }
  .coc-pills button { font-family: "Dosis", sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; padding: 8px 16px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.12); background: transparent; color: rgba(255,255,255,0.6); cursor: pointer; transition: .2s; }
  .coc-pills button:hover { border-color: #ffa500; color: #ffa500; }
  .coc-pills button.on { background: #ffa500; border-color: #ffa500; color: #09090e; }
  .coc-feature { display: flex; justify-content: space-between; align-items: center; gap: 28px; flex-wrap: wrap; text-decoration: none; color: #fff; margin: 0 0 40px; padding: 28px 32px; border: 1px solid #ffa500; border-radius: 8px; background: linear-gradient(110deg, rgba(255,165,0,0.14), rgba(255,165,0,0.03)); transition: transform .2s, box-shadow .2s; }
  .coc-feature:hover { transform: translateY(-2px); box-shadow: 0 18px 50px rgba(255,165,0,0.12); color: #fff; }
  .coc-feature-tag { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; color: #ffa500; margin-bottom: 8px; }
  .coc-feature h2 { font-family: "Bebas Neue", sans-serif; font-weight: 400; font-size: 38px; letter-spacing: 1px; margin: 0 0 6px; }
  .coc-feature p { margin: 0; max-width: 56ch; color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.55; }
  .coc-feature-price { text-align: right; display: flex; flex-direction: column; gap: 2px; align-items: flex-end; }
  .coc-feature-price s { color: rgba(255,255,255,0.4); font-size: 16px; }
  .coc-feature-price b { font-family: "Bebas Neue", sans-serif; font-weight: 400; font-size: 52px; line-height: 1; letter-spacing: 1px; }
  .coc-feature-price span { margin-top: 8px; background: #ffa500; color: #09090e; font-weight: 800; font-size: 13px; letter-spacing: 1.4px; text-transform: uppercase; padding: 11px 20px; border-radius: 3px; }
  @media (max-width: 700px) { .coc-feature { padding: 22px 20px; } .coc-feature-price { align-items: flex-start; text-align: left; } }
`;

/* ─── card ────────────────────────────────────────────────────── */
const CourseCard = ({ course, index, onEnroll, onSyllabus, animDelay }) => {
  const pr = priceOf(course.label);

  return (
    <motion.div
      className="coc-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: animDelay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* image */}
      <div className="coc-card-img-wrap">
        <img src={course.image} alt={course.name} className="coc-card-img" />
        <div className="coc-card-img-overlay" />
        {/* watermark number */}
        <span className="coc-card-num">{String(index + 1).padStart(2, '0')}</span>
        {course.tag && <span className="coc-card-tag">{course.tag}</span>}
      </div>

      {/* content */}
      <div className="coc-card-body">
        <div className="coc-card-name">{course.name}</div>
        <div className="coc-card-desc">{course.desc}</div>

        <div className="coc-meta"><span>{course.duration} {course.duration === 1 ? "month" : "months"}</span><span>{course.students} students</span><span>Live classes</span></div>
        <div className="coc-skills">
          {course.skills.map(s => (
            <span key={s} className="coc-skill">{s}</span>
          ))}
        </div>
        {pr ? (
          <div className="coc-price">
            {pr.original && <s>{pkr(pr.original)}</s>}
            <b>{pkr(pr.price)}</b>
            {pr.off > 0 && <em>{pr.off}% off</em>}
          </div>
        ) : <div className="coc-price ask">Fee on WhatsApp</div>}
      </div>

      {/* footer */}
      <div className="coc-card-footer">
        <button className="coc-card-btn primary" onClick={() => onEnroll(course.label)}>
          Enroll Now <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button className="coc-card-btn" onClick={onSyllabus}>
          <FontAwesomeIcon icon={faDownload} /> Syllabus
        </button>
      </div>
    </motion.div>
  );
};

/* ─── page ────────────────────────────────────────────────────── */
function OfferedCourses() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [cat, setCat] = useState('All');
  useSeo({ title: 'Courses – Web Development, AI, Python, Cyber Security', description: 'Live online IT courses with clear fees: full stack web development, AI, data science, Python, cyber security, mobile apps and more. Free demo class.', path: '/offeredcourses' });
  const cats = ['All', ...Array.from(new Set(courses.map(c => c.cat)))];
  const shown = cat === 'All' ? courses : courses.filter(c => c.cat === cat);
  const onEnroll   = (title) => navigate('/', { state: { title } });
  const onSyllabus = () => {
    alert("Updated outlines not available. Contact us on WhatsApp. Redirecting...");
    setTimeout(() => navigate('/contactus'), 1000);
  };

  return (
    <>
      <style>{css}</style>
      <style>{cfxCss}</style>
      <div className="coc-wrap">

        {/* hero */}
        <motion.div
          className="coc-hero"
          ref={heroRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroScene hostRef={heroRef} />
          <div className="coc-hero-glow" />
          <div className="coc-badge">CodeBuild Academy</div>
          <h1 className="coc-hero-h1">
            Transform Your<em>Future.</em>
          </h1>
          <p className="coc-hero-sub">
            Industry-leading programs by working professionals. Real skills, real careers.
          </p>
          <div className="coc-stats">
            {[["1000+","Students"],["95%","Placed"],["20+","Courses"],["7+","Departments"]].map(([n, l]) => (
              <div className="coc-stat" key={l}>
                <div className="coc-stat-n"><CountUp value={n} /></div>
                <div className="coc-stat-l">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Ticker items={["HTML & CSS","JavaScript","React","Node.js","Python","Machine Learning","Generative AI","Prompt Engineering","Cyber Security","Flutter","Data Analysis","Blockchain","Robotics"]} />

        {/* grid */}
        <div className="coc-body">
          <Link to="/ai-kids-enroll" className="coc-feature">
            <div>
              <span className="coc-feature-tag">Limited-time offer · ages {KIDS_OFFER.ages[0]}–{KIDS_OFFER.ages[1]}</span>
              <h2>{KIDS_OFFER.title}</h2>
              <p>AI bots, AI storybooks, AI videos and prompt engineering in {KIDS_OFFER.days} days, with a premium certificate. 100% refundable after {KIDS_OFFER.refundAfterClasses} classes.</p>
            </div>
            <div className="coc-feature-price"><s>{pkr(KIDS_OFFER.originalPrice)}</s><b>{pkr(KIDS_OFFER.price)}</b><span>Enroll now <FontAwesomeIcon icon={faArrowRight} /></span></div>
          </Link>

          <div className="coc-section-label">
            <span className="coc-section-label-text">All Courses</span>
            <div className="coc-section-label-line" />
            <span className="coc-section-label-count">{shown.length} available</span>
          </div>
          <div className="coc-pills" role="tablist" aria-label="Course categories">
            {cats.map(c => <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}
          </div>

          <div className="coc-grid">
            {shown.map((course, i) => (
              <Tilt key={course.name}>
                <CourseCard
                  index={i}
                  course={course}
                  onEnroll={onEnroll}
                  onSyllabus={onSyllabus}
                  animDelay={Math.min(i * 0.05, 0.3)}
                />
              </Tilt>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="coc-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="coc-cta-line" />
          <h3 className="coc-cta-h">Not Sure Where to <em>Start?</em></h3>
          <p className="coc-cta-p">Free consultation — no commitment, no pressure.</p>
          <Link to="/contactus" className="coc-cta-link">
            Contact Our Advisors <FontAwesomeIcon icon={faChevronRight} />
          </Link>
        </motion.div>

      </div>
    </>
  );
}

export default OfferedCourses;