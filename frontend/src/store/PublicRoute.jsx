import { Navigate } from "react-router-dom"
import useAuthUser from "../store/useAuthStore"

const PublicRoute = ({ children }) => {
  const { authUser, isLoading } = useAuthUser()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a06]">
        <div className="w-8 h-8 border-2 border-white/10 border-t-green-500 rounded-full animate-spin" />
      </div>
    )
  }

  // If already logged in, redirect to homepage
  return authUser ? <Navigate to="/" replace /> : children
}

export default PublicRoute