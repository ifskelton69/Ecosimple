import axios from 'axios'

const URL = 'http://localhost:5000/api'

// ─── AQI ──────────────────────────────────────────────
const getAQI = async (lat = 19.076, lon = 72.877) => {
  return await axios.get(`${URL}/aqi`, {
    params: { lat, lon }
  })
}

const getAQIForMultipleCities = async (cities) => {
  try {
    const promises = cities.map(city =>
      getAQI(city.lat, city.lon)
        .then(response => ({
          ...city,
          aqiData: response.data.data,
          recommendations: response.data.recommendations,
          success: true
        }))
        .catch(error => ({
          ...city,
          success: false,
          error: error.message
        }))
    )
    return await Promise.all(promises)
  } catch (error) {
    console.error('Error fetching multiple AQI data:', error)
    throw error
  }
}

// ─── HELPERS ──────────────────────────────────────────
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || error.message || 'Something went wrong')
  }
  return response.json()
}

// ─── AUTH ─────────────────────────────────────────────
export const loginUser = async (email, password) => {
  const response = await fetch(`${URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await handleResponse(response)
  if (data.token) localStorage.setItem('token', data.token)
  return data
}

export const registerUser = async (name, email, password) => {
  const response = await fetch(`${URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await handleResponse(response)
  if (data.token) localStorage.setItem('token', data.token)
  return data
}

export const logoutUser = () => {
  localStorage.removeItem('token')
}

// ─── TICKETS ──────────────────────────────────────────
export const submitTicket = async (source, destination) => {
  const response = await fetch(`${URL}/submit_ticket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ source, destination }),
  })
  return handleResponse(response)
}

// ─── LEADERBOARD ──────────────────────────────────────
export const fetchLeaderboard = async () => {
  const response = await fetch(`${URL}/leaderboard`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(response)
}

export { getAQI, getAQIForMultipleCities }