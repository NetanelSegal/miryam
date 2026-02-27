import { useState, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import { Check, Upload, Camera, Clock, X as XIcon, Trophy, Lock } from 'lucide-react'
import { Heading, Text, Button, Input, Container, Card, Badge, EmptyState, VoteBar, LoadingState } from '@/components/ui'
import { AnimateOnScroll, StaggerChildren } from '@/components/motion'
import { useToast } from '@/components/ui/Toast'
import { confetti } from '@/lib/confetti'
import { useRequiredParticipant, useFileUpload } from '@/hooks'
import { ParticipantGate } from '@/components/guards/ParticipantGate'
import * as store from '@/lib/store'
import { subscribeToSettings } from '@/lib/settings-store'

function VotingClosedView() {
  const participant = useRequiredParticipant()
  const { id: pid } = participant
  const [approvedCostumes, setApprovedCostumes] = useState<store.CostumeEntry[]>([])
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({})
  const [existingVote, setExistingVote] = useState<store.VoteRecord | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      store.getApprovedCostumes(),
      store.getVoteCounts(),
      store.getVote(pid),
    ]).then(([costumes, counts, vote]) => {
      setApprovedCostumes(costumes)
      setVoteCounts(counts)
      setExistingVote(vote)
    }).finally(() => setLoading(false))
  }, [pid])

  const votedFor = existingVote?.candidateId ?? null
  const maxVotes = Math.max(...Object.values(voteCounts), 1)

  if (loading) {
    return (
      <Container size="md" className="py-12 flex justify-center">
        <LoadingState />
      </Container>
    )
  }

  return (
    <Container size="md" className="py-8 md:py-12">
      <AnimateOnScroll variant="fade-up" className="text-center mb-8 md:mb-10">
        <Heading level={1} gradient>תחרות התחפושות</Heading>
      </AnimateOnScroll>

      <AnimateOnScroll variant="fade-up" delay={0.1}>
        <Card variant="accent" className="p-6 mb-10 max-w-lg mx-auto text-center">
          <Lock className="w-12 h-12 text-accent-violet mx-auto mb-3" />
          <Heading level={4} className="text-white mb-2">ההצבעות נסגרו</Heading>
          <Text variant="secondary" size="sm">
            ההצבעות הסתיימו. הנה התוצאות הסופיות
          </Text>
        </Card>
      </AnimateOnScroll>

      <div className="mt-8">
        {approvedCostumes.length === 0 ? (
          <EmptyState icon={Trophy} message="לא היו תחפושות בהצבעה" />
        ) : (
          <AnimateOnScroll variant="fade-up">
            <div className="space-y-4">
              {approvedCostumes
                .map((c) => ({ ...c, votes: voteCounts[c.id] ?? 0 }))
                .sort((a, b) => b.votes - a.votes)
                .map((costume) => (
                  <div key={costume.id} className="flex items-center gap-3 md:gap-4">
                    <img
                      src={store.getCostumeImageUrl(costume)}
                      alt={costume.title}
                      className="w-10 h-10 md:w-12 md:h-12 object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Text size="sm" className="font-semibold">
                          {costume.title}
                        </Text>
                        <Text variant="muted" size="xs">
                          ({costume.participantName})
                        </Text>
                        {votedFor === costume.id && (
                          <Badge variant="success" className="gap-1">
                            <Check className="w-3 h-3" /> הבחירה שלך
                          </Badge>
                        )}
                      </div>
                      <VoteBar votes={costume.votes} maxVotes={maxVotes} size="sm" />
                    </div>
                  </div>
                ))}
            </div>
          </AnimateOnScroll>
        )}
      </div>
    </Container>
  )
}

