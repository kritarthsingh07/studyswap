import { PageHero, SectionHeading } from "../components/Layout";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function ProfilePage() {
  const { data, error } = useAsyncData(async () => {
    const [dashboard, notifications] = await Promise.all([api.getDashboard(), api.getNotifications()]);
    return { dashboard: dashboard.dashboard, notifications: notifications.notifications };
  }, []);

  const user = data?.dashboard?.user;
  const listings = data?.dashboard?.listings || [];

  return (
    <>
      <PageHero
        tag="USER DASHBOARD"
        title="Your Account"
        description="Profile, listings, orders placeholder, wishlist entry point, and notifications all begin here."
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
        <SectionHeading eyebrow="Listings" title="Your Products" />
        <div className="grid">
          {listings.length ? (
            listings.map((listing) => (
              <div className="list-item card" key={listing._id}>
                <img src={listing.images?.[0] || "/assets/heroimage.webp"} alt={listing.title} />
                <div>
                  <h3>{listing.title}</h3>
                  <p className="muted">{listing.category?.name || ""}</p>
                </div>
                <strong className="price">{currency.format(listing.price)}</strong>
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
