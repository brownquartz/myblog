import { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api'        // your axios instance
import { useNavigate } from 'react-router-dom';
import './Login.css' // your styles

export default function Login() {
  const { login } = useContext(AuthContext)
  const Navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: ''})

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const { data } = await api.post('/login', form)
      login({ token: data.token, user: data.user })
      Navigate('/posts') // or wherever you want to redirect after login
      // redirect or show success…
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>ログイン</h2>
      <div className="form-group">
        <label>
            Email
            <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            />
        </label>
      </div>
      <div className="form-group">
        <label>
            Password
            <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            />
        </label>
      </div>
      <button type="submit">ログイン</button>
    </form>
  )
}
