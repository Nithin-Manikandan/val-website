/**
 * Utility functions for exporting data to CSV
 */

/**
 * Convert array of objects to CSV string
 */
const arrayToCSV = (data, headers) => {
  if (!data || data.length === 0) return ''
  
  const csvRows = []
  
  // Add header row
  csvRows.push(headers.join(','))
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]
      // Escape quotes and wrap in quotes if contains comma
      const escaped = ('' + value).replace(/"/g, '""')
      return `"${escaped}"`
    })
    csvRows.push(values.join(','))
  }
  
  return csvRows.join('\n')
}

/**
 * Download CSV file
 */
const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export bookings to CSV
 */
export const exportBookingsToCSV = (bookings) => {
  const data = bookings.map(booking => ({
    'User Name': booking.profiles?.full_name || 'N/A',
    'User Email': booking.profiles?.email || 'N/A',
    'Session Title': booking.sessions?.title || 'N/A',
    'Session Date': booking.sessions?.date ? new Date(booking.sessions.date).toLocaleDateString() : 'N/A',
    'Session Time': booking.sessions?.time || 'N/A',
    'Session Type': booking.sessions?.type || 'N/A',
    'Attendance Status': booking.attendance_status || 'N/A',
    'Notes': booking.notes || '',
    'Booked At': booking.created_at ? new Date(booking.created_at).toLocaleString() : 'N/A'
  }))
  
  const headers = [
    'User Name',
    'User Email',
    'Session Title',
    'Session Date',
    'Session Time',
    'Session Type',
    'Attendance Status',
    'Notes',
    'Booked At'
  ]
  
  const csv = arrayToCSV(data, headers)
  const filename = `bookings_${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

/**
 * Export payments to CSV
 */
export const exportPaymentsToCSV = (payments) => {
  const data = payments.map(payment => ({
    'User Name': payment.profiles?.full_name || 'N/A',
    'User Email': payment.profiles?.email || 'N/A',
    'Session Title': payment.sessions?.title || 'N/A',
    'Session Date': payment.sessions?.date ? new Date(payment.sessions.date).toLocaleDateString() : 'N/A',
    'Amount': `$${payment.amount || 0}`,
    'Payment Status': payment.payment_status || 'N/A',
    'Created At': payment.created_at ? new Date(payment.created_at).toLocaleString() : 'N/A'
  }))
  
  const headers = [
    'User Name',
    'User Email',
    'Session Title',
    'Session Date',
    'Amount',
    'Payment Status',
    'Created At'
  ]
  
  const csv = arrayToCSV(data, headers)
  const filename = `payments_${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

/**
 * Generate monthly report
 */
export const generateMonthlyReport = (bookings, payments, sessions) => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  // Filter data for current month
  const monthlyBookings = bookings.filter(b => {
    const bookingDate = new Date(b.sessions?.date)
    return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
  })
  
  const monthlyPayments = payments.filter(p => {
    const paymentDate = new Date(p.sessions?.date)
    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
  })
  
  // Calculate statistics
  const totalBookings = monthlyBookings.length
  const attendedSessions = monthlyBookings.filter(b => b.attendance_status === 'attended').length
  const cancelledSessions = monthlyBookings.filter(b => b.attendance_status === 'cancelled').length
  const noShowSessions = monthlyBookings.filter(b => b.attendance_status === 'no-show').length
  const attendanceRate = totalBookings > 0 ? ((attendedSessions / totalBookings) * 100).toFixed(1) : 0
  
  const totalRevenue = monthlyPayments.filter(p => p.payment_status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const pendingRevenue = monthlyPayments.filter(p => p.payment_status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  
  const reportData = [
    { 'Metric': 'Total Bookings', 'Value': totalBookings },
    { 'Metric': 'Attended Sessions', 'Value': attendedSessions },
    { 'Metric': 'Cancelled Sessions', 'Value': cancelledSessions },
    { 'Metric': 'No-Show Sessions', 'Value': noShowSessions },
    { 'Metric': 'Attendance Rate', 'Value': `${attendanceRate}%` },
    { 'Metric': 'Total Revenue (Paid)', 'Value': `$${totalRevenue}` },
    { 'Metric': 'Pending Revenue', 'Value': `$${pendingRevenue}` },
    { 'Metric': 'Total Revenue', 'Value': `$${totalRevenue + pendingRevenue}` }
  ]
  
  const csv = arrayToCSV(reportData, ['Metric', 'Value'])
  const monthName = now.toLocaleString('default', { month: 'long' })
  const filename = `monthly_report_${monthName}_${currentYear}.csv`
  downloadCSV(csv, filename)
}

