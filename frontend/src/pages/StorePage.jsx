import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHero } from "../components/Layout";
import { ProductGrid } from "../components/ProductGrid";
import { Notice } from "../components/Notice";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

export function StorePage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [filters, setFilters] = useState({
    search: "",
    category: initialCategory,
    minPrice: "",
    maxPrice: "",
    sort: "-createdAt"
  });
  const [message, setMessage] = useState("");
  const queryKey = useMemo(() => JSON.stringify(filters), [filters]);

  const categoriesQuery = useAsyncData(() => api.getCategories(), []);
  const productsQuery = useAsyncData(() => api.getProducts(filters), [queryKey]);

  function handleSubmit(event) {
    event.preventDefault();
    setFilters({
      search: event.currentTarget.search.value,
      category: event.currentTarget.category.value,
      minPrice: event.currentTarget.minPrice.value,
      maxPrice: event.currentTarget.maxPrice.value,
      sort: event.currentTarget.sort.value
    });
  }

  return (
    <>
      <PageHero
        tag="MARKETPLACE"
        title="Discover Affordable Student Essentials"
        description="Search, sort, and filter live product data from the backend API."
      />
      <section className="section">
        <form className="search-bar" id="store-filter-form" onSubmit={handleSubmit}>
          <input className="input" name="search" defaultValue={filters.search} placeholder="Search books, laptops, phones, and more" />
          <select className="input" name="category" defaultValue={filters.category}>
            <option value="">All Categories</option>
            {categoriesQuery.data?.categories?.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
          <input className="input" name="minPrice" type="number" min="0" placeholder="Min price" defaultValue={filters.minPrice} />
          <input className="input" name="maxPrice" type="number" min="0" placeholder="Max price" defaultValue={filters.maxPrice} />
          <select className="input" name="sort" defaultValue={filters.sort}>
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
          <button className="btn btn-primary" type="submit">Apply Filters</button>
        </form>
        <Notice message={message || productsQuery.error} tone={productsQuery.error ? "error" : "success"} />
        <ProductGrid
          products={productsQuery.data?.products || []}
          onWishlistAdded={setMessage}
          emptyMessage="No products match the current filters."
        />
      </section>
    </>
  );
}
