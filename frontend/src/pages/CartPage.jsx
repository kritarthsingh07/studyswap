import { PageHero } from "../components/Layout";
import { CartGrid } from "../components/ProductGrid";
import { useAsyncData } from "../hooks/useAsyncData";
import { api, getAccessToken, getGuestCart } from "../services/api";

export function CartPage() {
  const { data, error } = useAsyncData(async () => {
    if (getAccessToken()) {
      const response = await api.getCart();
      return response.cart.items;
    }

    const guestCart = getGuestCart();
    if (!guestCart.length) {
      return [];
    }

    const allProducts = await api.getProducts({ limit: 100 });
    return guestCart
      .map((item) => ({
        ...item,
        productData: allProducts.products.find((product) => product._id === item.productId)
      }))
      .filter((item) => item.productData);
  }, []);

  return (
    <>
      <PageHero
        tag="PERSISTENT CART"
        title="Your Cart"
        description="Guest carts stay in local storage and signed-in carts sync with the backend."
      />
      <section className="section">
        {error ? <div className="empty-state">{error}</div> : <CartGrid items={data || []} />}
      </section>
    </>
  );
}
