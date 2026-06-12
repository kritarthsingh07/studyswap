import { useState } from "react";
import { PageHero, SectionHeading } from "../components/Layout";
import { Notice } from "../components/Notice";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function ProfilePage() {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [notice, setNotice] = useState({ message: "", tone: "success" });

  const { data, error, refetch } = useAsyncData(async () => {
    const [dashboard, notifications, categories] = await Promise.all([
      api.getDashboard(),
      api.getNotifications(),
      api.getCategories()
    ]);
    return {
      dashboard: dashboard.dashboard,
      notifications: notifications.notifications,
      categories: categories.categories || []
    };
  }, []);

  const user = data?.dashboard?.user;
  const listings = data?.dashboard?.listings || [];
  const categories = data?.categories || [];

  async function handleDelete(productId) {
    if (!confirm("Delete this listing?")) return;
    try {
      await api.deleteProduct(productId);
      setNotice({ message: "Listing deleted.", tone: "success" });
      refetch?.();
    } catch (err) {
      setNotice({ message: err.message, tone: "error" });
    }
  }

  function startEdit(listing) {
    setEditingId(listing._id);
    setEditForm({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category?._id || listing.category,
      condition: listing.condition
    });
  }

  async function handleEditSave(productId) {
    try {
      await api.updateProduct(productId, editForm);
      setEditingId(null);
      setNotice({ message: "Listing updated.", tone: "success" });
      refetch?.();
    } catch (err) {
      setNotice({ message: err.message, tone: "error" });
    }
  }

  return (
    <>
      <PageHero
        tag="USER DASHBOARD"
        title="Your Account"
        description="Manage your profile, listings, and notifications."
      />
      <section className="section">
        {error ? (
          <div className="empty-state">{error} Sign in on the auth page to load your dashboard.</div>
        ) : user ? (
          <div className="panel">
            <div className="product-body">
              <h2>{user.name}</h2>
              <p className="muted">{user.email}</p>
              <p>{user.college || "Add your college"} · {user.city || "Add your city"}</p>
            </div>
          </div>
        ) : null}
      </section>

      <section className="section">
        <SectionHeading eyebrow="My Listings" title="Your Products" />
        <Notice message={notice.message} tone={notice.tone} />
        <div className="grid">
          {listings.length ? (
            listings.map((listing) => (
              <div className="list-item card" key={listing._id}>
                {editingId === listing._id ? (
                  <div className="form-grid" style={{ padding: "1rem", width: "100%" }}>
                    <input
                      className="input"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Title"
                    />
                    <textarea
                      className="textarea"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Description"
                    />
                    <input
                      className="input"
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      placeholder="Price"
                    />
                    <select
                      className="input"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <input
                      className="input"
                      value={editForm.condition}
                      onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                      placeholder="Condition"
                    />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn btn-primary" onClick={() => handleEditSave(listing._id)}>Save</button>
                      <button className="btn" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={listing.images?.[0] || "/assets/heroimage.webp"}
                      alt={listing.title}
                      style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3>{listing.title}</h3>
                      <p className="muted">{listing.category?.name || ""}</p>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 99,
                          fontSize: "0.75rem",
                          background: listing.status === "active" ? "#22c55e20" : "#ef444420",
                          color: listing.status === "active" ? "#16a34a" : "#dc2626"
                        }}
                      >
                        {listing.status}
                      </span>
                    </div>
                    <strong className="price">{currency.format(listing.price)}</strong>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn" onClick={() => startEdit(listing)}>Edit</button>
                      <button
                        className="btn"
                        style={{ background: "#ef4444", color: "#fff" }}
                        onClick={() => handleDelete(listing._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">No listings yet. Use the Sell page to create your first product.</div>
          )}
        </div>
      </section>

      <section className="section">
        <SectionHeading eyebrow="Notifications" title="Recent Activity" />
        <div className="info-grid">
          {data?.notifications?.length ? (
            data.notifications.map((item) => (
              <div className="info-card" key={item._id}>
                <h3>{item.title}</h3>
                <p>{item.message}</p>
              </div>
            ))
          ) : (
            <div className="empty-state">No notifications yet.</div>
          )}
        </div>
      </section>
    </>
  );
}
