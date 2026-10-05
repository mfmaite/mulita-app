import { ImageResponse } from "next/og";
import { brandColors, logoDataUrl } from "@/lib/brand-assets";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const logo = await logoDataUrl();

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: brandColors.cream }}>
      <img src={logo} alt="" width={170} height={170} />
    </div>,
    size,
  );
}
