import { NextResponse } from "next/server";
import { getBackendBaseUrl, pickBackendError } from "../../../backend.js";

const readJson = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return { message: await response.text() };
};

const jsonError = (data, fallback, status) =>
  NextResponse.json(
    {
      ok: false,
      success: false,
      error: pickBackendError(data, fallback),
    },
    { status },
  );

export async function GET(_request, { params }) {
  const { slug } = await params;

  try {
    const response = await fetch(
      `${getBackendBaseUrl()}/post/${encodeURIComponent(slug)}/engagement`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );

    const data = await readJson(response);

    if (!response.ok || data?.success === false) {
      return jsonError(data, "Unable to load blog engagement.", response.status);
    }

    return NextResponse.json({ ok: true, success: true, data: data.data });
  } catch {
    return jsonError({}, "Unable to connect to the backend API.", 502);
  }
}

export async function POST(request, { params }) {
  const { slug } = await params;
  let payload;

  try {
    payload = await request.json();
  } catch {
    return jsonError({}, "Invalid request body.", 400);
  }

  const kind = String(payload?.kind || "").trim();
  const endpointByKind = {
    comment: `/post/${encodeURIComponent(slug)}/comments`,
    view: `/post/${encodeURIComponent(slug)}/views`,
  };
  const endpoint = endpointByKind[kind];

  if (!endpoint) {
    return jsonError({}, "Unsupported engagement action.", 400);
  }

  try {
    const response = await fetch(`${getBackendBaseUrl()}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(request.headers.get("user-agent")
          ? { "user-agent": request.headers.get("user-agent") }
          : {}),
        ...(request.headers.get("sec-fetch-mode")
          ? { "sec-fetch-mode": request.headers.get("sec-fetch-mode") }
          : {}),
        ...(request.headers.get("sec-fetch-dest")
          ? { "sec-fetch-dest": request.headers.get("sec-fetch-dest") }
          : {}),
        ...(payload?.visitorId ? { "x-visitor-id": payload.visitorId } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await readJson(response);

    if (!response.ok || data?.success === false) {
      return jsonError(data, "Unable to update blog engagement.", response.status);
    }

    return NextResponse.json({
      ok: true,
      success: true,
      message: data.message,
      data: data.data,
    });
  } catch {
    return jsonError({}, "Unable to connect to the backend API.", 502);
  }
}
