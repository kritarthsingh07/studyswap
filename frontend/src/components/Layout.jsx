import { Link, NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/store", label: "Marketplace" },
  { to: "/categories", label: "Categories" },
  { to: "/exchange", label: "Exchange" },
  { to: "/sell", label: "Sell Item" }
];

export function Layout() {
  return (
    <>
      <div className="top-banner">Exclusive Student Marketplace | Buy • Sell • Exchange Student Essentials</div>
      <nav className="navbar">
        <Link className="logo" to="/">
          Study<span>Swap</span>
        </Link>
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => (isActive ? "nav-link-active" : undefined)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-icons">
          <Link to="/store" aria-label="Search">
            <i className="fa-solid fa-magnifying-glass" />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist">
            <i className="fa-regular fa-heart" />
          </Link>
          <Link to="/profile" aria-label="Profile">
            <i className="fa-regular fa-user" />
          </Link>
          <Link to="/cart" aria-label="Cart">
            <i className="fa-solid fa-cart-shopping" />
          </Link>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h2 className="logo">
              Study<span>Swap</span>
            </h2>
            <p>Student-first marketplace for affordable books, gadgets, calculators, and hostel essentials.</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <p><Link to="/">Home</Link></p>
            <p><Link to="/store">Marketplace</Link></p>
            <p><Link to="/categories">Categories</Link></p>
            <p><Link to="/contact">Contact</Link></p>
          </div>
          <div>
            <h3>Support</h3>
            <p><Link to="/auth">Login / Register</Link></p>
            <p><Link to="/profile">Dashboard</Link></p>
            <p><Link to="/sell">Sell an Item</Link></p>
            <p><Link to="/exchange">Exchange</Link></p>
          </div>
        </div>
        <div className="copyright">
          <span>© 2026 StudySwap. All rights reserved.</span>
          
        </div>
      </footer>
    </>
  );
}

export function PageHero({ tag, title, description }) {
  return (
    <section className="page-hero">
      <span className="pill">{tag}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="section-heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {subtitle ? <span className="section-subtitle">{subtitle}</span> : null}
    </div>
  );
}
