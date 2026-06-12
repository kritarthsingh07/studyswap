import { useRef, useState } from "react";
import { PageHero } from "../components/Layout";
import { Notice } from "../components/Notice";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

export function SellPage() {
  const categories = useAsyncData(() => api.getCategories(), []);
  const [notice, setNotice] = useState({ message: "", tone: "success" });
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef(null);

  function handleImageChange(event) {
    const files = Array.from(event.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setUploading(true);

    try {
      
      const payload = new FormData();
      payload.append("title", form.get("title"));
      payload.append("description", form.get("description"));
      payload.append("price", form.get("price"));
      payload.append("category", form.get("category"));
      payload.append("condition", form.get("condition"));

      const imageFiles = event.currentTarget.querySelector('input[type="file"]').files;
      for (const file of imageFiles) {
        payload.append("images", file);
      }

      const result = await api.createProductMultipart(payload);
      setNotice({ message: `Listing created: ${result.product.title}`, tone: "success" });
      formRef.current?.reset();
      setPreviews([]);
    } catch (error) {
      setNotice({ message: error.message, tone: "error" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <PageHero
        tag="SELL PRODUCT"
        title="List Your Item"
        description="Fill in the details below to list your item on the marketplace."
      />
      <section className="section">
        <form ref={formRef} className="form-card form-grid" onSubmit={handleSubmit} encType="multipart/form-data">
          <input className="input" name="title" placeholder="Product title" required />
          <textarea className="textarea" name="description" placeholder="Describe condition, specs, and delivery details" required />
          <input className="input" name="price" type="number" min="0" placeholder="Price (₹)" required />
          <select className="input" name="category" defaultValue="">
            <option value="" disabled>Select category</option>
            {categories.data?.categories?.map((item) => (
              <option key={item._id} value={item._id}>{item.name}</option>
            ))}
          </select>
          <input className="input" name="condition" placeholder="Condition (Excellent, Good, Like New)" required />
          <div>
            <label className="input" style={{ cursor: "pointer", display: "block" }}>
              📷 Upload Images (up to 6)
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </label>
            {previews.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                {previews.map((src, i) => (
                  <img key={i} src={src} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }} />
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-primary" type="submit" disabled={uploading}>
            {uploading ? "Creating..." : "Create Listing"}
          </button>
          <Notice message={notice.message || categories.error} tone={categories.error ? "error" : notice.tone} />
        </form>
      </section>
    </>
  );
}
