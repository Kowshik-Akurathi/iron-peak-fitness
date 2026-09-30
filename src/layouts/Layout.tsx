import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { AIChatPreview } from '../components/assistant/AIChatPreview'
import { Navbar } from '../components/Navbar'

export function Layout() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AIChatPreview />
    </div>
  )
}
