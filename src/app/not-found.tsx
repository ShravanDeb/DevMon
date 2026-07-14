import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-0">
      <div className="text-center space-y-6 px-6">
        <div className="space-y-2">
          <p className="text-sm font-mono font-medium text-accent uppercase tracking-widest">
            404
          </p>
          <h1 className="text-3xl font-display font-semibold text-text-primary">
            Page not found
          </h1>
          <p className="text-sm text-text-secondary max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-medium transition-all hover:scale-105 active:scale-95"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
