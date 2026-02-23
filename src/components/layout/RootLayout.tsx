import { Outlet } from 'react-router'
import { Navbar } from './Navbar'
import { Orbs } from '../ui/Orbs'

export function RootLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Orbs variant="general" />
    </div>
  )
}
