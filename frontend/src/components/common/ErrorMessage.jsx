import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="error-state">
      <AlertCircle size={22} />
      <div>
        <strong>Unable to load</strong>
        <p>{message}</p>
        {onRetry && <button onClick={onRetry}>Try again</button>}
      </div>
    </div>
  );
}
