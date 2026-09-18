import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { DemoCustomer } from '../types'
import { getDemoAccount, resetDemoAccount, saveDemoAccount } from '../services/demoAccountService'
import { AccountContext } from './AccountContextStore'

export function AccountProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<DemoCustomer>(getDemoAccount)
  const loading = false

  const updateProfile = useCallback((updates: Partial<DemoCustomer>) => {
    setCustomer((current) => {
      const next = { ...current, ...updates }
      saveDemoAccount(next)
      return next
    })
  }, [])

  const resetProfile = useCallback(() => {
    const next = resetDemoAccount()
    setCustomer(next)
    return next
  }, [])

  const value = useMemo(() => ({ customer, exists: Boolean(customer.id), loading, updateProfile, resetProfile }), [customer, loading, updateProfile, resetProfile])
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}
