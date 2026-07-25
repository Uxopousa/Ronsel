export default function ErrorAlert({ message }) {
  if (!message) return null;

  return (
    <div className="px-3 py-2 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-md text-xs text-red-600 dark:text-red-300">
      {message}
    </div>
  );
}
