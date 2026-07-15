"use client";

export default function VerifyError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="text-center space-y-6 px-6 max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl surface-card flex items-center justify-center">
          <svg className="w-8 h-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Something went wrong
          </h1>
          <p className="text-sm text-text-secondary">
            We couldn&apos;t verify this credential. This might be a temporary issue.
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl surface-btn-accent text-[13px] font-medium transition-all hover:scale-105 active:scale-95"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
