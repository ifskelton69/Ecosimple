import { Navigate } from "react-router-dom"
import useAuthUser from "../store/useAuthStore"

const PrivateRoute = ({ children }) => {
  const { authUser, isLoading } = useAuthUser()

  // Still fetching — don't redirect yet
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a06]">
        <div className="w-8 h-8 border-2 border-white/10 border-t-green-500 rounded-full animate-spin" />
      </div>
    )
  }

  // No user after load — redirect to login
  return authUser ? children : <Navigate to="/login" replace />
}

export default PrivateRoute