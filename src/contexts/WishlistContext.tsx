import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { products } from '../data/siteData'

const STORAGE_KEY = 'iron-peak-wishlist'
type WishlistContextValue = { wishlist: string[]; count: number; isSaved: (productId: string) => boolean; toggleWishlist: (productId: string) => void; removeFromWishlist: (productId: string) => void; clearWishlist: () => void }
const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

function readWishlist() {
  if (typeof window === 'undefined') return []
  try { const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]'); if (!Array.isArray(parsed)) return []; return parsed.filter((id): id is string => typeof id === 'string' && products.some((product) => product.id === id)) } catch { return [] }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>(readWishlist)
  useEffect(() => { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist)) } catch { /* localStorage can be unavailable in privacy-restricted browsers */ } }, [wishlist])
  const value = useMemo<WishlistContextValue>(() => ({ wishlist, count: wishlist.length, isSaved: (productId) => wishlist.includes(productId), toggleWishlist: (productId) => setWishlist((current) => current.includes(productId) ? current.filter((id) => id !== productId) : products.some((product) => product.id === productId) ? [...current, productId] : current), removeFromWishlist: (productId) => setWishlist((current) => current.filter((id) => id !== productId)), clearWishlist: () => setWishlist([]) }), [wishlist])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export { WishlistContext }
