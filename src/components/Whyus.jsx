import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const whyUsData = [
  {
    icon: "🌐",
    title: "International Recognition",
    desc: "CodeBuild Academy is globally recognized, with alumni working at leading tech firms across 20+ countries.",
  },
  {
    icon: "👨‍💻",
    title: "Industry Expert Trainers",
    desc: "Learn from working professionals with 10+ years of real-world experience — not just academics.",
  },
  {
    icon: "🛠️",
    title: "Hands-On Project Learning",
    desc: "Every course is built around live projects, giving you a portfolio that speaks louder than a certificate.",
  },
  {
    icon: "📜",
    title: "Globally Accredited Certificates",
    desc: "Our certificates are recognized by employers worldwide, adding real weight to your resume.",
  },
  {
    icon: "🕐",
    title: "Flexible Schedules",
    desc: "Morning, evening, or weekend batches — we fit around your life, not the other way around.",
  },
  {
    icon: "🚀",
    title: "Career Placement Support",
    desc: "From resume reviews to mock interviews and job referrals, we stand by you until you land the job.",
  },
];

const stats = [
  { value: "1200+", label: "Students Trained" },
  { value: "95%",  label: "Placement Rate" },
  { value: "3",  label: "Countries Reached" },
  { value: "20+",  label: "Courses Offered" },
];

