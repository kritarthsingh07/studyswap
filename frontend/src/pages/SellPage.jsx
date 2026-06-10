import { useState } from "react";
import { PageHero } from "../components/Layout";
import { Notice } from "../components/Notice";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

export function SellPage() {
  const categories = useAsyncData(() => api.getCategories(), []);
  const [notice, setNotice] = useState({ message: "", tone: "success" });

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const result = await api.createProduct({
        title: form.get("title"),
        description: form.get("description"),
        price: Number(form.get("price")),
        category: form.get("category"),
        condition: form.get("condition"),
        images: String(form.get("images") || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      });

      setNotice({ message: `Listing created: ${result.product.title}`, tone: "success" });
      event.currentTarget.reset();
    } catch (error) {
      setNotice({ message: error.message, tone: "error" });
    }
  }

  return (
    <>
      <PageHero
        tag="SELL PRODUCT"
        title="List Your Item"
        description="Connect the current Sell flow to product creation, Cloudinary-ready images, and MongoDB storage."
      />
      <section className="section">
        <div className="two-col">
          <form className="form-card form-grid" onSubmit={handleSubmit}>
            <input className="input" name="title" placeholder="Product title" required />
            <textarea className="textarea" name="description" placeholder="Describe condition, specs, and delivery details" required />
            <input className="input" name="price" type="number" min="0" placeholder="Price" required />
            <select className="input" name="category" defaultValue="">
              <option value="" disabled>Select category</option>
              {categories.data?.categories?.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
            <input className="input" name="condition" placeholder="Condition (Excellent, Good, Like New)" required />
            <input className="input" name="images" placeholder="Comma-separated image URLs or Cloudinary upload payloads" />
            <button className="btn btn-primary" type="submit">Create Listing</button>
            <Notice message={notice.message || categories.error} tone={categories.error ? "error" : notice.tone} />
          </form>
          <div className="info-grid">
            <div className="info-card"><h3>Upload Strategy</h3><p>Backend is prepared for Cloudinary uploads through the upload service.</p></div>
            <div className="info-card"><h3>Ownership</h3><p>Listings are linked to the authenticated seller and protected by route guards.</p></div>
            <div className="info-card"><h3>Marketplace Sync</h3><p>New products appear in the marketplace once saved in MongoDB.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
