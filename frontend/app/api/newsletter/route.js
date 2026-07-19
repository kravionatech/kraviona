import { NextResponse } from "next/server";
import { getBackendBaseUrl, pickBackendError } from "../backend.js";

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, success: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const email = String(payload?.email || "").trim();

  if (!email) {
    return NextResponse.json(
      { ok: false, success: false, error: "Email is required." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${getBackendBaseUrl()}/newslatter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : { message: await response.text() };

    if (!response.ok || data?.success === false || data?.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: pickBackendError(data, "Subscription failed."),
        },
        { status: response.status || 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      success: true,
      message: data?.message || "Subscriber created successfully",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: "Unable to connect to the newsletter API.",
      },
      { status: 502 },
    );
  }
}
