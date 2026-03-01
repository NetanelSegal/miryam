import { useState, useEffect } from 'react'
import { Camera, Send, X } from 'lucide-react'
import { Heading, Text, Button, Input, Container, Card, LoadingState } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { AnimateOnScroll, StaggerChildren, PageTransition } from '@/components/motion'
import { BlessingShareModal } from '@/components/party/BlessingShareModal'
import * as store from '@/lib/store'
import { timeAgo } from '@/lib/date'
import { useBlessingForm } from '@/hooks/forms/useBlessingForm'

export function BlessingsContent() {
  const { toast } = useToast()
  const [blessings, setBlessings] = useState<store.Blessing[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [lastSavedBlessing, setLastSavedBlessing] = useState<store.Blessing | null>(null)

  useEffect(() => {
    const unsub = store.subscribeToBlessings((data) => {
      setBlessings(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const blessingsUrl = `${window.location.origin}/party/blessings`

  const {
    register,
    watch,
    handleSubmit,
    errors,
    isSubmitting,
    fileInputRef,
    preview: photoPreview,
    handleFileChange,
    clearFile,
    MAX_MESSAGE_LENGTH,
  } = useBlessingForm({
    onSuccess: async (saved) => {
      const refreshed = await store.getAllBlessings()
      setBlessings(refreshed)
      setLastSavedBlessing(saved)
      setShareModalOpen(true)
      toast('success', 'הברכה נוספה בהצלחה! 🎉')
      setShowForm(false)
    },
    onError: (msg) => toast('error', msg),
    onReset: () => setShowForm(false),
  })

  const message = watch('message', '')

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
                  {...register('name')}
                  error={errors.name?.message}
                />

                <div>
                  <Input
                    label="ברכה"
                    placeholder="כתבו ברכה למרים..."
                    multiline
                    maxLength={MAX_MESSAGE_LENGTH}
                    {...register('message')}
                    error={errors.message?.message}
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
                    onChange={handleFileChange}
                  />
                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img src={photoPreview} alt="תצוגה מקדימה" className="w-20 h-20 object-cover rounded-none border border-border-neutral" />
                      <button
                        type="button"
                        onClick={clearFile}
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
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); clearFile() }}>
                    ביטול
                  </Button>
                  <Button type="submit" variant="primary" size="sm" icon={<Send className="w-4 h-4" />} disabled={isSubmitting} loading={isSubmitting}>
                    {isSubmitting ? 'שומר...' : 'שליחה'}
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
        {lastSavedBlessing && (
          <BlessingShareModal
            open={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            blessing={lastSavedBlessing}
            blessingsUrl={blessingsUrl}
          />
        )}
      </Container>
    </PageTransition>
  )
}
