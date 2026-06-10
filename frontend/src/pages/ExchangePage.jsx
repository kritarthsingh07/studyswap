import { useState } from "react";
import { PageHero } from "../components/Layout";
import { Notice } from "../components/Notice";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

export function ExchangePage() {
  const [notice, setNotice] = useState({ message: "", tone: "success" });
  const { data, error } = useAsyncData(async () => {
    const [products, exchanges] = await Promise.all([api.getProducts({ limit: 50 }), api.getExchanges()]);
    return { products: products.products, exchanges: exchanges.exchanges };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await api.createExchange({
        requestedProduct: form.get("requestedProduct"),
        offeredProduct: form.get("offeredProduct")
      });

      setNotice({ message: "Exchange request created.", tone: "success" });
    } catch (submitError) {
      setNotice({ message: submitError.message, tone: "error" });
    }
  }

  return (
    <>
      <PageHero
        tag="EXCHANGE MODULE"
        title="Swap Products With Other Students"
        description="Create exchange requests and track their status from pending to completed."
      />
      <section className="section">
        <div className="two-col">
          <form className="form-card form-grid" onSubmit={handleSubmit}>
            <select className="input" name="offeredProduct" defaultValue="">
              <option value="" disabled>Select your offered product</option>
              {data?.products?.map((product) => (
                <option key={`offered-${product._id}`} value={product._id}>{product.title}</option>
              ))}
            </select>
            <select className="input" name="requestedProduct" defaultValue="">
              <option value="" disabled>Select requested product</option>
              {data?.products?.map((product) => (
                <option key={`requested-${product._id}`} value={product._id}>{product.title}</option>
              ))}
            </select>
            <button className="btn btn-primary" type="submit">Request Exchange</button>
            <Notice message={notice.message || error} tone={error ? "error" : notice.tone} />
          </form>
          <div className="info-grid">
            {data?.exchanges?.length ? (
              data.exchanges.map((exchange) => (
                <div className="info-card" key={exchange._id}>
                  <h3>{exchange.offeredProduct?.title} → {exchange.requestedProduct?.title}</h3>
                  <p className="muted">Status: {exchange.status}</p>
                </div>
              ))
            ) : (
              <div className="empty-state">No exchange requests yet.</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
