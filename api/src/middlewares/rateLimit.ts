import { Context, Next } from 'hono'

// IPごとの履歴を保持するためのマップ
const requestHistory = new Map<string, number[]>()

// 1分間に許容するリクエスト数
const LIMIT = 10
// しきい値時間 (ミリ秒)
const TIME_WINDOW = 60 * 1000

export const rateLimitMiddleware = async (c: Context, next: Next) => {
  // IPアドレス取得（プロキシ環境やCloudflare環境に対応）
  const ip = c.req.header('x-forwarded-for') || 
             c.req.header('CF-Connecting-IP') || 
             c.req.header('X-Real-IP') || 
             c.env?.remoteAddr ||  // Cloudflare Workers環境用
             'unknown'

  const now = Date.now()
  const timestamps = requestHistory.get(ip) || []

  // 古いタイムスタンプを除去
  const recentTimestamps = timestamps.filter((ts: number) => now - ts < TIME_WINDOW)

  // 今回のアクセスを追加
  recentTimestamps.push(now)
  requestHistory.set(ip, recentTimestamps)

  // LIMITを超えていれば429エラーを返却
  if (recentTimestamps.length > LIMIT) {
    return c.text('Too Many Requests', 429)
  }

  await next()
}
