import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* ─── course data ─────────────────────────────────────────────── */
const courses = [
  { group: "🌐  Web Development",    icon: "🌐", options: [
      { label: "Full Stack Web Development",                  tag: "Popular" },
      { label: "Frontend Web Dev with React",                 tag: "" },
    ]
  },
  { group: "🤖  AI & Data Science",  icon: "🤖", options: [
      { label: "Full Stack Web Dev with Artificial Intelligence", tag: "Hot" },
      { label: "Machine Learning from Scratch",               tag: "" },
      { label: "Data Analysis with Python",                   tag: "" },
      { label: "AI Prompt Engineering",                      tag: "New" },
      { label: "AI for kids",                     tag: "" },
      { label: "AI for Business",                     tag: "" },
      { label: "Robotics & Automation",                     tag: "" },
      
    ]
  },
  { group: "⛓️  Emerging Tech",       icon: "⛓️", options: [
      { label: "Blockchain Development",                      tag: "New" },
      { label: "Robotics & Automation",                       tag: "" },
      { label: "Internet of Things (IoT)",                    tag: "New" }
    ]
  },
  { group: "📱  Mobile & Security",   icon: "📱", options: [
      { label: "Android App Development",                     tag: "" },
      { label: "Ethical Hacking & Cyber Security",            tag: "" },
      { label: "iOS App Development",                         tag: "" }
    ]
  },
  { group: "🐍  Programming",         icon: "🐍", options: [
      { label: "Python Programming from Zero to Hero",        tag: "" },
      { label: "JavaScript Programming from Zero to Hero",    tag: "" },
      { label: "C++ Programming from Zero to Hero",        tag: "" },
      { label: "Data Structures & Algorithms",                tag: "" }

    ]
  },
  { group: "💼  Business & Office",   icon: "💼", options: [
      { label: "Business Development",                        tag: "" },
      { label: "MS Office",                                   tag: "" },
      { label: "Digital Marketing",                             tag: "" },
      { label: "Graphic Design with Adobe",                      tag: "" }
    ]
  },
];

const allOptions = courses.flatMap(c => c.options.map(o => o.label));

