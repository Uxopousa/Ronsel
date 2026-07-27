export default function ErrorAlert({ message }) {
  if (!message) return null;

  return (
    <div className="px-3 py-2 bg-error-bg border border-error/20 rounded-md text-xs text-error-text">
      {message}
    </div>
  );
}
