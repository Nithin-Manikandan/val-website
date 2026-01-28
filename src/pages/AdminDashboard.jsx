import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabaseClient'
import { sendAttendanceUpdate } from '../utils/notifications'
import { exportBookingsToCSV, exportPaymentsToCSV, generateMonthlyReport } from '../utils/exportData'
import './AdminDashboard.css'

function AdminDashboard() {
  const { signOut, profile } = useAuth()
  const [activeTab, setActiveTab] = useState('sessions')
  const [sessions, setSessions] = useState([])
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [bookingSearch, setBookingSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [editingSession, setEditingSession] = useState(null)
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'group',
    price: 15,
    capacity: 10
  })

  // Capitalize session type for display
  const formatSessionType = (type) => {
    if (!type) return ''
    if (type === 'one-on-one') return 'One-on-One'
    if (type === 'extended') return 'Extended'
    if (type === 'group') return 'Group'
    return type
  }

  // Convert 24-hour time to 12-hour AM/PM format
  const formatTime = (time24) => {
    if (!time24) return ''
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [sessionsRes, usersRes, bookingsRes, paymentsRes] = await Promise.all([
        supabase.from('sessions').select('*').order('date', { ascending: true }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*, profiles(*), sessions(*)').order('created_at', { ascending: false }),
        supabase.from('payments').select('*, profiles:user_id(full_name, email), sessions:session_id(title, date, time)').order('created_at', { ascending: false })
      ])

      // Log any errors
      if (sessionsRes.error) {
        console.error('Sessions error:', sessionsRes.error)
        alert(`Sessions error: ${sessionsRes.error.message}`)
      }
      if (usersRes.error) {
        console.error('Users error:', usersRes.error)
        alert(`Users error: ${usersRes.error.message}`)
      }
      if (bookingsRes.error) {
        console.error('Bookings error:', bookingsRes.error)
        alert(`Bookings error: ${bookingsRes.error.message}`)
      }
      if (paymentsRes.error) {
        console.error('Payments error:', paymentsRes.error)
        alert(`Payments error: ${paymentsRes.error.message}`)
      }

      setSessions(sessionsRes.data || [])
      setUsers(usersRes.data || [])
      setBookings(bookingsRes.data || [])
      setPayments(paymentsRes.data || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSessionFormChange = (e) => {
    const { name, value } = e.target
    setSessionForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSessionSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingSession) {
        // Update existing session
        const { error } = await supabase
          .from('sessions')
          .update(sessionForm)
          .eq('id', editingSession.id)
        
        if (error) throw error
        alert('Session updated successfully!')
      } else {
        // Create new session
        const { error } = await supabase
          .from('sessions')
          .insert([sessionForm])
        
        if (error) throw error
        alert('Session created successfully!')
      }
      
      setShowSessionForm(false)
      setEditingSession(null)
      setSessionForm({
        title: '',
        description: '',
        date: '',
        time: '',
        type: 'group',
        price: 15,
        capacity: 10
      })
      fetchAdminData()
    } catch (error) {
      console.error('Error saving session:', error)
      alert('Failed to save session')
    }
  }

  const handleEditSession = (session) => {
    setEditingSession(session)
    setSessionForm({
      title: session.title,
      description: session.description,
      date: session.date,
      time: session.time,
      type: session.type,
      price: session.price,
      capacity: session.capacity
    })
    setShowSessionForm(true)
  }

  const handleDeleteSession = async (sessionId) => {
    const session = sessions.find(s => s.id === sessionId)
    const affectedBookings = bookings.filter(b => b.session_id === sessionId)

    if (affectedBookings.length > 0) {
      if (!confirm(`This session has ${affectedBookings.length} booking(s). Deleting will cancel all bookings and remove associated payments. Continue?`)) {
        return
      }
    } else {
      if (!confirm('Are you sure you want to delete this session?')) return
    }

    try {
      // Delete associated payments first
      const { error: paymentsError } = await supabase
        .from('payments')
        .delete()
        .eq('session_id', sessionId)

      if (paymentsError) throw paymentsError

      // Delete associated bookings
      const { error: bookingsError } = await supabase
        .from('bookings')
        .delete()
        .eq('session_id', sessionId)

      if (bookingsError) throw bookingsError

      // Delete the session
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error

      alert(`Session deleted successfully! ${affectedBookings.length} booking(s) cancelled.`)
      fetchAdminData()
    } catch (error) {
      console.error('Error deleting session:', error)
      alert('Failed to delete session')
    }
  }

  const handleAttendanceUpdate = async (bookingId, status) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ attendance_status: status })
        .eq('id', bookingId)

      if (error) throw error

      // Get booking details for notification
      const booking = bookings.find(b => b.id === bookingId)

      // If marking as attended, create payment record only if it doesn't exist
      if (status === 'attended') {
        // Check if payment already exists for this booking
        const { data: existingPayment } = await supabase
          .from('payments')
          .select('id')
          .eq('user_id', booking.user_id)
          .eq('session_id', booking.session_id)
          .single()

        // Only create payment if it doesn't exist
        if (!existingPayment) {
          await supabase.from('payments').insert([{
            user_id: booking.user_id,
            session_id: booking.session_id,
            amount: booking.sessions.price,
            payment_status: 'pending'
          }])
        }
      }

      // Send attendance update notification
      await sendAttendanceUpdate({
        userId: booking.user_id,
        userName: booking.profiles?.full_name || 'Student',
        sessionTitle: booking.sessions?.title || 'Session',
        sessionDate: new Date(booking.sessions?.date).toLocaleDateString(),
        status
      })

      fetchAdminData()
    } catch (error) {
      console.error('Error updating attendance:', error)
      alert('Failed to update attendance')
    }
  }

  const handleMarkAsPaid = async (paymentId) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ payment_status: 'paid' })
        .eq('id', paymentId)

      if (error) throw error

      alert('Payment marked as paid!')
      fetchAdminData()
    } catch (error) {
      console.error('Error updating payment:', error)
      alert('Failed to update payment status')
    }
  }

  const handleNotesUpdate = async (bookingId, notes) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          notes,
          notes_updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)

      if (error) throw error

      // Update local state immediately for better UX
      setBookings(bookings.map(b =>
        b.id === bookingId ? { ...b, notes } : b
      ))
    } catch (error) {
      console.error('Error updating notes:', error)
      alert('Failed to update notes')
    }
  }

  const calculateTotalRevenue = () => {
    return payments
      .filter(p => p.payment_status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const calculatePendingRevenue = () => {
    return payments
      .filter(p => p.payment_status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const getFilteredPayments = () => {
    if (paymentFilter === 'all') return payments
    return payments.filter(p => p.payment_status === paymentFilter)
  }

  const getFilteredBookings = () => {
    if (!bookingSearch) return bookings
    return bookings.filter(b =>
      b.profiles?.full_name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.sessions?.title?.toLowerCase().includes(bookingSearch.toLowerCase())
    )
  }

  const getFilteredUsers = () => {
    if (!userSearch) return users
    return users.filter(u =>
      u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
    )
  }

  const handleTypeChange = (e) => {
    const type = e.target.value
    let price = 15
    let capacity = 10

    if (type === 'one-on-one') {
      price = 25
      capacity = 1
    } else if (type === 'extended') {
      price = 50
      capacity = 1
    } else if (type === 'group') {
      price = 15
      capacity = 10
    }

    setSessionForm(prev => ({
      ...prev,
      type,
      price,
      capacity
    }))
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Welcome, {profile?.full_name}</p>
            </div>
            <button onClick={signOut} className="btn btn-outline">Sign Out</button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          <div className="admin-tabs">
            <button 
              className={activeTab === 'sessions' ? 'active' : ''}
              onClick={() => setActiveTab('sessions')}
            >
              Sessions
            </button>
            <button 
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={activeTab === 'bookings' ? 'active' : ''}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings & Attendance
            </button>
            <button
              className={activeTab === 'payments' ? 'active' : ''}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </button>
          </div>

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Manage Sessions</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowSessionForm(true)
                    setEditingSession(null)
                    setSessionForm({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      type: 'group',
                      price: 15,
                      capacity: 10
                    })
                  }}
                >
                  + Add New Session
                </button>
              </div>

              {showSessionForm && (
                <div className="modal-overlay" onClick={() => setShowSessionForm(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3>{editingSession ? 'Edit Session' : 'Create New Session'}</h3>
                    <form onSubmit={handleSessionSubmit}>
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          name="title"
                          value={sessionForm.title}
                          onChange={handleSessionFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={sessionForm.description}
                          onChange={handleSessionFormChange}
                          rows="3"
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Date</label>
                          <input
                            type="date"
                            name="date"
                            value={sessionForm.date}
                            onChange={handleSessionFormChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Time</label>
                          <input
                            type="time"
                            name="time"
                            value={sessionForm.time}
                            onChange={handleSessionFormChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Type</label>
                          <select
                            name="type"
                            value={sessionForm.type}
                            onChange={handleTypeChange}
                            required
                          >
                            <option value="group">Group ($15/30min)</option>
                            <option value="one-on-one">1-on-1 ($25/30min)</option>
                            <option value="extended">Extended ($50/1hr)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Price ($)</label>
                          <input
                            type="number"
                            name="price"
                            value={sessionForm.price}
                            onChange={handleSessionFormChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Capacity</label>
                          <input
                            type="number"
                            name="capacity"
                            value={sessionForm.capacity}
                            onChange={handleSessionFormChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="modal-actions">
                        <button type="button" className="btn btn-outline" onClick={() => setShowSessionForm(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          {editingSession ? 'Update' : 'Create'} Session
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="sessions-grid">
                {sessions.map(session => (
                  <div key={session.id} className="admin-session-card">
                    <div className="session-header">
                      <h3>{session.title}</h3>
                      <span className="session-type">{formatSessionType(session.type)}</span>
                    </div>
                    <p>{session.description}</p>
                    <div className="session-details">
                      <span>Date: {new Date(session.date).toLocaleDateString()}</span>
                      <span>Time: {formatTime(session.time)}</span>
                      <span>Price: ${session.price}</span>
                      <span>Capacity: {session.capacity} spots</span>
                    </div>
                    <div className="session-actions">
                      <button className="btn-icon" onClick={() => handleEditSession(session)}>
                        Edit
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDeleteSession(session.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <h2>Registered Users</h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #e8e8e8', width: '100%', maxWidth: '400px' }}
                />
              </div>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Sessions Booked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredUsers().map(user => (
                      <tr key={user.id}>
                        <td>{user.full_name}</td>
                        <td>{user.email}</td>
                        <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td>{bookings.filter(b => b.user_id === user.id).length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="tab-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0 }}>Bookings & Attendance</h2>
                <button
                  onClick={() => exportBookingsToCSV(bookings)}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  📊 Export to CSV
                </button>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Search by user name or session..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #e8e8e8', width: '100%', maxWidth: '400px' }}
                />
              </div>
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Session</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredBookings().map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.profiles?.full_name}</td>
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
                          <select
                            value={booking.attendance_status}
                            onChange={(e) => handleAttendanceUpdate(booking.id, e.target.value)}
                            className="attendance-select"
                          >
                            <option value="booked">Booked</option>
                            <option value="attended">Attended</option>
                            <option value="no-show">No Show</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <textarea
                            value={booking.notes || ''}
                            onChange={(e) => handleNotesUpdate(booking.id, e.target.value)}
                            placeholder="Add session notes..."
                            style={{
                              width: '200px',
                              minHeight: '60px',
                              padding: '0.5rem',
                              borderRadius: '6px',
                              border: '1px solid #e8e8e8',
                              fontSize: '0.9rem',
                              resize: 'vertical'
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="tab-content">
              <div className="dashboard-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2>Payment Management</h2>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ddd' }}
                    >
                      <option value="all">All Payments</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                    <button
                      onClick={() => exportPaymentsToCSV(payments)}
                      className="btn btn-primary"
                      style={{ padding: '0.75rem 1.5rem' }}
                    >
                      📊 Export Payments
                    </button>
                    <button
                      onClick={() => generateMonthlyReport(bookings, payments, sessions)}
                      className="btn btn-primary"
                      style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #00f5d4 0%, #00d4aa 100%)' }}
                    >
                      📈 Monthly Report
                    </button>
                  </div>
                </div>

                {/* Revenue Stats */}
                <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                  <div className="stat-card">
                    <div className="stat-icon">$</div>
                    <div className="stat-info">
                      <h3>${calculateTotalRevenue()}</h3>
                      <p>Total Revenue</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">$</div>
                    <div className="stat-info">
                      <h3>${calculatePendingRevenue()}</h3>
                      <p>Pending Revenue</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">#</div>
                    <div className="stat-info">
                      <h3>{payments.length}</h3>
                      <p>Total Payments</p>
                    </div>
                  </div>
                </div>

                {/* Payments Table */}
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Session</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredPayments().map(payment => (
                        <tr key={payment.id}>
                          <td>
                            <div>{payment.profiles?.full_name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                              {payment.profiles?.email}
                            </div>
                          </td>
                          <td>{payment.sessions?.title}</td>
                          <td>
                            <div>{new Date(payment.sessions?.date).toLocaleDateString()}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                              {formatTime(payment.sessions?.time)}
                            </div>
                          </td>
                          <td style={{ fontWeight: '600', color: '#28a745' }}>${payment.amount}</td>
                          <td>
                            <span className={`status-badge ${payment.payment_status}`}>
                              {payment.payment_status}
                            </span>
                          </td>
                          <td>
                            {payment.payment_status === 'pending' && (
                              <button
                                onClick={() => handleMarkAsPaid(payment.id)}
                                className="btn btn-sm btn-success"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                              >
                                Mark as Paid
                              </button>
                            )}
                            {payment.payment_status === 'paid' && (
                              <span style={{ color: '#28a745', fontWeight: '600' }}>✓ Paid</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {getFilteredPayments().length === 0 && (
                    <p className="empty-state">No payments found</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

