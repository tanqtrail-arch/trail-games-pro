// =============================================================================
// レポート共通ユーティリティ
// =============================================================================

/** 現在日時を日本語フォーマットで返す */
export function formatJaDate(date: Date = new Date()): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** 週の開始日〜終了日を返す */
export function getWeekRange(date: Date = new Date()): { start: string; end: string } {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: formatJaDate(monday),
    end: formatJaDate(sunday),
  };
}

/** 月表示 */
export function getMonthLabel(date: Date = new Date()): string {
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
}

/** 円表示 */
export function formatYen(n: number): string {
  return `¥${n.toLocaleString()}`;
}

/** パーセント変化 */
export function deltaPercent(current: number, previous: number): string {
  if (previous === 0) return '+∞%';
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

/** 増減の矢印 */
export function trendArrow(current: number, previous: number): string {
  if (current > previous) return '↑';
  if (current < previous) return '↓';
  return '→';
}
