import { Link } from 'react-router-dom'
import './Sessions.css'

function Sessions() {
  const pricingPlans = [
    {
      name: 'Group Sessions',
      price: '$15',
      duration: '30 minutes',
      capacity: 'Up to 10 people',
      features: [
        'Interactive group discussions',
        'Collaborative planning sessions',
        'Peer interaction and support',
        'Cost-effective option',
        'Flexible scheduling',
        'Share experiences with others'
      ],
      popular: false
    },
    {
      name: '1-on-1 Session',
      price: '$25',
      duration: '30 minutes',
      capacity: 'Individual attention',
      features: [
        'Personalized guidance',
        'Focused one-on-one time',
        'Customized advice for your goals',
        'Targeted course recommendations',
        'Immediate feedback',
        'Flexible topic selection'
      ],
      popular: true
    },
    {
      name: '1-on-1 Extended',
      price: '$50',
      duration: '1 hour',
      capacity: 'Individual attention',
      features: [
        'Extended personalized guidance',
        'Deep-dive into your schedule',
        'Comprehensive planning support',
        'Course selection & planning',
        'Long-term strategy development',
        'Maximum planning time'
      ],
      popular: false
    }
  ]

  return (
    <div className="sessions">
      {/* Hero Section */}
      <section className="sessions-hero">
        <div className="container">
          <h1>Sessions & Pricing</h1>
          <p className="sessions-subtitle">Flexible Options to Fit Your Learning Style</p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing section">
        <div className="container">
          <h2>Choose Your Guidance Path</h2>
          <p className="pricing-intro">
            Whether you prefer collaborative group sessions or personalized one-on-one guidance,
            we have the perfect option for you.
          </p>
          
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-duration">/ {plan.duration}</span>
                </div>
                <p className="capacity">{plan.capacity}</p>
                <ul className="features-list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/login" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="what-to-expect section">
        <div className="container">
          <h2>What to Expect</h2>
          <div className="expect-grid">
            <div className="expect-card">
              <div className="expect-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>Easy Scheduling</h3>
              <p>Book sessions at times that work for your busy schedule. We're flexible and accommodating.</p>
            </div>
            <div className="expect-card">
              <div className="expect-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <h3>Engaging Sessions</h3>
              <p>Interactive, fun, and effective guidance sessions designed to help you make confident decisions.</p>
            </div>
            <div className="expect-card">
              <div className="expect-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3>Progress Tracking</h3>
              <p>Regular feedback and progress updates to help you see your improvement over time.</p>
            </div>
            <div className="expect-card">
              <div className="expect-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>Ongoing Support</h3>
              <p>Questions between sessions? We're here to help via email and provide continuous support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>How do I book a session?</h3>
              <p>Simply contact us via email at vallearningco@gmail.com or use our contact form. We'll work with you to schedule a session that fits your needs.</p>
            </div>
            <div className="faq-item">
              <h3>What topics do you cover?</h3>
              <p>We provide guidance on course selection, schedule planning, extracurricular choices, time management, and general high school navigation strategies.</p>
            </div>
            <div className="faq-item">
              <h3>Can I switch between group and individual sessions?</h3>
              <p>Absolutely! You're free to mix and match session types based on your needs and preferences.</p>
            </div>
            <div className="faq-item">
              <h3>What if I need to cancel or reschedule?</h3>
              <p>We understand life happens! Just let us know at least 24 hours in advance and we'll happily reschedule your session.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Sessions

