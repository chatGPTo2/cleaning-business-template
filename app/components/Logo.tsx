import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

const SIZES = {
  sm: { width: 100, height: 40 },
  md: { width: 148, height: 56 },
  lg: { width: 200, height: 76 },
};

export default function Logo({
  size = "md",
}: LogoProps) {
  const s = SIZES[size];

  return (
    <Image
      src="/taspro-logo.png"
      alt="Taspro Cleaning Solutions"
      width={s.width}
      height={s.height}
      className="object-contain"
      priority
    />
  );
}
