import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Dashboard from "./Pages/Dashboard";
import KnowYourEnv from "./Pages/KnowYourEnv";
import LeaderBoard from "./Pages/LeaderBoard";
import Profile from "./Pages/Profile";
import AQI from "./Pages/AQI";
import Water from "./Pages/Water";
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import Form from "./Pages/Form"
import Noise from "./Pages/Noise";
import Forest from "./Pages/ForestCover";
import ParticleBackground from './Components/ParticleBackground';
import Notifications from "./Pages/notification";
import PrivateRoute from "./store/privateRoute.js";

const App = () => {
  return (
    <>
      <ParticleBackground />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<PrivateRoute><Homepage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><LeaderBoard /></PrivateRoute>} />
        <Route path="/knowyourenv" element={<PrivateRoute><KnowYourEnv /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/aqi" element={<PrivateRoute><AQI /></PrivateRoute>} />
        <Route path="/water" element={<PrivateRoute><Water /></PrivateRoute>} />
        <Route path="/form" element={<PrivateRoute><Form /></PrivateRoute>} />
        <Route path="/noise" element={<PrivateRoute><Noise /></PrivateRoute>} />
        <Route path="/forest" element={<PrivateRoute><Forest /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default App