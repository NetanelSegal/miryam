import { useState, useEffect } from 'react'
import { Outlet } from 'react-router'
import { Home } from 'lucide-react'
import { Navbar } from './Navbar'
import { Orbs } from '../ui/Orbs'
import { Heading, Text, Button, Container, LoadingState } from '@/components/ui'
import { subscribeToSettings } from '@/lib/settings-store'

export function PartyLayout() {
  const [partyOpen, setPartyOpen] = useState<boolean | null>(null)

  useEffect(() => {
    return subscribeToSettings((s) => setPartyOpen(s.partyOpen))
  }, [])

  if (partyOpen === null) {
    return <LoadingState className="min-h-screen items-center justify-center" />
  }

  if (!partyOpen) {
    return (
      <div className="min-h-screen relative flex flex-col">
        <Navbar showBackHome />
        <main className="pt-[65px] flex-1 flex items-center justify-center">
          <Container size="sm" className="py-12 text-center">
            <Heading level={2} className="text-white mb-4">
              המתחם סגור כרגע
            </Heading>
            <Text variant="secondary" className="mb-8">
              מתחם המסיבה אינו זמין כעת. נסו שוב מאוחר יותר.
            </Text>
            <Button variant="primary" href="/" icon={<Home className="w-4 h-4" />}>
              חזרה לבית
            </Button>
          </Container>
        </main>
        <Orbs variant="party" />
      </div>
    )
  }

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
