import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useAccount } from './useAccount'
import { AuthContext } from './AuthContextStore'
import { clearDemoAuth, createDemoAuthUser, DEMO_LOGIN_EMAIL, getDemoAuth, isDemoCredentialMatch, saveDemoAuth } from '../services/demoAuthService'
import type { AuthResult, AuthUser, LoginCredentials, SignupData } from '../types'

function profileForDemoLogin(user: AuthUser) {
  if (user.email !== DEMO_LOGIN_EMAIL) return {}
  return { id: user.userId, firstName: 'Alex', lastName: 'Morgan', email: user.email }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { customer, updateProfile } = useAccount()
  const [user, setUser] = useState<AuthUser | null>(getDemoAuth)

  const login = useCallback((credentials: LoginCredentials): AuthResult => {
    const email = credentials.email.trim().toLowerCase()
    if (!email) return { success: false, error: 'Please enter your email.' }
    if (!credentials.password) return { success: false, error: 'Please enter your password.' }
    if (!isDemoCredentialMatch(email, credentials.password)) return { success: false, error: 'Incorrect email or password.' }
    const nextUser = createDemoAuthUser(email)
    saveDemoAuth(nextUser, credentials.rememberSession)
    updateProfile(profileForDemoLogin(nextUser))
    setUser(nextUser)
    return { success: true }
  }, [updateProfile])

  const signup = useCallback((data: SignupData): AuthResult => {
    const email = data.email.trim().toLowerCase()
    if (!data.firstName.trim() || !data.lastName.trim() || !email || !data.mobile.trim()) return { success: false, error: 'Please complete all required fields.' }
    if (email === customer.email.trim().toLowerCase() || email === DEMO_LOGIN_EMAIL) return { success: false, error: 'Email already registered.' }
    const nextUser = createDemoAuthUser(email)
    saveDemoAuth(nextUser)
    updateProfile({ id: nextUser.userId, firstName: data.firstName.trim(), lastName: data.lastName.trim(), email, phone: data.mobile.trim(), memberSince: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) })
    setUser(nextUser)
    return { success: true }
  }, [customer.email, updateProfile])

  const logout = useCallback(() => { clearDemoAuth(); setUser(null) }, [])
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), isLoading: false, isDemoUser: true, login, signup, logout }), [user, login, signup, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
