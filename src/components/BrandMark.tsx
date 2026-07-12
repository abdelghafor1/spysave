import Image from "next/image";

type BrandMarkProps = {
  size?: number;
  className?: string;
};

export function BrandMark({ size = 44, className = "" }: BrandMarkProps) {
  return (
    <Image
      src="/spysave-mark.svg"
      alt="SpySave logo"
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
      priority
    />
  );
}
