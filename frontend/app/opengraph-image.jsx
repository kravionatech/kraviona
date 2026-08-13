import { ImageResponse } from "next/og";

export const alt = "Kraviona Tech Solutions — Web Development and Technical SEO Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0f5960",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 30, fontWeight: 700 }}>
          <span
            style={{
              alignItems: "center",
              background: "#d85e3d",
              borderRadius: 6,
              color: "#FFFFFF",
              display: "flex",
              height: 36,
              justifyContent: "center",
              marginRight: 14,
              width: 36,
            }}
          >
            K
          </span>
          KRAVIONA
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 58, lineHeight: 1.08, fontWeight: 800, maxWidth: 900 }}>
            Web Development &amp; Technical SEO
          </div>
          <div style={{ marginTop: 22, fontSize: 30, color: "#D6E0E2" }}>
            Built for speed, visibility, and growth.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 25 }}>
            <span style={{ color: "#f3bd67" }}>kraviona.com</span>
          <span>Delhi NCR, India</span>
        </div>
      </div>
    ),
    size,
  );
}
