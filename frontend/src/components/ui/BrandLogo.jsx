export default function BrandLogo({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="url(#brand-grad)" />
      <path d="M8 18c3.5-5 10.5-5 14 0l2 3c-5-1-13-1-18 0l2-3Z" fill="white" opacity="0.9" />
      <circle cx="10" cy="20" r="1.5" fill="white" />
      <circle cx="20" cy="20" r="1.5" fill="white" />
      <defs>
        <linearGradient id="brand-grad" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
    </svg>
  );
}
