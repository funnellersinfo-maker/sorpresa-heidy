'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export default function Home() {
  const [showVideo, setShowVideo] = useState(false)
  const [heartClicked, setHeartClicked] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioStartedRef = useRef(false)

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  const startAudio = useCallback(() => {
    if (audioStartedRef.current) return
    audioStartedRef.current = true
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setAudioPlaying(true)
      }).catch(() => {
        audioStartedRef.current = false
      })
    }
  }, [])

  // Auto-play audio on first scroll
  useEffect(() => {
    const handleScroll = () => {
      startAudio()
    }

    const handleTouch = () => {
      startAudio()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchstart', handleTouch, { passive: true, once: true })
    window.addEventListener('click', handleTouch, { once: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouch)
      window.removeEventListener('click', handleTouch)
    }
  }, [startAudio])

  const handleHeartClick = () => {
    if (heartClicked) return
    // Ensure audio is playing when heart is touched
    startAudio()
    setHeartClicked(true)
    setTimeout(() => {
      setShowVideo(true)
    }, 800)
  }

  const closeVideo = () => {
    setShowVideo(false)
    setHeartClicked(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [showVideo])

  // Keep audio playing state in sync
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => setAudioPlaying(true)
    const onPause = () => setAudioPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  return (
    <div className="landing-page">
      {/* Hidden audio element - auto-plays on first scroll/touch */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/cancion.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating now-playing indicator */}
      {audioPlaying && (
        <div className="now-playing-indicator">
          <div className="np-visualizer">
            <span className="np-bar np-bar-1" />
            <span className="np-bar np-bar-2" />
            <span className="np-bar np-bar-3" />
            <span className="np-bar np-bar-4" />
          </div>
          <span className="np-text">🎵 Tejiendo un Amanecer</span>
        </div>
      )}

      {/* Floating particles background */}
      <div className="particles-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <div className="main-container">
        {/* Header / Title */}
        <div className="header-section">
          <div className="sparkle-line" />
          <h1 className="title-main">Feliz Cumpleaños</h1>
          <p className="subtitle">✦ 28 ✦</p>
          <div className="sparkle-line" />
        </div>

        {/* Letter Box */}
        <div className="letter-box">
          <div className="letter-decoration">✦ ✦ ✦</div>
          <p className="letter-greeting">Para mi niña hermosa,</p>
          <div className="letter-divider" />
          <p className="letter-text">
            Hoy cumples 28 añitos y, mirándote hoy, solo puedo sentir un orgullo inmenso por la mujer que eres y un agradecimiento infinito por tener el privilegio de caminar a tu lado.
          </p>
          <p className="letter-text">
            Sé muy bien que nuestro camino no ha sido perfecto. Sé que he cometido errores reales, que he sido desleal, descuidado y que te he fallado con actitudes que nunca mereciste. No pretendo borrar el pasado con promesas vacías, porque sé que las palabras se las lleva el viento; hoy mi único objetivo es respaldar este amor con hechos, con respeto absoluto, cuidando cada detalle y protegiendo tu paz día tras día.
          </p>
          <p className="letter-text">
            Gracias por tu resiliencia, por tu amor incondicional y por este borrón y cuenta nueva que hoy nos une más fuerte. Quiero que camines con la tranquilidad de que mi corazón te pertenece solo a ti. Contigo quiero pasar el resto de mi vida, y aunque hoy te entrego este detalle digital, prepárate... porque muy pronto llegará ese anillo y ese &quot;sí para siempre&quot; que tanto deseo darte ante el mundo.
          </p>
          <div className="letter-divider" />
          <p className="letter-signature">
            Feliz cumpleaños, mi amor.<br />
            <span className="signature-highlight">Eres mi mayor bendición.</span>
          </p>
          <div className="letter-decoration">✦ ✦ ✦</div>
        </div>

        {/* Heart Button */}
        <div className={`heart-section ${heartClicked ? 'heart-exploded' : ''}`}>
          <button
            className={`heart-btn ${heartClicked ? 'clicked' : ''}`}
            onClick={handleHeartClick}
            aria-label="Toca aquí con amor"
          >
            <svg
              className="heart-svg"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#d4af37"
                stroke="#d4af37"
                strokeWidth="0.5"
              />
            </svg>
            <span className="heart-label">Toca aquí con amor</span>
          </button>

          {/* Explosion particles on click */}
          {heartClicked && (
            <div className="explosion-container">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="explosion-particle"
                  style={{
                    '--angle': `${(360 / 20) * i}deg`,
                    '--distance': `${60 + Math.random() * 80}px`,
                    animationDelay: `${Math.random() * 0.2}s`,
                    backgroundColor: i % 2 === 0 ? '#d4af37' : '#ff6b8a',
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="video-overlay" onClick={closeVideo}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="video-close-btn" onClick={closeVideo} aria-label="Cerrar video">
              ✕
            </button>
            <div className="video-wrapper">
              <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                className="video-player"
              >
                <source src="/collage.mp4" type="video/mp4" />
                Tu navegador no soporta video.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>Hecho con todo el amor del mundo 💛</p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          overflow-x: hidden;
        }

        .landing-page {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(
            170deg,
            #0a0a0f 0%,
            #0d0b1a 20%,
            #150f2e 40%,
            #1a1145 60%,
            #120d30 80%,
            #0a0a0f 100%
          );
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #f0e6d3;
          padding: 2rem 1rem;
        }

        /* Now Playing floating indicator */
        .now-playing-indicator {
          position: fixed;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(10, 10, 15, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 50px;
          padding: 6px 16px;
          z-index: 100;
          animation: fadeDown 0.6s ease;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .np-visualizer {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 14px;
        }

        .np-bar {
          width: 2px;
          background: #d4af37;
          border-radius: 1px;
          animation: npVis 0.7s ease-in-out infinite alternate;
        }

        .np-bar-1 { height: 4px; animation-delay: 0s; }
        .np-bar-2 { height: 8px; animation-delay: 0.12s; }
        .np-bar-3 { height: 12px; animation-delay: 0.24s; }
        .np-bar-4 { height: 6px; animation-delay: 0.36s; }

        @keyframes npVis {
          0% { height: 3px; }
          100% { height: 14px; }
        }

        .np-text {
          font-size: 0.7rem;
          color: rgba(212, 175, 55, 0.8);
          white-space: nowrap;
          font-weight: 300;
        }

        /* Floating particles */
        .particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.6), rgba(212, 175, 55, 0));
          animation: floatParticle 8s ease-in-out infinite;
        }

        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(15px);
            opacity: 0.8;
          }
        }

        /* Main container */
        .main-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 450px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          flex: 1;
        }

        /* Header */
        .header-section {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding-top: 1rem;
        }

        .sparkle-line {
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
        }

        .title-main {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #d4af37, #f5e6a3, #d4af37);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
          letter-spacing: 0.04em;
          line-height: 1.2;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 200% center; }
        }

        .subtitle {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem;
          color: #d4af37;
          letter-spacing: 0.5em;
          font-weight: 400;
        }

        /* Letter Box */
        .letter-box {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 20px;
          padding: 2rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .letter-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
        }

        .letter-decoration {
          text-align: center;
          color: #d4af37;
          letter-spacing: 1em;
          font-size: 0.7rem;
          opacity: 0.6;
          margin: 0.5rem 0;
        }

        .letter-greeting {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #d4af37;
          text-align: center;
          margin-bottom: 0.25rem;
        }

        .letter-divider {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
          margin: 1rem auto;
        }

        .letter-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: rgba(240, 230, 211, 0.9);
          margin-bottom: 1rem;
          text-align: justify;
          font-weight: 300;
        }

        .letter-signature {
          text-align: center;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.1rem;
          line-height: 1.8;
          color: rgba(240, 230, 211, 0.95);
        }

        .signature-highlight {
          color: #d4af37;
          font-weight: 600;
          font-size: 1.15rem;
        }

        /* Heart Section */
        .heart-section {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 0;
          transition: all 0.5s ease;
        }

        .heart-section.heart-exploded {
          transform: scale(0.8);
          opacity: 0;
          pointer-events: none;
        }

        .heart-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease;
          animation: heartbeat 1.5s ease-in-out infinite;
          -webkit-tap-highlight-color: transparent;
        }

        .heart-btn:hover {
          transform: scale(1.08);
        }

        .heart-btn:active {
          transform: scale(0.95);
        }

        .heart-btn.clicked {
          animation: heartExplode 0.8s ease-out forwards;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.12); }
          30% { transform: scale(1); }
          45% { transform: scale(1.08); }
          60% { transform: scale(1); }
        }

        @keyframes heartExplode {
          0% { transform: scale(1); }
          30% { transform: scale(1.4); }
          100% { transform: scale(0); opacity: 0; }
        }

        .heart-svg {
          width: 80px;
          height: 80px;
          filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.4)) drop-shadow(0 0 40px rgba(212, 175, 55, 0.2));
        }

        .heart-label {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1rem;
          color: #d4af37;
          letter-spacing: 0.05em;
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }

        /* Explosion particles */
        .explosion-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .explosion-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: explodeParticle 1s ease-out forwards;
          transform: translate(-50%, -50%);
        }

        @keyframes explodeParticle {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(-1 * var(--distance)));
            opacity: 0;
          }
        }

        /* Video Modal */
        .video-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.92);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .video-modal {
          position: relative;
          width: 100%;
          max-width: 420px;
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .video-close-btn {
          position: absolute;
          top: -40px;
          right: 0;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .video-close-btn:hover {
          background: rgba(212, 175, 55, 0.3);
        }

        .video-wrapper {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 0 60px rgba(212, 175, 55, 0.15);
        }

        .video-player {
          width: 100%;
          max-height: 85vh;
          display: block;
          border-radius: 16px;
        }

        /* Footer */
        .footer {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 2rem 1rem 1rem;
          margin-top: auto;
          width: 100%;
          max-width: 450px;
        }

        .footer p {
          font-size: 0.8rem;
          color: rgba(212, 175, 55, 0.4);
          font-weight: 300;
          letter-spacing: 0.03em;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0f;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 4px;
        }

        /* Selection */
        ::selection {
          background: rgba(212, 175, 55, 0.3);
          color: #f0e6d3;
        }
      `}</style>
    </div>
  )
}
