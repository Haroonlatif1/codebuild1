import React, { useEffect, useState } from 'react'
import Form from "./Forms"
import Reviews from "./Reviews"
import WhyUs from './Whyus'
import ClassInsights from './Classinsights'
import VideoReviews from './VideoReviews'
import Blog from './Blog'
import Competition from './Competition'

const Home = () => {
  const [showModal, setShowModal] = useState(true)

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
      <Competition />
      <Form />
      <WhyUs />
      <Blog />
      <VideoReviews />
      <ClassInsights />
      <div className='h-50'><Reviews /></div>

      {/* ElevenLabs Widget */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
      }}>
        <elevenlabs-convai agent-id="agent_0801kxc439vtemhttjkseenq3wdq"></elevenlabs-convai>
      </div>
    </div>
  )
}

export default Home