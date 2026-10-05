import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const brandColors = {
  green: "#234B40",
  greenLight: "#D9EBE5",
  cream: "#F4EBD8",
  creamLight: "#FCFAF4",
};

export async function brandFonts() {
  const [baloo, dmSans] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Baloo2-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/DMSans-Medium.ttf")),
  ]);
  return [
    { name: "Baloo 2", data: baloo, weight: 700 as const, style: "normal" as const },
    { name: "DM Sans", data: dmSans, weight: 500 as const, style: "normal" as const },
  ];
}

export async function logoDataUrl() {
  const svg = await readFile(join(process.cwd(), "public/mulita.svg"));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}
