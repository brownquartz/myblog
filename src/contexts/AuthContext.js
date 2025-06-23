import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {}
})

export const AuthProvider = ({ children }) => {
  // token is stored as a plain string, never JSON
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null
  })

  // user is JSON-stringified when we save it
  const [user, setUser] = useState(() => {
    const str = localStorage.getItem('user')
    // only parse if it's real JSON (i.e. not "undefined")
    try {
      return str ? JSON.parse(str) : null
    } catch {
      return null
    }
  })

  // whenever token changes, sync to localStorage (or remove)
  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  // whenever user changes, sync to localStorage (or remove)
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const login = ({ token: newToken, user: newUser }) => {
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;