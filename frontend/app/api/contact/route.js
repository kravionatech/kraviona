import { NextResponse } from "next/server";
import { getBackendBaseUrl, pickBackendError } from "../backend.js";

const splitName = (payload) => {
  const fullName = String(payload.name || "").trim();
  const parts = fullName.split(/\s+/).filter(Boolean);
  const firstName = String(payload.firstName || parts[0] || "").trim();
  const lastName = String(
    payload.lastName || parts.slice(1).join(" ") || "Customer",
  ).trim();

  return { firstName, lastName };
};

const validateRequiredFields = (payload, fields) => {
  const missingField = fields.find(
    (field) => !String(payload?.[field] || "").trim(),
  );

  return missingField ? `${missingField} is required.` : "";
};

const normalizeMessagePayload = (payload) => {
  const { firstName, lastName } = splitName(payload);

  return {
    firstName,
    lastName,
    email: String(payload.email || "").trim(),
    phone: String(payload.phone || "").trim(),
    subject: String(payload.subject || "Service Inquiry").trim(),
    message: String(payload.message || "").trim(),
  };
};

const normalizeLeadPayload = (payload) => ({
  name: String(payload.name || "").trim(),
  email: String(payload.email || "").trim(),
  phone: String(payload.phone || "").trim(),
  subject: String(payload.subject || `Lead Inquiry: ${payload.service || "Service"}`).trim(),
  message: String(payload.message || "").trim(),
  leadType: String(payload.leadType || "service-popup").trim(),
  page: String(payload.page || "").trim(),
  service: String(payload.service || "").trim(),
  budget: String(payload.budget || "").trim(),
  company: String(payload.company || "").trim(),
});

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

  const isLeadRequest =
    payload?.leadType === "service-popup" ||
    payload?.leadType === "contact-form" ||
    payload?.leadType === "other";
  const endpointPath = isLeadRequest ? "/leads" : "/messages";
  const backendPayload = isLeadRequest
    ? normalizeLeadPayload(payload)
    : normalizeMessagePayload(payload);
  const requiredFields = isLeadRequest
    ? ["name", "email", "phone", "subject", "message"]
    : ["firstName", "lastName", "email", "phone", "subject", "message"];
  const validationError = validateRequiredFields(backendPayload, requiredFields);

  if (validationError) {
    return NextResponse.json(
      { ok: false, success: false, error: validationError },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${getBackendBaseUrl()}${endpointPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(backendPayload),
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
          error: pickBackendError(data, "Unable to send message."),
        },
        { status: response.status || 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      success: true,
      message:
        data?.message ||
        (isLeadRequest
          ? "Lead created successfully"
          : "Message created successfully"),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: "Unable to connect to the backend API.",
      },
      { status: 502 },
    );
  }
}
