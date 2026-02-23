const RANK_COLORS = ['text-amber-400', 'text-gray-300', 'text-amber-600'] as const

export function getRankColor(index: number): string {
  return RANK_COLORS[index] ?? 'text-text-muted'
}
