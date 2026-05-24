import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { LiaAddressCard } from "react-icons/lia";
import { loginuser } from '../store/authslice'  // 👈 import resetStatus
 import { resetStatus } from '../store/authslice'  // 👈 import resetStatus
const Loginpage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, status } = useSelector((state) => state.auth)
  const [userdata, setuserdata] = useState({
    email: "",
    password: ""
  })

  const handlechange = (e) => {
    const { name, value } = e.target
    setuserdata({
      ...userdata, [name]: value
    })
  }

  const handlesubmit = (e) => {
    e.preventDefault()
    if(status==="loading") return; // 👈 prevent multiple submits
     dispatch(resetStatus()) // 👈 clear stale status before dispatching
    dispatch(loginuser(userdata))
  }

useEffect(() => {
  if (status === "succeeded") {
    localStorage.setItem("token", token)
    dispatch(resetStatus()) // 👈 reset BEFORE navigate
    navigate("/")
  }
  if (status === "failed") {
    alert("something went wrong, please try again later")
  
  }
}, [status])  // 👈 only status, no dispatch/navigate in deps

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <LiaAddressCard className="mx-auto h-14 w-auto mt-15" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6" onSubmit={handlesubmit} autoComplete="off">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="off"
                onChange={handlechange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <NavLink to="/forgotpassword" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </NavLink>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="off"
                onChange={handlechange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </div>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--muted)', fontSize: '14px' }}>
          No account? <Link to="/register" style={{ color: 'var(--accent)' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Loginpage