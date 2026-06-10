import { Link } from "react-router-dom";
import { PageHero } from "../components/Layout";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

export function CategoriesPage() {
  const { data, error } = useAsyncData(() => api.getCategories(), []);

  return (
    <>
      <PageHero
        tag="CATEGORY SYSTEM"
        title="Browse Working Categories"
        description="Every category now routes into the live marketplace experience."
      />
      <section className="section">
        {error ? <div className="empty-state">{error}</div> : null}
        <div className="category-grid">
          {data?.categories?.map((category) => (
            <Link className="category-card" key={category._id} to={`/store?category=${category._id}`}>
              <img src={category.image || "/assets/category-books.webp"} alt={category.name} />
              <h3>{category.name}</h3>
              <p className="muted">{category.description || "Browse live listings from MongoDB-backed catalog data."}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
