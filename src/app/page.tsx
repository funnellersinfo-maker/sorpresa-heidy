'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export default function Home() {
  const [entered, setEntered] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [heartClicked, setHeartClicked] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [flashActive, setFlashActive] = useState(false)
  const [revealedSections, setRevealedSections] = useState<Set<number>>(new Set())
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Generate particles once
  useEffect(() => {
    setParticles(Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    })))
  }, [])

  // Intersection Observer for scroll-triggered reveals
  useEffect(() => {
    if (!entered) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-section'))
            if (!isNaN(index) && !revealedSections.has(index)) {
              // Add staggered delay based on section index for more magical effect
              const delay = index === 0 ? 200 : 600
              setTimeout(() => {
                setRevealedSections(prev => {
                  const next = new Set(prev)
                  next.add(index)
                  return next
                })
              }, delay)
            }
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -80px 0px',
      }
    )

    // Delay to allow DOM to settle after splash transition
    const timer = setTimeout(() => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref)
      })
    }, 500)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [entered, revealedSections])

  // Audio events sync
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

  // Handle splash enter
  const handleEnter = useCallback(() => {
    if (entered) return
    setEntered(true)
    document.body.style.overflow = ''

    if (audioRef.current) {
      audioRef.current.load()
      const playPromise = audioRef.current.play()
      if (playPromise) {
        playPromise.catch(() => {
          if (audioRef.current) {
            audioRef.current.volume = 0.01
            audioRef.current.play().then(() => {
              if (audioRef.current) audioRef.current.volume = 1
            }).catch(() => {})
          }
        })
      }
    }
  }, [entered])

  const handleHeartClick = () => {
    if (heartClicked) return
    setHeartClicked(true)
    setTimeout(() => setFlashActive(true), 400)
    setTimeout(() => {
      setShowVideo(true)
      setFlashActive(false)
    }, 700)
  }

  const closeVideo = () => {
    setShowVideo(false)
    setHeartClicked(false)
    if (videoRef.current) videoRef.current.pause()
  }

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [showVideo])

  const setSectionRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el
  }, [])

  const isRevealed = (index: number) => revealedSections.has(index)

  return (
    <>
      <audio ref={audioRef} loop preload="auto" playsInline>
        <source src="/cancion.mp3" type="audio/mpeg" />
      </audio>

      {/* ===== SCREEN 1: Toca para abrir ===== */}
      {!entered && (
        <div
          className="splash-screen"
          onClick={handleEnter}
          onTouchEnd={(e) => { e.preventDefault(); handleEnter() }}
        >
          <div className="splash-bg-particles">
            {particles.slice(0, 15).map((p) => (
              <div
                key={p.id}
                className="splash-particle"
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
          <div className="splash-content">
            <div className="splash-heart-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#d4af37"
                  stroke="#d4af37"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <p className="splash-tap-text">Toca para abrir</p>
          </div>
        </div>
      )}

      {/* ===== SCREEN 2: Landing with scroll reveals ===== */}
      <div className={`landing-page ${entered ? 'visible' : 'hidden-page'}`}>
        {flashActive && <div className="flash-overlay" />}

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

        <div className="particles-container">
          {particles.map((p) => (
            <div key={p.id} className="particle" style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, animationDelay: `${p.delay}s` }} />
          ))}
        </div>

        <div className="main-container">
          {/* Section 0: Date - takes first viewport */}
          <div
            ref={setSectionRef(0)}
            data-section="0"
            className={`date-section scroll-reveal ${isRevealed(0) ? 'revealed' : ''}`}
          >
            <div className="date-glow" />
            <div className="date-inner">
              <span className="date-digit" style={{ animationDelay: '0.1s' }}>1</span>
              <span className="date-digit" style={{ animationDelay: '0.2s' }}>3</span>
              <span className="date-sep">/</span>
              <span className="date-digit" style={{ animationDelay: '0.3s' }}>0</span>
              <span className="date-digit" style={{ animationDelay: '0.4s' }}>6</span>
              <span className="date-sep">/</span>
              <span className="date-digit" style={{ animationDelay: '0.5s' }}>2</span>
              <span className="date-digit" style={{ animationDelay: '0.6s' }}>6</span>
            </div>
            <div className="date-sparkles">
              <span className="date-sparkle" style={{ animationDelay: '0s' }}>✦</span>
              <span className="date-sparkle" style={{ animationDelay: '0.5s' }}>✦</span>
              <span className="date-sparkle" style={{ animationDelay: '1s' }}>✦</span>
            </div>
          </div>

          {/* Section 1: Title */}
          <div
            ref={setSectionRef(1)}
            data-section="1"
            className={`header-section scroll-reveal ${isRevealed(1) ? 'revealed' : ''}`}
          >
            <div className="sparkle-line" />
            <h1 className="title-main">Feliz Cumpleaños</h1>
            <p className="subtitle">✦ 28 ✦</p>
            <div className="sparkle-line" />
          </div>

          {/* Section 2: Letter greeting + decoration */}
          <div
            ref={setSectionRef(2)}
            data-section="2"
            className="letter-box"
          >
            <div className={`letter-decoration scroll-reveal-inner ${isRevealed(2) ? 'revealed' : ''}`}>✦ ✦ ✦</div>
            <p className={`letter-greeting scroll-reveal-inner ${isRevealed(2) ? 'revealed' : ''}`}>Para mi niña hermosa,</p>
            <div className={`letter-divider scroll-reveal-inner ${isRevealed(2) ? 'revealed' : ''}`} />

            {/* Section 3: Paragraph 1 */}
            <div
              ref={setSectionRef(3)}
              data-section="3"
              className={`letter-text scroll-reveal-inner ${isRevealed(3) ? 'revealed' : ''}`}
            >
              Hoy cumples 28 añitos y, mirándote hoy, solo puedo sentir un orgullo inmenso por la mujer que eres y un agradecimiento infinito por tener el privilegio de caminar a tu lado.
            </div>

            {/* Section 4: Paragraph 2 */}
            <div
              ref={setSectionRef(4)}
              data-section="4"
              className={`letter-text scroll-reveal-inner ${isRevealed(4) ? 'revealed' : ''}`}
            >
              Sé muy bien que nuestro camino no ha sido perfecto. Sé que he cometido errores reales, que he sido desleal, descuidado y que te he fallado con actitudes que nunca mereciste. No pretendo borrar el pasado con promesas vacías, porque sé que las palabras se las lleva el viento; hoy mi único objetivo es respaldar este amor con hechos, con respeto absoluto, cuidando cada detalle y protegiendo tu paz día tras día.
            </div>

            {/* Section 5: Paragraph 3 */}
            <div
              ref={setSectionRef(5)}
              data-section="5"
              className={`letter-text scroll-reveal-inner ${isRevealed(5) ? 'revealed' : ''}`}
            >
              Gracias por tu resiliencia, por tu amor incondicional y por este borrón y cuenta nueva que hoy nos une más fuerte. Quiero que camines con la tranquilidad de que mi corazón te pertenece solo a ti. Contigo quiero pasar el resto de mi vida, y aunque hoy te entrego este detalle digital, prepárate... porque muy pronto llegará ese anillo y ese &quot;sí para siempre&quot; que tanto deseo darte ante el mundo.
            </div>

            {/* Section 6: Closing */}
            <div
              ref={setSectionRef(6)}
              data-section="6"
              className={`letter-closing scroll-reveal-inner ${isRevealed(6) ? 'revealed' : ''}`}
            >
              <div className="letter-divider" />
              <p className="letter-signature">
                Feliz cumpleaños, mi amor.<br />
                <span className="signature-highlight">Eres mi mayor bendición.</span>
              </p>
              <div className="letter-decoration">✦ ✦ ✦</div>
            </div>
          </div>

          {/* Section 7: Heart button */}
          <div
            ref={setSectionRef(7)}
            data-section="7"
            className={`heart-section scroll-reveal ${isRevealed(7) ? 'revealed' : ''} ${heartClicked ? 'heart-exploded' : ''}`}
          >
            <button className={`heart-btn ${heartClicked ? 'clicked' : ''}`} onClick={handleHeartClick} aria-label="Toca aquí con amor">
              <svg className="heart-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#d4af37" stroke="#d4af37" strokeWidth="0.5" />
              </svg>
              <span className="heart-label">Toca aquí con amor</span>
            </button>
            {heartClicked && (
              <div className="explosion-container">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="explosion-particle" style={{ '--angle': `${(360 / 20) * i}deg`, '--distance': `${60 + Math.random() * 80}px`, animationDelay: `${Math.random() * 0.2}s`, backgroundColor: i % 2 === 0 ? '#d4af37' : '#ff6b8a' } as React.CSSProperties} />
                ))}
              </div>
            )}
          </div>
        </div>

        {showVideo && (
          <div className="video-fullscreen">
            <button className="video-close-btn" onClick={closeVideo} aria-label="Cerrar video">✕</button>
            <video ref={videoRef} controls autoPlay playsInline className="video-player-fs">
              <source src="/collage.mp4" type="video/mp4" />
            </video>
          </div>
        )}

        <footer className="footer"><p>Hecho con todo el amor del mundo 💛</p></footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; background: #0a0a0f !important; color: #f0e6d3 !important; }

        /* ===== SPLASH: Just heart + Toca para abrir ===== */
        .splash-screen {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: #0a0a0f;
          z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          animation: splashIn 0.6s ease;
        }
        @keyframes splashIn { from { opacity: 0; } to { opacity: 1; } }

        .splash-bg-particles {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; overflow: hidden;
        }
        .splash-particle {
          position: absolute; border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.4), rgba(212, 175, 55, 0));
          animation: floatP 6s ease-in-out infinite;
        }
        @keyframes floatP {
          0%, 100% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }

        .splash-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center; gap: 2rem;
        }
        .splash-heart-icon {
          width: 100px; height: 100px;
          animation: splashHeartbeat 1.4s ease-in-out infinite;
          filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.5)) drop-shadow(0 0 60px rgba(212, 175, 55, 0.2));
        }
        .splash-heart-icon svg { width: 100%; height: 100%; }
        @keyframes splashHeartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.18); }
          28% { transform: scale(1); }
          42% { transform: scale(1.12); }
          56% { transform: scale(1); }
        }
        .splash-tap-text {
          font-family: 'Inter', sans-serif;
          font-size: 1rem; color: rgba(212, 175, 55, 0.7);
          font-weight: 300; letter-spacing: 0.15em;
          animation: tapBlink 2.5s ease-in-out infinite;
        }
        @keyframes tapBlink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        /* ===== HIDDEN PAGE ===== */
        .hidden-page {
          opacity: 0; pointer-events: none; position: fixed; top: 0; left: 0;
        }

        /* ===== LANDING PAGE ===== */
        .landing-page {
          position: relative;
          min-height: 100vh; min-height: 100dvh;
          display: flex; flex-direction: column; align-items: center;
          background: linear-gradient(170deg, #0a0a0f 0%, #0d0b1a 20%, #150f2e 40%, #1a1145 60%, #120d30 80%, #0a0a0f 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #f0e6d3; padding: 0 1rem;
          transition: opacity 1s ease;
        }
        .landing-page.visible {
          opacity: 1; pointer-events: auto; position: relative;
        }

        /* ===== SCROLL REVEAL ===== */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(50px) scale(0.9);
          filter: blur(8px);
          transition: opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1),
                     transform 1.5s cubic-bezier(0.16, 1, 0.3, 1),
                     filter 1.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal.revealed {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }

        .scroll-reveal-inner {
          opacity: 0;
          transform: translateY(25px);
          filter: blur(4px);
          max-height: 0;
          overflow: hidden;
          margin-bottom: 0;
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                     transform 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                     filter 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                     max-height 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal-inner.revealed {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
          max-height: 600px;
          overflow: visible;
        }

        /* ===== FLASH ===== */
        .flash-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: white; z-index: 9999;
          animation: flashBurst 0.6s ease-out forwards; pointer-events: none;
        }
        @keyframes flashBurst {
          0% { opacity: 0; } 10% { opacity: 1; } 30% { opacity: 1; } 100% { opacity: 0; }
        }

        /* ===== NOW PLAYING ===== */
        .now-playing-indicator {
          position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 8px;
          background: rgba(10, 10, 15, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 50px;
          padding: 6px 16px; z-index: 100; animation: fadeDown 0.6s ease;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .np-visualizer { display: flex; align-items: flex-end; gap: 2px; height: 14px; }
        .np-bar { width: 2px; background: #d4af37; border-radius: 1px; animation: npVis 0.7s ease-in-out infinite alternate; }
        .np-bar-1 { height: 4px; } .np-bar-2 { height: 8px; animation-delay: 0.12s; }
        .np-bar-3 { height: 12px; animation-delay: 0.24s; } .np-bar-4 { height: 6px; animation-delay: 0.36s; }
        @keyframes npVis { 0% { height: 3px; } 100% { height: 14px; } }
        .np-text { font-size: 0.7rem; color: rgba(212, 175, 55, 0.8); white-space: nowrap; font-weight: 300; }

        /* ===== PARTICLES ===== */
        .particles-container {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 0; overflow: hidden;
        }
        .particle {
          position: absolute; border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.6), rgba(212, 175, 55, 0));
          animation: floatParticle 8s ease-in-out infinite;
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
        }

        /* ===== MAIN CONTAINER ===== */
        .main-container {
          position: relative; z-index: 1; width: 100%; max-width: 450px;
          display: flex; flex-direction: column; align-items: center; flex: 1;
        }

        /* ===== DATE: First viewport ===== */
        .date-section {
          position: relative; text-align: center;
          /* Take full viewport height - centered */
          min-height: 85vh; min-height: 85dvh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .date-glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 250px; height: 80px;
          background: radial-gradient(ellipse, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.05), transparent);
          border-radius: 50%; animation: dateGlow 2s ease-in-out infinite alternate;
        }
        @keyframes dateGlow {
          0% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        }
        .date-inner { position: relative; display: flex; align-items: center; justify-content: center; gap: 3px; }
        .date-digit {
          font-family: 'Playfair Display', Georgia, serif; font-size: 2.4rem; font-weight: 700;
          color: #d4af37; display: inline-block;
          animation: digitPop 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          text-shadow: 0 0 30px rgba(212, 175, 55, 0.7), 0 0 60px rgba(212, 175, 55, 0.3);
        }
        @keyframes digitPop {
          0% { transform: scale(0) rotateY(90deg); opacity: 0; }
          60% { transform: scale(1.3) rotateY(-10deg); }
          100% { transform: scale(1) rotateY(0deg); opacity: 1; }
        }
        .date-sep {
          font-family: 'Playfair Display', Georgia, serif; font-size: 2rem;
          color: rgba(212, 175, 55, 0.5); margin: 0 5px;
          animation: digitPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }
        .date-sparkles { display: flex; justify-content: center; gap: 1.5rem; margin-top: 0.8rem; }
        .date-sparkle { font-size: 0.6rem; color: #d4af37; animation: sparkle 2s ease-in-out infinite; opacity: 0.5; }
        @keyframes sparkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }

        /* ===== HEADER ===== */
        .header-section {
          text-align: center; display: flex; flex-direction: column; align-items: center;
          gap: 0.75rem; padding: 6rem 0 4rem;
          /* Extra spacing so it needs scroll to reach */
        }
        .sparkle-line { width: 120px; height: 1px; background: linear-gradient(90deg, transparent, #d4af37, transparent); }
        .title-main {
          font-family: 'Playfair Display', Georgia, serif; font-size: 2.2rem; font-weight: 700;
          background: linear-gradient(135deg, #d4af37, #f5e6a3, #d4af37);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: shimmer 3s ease-in-out infinite; letter-spacing: 0.04em; line-height: 1.2;
        }
        @keyframes shimmer { 0%, 100% { background-position: 0% center; } 50% { background-position: 200% center; } }
        .subtitle { font-family: 'Playfair Display', Georgia, serif; font-size: 1.5rem; color: #d4af37; letter-spacing: 0.5em; font-weight: 400; }

        /* ===== LETTER BOX ===== */
        .letter-box {
          width: 100%; margin-top: 2rem;
          background: rgba(255, 255, 255, 0.04); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 20px;
          padding: 2rem 1.5rem; position: relative; overflow: hidden;
        }
        .letter-box::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
        }
        .letter-decoration { text-align: center; color: #d4af37; letter-spacing: 1em; font-size: 0.7rem; }
        .letter-decoration.revealed { opacity: 0.6; margin: 0.5rem 0; }
        .letter-greeting {
          font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; font-weight: 600;
          color: #d4af37; text-align: center;
        }
        .letter-greeting.revealed { margin-bottom: 0.25rem; }
        .letter-divider { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent); margin: 0 auto; }
        .letter-divider.revealed { margin: 1rem auto; }
        .letter-text {
          font-size: 0.95rem; line-height: 1.7; color: rgba(240, 230, 211, 0.9);
          text-align: justify; font-weight: 300;
          padding-top: 0.5rem;
        }
        .letter-text.revealed { margin-bottom: 1rem; }
        .letter-closing.revealed { text-align: center; }
        .letter-signature {
          text-align: center; font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.1rem; line-height: 1.8; color: rgba(240, 230, 211, 0.95);
        }
        .signature-highlight { color: #d4af37; font-weight: 600; font-size: 1.15rem; }

        /* ===== HEART ===== */
        .heart-section {
          position: relative; display: flex; flex-direction: column; align-items: center;
          padding: 6rem 0 3rem;
          /* Extra spacing so it needs scroll to reach */
        }
        .heart-section.heart-exploded { transform: scale(0.8); opacity: 0; pointer-events: none; transition: all 0.5s ease; }
        .heart-btn {
          display: flex; flex-direction: column; align-items: center; gap: 1rem;
          background: none; border: none; cursor: pointer;
          animation: heartbeat 1.5s ease-in-out infinite; -webkit-tap-highlight-color: transparent;
        }
        .heart-btn:active { transform: scale(0.95); }
        .heart-btn.clicked { animation: heartExplode 0.8s ease-out forwards; }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); } 15% { transform: scale(1.12); } 30% { transform: scale(1); }
          45% { transform: scale(1.08); } 60% { transform: scale(1); }
        }
        @keyframes heartExplode { 0% { transform: scale(1); } 30% { transform: scale(1.4); } 100% { transform: scale(0); opacity: 0; } }
        .heart-svg { width: 80px; height: 80px; filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.4)) drop-shadow(0 0 40px rgba(212, 175, 55, 0.2)); }
        .heart-label { font-family: 'Playfair Display', Georgia, serif; font-size: 1rem; color: #d4af37; letter-spacing: 0.05em; text-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }

        .explosion-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
        .explosion-particle { position: absolute; width: 8px; height: 8px; border-radius: 50%; animation: explodeParticle 1s ease-out forwards; transform: translate(-50%, -50%); }
        @keyframes explodeParticle {
          0% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(-1 * var(--distance))); opacity: 0; }
        }

        /* ===== VIDEO ===== */
        .video-fullscreen {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: #000; z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          animation: videoReveal 0.3s ease-out;
        }
        @keyframes videoReveal { 0% { opacity: 0; } 100% { opacity: 1; } }
        .video-close-btn {
          position: absolute; top: 16px; right: 16px;
          background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(212, 175, 55, 0.3); color: #d4af37;
          width: 40px; height: 40px; border-radius: 50%; font-size: 1.1rem;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; z-index: 10;
        }
        .video-close-btn:hover { background: rgba(212, 175, 55, 0.3); transform: scale(1.1); }
        .video-player-fs { width: 100%; height: 100%; object-fit: contain; display: block; }

        /* ===== FOOTER ===== */
        .footer { position: relative; z-index: 1; text-align: center; padding: 2rem 1rem 1rem; margin-top: auto; width: 100%; max-width: 450px; }
        .footer p { font-size: 0.8rem; color: rgba(212, 175, 55, 0.4); font-weight: 300; letter-spacing: 0.03em; }

        /* ===== SCROLLBAR ===== */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 4px; }
        ::selection { background: rgba(212, 175, 55, 0.3); color: #f0e6d3; }
      `}</style>
    </>
  )
}
