import { supabase } from '../config/supabaseClient'

/**
 * Create a notification in the database
 * This can be extended to send actual emails via SendGrid, Supabase Edge Functions, etc.
 */
export const createNotification = async ({ userId, type, title, message, bookingId = null, sessionId = null }) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type,
        title,
        message,
        related_booking_id: bookingId,
        related_session_id: sessionId,
        is_read: false,
        email_sent: false // Set to true when you implement actual email sending
      }])
      .select()
      .single()

    if (error) throw error
    
    // TODO: Send actual email here
    // await sendEmail({ to: userEmail, subject: title, body: message })
    
    return { success: true, data }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error }
  }
}

/**
 * Send booking confirmation notification
 */
export const sendBookingConfirmation = async ({ userId, userName, sessionTitle, sessionDate, sessionTime }) => {
  return await createNotification({
    userId,
    type: 'booking_confirmation',
    title: 'Booking Confirmed!',
    message: `Hi ${userName}, your booking for "${sessionTitle}" on ${sessionDate} at ${sessionTime} has been confirmed. We look forward to seeing you!`
  })
}

/**
 * Send 24-hour reminder notification
 */
export const send24HourReminder = async ({ userId, userName, sessionTitle, sessionDate, sessionTime }) => {
  return await createNotification({
    userId,
    type: 'reminder',
    title: 'Session Reminder - Tomorrow!',
    message: `Hi ${userName}, this is a reminder that you have "${sessionTitle}" tomorrow (${sessionDate}) at ${sessionTime}. See you there!`
  })
}

/**
 * Send cancellation notification
 */
export const sendCancellationNotification = async ({ userId, userName, sessionTitle, sessionDate, reason = 'user request' }) => {
  return await createNotification({
    userId,
    type: 'cancellation',
    title: 'Booking Cancelled',
    message: `Hi ${userName}, your booking for "${sessionTitle}" on ${sessionDate} has been cancelled (${reason}). If you have any questions, please contact us.`
  })
}

/**
 * Send attendance update notification
 */
export const sendAttendanceUpdate = async ({ userId, userName, sessionTitle, sessionDate, status }) => {
  const statusMessages = {
    attended: 'Thank you for attending! We hope you found it valuable.',
    absent: 'We noticed you were unable to attend. Please let us know if you need to reschedule.',
    cancelled: 'Your session was marked as cancelled.'
  }
  
  return await createNotification({
    userId,
    type: 'attendance_update',
    title: `Attendance Updated - ${status}`,
    message: `Hi ${userName}, your attendance for "${sessionTitle}" on ${sessionDate} has been marked as "${status}". ${statusMessages[status] || ''}`
  })
}

/**
 * Send admin alert for new booking
 */
export const sendAdminAlert = async ({ adminId, userName, sessionTitle, sessionDate }) => {
  return await createNotification({
    userId: adminId,
    type: 'admin_alert',
    title: 'New Booking Received',
    message: `${userName} has booked "${sessionTitle}" on ${sessionDate}.`
  })
}

/**
 * Get user's unread notifications
 */
export const getUnreadNotifications = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { success: false, error }
  }
}

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error }
  }
}

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return { success: false, error }
  }
}

