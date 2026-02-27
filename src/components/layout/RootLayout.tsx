import { Outlet } from 'react-router'
import { Navbar } from './Navbar'
import { Orbs } from '../ui/Orbs'

export function RootLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Orbs variant="general" />
    </div>
  )
}
