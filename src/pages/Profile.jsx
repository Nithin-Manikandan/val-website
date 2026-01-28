import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabaseClient'
import './Profile.css'

function Profile() {
  const { user, profile, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    parent_contact: '',
    grade_level: '',
    school: ''
  })

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        parent_contact: profile.parent_contact || '',
        grade_level: profile.grade_level || '',
        school: profile.school || ''
      })
    }
  }, [profile])

  const handleChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileForm)
        .eq('id', user.id)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>My Profile</h1>
              <p>Manage your personal information</p>
            </div>
            <button onClick={signOut} className="btn btn-outline">Sign Out</button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="container">
          <div className="profile-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={profileForm.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  style={{ background: '#f0f0f0', cursor: 'not-allowed' }}
                />
                <small style={{ color: '#6c757d' }}>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                />
              </div>

              <div className="form-group">
                <label>Parent/Guardian Contact</label>
                <input
                  type="text"
                  name="parent_contact"
                  value={profileForm.parent_contact}
                  onChange={handleChange}
                  placeholder="Parent name and phone number"
                />
              </div>

              <div className="form-group">
                <label>Grade Level</label>
                <select
                  name="grade_level"
                  value={profileForm.grade_level}
                  onChange={handleChange}
                >
                  <option value="">Select grade level</option>
                  <option value="8th">8th Grade (Rising Freshman)</option>
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
              </div>

              <div className="form-group">
                <label>School</label>
                <input
                  type="text"
                  name="school"
                  value={profileForm.school}
                  onChange={handleChange}
                  placeholder="Your school name"
                />
              </div>

              {success && (
                <div className="success-message">
                  ✓ Profile updated successfully!
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

