import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>VAL</h3>
            <p className="footer-tagline">Stress Less, Start Strong</p>
            <p>Empowering rising freshmen with peer-to-peer tutoring and mentorship.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/why-us">Why Us</Link></li>
              <li><Link to="/sessions">Sessions & Pricing</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>
              <strong>Email:</strong><br />
              <a href="mailto:vallearningco@gmail.com">vallearningco@gmail.com</a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} VAL (Value Added Learning). All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

