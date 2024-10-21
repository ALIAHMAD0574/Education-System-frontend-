'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'

export default function Component() {
  const [view, setView] = useState('login')
  const [message, setMessage] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    phone_number: '',
    education: '',
    password: '',
    confirmPassword: '',
    newPassword: '',
  })

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  useEffect(() => {
    const isLoginParam = searchParams.get('login')
    if (pathname === '/register') {
      setView(isLoginParam === 'true' ? 'login' : 'signup')
    }
  }, [pathname, searchParams])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const toggleView = (newView) => {
    setView(newView)
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      address: '',
      phone_number: '',
      education: '',
      password: '',
      confirmPassword: '',
      newPassword: '',
    })
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let endpoint = 'http://127.0.0.1:8000/accounts/'
    let payload = {}

    switch (view) {
      case 'login':
        endpoint += 'login'
        payload = { email: formData.email, password: formData.password }
        break
      case 'signup':
        endpoint += 'signup'
        if (formData.password !== formData.confirmPassword) {
          toast.error('Password and Confirm Password do not match')
          return
        }
        payload = formData
        break
      case 'forgot':
        endpoint += 'forgot'
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('New Password and Confirm Password do not match')
          return
        }
        payload = {
          email: formData.email,
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword,
        }
        break
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Success')

        if (view === 'login' && data.access_token) {
          Cookies.set('token', data.access_token, { expires: 7 })
          const event = new CustomEvent('login')
          window.dispatchEvent(event)
          router.push('/dashboard')
        } else if (view === 'signup') {
          toggleView('login')
          toast.success("Sign-up successful! Please log in to access your dashboard.")
        } else if (view === 'forgot') {
          toggleView('login')
          toast.success("Password reset successful! Please log in with your new password.")
        }
      } else {
        toast.error(data.detail || 'An error occurred')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-emerald-100 p-4">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl h-[500px] overflow-hidden relative">
        <motion.div
          initial={false}
          animate={{ x: view === 'login' ? 0 : '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute w-1/2 h-full bg-emerald-500 p-8 text-white flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <div>
            <h1 className="mb-4 text-5xl font-extrabold">Quiz Pro</h1>
            <p className="text-xl font-light">Master the Quiz, Unleash Your Mind Knowledge Awaits, Adventure You'll Find!</p>
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ x: view === 'login' ? 0 : '-100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute right-0 w-1/2 h-full bg-white p-8 flex flex-col items-center justify-center"
        >
          <h2 className="mb-4 text-3xl font-semibold text-gray-800">
            {view === 'login' ? 'Login' : view === 'signup' ? 'Sign Up' : 'Forgot Password'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-2 w-full overflow-y-auto max-h-[350px] pr-4">
            {view === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="First Name"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Last Name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                <InputField
                  label="Address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <InputField
                  label="Phone Number"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
                <InputField
                  label="Education"
                  id="education"
                  value={formData.education}
                  onChange={handleChange}
                />
              </>
            )}
            <InputField
              label="Email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
            {view !== 'forgot' && (
              <InputField
                label="Password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
              />
            )}
            {(view === 'signup' || view === 'forgot') && (
              <>
                <InputField
                  label={view === 'forgot' ? "New Password" : "Confirm Password"}
                  id={view === 'forgot' ? "newPassword" : "confirmPassword"}
                  value={view === 'forgot' ? formData.newPassword : formData.confirmPassword}
                  onChange={handleChange}
                  type="password"
                />
                {/* <InputField
                  label="Confirm Password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type="password"
                /> */}
              </>
            )}
            <motion.button
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 w-full rounded-md bg-yellow-400 px-4 py-2 font-semibold text-gray-800 shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
              type="submit"
            >
              {view === 'login' ? 'LOGIN' : view === 'signup' ? 'SIGN UP' : 'RESET PASSWORD'}
            </motion.button>
          </form>

          {view === 'login' && (
            <button
              onClick={() => toggleView('forgot')}
              className="mt-2 text-sm text-emerald-600 hover:text-emerald-500"
            >
              Forgot Password?
            </button>
          )}

          {message && <p className="mt-2 text-center text-red-500">{message}</p>}

          <div className="mt-2 text-center text-sm text-gray-600">
            {view === 'login' ? (
              <>
                Don't have an account?
                <button
                  className="ml-1 font-medium text-emerald-600 hover:text-emerald-500"
                  onClick={() => toggleView('signup')}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?
                <button
                  className="ml-1 font-medium text-emerald-600 hover:text-emerald-500"
                  onClick={() => toggleView('login')}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const InputField = ({ label, id, value, onChange, type = 'text' }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 text-gray-800"
      required
    />
  </div>
)