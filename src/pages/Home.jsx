import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import './Home.css'

function Home() {
  const [isStatsVisible, setIsStatsVisible] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsStatsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  const CountUp = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isStatsVisible) return

      let startTime
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)

        setCount(Math.floor(progress * end))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }, [isStatsVisible, end, duration])

    return <span>{count}{suffix}</span>
  }
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Welcome to VAL</h1>
              <h2 className="hero-subtitle">Value Added Learning</h2>
              <p className="hero-tagline">Stress Less, Start Strong</p>
              <p className="hero-description">
                Personalized guidance and mentorship for rising freshmen navigating high school,
                by current high school students who understand your journey.
              </p>
              <div className="hero-buttons">
                <Link to="/sessions" className="btn btn-primary">
                  View Sessions
                </Link>
                <Link to="/about" className="btn btn-outline">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <img src="/val-logo.png" alt="VAL Logo" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Peer Mentorship</h3>
              <p>Get advice from current high school students who recently navigated the same decisions you're facing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h3>Course Selection Guidance</h3>
              <p>Get personalized recommendations on which classes to take based on your interests and goals.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>Schedule Planning</h3>
              <p>Learn how to build a balanced schedule that sets you up for success without overwhelming you.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>High School Navigation</h3>
              <p>Get insider tips on extracurriculars, time management, and making the most of your freshman year.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <h2 className="section-title">Why Freshmen Need Support</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">
                <CountUp end={4} suffix="M+" duration={2000} />
              </div>
              <p className="stat-label">Rising US high school freshmen each year</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                <CountUp end={43} suffix="%" duration={2000} />
              </div>
              <p className="stat-label">Freshmen not feeling prepared for high school</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                <CountUp end={60} suffix="%" duration={2000} />
              </div>
              <p className="stat-label">High schoolers stressed every day</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                <CountUp end={45} suffix="%" duration={2000} />
              </div>
              <p className="stat-label">Freshmen stressed almost daily in school</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your High School Journey?</h2>
            <p>Join VAL today and make your transition to high school smooth and successful.</p>
            <Link to="/contact" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

