import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { emailConfig } from '../config/emailConfig'
import './Contact.css'

function Contact() {
  const form = useRef()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({
        submitting: false,
        submitted: false,
        error: 'Please fill in all required fields.'
      })
      return
    }

    // Set loading state
    setStatus({
      submitting: true,
      submitted: false,
      error: null
    })

    try {
      // Send email using EmailJS
      // Configure your credentials in src/config/emailConfig.js
      const result = await emailjs.sendForm(
        emailConfig.serviceId,
        emailConfig.templateId,
        form.current,
        emailConfig.publicKey
      )

      console.log('Email sent successfully:', result.text)

      // Set success state
      setStatus({
        submitting: false,
        submitted: true,
        error: null
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })

      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus({
          submitting: false,
          submitted: false,
          error: null
        })
      }, 5000)

    } catch (error) {
      console.error('Email send failed:', error)
      setStatus({
        submitting: false,
        submitted: false,
        error: 'Failed to send message. Please try again or email us directly at vallearningco@gmail.com'
      })
    }
  }

  return (
    <div className="contact">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p className="contact-subtitle">We're here to help you start strong!</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info">
              <h2>Let's Connect</h2>
              <p>
                Have questions about our guidance services? Want to schedule a session?
                We'd love to hear from you!
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="method-details">
                    <h3>Email Us</h3>
                    <a href="mailto:vallearningco@gmail.com">vallearningco@gmail.com</a>
                    <p>We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="method-details">
                    <h3>Response Time</h3>
                    <p>Monday - Friday: Within 24 hours</p>
                    <p>Weekends: Within 48 hours</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                  </div>
                  <div className="method-details">
                    <h3>Session Booking</h3>
                    <p>Contact us to schedule your first session</p>
                    <p>Flexible scheduling available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <form className="contact-form" onSubmit={handleSubmit} ref={form}>
                <h2>Send Us a Message</h2>

                {/* Success Message */}
                {status.submitted && (
                  <div className="form-message success-message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p>Message sent successfully! We'll get back to you soon.</p>
                  </div>
                )}

                {/* Error Message */}
                {status.error && (
                  <div className="form-message error-message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <p>{status.error}</p>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    disabled={status.submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Your Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    disabled={status.submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What's this about?"
                    disabled={status.submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help you..."
                    disabled={status.submitting}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={status.submitting}
                >
                  {status.submitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact

