import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Landing from './components/Landing'
import Home from './components/Home'
import Dashboard from './components/admin/Dashboard';
import AddMatches from './components/admin/AddMatches';
import ScoreMatches from './components/admin/ScoreMatches';
import ScoreTournaments from './components/admin/ScoreTournaments';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/admin",
    element: <Dashboard />,
  },
  {
    path: "/admin/addMatches",
    element: <AddMatches />,
  },
  {
    path: "/admin/match/score",
    element: <ScoreMatches />,
  },
  {
    path: "/admin/tournament/score",
    element: <ScoreTournaments />,
  },
])

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