/* ─── custom dropdown ─────────────────────────────────────────── */
const CourseDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (label) => { onChange(label); setOpen(false); };

  // find tag for current value
  const currentTag = courses.flatMap(c => c.options).find(o => o.label === value)?.tag || "";

  return (
    <div className="cbf-dropdown" ref={ref}>
      <button type="button" className={`cbf-dropdown-trigger${open ? ' cbf-open' : ''}`} onClick={() => setOpen(o => !o)}>
        <span className="cbf-dropdown-val">
          {value}
          {currentTag && <span className="cbf-tag cbf-tag--trigger">{currentTag}</span>}
        </span>
        <span className={`cbf-chevron${open ? ' cbf-chevron--up' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="cbf-dropdown-menu">
          {courses.map(({ group, options }) => (
            <div key={group} className="cbf-optgroup">
              <div className="cbf-optgroup-label">{group}</div>
              {options.map(({ label, tag }) => (
                <div
                  key={label}
                  className={`cbf-option${value === label ? ' cbf-option--active' : ''}`}
                  onClick={() => select(label)}
                >
                  <span className="cbf-option-label">{label}</span>
                  <span className="cbf-option-right">
                    {tag && <span className="cbf-tag">{tag}</span>}
                    {value === label && <span className="cbf-checkmark">✓</span>}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── styles ──────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@400;600;700;800&family=Bebas+Neue&display=swap');

  /* ---------- section ---------- */
  .cbf-section {
    padding: 40px 20px;
    background: transparent;
    font-family: "Dosis", sans-serif;
  }

  /* ---------- card ---------- */
  .cbf-card {
    background: #111116;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 4px;
    position: relative;
    overflow: visible;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6);
  }

  /* left orange bar */
  .cbf-card::before {
    content: "";
    position: absolute;
    left: -1px; top: 0; bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #ffa500 0%, #ff6a00 100%);
    border-radius: 4px 0 0 4px;
  }

  .cbf-card-inner {
    padding: 36px 32px 32px;
  }

  /* ---------- header ---------- */
  .cbf-header {
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cbf-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #ffa500;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .cbf-eyebrow::before {
    content: "";
    display: inline-block;
    width: 20px;
    height: 2px;
    background: #ffa500;
    border-radius: 1px;
  }
  .cbf-title {
    font-family: "Bebas Neue", sans-serif;
    font-size: 42px;
    color: #ffffff;
    letter-spacing: 2px;
    line-height: 1;
    margin: 0;
  }
  .cbf-title span {
    color: #ffa500;
    -webkit-text-stroke: 0px;
  }
  .cbf-subtitle {
    margin-top: 6px;
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.3px;
  }

  /* ---------- form fields ---------- */
  .cbf-field {
    margin-bottom: 20px;
  }
  .cbf-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin-bottom: 8px;
  }
  .cbf-input {
    width: 100%;
    background: #0d0d12 !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 4px !important;
    color: #fff !important;
    font-family: "Dosis", sans-serif !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    padding: 12px 16px !important;
    transition: border-color 0.25s, box-shadow 0.25s !important;
    outline: none !important;
    box-shadow: none !important;
    box-sizing: border-box;
  }
  .cbf-input:focus {
    border-color: #ffa500 !important;
    box-shadow: 0 0 0 3px rgba(255,165,0,0.12) !important;
    background: #0f0f14 !important;
  }
  .cbf-input::placeholder {
    color: rgba(255,255,255,0.2) !important;
    font-weight: 400 !important;
  }

  /* ---------- custom dropdown ---------- */
  .cbf-dropdown {
    position: relative;
    width: 100%;
  }
  .cbf-dropdown-trigger {
    width: 100%;
    background: #0d0d12;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    color: #fff;
    font-family: "Dosis", sans-serif;
    font-size: 15px;
    font-weight: 600;
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    transition: border-color 0.25s, box-shadow 0.25s;
    text-align: left;
  }
  .cbf-dropdown-trigger:hover,
  .cbf-dropdown-trigger.cbf-open {
    border-color: #ffa500;
    box-shadow: 0 0 0 3px rgba(255,165,0,0.12);
  }
  .cbf-dropdown-val {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .cbf-chevron {
    font-size: 16px;
    color: rgba(255,255,255,0.4);
    transition: transform 0.25s;
    flex-shrink: 0;
  }
  .cbf-chevron--up {
    transform: rotate(180deg);
    color: #ffa500;
  }

  /* dropdown menu */
  .cbf-dropdown-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0; right: 0;
    background: #14141a;
    border: 1px solid rgba(255,165,0,0.25);
    border-radius: 6px;
    z-index: 999;
    max-height: 340px;
    overflow-y: auto;
    box-shadow: 0 16px 48px rgba(0,0,0,0.7);
    scrollbar-width: thin;
    scrollbar-color: rgba(255,165,0,0.3) transparent;
  }
  .cbf-dropdown-menu::-webkit-scrollbar { width: 4px; }
  .cbf-dropdown-menu::-webkit-scrollbar-thumb { background: rgba(255,165,0,0.3); border-radius: 2px; }

  .cbf-optgroup {
    padding: 8px 0 4px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .cbf-optgroup:last-child { border-bottom: none; }
  .cbf-optgroup-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #ffa500;
    padding: 4px 16px 8px;
    display: block;
    opacity: 0.75;
  }
  .cbf-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    cursor: pointer;
    transition: background 0.15s;
    gap: 8px;
  }
  .cbf-option:hover {
    background: rgba(255,165,0,0.07);
  }
  .cbf-option--active {
    background: rgba(255,165,0,0.1);
  }
  .cbf-option-label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    font-family: "Dosis", sans-serif;
    letter-spacing: 0.2px;
    line-height: 1.3;
  }
  .cbf-option--active .cbf-option-label {
    color: #fff;
  }
  .cbf-option-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  /* tags */
  .cbf-tag {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: 2px;
    background: rgba(255,165,0,0.15);
    color: #ffa500;
    border: 1px solid rgba(255,165,0,0.3);
    white-space: nowrap;
  }
  .cbf-tag--trigger { font-size: 9px; }

  .cbf-checkmark {
    color: #ffa500;
    font-size: 13px;
    font-weight: 800;
  }

  /* ---------- submit button ---------- */
  .cbf-btn {
    width: 100%;
    padding: 14px 24px;
    background: #ffa500;
    color: #0a0a0f;
    border: 2px solid #ffa500;
    border-radius: 4px;
    font-family: "Bebas Neue", sans-serif;
    font-size: 20px;
    letter-spacing: 3px;
    cursor: pointer;
    margin-top: 4px;
    transition: background 0.25s, color 0.25s, transform 0.2s, box-shadow 0.25s;
    box-shadow: 0 4px 24px rgba(255,165,0,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .cbf-btn:hover {
    background: transparent;
    color: #ffa500;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(255,165,0,0.2);
  }
  .cbf-btn:active { transform: translateY(0); }

  /* ---------- result ---------- */
  .cbf-result {
    margin-top: 16px;
    font-size: 13px;
    font-weight: 700;
    color: #ffa500;
    text-align: center;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 10px;
    border: 1px solid rgba(255,165,0,0.2);
    border-radius: 4px;
    background: rgba(255,165,0,0.05);
    animation: cbf-pop 0.3s ease;
  }
  @keyframes cbf-pop {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ---------- footer note ---------- */
  .cbf-footnote {
    margin-top: 18px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: rgba(255,255,255,0.22);
    justify-content: center;
    letter-spacing: 0.3px;
  }
  .cbf-footnote-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: rgba(255,165,0,0.4);
    display: inline-block;
  }

  /* ---------- responsive ---------- */
  @media (max-width: 576px) {
    .cbf-section { padding: 20px 12px; }
    .cbf-card-inner { padding: 28px 20px 24px; }
    .cbf-title { font-size: 34px; }
  }
`;

/* ─── component ───────────────────────────────────────────────── */
const Forms = () => {
  const location = useLocation();
  const title = location.state?.title;
  const [selectedOption, setSelectedOption] = useState(title || "Full Stack Web Development");
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");

    const formData = new FormData(event.target);
    formData.append("access_key", "bee286f3-0072-4c0e-ba9b-bf28ff0728e7");
    formData.append("course", selectedOption);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.success) {
      setResult("✓  Application Received!");
      event.target.reset();
      setSelectedOption("Full Stack Web Development");
      setTimeout(() => setResult(""), 3000);
    } else {
      setResult(data.message);
    }
  };

  return (
    <>
      <style>{css}</style>

      <div className="cbf-section">
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="cbf-card">
            <div className="cbf-card-inner">

              {/* header */}
              <div className="cbf-header">
                <div className="cbf-eyebrow">CodeBuild Academy</div>
                <h2 className="cbf-title">Enroll <span>Now</span></h2>
                <p className="cbf-subtitle">Start your IT career — fill in your details below.</p>
              </div>

              <form onSubmit={onSubmit}>
                {/* Name */}
                <div className="cbf-field">
                  <label className="cbf-label" htmlFor="cbf-name">Full Name</label>
                  <input
                    id="cbf-name"
                    className="cbf-input"
                    type="text"
                    name="name"
                    placeholder="e.g. Ali Hassan"
                    required
                  />
                </div>

                {/* Email */}
                <div className="cbf-field">
                  <label className="cbf-label" htmlFor="cbf-email">Email Address</label>
                  <input
                    id="cbf-email"
                    className="cbf-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="cbf-field">
                  <label className="cbf-label" htmlFor="cbf-phone">Phone Number</label>
                  <input
                    id="cbf-phone"
                    className="cbf-input"
                    type="tel"
                    name="phone"
                    placeholder="+92 300 0000000"
                    required
                  />
                </div>

                {/* Course */}
                <div className="cbf-field">
                  <label className="cbf-label">Preferred Course</label>
                  <CourseDropdown value={selectedOption} onChange={setSelectedOption} />
                </div>

                <button className="cbf-btn" type="submit">
                  <span>Submit Application</span>
                  <span>→</span>
                </button>
              </form>

              {result && <div className="cbf-result">{result}</div>}

              <div className="cbf-footnote">
                <span className="cbf-footnote-dot" />
                Free consultation call after enrollment
                <span className="cbf-footnote-dot" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forms;