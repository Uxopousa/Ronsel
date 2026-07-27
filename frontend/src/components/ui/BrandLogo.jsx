export default function BrandLogo({ size = 32, className = '' }) {
  return (
    <img
      src="/logoRonsel.png"
      alt="Ronsel"
      style={{ width: size, height: size }}
      className={`rounded-md ${className}`}
    />
  );
}
