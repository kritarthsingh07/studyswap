import { useState } from "react";
import { PageHero } from "../components/Layout";
import { ProductGrid } from "../components/ProductGrid";
import { Notice } from "../components/Notice";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

export function WishlistPage() {
  const [message, setMessage] = useState("");
  const { data, error } = useAsyncData(() => api.getWishlist(), []);

  return (
    <>
      <PageHero
        tag="WISHLIST"
        title="Saved For Later"
        description="Track interesting listings and sync them to the backend once you’re signed in."
      />
      <section className="section">
        <Notice message={message || error} tone={error ? "error" : "success"} />
        <ProductGrid
          products={data?.wishlist?.items || []}
          onWishlistAdded={setMessage}
          emptyMessage="Your wishlist is empty."
        />
      </section>
    </>
  );
}
