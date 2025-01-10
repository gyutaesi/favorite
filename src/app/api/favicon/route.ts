import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // favicon 링크 찾기
    let favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href");

    // 상대 경로를 절대 경로로 변환
    if (favicon && !favicon.startsWith("http")) {
      const baseUrl = new URL(url).origin;
      favicon = new URL(favicon, baseUrl).toString();
    }

    return NextResponse.json({ favicon });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch favicon" },
      { status: 500 }
    );
  }
}
