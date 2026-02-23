import { Outlet } from 'react-router'
import { Navbar } from './Navbar'
import { Orbs } from '../ui/Orbs'

export function PartyLayout() {
  return (
    <div className="min-h-screen relative">
      <Navbar showBackHome />
      <main className="pt-[65px]">
        <Outlet />
      </main>
      <Orbs variant="party" />
    </div>
  )
}
