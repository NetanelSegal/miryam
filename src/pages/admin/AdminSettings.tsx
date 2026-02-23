import { useState, useEffect, useCallback } from 'react'
import { Settings, Loader2, Vote, PartyPopper } from 'lucide-react'
import { Heading, Text, Button, Card, useToast } from '@/components/ui'
import * as settingsStore from '@/lib/settings-store'

export function AdminSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<settingsStore.EventSettings | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    return settingsStore.subscribeToSettings(setSettings)
  }, [])

  const handleToggle = useCallback(
    async (field: 'votingOpen' | 'partyOpen', value: boolean) => {
      if (!settings) return
      setUpdating(field)
      try {
        await settingsStore.updateSettings({ [field]: value })
        toast('success', value ? 'נפתח' : 'נסגר')
      } catch (err) {
        toast('error', err instanceof Error ? err.message : 'שגיאה בעדכון')
      } finally {
        setUpdating(null)
      }
    },
    [settings, toast]
  )

  if (settings === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent-violet" />
      </div>
    )
  }

  return (
    <>
      <Heading level={4} className="text-white mb-6">
        <Settings className="w-5 h-5 inline-block ml-2 align-middle" />
        הגדרות אירוע
      </Heading>

      <div className="space-y-4">
        <Card variant="accent" className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Vote className="w-5 h-5 text-accent-violet shrink-0" />
              <div>
                <Text className="font-medium">הצבעות</Text>
                <Text variant="muted" size="sm">
                  {settings.votingOpen ? 'ההצבעות פתוחות — משתתפים יכולים להצביע' : 'ההצבעות סגורות — יוצגו תוצאות בלבד'}
                </Text>
              </div>
            </div>
            <Button
              variant={settings.votingOpen ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleToggle('votingOpen', !settings.votingOpen)}
              disabled={updating === 'votingOpen'}
              icon={updating === 'votingOpen' ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {settings.votingOpen ? 'פתוח' : 'סגור'}
            </Button>
          </div>
        </Card>

        <Card variant="accent" className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PartyPopper className="w-5 h-5 text-accent-violet shrink-0" />
              <div>
                <Text className="font-medium">מתחם המסיבה</Text>
                <Text variant="muted" size="sm">
                  {settings.partyOpen ? 'המתחם פתוח' : 'המתחם סגור — גישה חסומה'}
                </Text>
              </div>
            </div>
            <Button
              variant={settings.partyOpen ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleToggle('partyOpen', !settings.partyOpen)}
              disabled={updating === 'partyOpen'}
              icon={updating === 'partyOpen' ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {settings.partyOpen ? 'פתוח' : 'סגור'}
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
