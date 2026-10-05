import { ImageResponse } from "next/og";
import { brandColors, brandFonts, logoDataUrl } from "@/lib/brand-assets";

export const alt = "Mulita: tus cuentas claras, y tá.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [fonts, logo] = await Promise.all([brandFonts(), logoDataUrl()]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        gap: 72,
        padding: "0 96px",
        background: brandColors.green,
      }}
    >
      <div style={{ display: "flex", padding: 14, borderRadius: 9999, background: brandColors.cream }}>
        <img src={logo} alt="" width={330} height={330} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: "Baloo 2", fontSize: 150, lineHeight: 1, color: brandColors.creamLight }}>Mulita</span>
        <span style={{ fontFamily: "Baloo 2", fontSize: 52, color: brandColors.cream }}>Tus cuentas claras, y tá.</span>
        <span style={{ marginTop: 20, maxWidth: 580, fontFamily: "DM Sans", fontSize: 30, color: brandColors.greenLight }}>
          Gastos, presupuesto, cuotas de la tarjeta y metas de ahorro, sin planillas eternas.
        </span>
      </div>
    </div>,
    { ...size, fonts },
  );
}
