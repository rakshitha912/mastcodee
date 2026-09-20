import { useState, type ImgHTMLAttributes } from "react";

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackLabel: string;
  containerClassName?: string;
};

export function SafeImage({
  fallbackLabel,
  containerClassName = "",
  className = "",
  alt,
  onError,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const initials = fallbackLabel
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  if (failed || !props.src) {
    return (
      <div
        role="img"
        aria-label={alt || `${fallbackLabel} image placeholder`}
        className={`flex items-center justify-center bg-secondary text-3xl font-display font-bold text-primary ${containerClassName}`}
      >
        <span className="rounded-full border border-border bg-white px-4 py-3 shadow-sm">
          {initials || "MC"}
        </span>
      </div>
    );
  }

  return (
    <img
      {...props}
      alt={alt || fallbackLabel}
      className={className}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
