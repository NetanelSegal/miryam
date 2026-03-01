const heILTimeOptions: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
}

const heILDateTimeOptions: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('he-IL', heILTimeOptions)
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('he-IL', heILDateTimeOptions)
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'עכשיו'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `לפני ${minutes} דקות`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `לפני ${hours} שעות`
  const days = Math.floor(hours / 24)
  return `לפני ${days} ימים`
}

export interface CountdownTimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function calculateTimeLeft(target: Date): CountdownTimeLeft | null {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}
