import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_FEEDBACK_DB_ID!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, targetWidget, title, detail, email } = body;

    if (!title?.trim() || !detail?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "제목": { title: [{ text: { content: title.trim() } }] },
        "유형": { select: { name: type === "improve" ? "기존 위젯 개선" : "신규 위젯 제안" } },
        "대상 위젯": { rich_text: [{ text: { content: targetWidget || "" } }] },
        "상세 내용": { rich_text: [{ text: { content: detail.trim() } }] },
        ...(email?.trim() ? { "이메일": { email: email.trim() } } : {}),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[feedback] Notion API error:", err);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
