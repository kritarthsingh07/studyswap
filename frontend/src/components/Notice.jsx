export function Notice({ message, tone = "success" }) {
  if (!message) return null;

  return <div className={`notice ${tone === "error" ? "notice-error" : "notice-success"}`}>{message}</div>;
}
