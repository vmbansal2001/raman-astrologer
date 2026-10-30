import { ImageResponse } from "next/og";
export const alt = "Acharya Raman Kamra — Vedic wisdom. Personal guidance.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#f5f0e5",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "70px 85px",
        border: "18px solid #502033",
        color: "#292d26",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 23,
          letterSpacing: 6,
          color: "#a58047",
        }}
      >
        RAMAN · VEDIC ASTROLOGER
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 80,
          letterSpacing: -3,
          lineHeight: 1.15,
        }}
      >
        <span>Ancient wisdom.</span>
        <span style={{ color: "#6c283e" }}>A clearer tomorrow.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          color: "#736f65",
        }}
      >
        <span>Acharya Raman Kamra</span>
        <span>ramanastrologer.com</span>
      </div>
    </div>,
    size,
  );
}
