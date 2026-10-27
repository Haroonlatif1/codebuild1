import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Enrollment from "./v2/Enrollment"
import DemoSession from "./v2/DemoSession"
import Assessment from "./v2/Assessment"
import { HowItWorks, Faq } from "./v2/HomeExtras"
import { KidsOffer, KidsDemo, StickyEnroll } from "./v2/KidsOffer"
import { DEFAULT_COURSE } from "./v2/courses"
import { useSeo } from "./v2/seo"
import Reviews from "./Reviews"
import WhyUs from './Whyus'
import ClassInsights from './Classinsights'
import VideoReviews from './VideoReviews'
import Blog from './Blog'
import Competition from './Competition'

const Home = () => {
  const [showModal, setShowModal] = useState(true)
  const [aiOpen, setAiOpen] = useState(false)
  const location = useLocation()
  const [course, setCourse] = useState(location.state?.title || DEFAULT_COURSE)
  useSeo({
    title: "IT Courses in Pakistan – Web Development, AI & Programming",
    description: "CodeBuild Academy offers live online IT courses in web development, AI, Python, cyber security and more for kids and adults. Free demo class, skill check and easy enrollment.",
    path: "/",
    jsonLd: { "@context": "https://schema.org", "@type": "EducationalOrganization", name: "CodeBuild Academy", url: "https://codebuild.pk", logo: "https://codebuild.pk/ll.png", telephone: "+92 328 4452954", sameAs: [] },
  })
  const enrollIn = (c) => { setCourse(c); document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' }) }

  useEffect(() => {
    // ElevenLabs Script Load
    if (
      document.querySelector('script[src*="elevenlabs"]') ||
      customElements.get('elevenlabs-convai')
    ) return

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
    script.async = true
    script.type = 'text/javascript'
    script.crossOrigin = 'anonymous'
    document.body.appendChild(script)

  }, [])

  return (
    <div style={{ backgroundColor: "black", position: "relative" }}>

      {/* Welcome Modal
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: "#000",
            border: "2px solid gold",
            borderRadius: "15px",
            padding: "30px",
            width: "90%",
            maxWidth: "600px",
            color: "gold",
            textAlign: "center",
            boxShadow: "0 0 20px gold"
          }}>
            <h2 style={{ marginBottom: "15px" }}>
              Welcome to CodeBuild 🚀
            </h2>

            <p style={{ lineHeight: "1.8" }}>
              Explore our courses! <br /><br />
              <strong>Version 3.0</strong> (Pakistan's most advanced educational website)
              will be live in <strong>July 2026</strong>.<br /><br />
              Some sections are under development, but you can still:
              <br />✅ Explore courses
              <br />✅ Verify certificates
              <br />✅ Apply using the application form
              <br /><br />
              Happy Coding 💻
            </p>

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "20px",
                backgroundColor: "gold",
                color: "black",
                border: "none",
                padding: "10px 25px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )} */}
      {/* <Competition /> */}
      <Enrollment course={course} onCourseChange={setCourse} />
      <KidsOffer />
      <KidsDemo />
      <VideoReviews />
      {/* <DemoSession /> */}
      <Assessment course={course} onEnroll={enrollIn} />
      <HowItWorks />
      <WhyUs />
      <Blog />
      <ClassInsights />
      <div className='h-50'><Reviews /></div>
      <Faq />

      <StickyEnroll />

      {/* Small AI icon – opens the ElevenLabs assistant only when clicked */}
      {aiOpen && (
        <div className="ai-panel">
          <elevenlabs-convai agent-id="agent_0801kxc439vtemhttjkseenq3wdq" variant="full" default-expanded="true"></elevenlabs-convai>
        </div>
      )}
      <button className="ai-fab" onClick={() => setAiOpen(o => !o)} aria-label={aiOpen ? "Hide AI assistant" : "Chat with our AI assistant"} aria-expanded={aiOpen} title="Ask our AI assistant">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9z" /><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" /></svg>
      </button>
    </div>
  )
}

export default Home