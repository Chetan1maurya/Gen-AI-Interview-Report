import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"

const Home = () => {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })

      // draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div style={styles.root}>
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <span style={styles.logoDot} />
          <span style={styles.logoText}>PrepAI</span>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate("/login")}>
            Log in
          </button>
          <button style={styles.navCta} onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main style={styles.hero}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          AI-Powered Interview Preparation
        </div>

        <h1 style={styles.heading}>
          Land Your Dream Job
          <br />
          <span style={styles.headingAccent}>With Confidence</span>
        </h1>

        <p style={styles.subtext}>
          Upload your resume, paste the job description, and get a personalized
          interview report with skill gap analysis, practice questions, and a
          day-by-day prep plan.
        </p>

        <div style={styles.ctaRow}>
          <button style={styles.primaryBtn} onClick={() => navigate("/register")}>
            Start for free
            <span style={styles.arrow}>→</span>
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate("/login")}>
            I already have an account
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { value: "10K+", label: "Reports Generated" },
            { value: "94%", label: "Interview Success Rate" },
            { value: "500+", label: "Companies Covered" },
          ].map((s) => (
            <div key={s.label} style={styles.statCard}>
              <span style={styles.statValue}>{s.value}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section style={styles.features}>
        {[
          {
            icon: "📄",
            title: "Resume Analysis",
            desc: "AI reads your resume and matches it against the job description instantly.",
          },
          {
            icon: "🎯",
            title: "Skill Gap Report",
            desc: "Know exactly what skills you're missing and how critical each one is.",
          },
          {
            icon: "💬",
            title: "Practice Questions",
            desc: "Get tailored technical and behavioral questions with ideal answers.",
          },
          {
            icon: "📅",
            title: "Prep Plan",
            desc: "A personalized day-by-day plan to fill your gaps before the interview.",
          },
        ].map((f) => (
          <div key={f.title} style={styles.featureCard}>
            <span style={styles.featureIcon}>{f.icon}</span>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <section style={styles.footerCta}>
        <h2 style={styles.footerCtaHeading}>Ready to ace your next interview?</h2>
        <button style={styles.primaryBtn} onClick={() => navigate("/register")}>
          Create free account
          <span style={styles.arrow}>→</span>
        </button>
      </section>

      <footer style={styles.footer}>
        <span>© 2026 PrepAI · Built by Chetan Maurya</span>
      </footer>
    </div>
  )
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#e8e8f0",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    overflowX: "hidden",
    position: "relative",
  },
  canvas: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
    pointerEvents: "none",
  },

  // Navbar
  nav: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.25rem 2.5rem",
    borderBottom: "1px solid rgba(99,102,241,0.15)",
    backdropFilter: "blur(10px)",
    background: "rgba(10,10,15,0.7)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#6366f1",
    display: "inline-block",
    boxShadow: "0 0 8px #6366f1",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "-0.3px",
  },
  navLinks: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  navBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#ccc",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  navCta: {
    background: "#6366f1",
    border: "none",
    color: "#fff",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
  },

  // Hero
  hero: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "6rem 1.5rem 4rem",
    maxWidth: "860px",
    margin: "0 auto",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: "999px",
    padding: "6px 16px",
    fontSize: "13px",
    color: "#a5b4fc",
    marginBottom: "2rem",
    letterSpacing: "0.3px",
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#6366f1",
    display: "inline-block",
    boxShadow: "0 0 6px #6366f1",
  },
  heading: {
    fontSize: "clamp(2.8rem, 7vw, 5rem)",
    fontWeight: "800",
    lineHeight: "1.1",
    letterSpacing: "-2px",
    color: "#ffffff",
    margin: "0 0 1.5rem",
  },
  headingAccent: {
    background: "linear-gradient(90deg, #6366f1, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtext: {
    fontSize: "1.15rem",
    color: "#9ca3af",
    lineHeight: "1.8",
    maxWidth: "600px",
    margin: "0 0 2.5rem",
  },
  ctaRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "4rem",
  },
  primaryBtn: {
    background: "#6366f1",
    border: "none",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
  },
  secondaryBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#9ca3af",
    padding: "14px 28px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "all 0.2s",
  },
  arrow: {
    fontSize: "16px",
    transition: "transform 0.2s",
  },

  // Stats
  statsRow: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  statCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "-1px",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    letterSpacing: "0.3px",
  },

  // Features
  features: {
    position: "relative",
    zIndex: 10,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
    maxWidth: "960px",
    margin: "0 auto",
    padding: "0 1.5rem 6rem",
  },
  featureCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "1.75rem",
    transition: "border-color 0.2s",
  },
  featureIcon: {
    fontSize: "28px",
    display: "block",
    marginBottom: "1rem",
  },
  featureTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    margin: "0 0 0.5rem",
  },
  featureDesc: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.7",
    margin: 0,
  },

  // Footer CTA
  footerCta: {
    position: "relative",
    zIndex: 10,
    textAlign: "center",
    padding: "5rem 1.5rem",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
  },
  footerCtaHeading: {
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "-1px",
    margin: 0,
  },

  // Footer
  footer: {
    position: "relative",
    zIndex: 10,
    textAlign: "center",
    padding: "1.5rem",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    fontSize: "13px",
    color: "#4b5563",
  },
}

export default Home