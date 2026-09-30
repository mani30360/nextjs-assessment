interface SpinnerProps {
  label?: string;
}

export default function Spinner({ label = "Loading…" }: SpinnerProps) {
  return (
    <div className="status" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p className="status__text">{label}</p>
    </div>
  );
}
