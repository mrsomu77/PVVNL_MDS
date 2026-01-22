export default function LoadingButton({
  loading,
  onClick,
  children,
  className = "",
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`px-6 py-2 rounded text-white flex items-center gap-2
        bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
        ${className}`}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {loading ? "Loading..." : children}
    </button>
  );
}
