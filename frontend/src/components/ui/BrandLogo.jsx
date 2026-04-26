export default function BrandLogo({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label="Ronsel"
    >
      <rect width="24" height="24" rx="5" className="fill-primary-600" />
      <path
        d="M6 16c3-5 9-5 12 0"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="6" cy="16" r="1.2" fill="white" />
    </svg>
  );
}
