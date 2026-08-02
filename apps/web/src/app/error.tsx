"use client";

type ErrorPageProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="foundation-shell">
      <section className="foundation-card" aria-labelledby="error-title">
        <p className="eyebrow">Development error boundary</p>
        <h1 id="error-title">The foundation could not be displayed.</h1>
        <button className="action-button" type="button" onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}
