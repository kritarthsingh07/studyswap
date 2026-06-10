import { api, getAccessToken, getGuestCart, setGuestCart } from "../services/api";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function ProductGrid({ products, onWishlistAdded, emptyMessage }) {
  async function addToWishlist(productId) {
    try {
      await api.addWishlist({ productId });
      onWishlistAdded?.("Added to wishlist.");
    } catch (error) {
      onWishlistAdded?.(`${error.message} Please sign in first.`);
    }
  }

  async function addToCart(productId) {
    try {
      if (getAccessToken()) {
        await api.addToCart({ productId, quantity: 1 });
      } else {
        const guestCart = getGuestCart();
        const existing = guestCart.find((item) => item.productId === productId);

        if (existing) {
          existing.quantity += 1;
        } else {
          guestCart.push({ productId, quantity: 1 });
        }

        setGuestCart(guestCart);
      }

      onWishlistAdded?.("Added to cart.");
    } catch (error) {
      onWishlistAdded?.(error.message);
    }
  }

  if (!products.length) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <article className="product-card" key={product._id}>
          <img src={product.images?.[0] || "/assets/heroimage.webp"} alt={product.title} />
          <div className="product-body">
            <span className="condition">{product.condition}</span>
            <h3>{product.title}</h3>
            <p className="muted">
              {product.seller?.name || "Verified Student Seller"} · {product.category?.name || "Category"}
            </p>
            <div className="product-meta">
              <span className="price">{currency.format(product.price)}</span>
              <div className="action-row">
                <button className="btn btn-primary" onClick={() => addToCart(product._id)}>
                  Add To Cart
                </button>
                <button className="btn btn-light" onClick={() => addToWishlist(product._id)}>
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CartGrid({ items }) {
  if (!items.length) {
    return <div className="empty-state">Your cart is empty. Start from the marketplace to add products.</div>;
  }

  return (
    <div className="grid">
      {items.map((item, index) => {
        const product = item.product || item.productData || {};

        return (
          <div className="card cart-item" key={item._id || item.productId || index}>
            <img src={product.images?.[0] || "/assets/heroimage.webp"} alt={product.title || "Item"} />
            <div>
              <h3>{product.title || "Saved product"}</h3>
              <p className="muted">{product.category?.name || "Student essential"}</p>
              <p className="price">{currency.format(product.price || 0)}</p>
            </div>
            <div className="action-row">
              <span>Qty: {item.quantity}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
