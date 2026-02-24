import { useState, useRef, useEffect, type FormEvent } from 'react'
import { Camera, Send, X } from 'lucide-react'
import { Heading, Text, Button, Input, Container, Card, LoadingState } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { AnimateOnScroll, StaggerChildren, PageTransition } from '@/components/motion'
import { ParticipantGate } from '@/components/guards/ParticipantGate'
import * as store from '@/lib/store'
import { uploadBlessingPhoto } from '@/lib/blessings-store'
import { timeAgo } from '@/lib/date'

const MAX_MESSAGE_LENGTH = 280

function BlessingsContent() {
  const { toast } = useToast()
  const [blessings, setBlessings] = useState<store.Blessing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = store.subscribeToBlessings((data) => {
      setBlessings(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function clearPhoto() {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setUploading(true)
    try {
      let photoURL: string | undefined
      if (photoFile) {
        photoURL = await uploadBlessingPhoto(photoFile)
      }

      const saved = await store.saveBlessing({
        name: name.trim(),
        message: message.trim(),
        photoURL,
      })

      setBlessings((prev) => [saved, ...prev])
      toast('success', 'הברכה נוספה בהצלחה! 🎉')
      setName('')
      setMessage('')
      clearPhoto()
      setShowForm(false)
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בשמירה')
    } finally {
      setUploading(false)
    }
  }

  return (
    <PageTransition>
      <Container size="md" className="py-12">
        <AnimateOnScroll variant="fade-up">
          <Heading level={2} gradient className="text-center mb-4">
            קיר ברכות
          </Heading>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={0.1}>
          <Text variant="secondary" className="text-center mb-8">
            השאירו ברכה למרים ותהיו חלק מהחגיגה
          </Text>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={0.2}>
          <div className="text-center mb-10">
            {!showForm && (
              <Button variant="primary" icon={<Send className="w-4 h-4" />} onClick={() => setShowForm(true)}>
                כתבו ברכה
              </Button>
            )}
          </div>
        </AnimateOnScroll>

        {showForm && (
          <AnimateOnScroll variant="fade-up">
            <Card variant="top" hoverable={false} className="p-6 mb-10 max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="שם"
                  placeholder="השם שלך"
                  required
                  value={name}
                  onChange={(e) => setName((e.target as HTMLInputElement).value)}
                />

                <div>
                  <Input
                    label="ברכה"
                    placeholder="כתבו ברכה למרים..."
                    multiline
                    required
                    maxLength={MAX_MESSAGE_LENGTH}
                    value={message}
                    onChange={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
                  />
                  <Text variant="muted" size="xs" className="mt-1 text-left" as="span">
                    {message.length}/{MAX_MESSAGE_LENGTH}
                  </Text>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img src={photoPreview} alt="תצוגה מקדימה" className="w-20 h-20 object-cover rounded-none border border-border-neutral" />
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="absolute -top-2 -left-2 bg-red-500 rounded-full p-0.5 text-white hover:bg-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={<Camera className="w-4 h-4" />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      הוסיפו תמונה
                    </Button>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); clearPhoto() }}>
                    ביטול
                  </Button>
                  <Button type="submit" variant="primary" size="sm" icon={<Send className="w-4 h-4" />} disabled={uploading} loading={uploading}>
                    {uploading ? 'שומר...' : 'שליחה'}
                  </Button>
                </div>
              </form>
            </Card>
          </AnimateOnScroll>
        )}

        {loading ? (
          <LoadingState />
        ) : (
        <StaggerChildren staggerDelay={0.08} className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {blessings.map((b) => (
            <Card key={b.id} variant="top" hoverable={false} className="break-inside-avoid p-5">
              {b.photoURL && (
                <img src={b.photoURL} alt={`תמונה מ${b.name}`} className="w-full h-40 object-cover rounded-none mb-3" />
              )}
              <Text className="whitespace-pre-wrap mb-3">{b.message}</Text>
              <div className="flex items-center justify-between">
                <Heading level={6} className="text-white">{b.name}</Heading>
                <Text variant="muted" size="xs">{timeAgo(b.timestamp)}</Text>
              </div>
            </Card>
          ))}
        </StaggerChildren>
        )}
      </Container>
    </PageTransition>
  )
}

export function BlessingsPage() {
  return (
    <ParticipantGate>
      <BlessingsContent />
    </ParticipantGate>
  )
}
