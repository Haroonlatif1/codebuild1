import React, { useEffect } from 'react'
import Form from "./Forms"
import Reviews from "./Reviews"
import WhyUs from './Whyus'
import ClassInsights from './Classinsights'
import VideoReviews from './VideoReviews'
import Blog from './Blog'

const Home = () => {
  useEffect(() => {
    // Don't load if script OR custom element already registered
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
    <div style={{ backgroundColor: "black" }}>
      <Form />

      <div><WhyUs /></div>
      <div><Blog/></div>
      <div><VideoReviews /></div>
      <div><ClassInsights /></div>
      <div className='h-50'><Reviews /></div>

      {/* ElevenLabs Wizard Widget - Fixed Bottom Right */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
      }}>
        <elevenlabs-convai agent-id="agent_1601kka7765vebp812fahehny4q8"></elevenlabs-convai>
      </div>
    </div>
  )
}

export default Home