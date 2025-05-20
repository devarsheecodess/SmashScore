import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Landing from './components/Landing'
import Home from './components/Home'

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
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
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
