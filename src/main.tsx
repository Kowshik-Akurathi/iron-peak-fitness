import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WishlistProvider } from './contexts/WishlistContext'
import { CartProvider } from './contexts/CartContext'
import { AccountProvider } from './contexts/AccountContext'
import { AuthProvider } from './contexts/AuthContext'
import { MembershipProvider } from './contexts/MembershipContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccountProvider><AuthProvider><MembershipProvider><WishlistProvider><CartProvider><App /></CartProvider></WishlistProvider></MembershipProvider></AuthProvider></AccountProvider>
  </StrictMode>,
)
