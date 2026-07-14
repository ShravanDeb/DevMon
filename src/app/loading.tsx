export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-0">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-border-subtle border-t-accent rounded-full animate-spin" />
        <p className="text-sm text-text-secondary font-mono">Loading...</p>
      </div>
    </div>
  );
}
