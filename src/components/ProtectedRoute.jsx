import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading, isAdmin } = useAuth()

  // Debug logging
  console.log('ProtectedRoute - adminOnly:', adminOnly)
  console.log('ProtectedRoute - isAdmin:', isAdmin)
  console.log('ProtectedRoute - profile:', profile)
  console.log('ProtectedRoute - profile.is_admin:', profile?.is_admin)

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    console.log('BLOCKED: Admin required but isAdmin is false')
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute

