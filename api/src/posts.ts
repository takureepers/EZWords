import { Hono } from "hono";
import { cors } from "hono/cors";
export function extractEmojis(input: string): string {
  // 絵文字にマッチする正規表現（ZWJ絵文字・スキンカラー含む）
  const emojiRegex = /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base})(?:\uFE0F|\u200D|\p{Emoji_Modifier})*/gu
  return (input.match(emojiRegex) || []).join('')
}

type Env = {
  Bindings: {
    DB: D1Database;
  };
};
const app = new Hono<Env>();

app.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `
      SELECT
        Posts.id, Posts.text, Posts.created_at,
        COUNT(Likes.id) AS likes_count
      FROM Posts
      LEFT JOIN Likes ON Likes.post_id = Posts.id
      GROUP BY Posts.id
      ORDER BY Posts.created_at DESC
      `
  ).all();
  return c.json(results);
});

// 投稿を受け取ってDBに保存
app.post("/", async (c) => {
  const ip = c.req.header("X-Forwarded-For")?.split(",")[0] || "unknown-ip";
  const currentTime = Date.now();
  const limitDuration = 5000; // 5秒以内に投稿しようとした場合はエラーを返す
  const postLimit = 5; // 同じIPからの投稿回数制限
  // リクエストボディの処理
  const body = await c.req.json();
  let text = extractEmojis(body).trim();

  if (!text || text.length > 200) {
    return c.text(
      "Invalid text. Ensure it is not empty and under 200 characters.",
      400
    );
  }

  // HTMLタグをエスケープしてXSSを防止
  // text = escapeHtml(text)

  // 投稿をDBに保存
  await c.env.DB.prepare("INSERT INTO Posts (text) VALUES (?)")
    .bind(text)
    .run();

  // 投稿成功
  return c.text("Post created successfully!" + ip);
});

app.post("/:id/like", async (c) => {
  const id = c.req.param("id");
  if (isNaN(Number(id))) return c.text("Invalid ID", 400);
  await c.env.DB.prepare(`INSERT INTO Likes (post_id) VALUES (?)`)
    .bind(id)
    .run();
  return c.text("Liked", 201);
});

export default app;