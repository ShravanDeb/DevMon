"use client";

export default function GlobalError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-primary">
      <div className="text-center space-y-6 px-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-secondary border border-border-primary flex items-center justify-center">
          <span className="text-2xl">!</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Something went wrong
          </h1>
          <p className="text-sm text-text-secondary max-w-md">
            An unexpected error occurred. Please try again.
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary text-white text-sm font-medium transition-all hover:scale-105 active:scale-95"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