const WhyUs = () => {
  const [visible, setVisible] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting)
            setVisible((prev) => [...new Set([...prev, i])]);
        },
        { threshold: 0.15 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  return (
    <>
      <style>{`
        /* =====================================================
           WHY US — CodeBuild Academy
           All selectors scoped under .cb-whyus
        ===================================================== */
        @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@400;600;700;800&family=Syne:wght@400;700;800&display=swap');

        /* ---------- section wrapper ---------- */
        .cb-whyus {
          position: relative;
          padding: 90px 20px 80px;
          overflow: hidden;
          font-family: "Dosis", sans-serif;
          background: #0a0a0f;
        }

        /* grain overlay */
        .cb-whyus::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.3;
          pointer-events: none;
          z-index: 0;
        }

        /* ---------- ambient orbs ---------- */
        .cb-whyus__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          pointer-events: none;
          z-index: 0;
        }
        .cb-whyus__orb--1 {
          width: 500px; height: 500px;
          background: rgba(255, 165, 0, 0.11);
          top: -140px; left: -130px;
        }
        .cb-whyus__orb--2 {
          width: 380px; height: 380px;
          background: rgba(255, 165, 0, 0.07);
          bottom: 30px; right: -110px;
        }
        .cb-whyus__orb--3 {
          width: 240px; height: 240px;
          background: rgba(255, 200, 80, 0.05);
          top: 48%; left: 48%;
          transform: translate(-50%, -50%);
        }

        /* ---------- header ---------- */
        .cb-whyus__header {
          position: relative;
          z-index: 1;
          text-align: center;
          margin-bottom: 64px;
        }
        .cb-whyus__eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: #ffa500;
          border: 1px solid rgba(255, 165, 0, 0.28);
          padding: 5px 18px;
          border-radius: 20px;
          margin-bottom: 20px;
          background: rgba(255, 165, 0, 0.06);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .cb-whyus__title {
          font-family: "Syne", sans-serif;
          font-size: clamp(28px, 5vw, 50px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          margin: 0 0 16px;
        }
        .cb-whyus__title span {
          color: #ffa500;
        }
        .cb-whyus__subtitle {
          color: rgba(255, 255, 255, 0.42);
          font-size: 16px;
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.78;
        }
        .cb-whyus__divider {
          width: 56px;
          height: 3px;
          background: linear-gradient(90deg, #ffa500, transparent);
          border-radius: 2px;
          margin: 22px auto 0;
        }

        /* ---------- stats row ---------- */
        .cb-whyus__stats {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
          margin-bottom: 68px;
        }
        .cb-whyus__stat {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 165, 0, 0.16);
          border-radius: 14px;
          padding: 20px 32px;
          text-align: center;
          min-width: 138px;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow:
            0 4px 24px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        .cb-whyus__stat:hover {
          border-color: rgba(255, 165, 0, 0.5);
          transform: translateY(-5px);
          box-shadow:
            0 14px 36px rgba(0, 0, 0, 0.4),
            0 0 24px rgba(255, 165, 0, 0.09),
            inset 0 1px 0 rgba(255, 255, 255, 0.07);
        }
        .cb-whyus__stat-value {
          font-family: "Syne", sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #ffa500;
          line-height: 1;
        }
        .cb-whyus__stat-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.42);
          margin-top: 6px;
          letter-spacing: 0.9px;
          text-transform: uppercase;
        }

        /* ---------- cards grid ---------- */
        .cb-whyus__grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 22px;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* glass card */
        .cb-whyus__card {
          position: relative;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          padding: 32px 28px;
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            inset 0 -1px 0 rgba(0, 0, 0, 0.15);
          transition: border-color 0.35s, transform 0.35s, box-shadow 0.35s;
          cursor: default;
          opacity: 0;
          transform: translateY(32px);
          overflow: hidden;
        }

        /* glass inner highlight */
        .cb-whyus__card::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }

        /* orange top-bar on hover */
        .cb-whyus__card::before {
          content: "";
          position: absolute;
          top: -1px; left: 0;
          height: 2px;
          width: 0;
          background: linear-gradient(90deg, #ffa500, rgba(255,165,0,0.15));
          border-radius: 18px 18px 0 0;
          transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 2;
        }
        .cb-whyus__card:hover::before { width: 100%; }

        .cb-whyus__card.cb-visible {
          animation: cb-fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .cb-whyus__card:hover {
          border-color: rgba(255, 165, 0, 0.3);
          transform: translateY(-8px);
          box-shadow:
            0 24px 56px rgba(0, 0, 0, 0.55),
            0 0 32px rgba(255, 165, 0, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.07);
        }

        .cb-whyus__card-icon {
          font-size: 38px;
          margin-bottom: 16px;
          display: inline-block;
          line-height: 1;
          filter: drop-shadow(0 0 10px rgba(255, 165, 0, 0.25));
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cb-whyus__card:hover .cb-whyus__card-icon {
          transform: scale(1.18) rotate(-6deg);
        }
        .cb-whyus__card-title {
          font-family: "Syne", sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 10px;
        }
        .cb-whyus__card-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.82;
          margin: 0;
        }

        /* ---------- CTA ---------- */
        .cb-whyus__cta {
          position: relative;
          z-index: 1;
          text-align: center;
          margin-top: 62px;
        }
        .cb-whyus__cta-text {
          color: rgba(255, 255, 255, 0.38);
          font-size: 14px;
          margin-bottom: 18px;
          letter-spacing: 0.5px;
        }
        .cb-whyus__cta-btn {
          display: inline-block;
          padding: 13px 42px;
          background: linear-gradient(135deg, #ffa500, #e08900);
          color: #0a0a0f;
          font-family: "Dosis", sans-serif;
          font-weight: 800;
          font-size: 15px;
          border: 1px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          letter-spacing: 0.8px;
          text-decoration: none;
          box-shadow: 0 4px 22px rgba(255, 165, 0, 0.22);
          transition: background 0.3s, color 0.3s, border-color 0.3s, transform 0.2s, box-shadow 0.3s;
        }
        .cb-whyus__cta-btn:hover {
          background: transparent;
          color: #fff;
          border-color: rgba(255, 255, 255, 0.45);
          box-shadow: none;
          transform: translateY(-2px);
        }

        /* ---------- keyframe ---------- */
        @keyframes cb-fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ---------- responsive ---------- */
        @media (max-width: 576px) {
          .cb-whyus { padding: 60px 14px 60px; }
          .cb-whyus__grid { grid-template-columns: 1fr; }
          .cb-whyus__stat { min-width: 110px; padding: 14px 20px; }
          .cb-whyus__stat-value { font-size: 24px; }
        }
      `}</style>

      <section className="cb-whyus">
        <div className="cb-whyus__orb cb-whyus__orb--1" />
        <div className="cb-whyus__orb cb-whyus__orb--2" />
        <div className="cb-whyus__orb cb-whyus__orb--3" />

        {/* header */}
        <div className="cb-whyus__header">
          <span className="cb-whyus__eyebrow">Why CodeBuild Academy</span>
          <h2 className="cb-whyus__title">
            We Don't Just Train.<br />
            We <span>Build Careers.</span>
          </h2>
          <p className="cb-whyus__subtitle">
            Join thousands of students who chose CodeBuild Academy to launch
            their international IT career — with real skills, real projects, and
            real results.
          </p>
          <div className="cb-whyus__divider" />
        </div>

        {/* stats */}
        <div className="cb-whyus__stats">
          {stats.map((s) => (
            <div className="cb-whyus__stat" key={s.label}>
              <div className="cb-whyus__stat-value">{s.value}</div>
              <div className="cb-whyus__stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* cards */}
        <div className="cb-whyus__grid">
          {whyUsData.map((item, i) => (
            <div
              key={i}
              className={`cb-whyus__card${visible.includes(i) ? " cb-visible" : ""}`}
              ref={(el) => (cardRefs.current[i] = el)}
              style={{ animationDelay: `${i * 0.09}s` }}
            >
              <div className="cb-whyus__card-icon">{item.icon}</div>
              <h3 className="cb-whyus__card-title">{item.title}</h3>
              <p className="cb-whyus__card-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cb-whyus__cta">
          <p className="cb-whyus__cta-text">Ready to start your IT journey?</p>
          <Link to="/offeredcourses" className="cb-whyus__cta-btn">
            Enroll Now →
          </Link>
        </div>
      </section>
    </>
  );
};

export default WhyUs;