import { Link } from 'react-router-dom'
import './WhyUs.css'

function WhyUs() {
  return (
    <div className="why-us">
      {/* Hero Section */}
      <section className="why-hero">
        <div className="container">
          <h1>Why Choose VAL?</h1>
          <p className="why-subtitle">The Peer Mentorship Advantage</p>
        </div>
      </section>

      {/* Comparison Section - Moved to top for visual impact */}
      <section className="comparison section">
        <div className="container">
          <h2>The VAL Difference</h2>
          <div className="comparison-grid">
            <div className="comparison-card val-card">
              <h3>With VAL</h3>
              <ul>
                <li>✓ Current high school students as mentors</li>
                <li>✓ Recent, relevant experience</li>
                <li>✓ Relatable and approachable</li>
                <li>✓ Affordable pricing</li>
                <li>✓ Flexible scheduling</li>
                <li>✓ Peer-to-peer connection</li>
                <li>✓ Real-time insider knowledge</li>
                <li>✓ Full schedule building & creation</li>
                <li>✓ Key insights about your school</li>
                <li>✓ Holistic guidance</li>
              </ul>
            </div>
            <div className="comparison-card traditional-card">
              <h3>Traditional Counseling</h3>
              <ul>
                <li>✗ Often years removed from high school</li>
                <li>✗ May have outdated information</li>
                <li>✗ Can feel intimidating</li>
                <li>✗ Often expensive or unavailable</li>
                <li>✗ Limited availability</li>
                <li>✗ Formal counselor-student dynamic</li>
                <li>✗ Generic, one-size-fits-all advice</li>
                <li>✗ Limited schedule customization</li>
                <li>✗ No school-specific insights</li>
                <li>✗ Primarily academic focus</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Main Reasons Section */}
      <section className="reasons section">
        <div className="container">
          <div className="reason-item">
            <div className="reason-content">
              <div className="reason-number">01</div>
              <h2>We've Been in Your Shoes</h2>
              <p>
                Unlike traditional counselors who may be years removed from high school, we're current
                students who recently made the exact same decisions you're facing. We remember choosing
                our classes, building our schedules, and navigating freshman year—and we know exactly
                what worked and what didn't.
              </p>
            </div>
          </div>

          <div className="reason-item reverse">
            <div className="reason-content">
              <div className="reason-number">02</div>
              <h2>Relatable & Approachable</h2>
              <p>
                Getting advice from peers creates a comfortable, judgment-free environment. You're not just
                another student to us—you're someone we genuinely want to help succeed. We speak your
                language, understand your concerns, and make the planning process feel less intimidating.
              </p>
            </div>
          </div>

          <div className="reason-item">
            <div className="reason-content">
              <div className="reason-number">03</div>
              <h2>Fresh, Relevant Insights</h2>
              <p>
                Our advice is current and proven—we're living it right now! We know which classes
                are actually challenging, which combinations work well together, and how to balance
                your schedule with extracurriculars in today's high school environment.
              </p>
            </div>
          </div>

          <div className="reason-item reverse">
            <div className="reason-content">
              <div className="reason-number">04</div>
              <h2>Affordable Excellence</h2>
              <p>
                Quality guidance shouldn't break the bank. As students ourselves, we understand budget
                constraints. That's why we offer competitive pricing without compromising on the quality
                of personalized advice and mentorship you receive.
              </p>
            </div>
          </div>

          <div className="reason-item">
            <div className="reason-content">
              <div className="reason-number">05</div>
              <h2>Flexible & Personalized</h2>
              <p>
                Whether you prefer group sessions or one-on-one guidance, we've got you covered.
                Our sessions are designed around your schedule, goals, and specific needs.
                You're in control of your high school planning journey.
              </p>
            </div>
          </div>

          <div className="reason-item reverse">
            <div className="reason-content">
              <div className="reason-number">06</div>
              <h2>Beyond Course Selection</h2>
              <p>
                We don't just help you pick classes—we provide holistic guidance on time management,
                extracurricular choices, and balancing your commitments. We're here to ensure you don't
                just survive high school, but truly thrive in it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="why-cta section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Experience the VAL Difference?</h2>
            <p>Join hundreds of students who are starting strong with VAL.</p>
            <div className="cta-buttons">
              <Link to="/sessions" className="btn btn-primary">
                View Our Sessions
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WhyUs

