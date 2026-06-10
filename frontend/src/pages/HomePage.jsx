import { Link } from "react-router-dom";
import { useState } from "react";
import { SectionHeading } from "../components/Layout";
import { ProductGrid } from "../components/ProductGrid";
import { Notice } from "../components/Notice";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

export function HomePage() {
  const [message, setMessage] = useState("");
  const { data, error } = useAsyncData(async () => {
    const [featured, categories] = await Promise.all([api.getFeaturedProducts(), api.getCategories()]);
    return { featured: featured.products, categories: categories.categories };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-tag">STUDENT MARKETPLACE</span>
          <h1>Buy, Sell & Exchange Student Essentials</h1>
          <p>
            Discover affordable laptops, books, smartphones, earbuds, smartwatches, calculators, and
            hostel essentials from verified students across campuses.
          </p>
          <div className="hero-buttons">
            <Link className="btn btn-primary" to="/store">
              Explore Marketplace
            </Link>
            <Link className="btn btn-secondary" to="/sell">
              Sell Item
            </Link>
          </div>
        </div>
        <div className="hero-media">
          <video autoPlay muted loop playsInline preload="auto">
            <source src="/assets/hero-laptop.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="section">
        <SectionHeading eyebrow="Popular Categories" title="Browse Categories" />
        <div className="category-grid">
          {data?.categories?.map((category) => (
            <Link className="category-card" key={category._id} to={`/store?category=${category._id}`}>
              <img src={category.image || "/assets/category-books.webp"} alt={category.name} />
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading eyebrow="Trending Listings" title="Featured Student Deals" />
        <Notice message={message || error} tone={error ? "error" : "success"} />
        <ProductGrid
          products={data?.featured || []}
          onWishlistAdded={setMessage}
          emptyMessage="No products found yet. Seed MongoDB Atlas and start listing products from the Sell page."
        />
      </section>

      <section className="exchange-band">
        <span className="pill">STUDYSWAP EXCHANGE</span>
        <h2>Exchange Instead Of Buying</h2>
        <p className="muted">
          Have an old laptop, engineering book, calculator or gadget? Exchange it with another student
          and save money.
        </p>
        <div className="exchange-buttons">
          <Link className="btn btn-primary" to="/exchange">
            Start Exchange
          </Link>
          <Link className="btn btn-light" to="/store">
            Browse Listings
          </Link>
        </div>
      </section>

      <section className="section">
        <SectionHeading eyebrow="Why StudySwap" title="Built For Students" />
        <div className="feature-grid">
          <div className="feature-card"><h3>Verified Students</h3><p>Buy and sell with confidence through trusted student profiles.</p></div>
          <div className="feature-card"><h3>Study Materials</h3><p>Access books, notes, calculators, and academic tools.</p></div>
          <div className="feature-card"><h3>Easy Exchange</h3><p>Swap products with other students instead of buying new.</p></div>
          <div className="feature-card"><h3>Save Money</h3><p>Student-friendly deals at affordable prices.</p></div>
        </div>
      </section>
    </>
  );
}
