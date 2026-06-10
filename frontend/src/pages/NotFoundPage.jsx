import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="section">
      <div className="empty-state">
        Page not found. <Link to="/">Return to the homepage</Link>.
      </div>
    </section>
  );
}
