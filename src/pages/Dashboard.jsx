import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabaseClient'
import { sendBookingConfirmation, sendCancellationNotification, sendAdminAlert } from '../utils/notifications'
import './Dashboard.css'

function Dashboard() {
  const { user, profile, signOut } = useAuth()
  const [sessions, setSessions] = useState([])
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sessionTypeFilter, setSessionTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Convert 24-hour time to 12-hour AM/PM format
  const formatTime = (time24) => {
    if (!time24) return ''
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Capitalize session type for display
  const formatSessionType = (type) => {
    if (!type) return ''
    if (type === 'one-on-one') return 'One-on-One'
    if (type === 'extended') return 'Extended'
    if (type === 'group') return 'Group'
    return type
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch upcoming sessions
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      // Fetch user's bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, sessions(*)')
        .eq('user_id', user.id)

      // Fetch user's payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*, sessions(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setSessions(sessionsData || [])
      setBookings(bookingsData || [])
      setPayments(paymentsData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const bookSession = async (sessionId) => {
    try {
      // Check if session is full
      const session = sessions.find(s => s.id === sessionId)
      const sessionBookings = await supabase
        .from('bookings')
        .select('id')
        .eq('session_id', sessionId)

      if (sessionBookings.data && sessionBookings.data.length >= session.capacity) {
        alert('Sorry, this session is full!')
        return
      }

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            session_id: sessionId,
            attendance_status: 'booked'
          }
        ])

      if (error) throw error

      // Send booking confirmation notification
      await sendBookingConfirmation({
        userId: user.id,
        userName: profile?.full_name || 'Student',
        sessionTitle: session.title,
        sessionDate: new Date(session.date).toLocaleDateString(),
        sessionTime: formatTime(session.time)
      })

      // Send admin alert
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')

      if (admins && admins.length > 0) {
        for (const admin of admins) {
          await sendAdminAlert({
            adminId: admin.id,
            userName: profile?.full_name || 'A student',
            sessionTitle: session.title,
            sessionDate: new Date(session.date).toLocaleDateString()
          })
        }
      }

      alert('Session booked successfully!')
      fetchDashboardData()
    } catch (error) {
      console.error('Error booking session:', error)
      alert('Failed to book session. You may have already booked this session.')
    }
  }

  // Get spots remaining for a session
  const getSpotsRemaining = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId)
    if (!session) return 0

    const sessionBookingsCount = bookings.filter(b => b.session_id === sessionId).length
    return session.capacity - sessionBookingsCount
  }

  // Check if session is full
  const isSessionFull = (sessionId) => {
    return getSpotsRemaining(sessionId) <= 0
  }

  const isSessionBooked = (sessionId) => {
    return bookings.some(booking => booking.session_id === sessionId)
  }

  const calculateTotalOwed = () => {
    return payments
      .filter(p => p.payment_status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const getFilteredSessions = () => {
    let filtered = sessions

    // Filter by session type
    if (sessionTypeFilter !== 'all') {
      filtered = filtered.filter(s => s.type === sessionTypeFilter)
    }

    // Filter by date
    if (dateFilter === 'upcoming') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(s => new Date(s.date) >= today)
    } else if (dateFilter === 'this-week') {
      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(s => {
        const sessionDate = new Date(s.date)
        return sessionDate >= today && sessionDate <= nextWeek
      })
    } else if (dateFilter === 'this-month') {
      const today = new Date()
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()
      filtered = filtered.filter(s => {
        const sessionDate = new Date(s.date)
        return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear
      })
    }

    return filtered
  }

  const cancelBooking = async (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId)
    const sessionDate = new Date(booking.sessions.date)
    const now = new Date()
    const hoursUntilSession = (sessionDate - now) / (1000 * 60 * 60)

    // Check if cancellation is within 24 hours
    if (hoursUntilSession < 24) {
      if (!window.confirm('This session is less than 24 hours away. Are you sure you want to cancel?')) {
        return
      }
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) throw error

      // Send cancellation notification
      await sendCancellationNotification({
        userId: user.id,
        userName: profile?.full_name || 'Student',
        sessionTitle: booking.sessions.title,
        sessionDate: new Date(booking.sessions.date).toLocaleDateString(),
        reason: 'user request'
      })

      alert('Booking cancelled successfully!')
      fetchDashboardData()
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Failed to cancel booking')
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Welcome back, {profile?.full_name || user?.email}!</h1>
              <p>Manage your sessions and track your progress</p>
            </div>
            <button onClick={signOut} className="btn btn-outline">Sign Out</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          <div className="dashboard-grid">
            {/* Stats Cards */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon">#</div>
                <div className="stat-info">
                  <h3>{bookings.length}</h3>
                  <p>Sessions Booked</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✓</div>
                <div className="stat-info">
                  <h3>{bookings.filter(b => b.attendance_status === 'attended').length}</h3>
                  <p>Sessions Attended</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">$</div>
                <div className="stat-info">
                  <h3>${calculateTotalOwed()}</h3>
                  <p>Amount Owed</p>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="dashboard-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0 }}>Upcoming Sessions</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <select
                    value={sessionTypeFilter}
                    onChange={(e) => setSessionTypeFilter(e.target.value)}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #e8e8e8' }}
                  >
                    <option value="all">All Types</option>
                    <option value="group">Group</option>
                    <option value="one-on-one">One-on-One</option>
                    <option value="extended">Extended</option>
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #e8e8e8' }}
                  >
                    <option value="all">All Dates</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                  </select>
                </div>
              </div>
              <div className="sessions-list">
                {getFilteredSessions().length === 0 ? (
                  <p className="empty-state">No sessions match your filters</p>
                ) : (
                  getFilteredSessions().map(session => (
                    <div key={session.id} className="session-card">
                      <div className="session-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <h3 style={{ margin: 0 }}>{session.title}</h3>
                          {isSessionFull(session.id) && (
                            <span className="full-badge">FULL</span>
                          )}
                        </div>
                        <p className="session-description">{session.description}</p>
                        <div className="session-meta">
                          <span>Date: {new Date(session.date).toLocaleDateString()}</span>
                          <span>Time: {formatTime(session.time)}</span>
                          <span>Price: ${session.price}</span>
                          <span className="session-type">{formatSessionType(session.type)}</span>
                          {!isSessionFull(session.id) && (
                            <span className="spots-remaining">
                              {getSpotsRemaining(session.id)} spot{getSpotsRemaining(session.id) !== 1 ? 's' : ''} left
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="session-actions">
                        {isSessionBooked(session.id) ? (
                          <button className="btn btn-success" disabled>
                            Booked
                          </button>
                        ) : isSessionFull(session.id) ? (
                          <button className="btn btn-secondary" disabled>
                            Full
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => bookSession(session.id)}
                          >
                            Book Session
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* My Bookings */}
            <div className="dashboard-section">
              <h2>My Bookings</h2>
              <div className="bookings-table">
                {bookings.length === 0 ? (
                  <p className="empty-state">No bookings yet</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Session</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Feedback</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.id}>
                          <td>{booking.sessions?.title}</td>
                          <td>
                            <div>{new Date(booking.sessions?.date).toLocaleDateString()}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                              {formatTime(booking.sessions?.time)}
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${booking.attendance_status}`}>
                              {booking.attendance_status}
                            </span>
                          </td>
                          <td>
                            {booking.notes ? (
                              <div style={{
                                padding: '0.5rem',
                                background: '#f8f9fa',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                maxWidth: '250px'
                              }}>
                                {booking.notes}
                              </div>
                            ) : (
                              <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>No feedback yet</span>
                            )}
                          </td>
                          <td>
                            {booking.attendance_status === 'booked' && (
                              <button
                                onClick={() => cancelBooking(booking.id)}
                                className="btn btn-danger btn-sm"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                              >
                                Cancel
                              </button>
                            )}
                            {booking.attendance_status === 'attended' && (
                              <span style={{ color: '#28a745', fontWeight: '600' }}>✓ Completed</span>
                            )}
                            {booking.attendance_status === 'cancelled' && (
                              <span style={{ color: '#6c757d' }}>Cancelled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Payment History */}
            <div className="dashboard-section">
              <h2>Payment History</h2>
              <div className="payments-table">
                {payments.length === 0 ? (
                  <p className="empty-state">No payment history yet</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Session</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(payment => (
                        <tr key={payment.id}>
                          <td>{payment.sessions?.title}</td>
                          <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                          <td>${payment.amount}</td>
                          <td>
                            <span className={`status-badge ${payment.payment_status}`}>
                              {payment.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

