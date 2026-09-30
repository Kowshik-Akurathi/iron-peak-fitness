import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { DemoCustomer } from '../types'
import { isCustomerProfileApiEnabled, loadAccount, readAccount, resetAccount, saveAccount } from '../services/accountService'
import { AccountContext } from './AccountContextStore'

export function AccountProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<DemoCustomer>(readAccount)
  const [loading, setLoading] = useState(isCustomerProfileApiEnabled)

  useEffect(() => {
    if (!isCustomerProfileApiEnabled) return
    let active = true
    void loadAccount().then((account) => { if (active && account) setCustomer(account) }).catch(() => undefined).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const updateProfile = useCallback((updates: Partial<DemoCustomer>) => {
    setCustomer((current) => {
      const next = { ...current, ...updates }
      saveAccount(next, updates)
      return next
    })
  }, [])

  const resetProfile = useCallback(() => {
    const next = resetAccount()
    setCustomer(next)
    return next
  }, [])

  const value = useMemo(() => ({ customer, exists: Boolean(customer.id), loading, updateProfile, resetProfile }), [customer, loading, updateProfile, resetProfile])
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}
