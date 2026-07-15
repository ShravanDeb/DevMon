"use client";

export default function CardError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="text-center space-y-6 px-6 max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-secondary border border-border-primary flex items-center justify-center">
          <span className="text-2xl">!</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Card generation failed
          </h1>
          <p className="text-sm text-text-secondary">
            We couldn&apos;t generate your card. This might be a temporary issue.
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
