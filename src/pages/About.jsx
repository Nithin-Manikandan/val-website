import './About.css'

function About() {
  const founders = [
    {
      name: 'Adrien Chung',
      role: 'Co-Founder',
      bio: 'Passionate about helping students navigate the challenges of high school. Specializes in course selection guidance and helping students build balanced schedules that align with their goals.',
      image: '/founders/adrien.jpg'
    },
    {
      name: 'Nithin Manikandan',
      role: 'Co-Founder',
      bio: 'Dedicated to making the transition to high school smoother for incoming freshmen. Experienced in providing personalized guidance on class choices and high school planning strategies.',
      image: '/founders/nithin.jpg'
    },
    {
      name: 'Yashas Karre',
      role: 'Co-Founder',
      bio: 'Committed to peer-to-peer mentorship and student success. Focuses on helping students make informed decisions about their academic path and extracurricular involvement.',
      image: '/founders/yashas.jpg'
    }
  ]

  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>About VAL</h1>
          <p className="about-subtitle">Value Added Learning</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story section">
        <div className="container">
          <h2>Our Story</h2>
          <div className="story-content">
            <p>
              VAL (Value Added Learning) was founded by three current high school students who
              understand firsthand the challenges and anxieties that come with transitioning to
              high school. We remember being in your shoes—wondering which classes to take, how to
              build the perfect schedule, and how to balance academics with everything else.
            </p>
            <p>
              That's why we created VAL. We wanted to build a bridge between where you are now
              and where you want to be. Unlike traditional counseling services, we're not just
              advisors—we're peers who recently made the same decisions you're about to make.
              We know which classes are actually challenging, which teachers to look out for, and
              how to create a schedule that sets you up for success without burning you out.
            </p>
            <p>
              Our mission is simple: to help rising freshmen start their high school journey with
              confidence, equipped with insider knowledge and personalized guidance. We help you
              choose the right classes, plan your schedule strategically, and navigate the social
              and academic landscape of high school.
            </p>
            <p>
              At VAL, we're more than just advisors—we're mentors, guides, and friends who genuinely
              care about your success. We've been there, we've made these choices, and now we're here
              to help you make the best decisions for your unique situation. Because when you succeed,
              we all succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="founders section">
        <div className="container">
          <h2>Meet Our Founders</h2>
          <p className="founders-intro">
            Three passionate high school students dedicated to helping you succeed.
          </p>
          <div className="founders-grid">
            {founders.map((founder, index) => (
              <div key={index} className="founder-card">
                <div className="founder-image">
                  <img src={founder.image} alt={founder.name} />
                </div>
                <div className="founder-info">
                  <h3>{founder.name}</h3>
                  <p className="founder-role">{founder.role}</p>
                  <p className="founder-bio">{founder.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values section">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Peer Connection</h3>
              <p>We believe in the power of learning from those who've recently walked in your shoes.</p>
            </div>
            <div className="value-card">
              <h3>Empowerment</h3>
              <p>We empower you to make informed decisions about your academic path with confidence.</p>
            </div>
            <div className="value-card">
              <h3>Personalization</h3>
              <p>Every student is unique, and our guidance reflects your individual goals, interests, and strengths.</p>
            </div>
            <div className="value-card">
              <h3>Genuine Care</h3>
              <p>Your success matters to us because we genuinely care about helping you thrive in high school.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