function VotingGame() {
  const participant = useRequiredParticipant()
  const { toast } = useToast()
  const { id: pid, name: pname } = participant
  const { fileInputRef, preview, selectedFile, handleFileChange, clearFile } = useFileUpload()

  const [myCostume, setMyCostume] = useState<store.CostumeEntry | undefined>(undefined)
  const [approvedCostumes, setApprovedCostumes] = useState<store.CostumeEntry[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [votedFor, setVotedFor] = useState<string | null>(null)
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({})
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      store.getCostumeByParticipant(pid),
      store.getApprovedCostumes(),
      store.getVote(pid),
      store.getVoteCounts(),
    ]).then(([costume, costumes, vote, counts]) => {
      setMyCostume(costume)
      setApprovedCostumes(costumes)
      setHasVoted(!!vote)
      setVotedFor(vote?.candidateId ?? null)
      setVoteCounts(counts)
    }).finally(() => setDataLoading(false))
  }, [pid])

  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !title.trim()) return
    setUploading(true)

    try {
      const imageUrl = await store.uploadCostumeImage(selectedFile)
      const entry = await store.submitCostume({
        participantId: pid,
        participantName: pname,
        title: title.trim(),
        imageUrl,
      })
      setMyCostume(entry)
      toast('success', 'התחפושת הועלתה! ממתינה לאישור 🎭')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בהעלאה')
    } finally {
      setUploading(false)
    }
  }, [selectedFile, title, pid, pname, toast])

  const handleVote = useCallback(async (costumeId: string) => {
    if (hasVoted) return
    const costume = approvedCostumes.find(c => c.id === costumeId)
    if (costume?.participantId === pid) {
      toast('info', 'אי אפשר להצביע לעצמך 😄')
      return
    }

    await store.castVote({ participantId: pid, participantName: pname, candidateId: costumeId })
    const counts = await store.getVoteCounts()
    setHasVoted(true)
    setVotedFor(costumeId)
    setVoteCounts(counts)
    confetti()
    toast('success', 'ההצבעה נרשמה! תודה 🎉')
  }, [hasVoted, pid, pname, approvedCostumes, toast])

  const refreshCostumes = useCallback(async () => {
    const [costumes, counts, costume] = await Promise.all([
      store.getApprovedCostumes(),
      store.getVoteCounts(),
      store.getCostumeByParticipant(pid),
    ])
    setApprovedCostumes(costumes)
    setVoteCounts(counts)
    if (costume) setMyCostume(costume)
  }, [pid])

  const maxVotes = Math.max(...Object.values(voteCounts), 1)

  const statusBadge = myCostume ? {
    pending: { variant: 'default' as const, text: 'ממתינה לאישור', icon: Clock },
    approved: { variant: 'success' as const, text: 'מאושרת!', icon: Check },
    rejected: { variant: 'error' as const, text: 'נדחתה', icon: XIcon },
  }[myCostume.status] : null

  if (dataLoading) {
    return (
      <Container size="md" className="py-12 flex justify-center">
        <LoadingState />
      </Container>
    )
  }

  return (
    <Container size="md" className="py-8 md:py-12">
      <AnimateOnScroll variant="fade-up" className="text-center mb-8 md:mb-10">
        <Heading level={1} gradient>תחרות התחפושות</Heading>
      </AnimateOnScroll>

      {!myCostume ? (
        <AnimateOnScroll variant="fade-up" delay={0.1}>
          <Card variant="accent" className="p-6 md:p-8 mb-10 max-w-lg mx-auto">
            <Heading level={4} className="text-white mb-2 text-center">העלו את התחפושת שלכם</Heading>
            <Text variant="secondary" size="sm" className="text-center mb-6">
              העלו תמונה, ואחרי אישור היא תופיע בהצבעות
            </Text>

            <div className="space-y-4">
              <Input
                label="שם התחפושת"
                placeholder="למשל: הנסיכה הקסומה"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                required
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />

              {preview ? (
                <div className="relative">
                  <img src={preview} alt="תצוגה מקדימה" className="w-full aspect-[3/4] object-cover" />
                  <button
                    onClick={clearFile}
                    className="absolute top-2 left-2 bg-red-500 p-1.5 text-white hover:bg-red-400 transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[3/4] border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 hover:border-accent-indigo/50 transition-colors"
                >
                  <Camera className="w-10 h-10 text-text-muted" />
                  <Text variant="muted" size="sm">לחצו לצילום או בחירת תמונה</Text>
                </button>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleUpload}
                disabled={!title.trim() || !selectedFile || uploading}
                loading={uploading}
                icon={<Upload className="w-4 h-4" />}
              >
                {uploading ? 'מעלה...' : 'העלאת תחפושת'}
              </Button>
            </div>
          </Card>
        </AnimateOnScroll>
      ) : (
        <AnimateOnScroll variant="fade-up" delay={0.1}>
          <Card variant="accent" className="p-4 mb-10 max-w-sm mx-auto">
            <div className="aspect-[3/4] overflow-hidden mb-3">
              <img src={store.getCostumeImageUrl(myCostume)} alt={myCostume.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-semibold">{myCostume.title}</Text>
                <Text variant="muted" size="xs">התחפושת שלך</Text>
              </div>
              {statusBadge && (
                <Badge variant={statusBadge.variant} className="gap-1">
                  <statusBadge.icon className="w-3 h-3" />
                  {statusBadge.text}
                </Badge>
              )}
            </div>
          </Card>
        </AnimateOnScroll>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <Heading level={3} className="text-white">הצביעו לתחפושת האהובה</Heading>
          <button onClick={refreshCostumes} className="text-text-muted hover:text-white text-xs transition-colors">
            רענון
          </button>
        </div>

        {approvedCostumes.length === 0 ? (
          <EmptyState icon={Trophy} message="עדיין אין תחפושות מאושרות. העלו תחפושת והמתינו לאישור!" />
        ) : !hasVoted ? (
          <StaggerChildren className="grid grid-cols-2 gap-4 md:gap-6">
            {approvedCostumes.map(costume => (
              <motion.button
                key={costume.id}
                onClick={() => handleVote(costume.id)}
                className="group relative bg-bg-card border border-white/5 overflow-hidden text-right transition-colors hover:border-accent-indigo/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={store.getCostumeImageUrl(costume)} alt={costume.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-gradient-brand text-white px-4 py-2 text-sm font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {costume.participantId === pid ? 'זו התחפושת שלך!' : 'הצביעו לי!'}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <Text size="sm" className="font-semibold">{costume.title}</Text>
                  <Text variant="muted" size="xs">{costume.participantName}</Text>
                </div>
              </motion.button>
            ))}
          </StaggerChildren>
        ) : (
          <AnimateOnScroll variant="fade-up">
            <Text variant="secondary" className="text-center mb-6">תודה שהצבעתם! הנה התוצאות עד כה</Text>
            <div className="space-y-4">
              {approvedCostumes
                .map(c => ({ ...c, votes: voteCounts[c.id] ?? 0 }))
                .sort((a, b) => b.votes - a.votes)
                .map(costume => (
                  <div key={costume.id} className="flex items-center gap-3 md:gap-4">
                    <img src={store.getCostumeImageUrl(costume)} alt={costume.title}
                      className="w-10 h-10 md:w-12 md:h-12 object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Text size="sm" className="font-semibold">{costume.title}</Text>
                        <Text variant="muted" size="xs">({costume.participantName})</Text>
                        {votedFor === costume.id && (
                          <Badge variant="success" className="gap-1">
                            <Check className="w-3 h-3" /> הבחירה שלך
                          </Badge>
                        )}
                      </div>
                      <VoteBar votes={costume.votes} maxVotes={maxVotes} size="sm" />
                    </div>
                  </div>
                ))}
            </div>
          </AnimateOnScroll>
        )}
      </div>
    </Container>
  )
}

export function VotingPage() {
  const [votingOpen, setVotingOpen] = useState<boolean | null>(null)

  useEffect(() => {
    return subscribeToSettings((s) => setVotingOpen(s.votingOpen))
  }, [])

  return (
    <ParticipantGate>
      {votingOpen === null ? (
        <Container size="md" className="py-12 flex justify-center">
          <LoadingState />
        </Container>
      ) : !votingOpen ? (
        <VotingClosedView />
      ) : (
        <VotingGame />
      )}
    </ParticipantGate>
  )
}
