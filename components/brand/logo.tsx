import Image from "next/image";

type LogoProps = {
  size?: number;
  priority?: boolean;
};

export function Logo({ size = 64, priority }: LogoProps) {
  return <Image src="/mulita.svg" alt="Mulita" width={size} height={size} priority={priority} unoptimized />;
}
