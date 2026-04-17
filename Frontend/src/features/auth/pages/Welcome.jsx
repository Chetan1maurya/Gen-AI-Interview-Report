import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"
import "../styles/Welcome.scss"

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
    <div className="home">
      <canvas ref={canvasRef} className="home__canvas" />

      {/* Hero */}
      <main className="home__hero">
        <div className="home__badge">
          <span className="home__badge-dot" />
          AI-Powered Interview Preparation
        </div>

        <h1 className="home__heading">
          Land Your Dream Job
          <br />
          <span className="home__heading-accent">
            With Confidence
          </span>
        </h1>

        <p className="home__subtext">
          Upload your resume, paste the job description, and get a personalized
          interview report with skill gap analysis, practice questions, and a
          day-by-day prep plan.
        </p>

        <div className="home__cta-row">
          <button
            className="home__primary-btn"
            onClick={() => navigate("/register")}
          >
            Start for free
            <span className="home__arrow">→</span>
          </button>

          <button
            className="home__secondary-btn"
            onClick={() => navigate("/login")}
          >
            I already have an account
          </button>
        </div>
      </main>

      {/* Features */}
      <section className="home__features">
        {[
          {
            icon: "📄",
            title: "Resume Analysis",
            desc: "AI reads your resume and matches it instantly.",
          },
          {
            icon: "🎯",
            title: "Skill Gap Report",
            desc: "Know exactly what skills you're missing.",
          },
          {
            icon: "💬",
            title: "Practice Questions",
            desc: "Get tailored interview questions.",
          },
          {
            icon: "📅",
            title: "Prep Plan",
            desc: "Day-by-day preparation roadmap.",
          },
        ].map((f) => (
          <div key={f.title} className="home__feature-card">
            <span className="home__feature-icon">{f.icon}</span>
            <h3 className="home__feature-title">{f.title}</h3>
            <p className="home__feature-desc">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <section className="home__footer-cta">
        <h2 className="home__footer-heading">
          Ready to ace your next interview?
        </h2>

        <button
          className="home__primary-btn"
          onClick={() => navigate("/register")}
        >
          Create free account
          <span className="home__arrow">→</span>
        </button>
      </section>

      <footer className="home__footer">
        © 2026 PrepAI · Built by Chetan Maurya
      </footer>
    </div>
  )
}

export default Home