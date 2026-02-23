import { useState, useEffect } from 'react'

interface CountdownProps {
  targetDate: Date
  onComplete?: () => void
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-heading text-4xl md:text-6xl font-bold gradient-text tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-text-muted text-xs md:text-sm mt-1">{label}</span>
    </div>
  )
}

export function Countdown({ targetDate, onComplete, className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calculateTimeLeft(targetDate)
      setTimeLeft(tl)
      if (!tl) {
        clearInterval(timer)
        onComplete?.()
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (!timeLeft) return null

  return (
    <div className={`flex items-center gap-4 md:gap-8 ${className}`} dir="ltr">
      <Digit value={timeLeft.days} label="ימים" />
      <span className="font-heading text-3xl md:text-5xl font-bold text-text-muted">:</span>
      <Digit value={timeLeft.hours} label="שעות" />
      <span className="font-heading text-3xl md:text-5xl font-bold text-text-muted">:</span>
      <Digit value={timeLeft.minutes} label="דקות" />
      <span className="font-heading text-3xl md:text-5xl font-bold text-text-muted">:</span>
      <Digit value={timeLeft.seconds} label="שניות" />
    </div>
  )
}
