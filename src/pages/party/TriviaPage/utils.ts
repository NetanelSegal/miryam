export function getScoreMessage(score: number, total: number): string {
  const pct = total > 0 ? score / total : 0
  if (pct === 1) return 'מושלם! את/ה מכירים את מרים הכי טוב!'
  if (pct >= 0.7) return 'כל הכבוד! את/ה ממש מכירים את מרים'
  if (pct >= 0.4) return 'לא רע! יש עוד מה ללמוד על מרים'
  return 'אופס... אולי תעקבו אחרי מרים ברשתות?'
}
