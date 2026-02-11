import Image from "next/image";
import Link from "next/link";

type SiteLogoProps = {
  href?: string;
  showText?: boolean;
  className?: string;
  textClassName?: string;
  iconSize?: number;
};

export default function SiteLogo({
  href = "/",
  showText = true,
  className = "",
  textClassName = "",
  iconSize = 36,
}: SiteLogoProps) {
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      <Image
        src="/logo-mark.svg"
        alt="YouTube Automation AI logo"
        width={iconSize}
        height={iconSize}
        priority
      />
      {showText && (
        <span className={`font-bold tracking-tight ${textClassName}`.trim()}>
          YouTube Automation AI
        </span>
      )}
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} aria-label="Go to homepage">
      {content}
    </Link>
  );
}
