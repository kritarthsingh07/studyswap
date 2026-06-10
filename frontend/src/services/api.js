const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://your-render-service.onrender.com/api");

const TOKEN_KEY = "studyswap_access_token";
const GUEST_CART_KEY = "studyswap_guest_cart";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getGuestCart() {
  return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
}

export function setGuestCart(cart) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export const api = {
  health: () => request("/health"),
  getFeaturedProducts: () => request("/products/featured"),
  getProducts: (params = {}) => request(`/products?${new URLSearchParams(params).toString()}`),
  getProduct: (id) => request(`/products/${id}`),
  getCategories: () => request("/categories"),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  refresh: () => request("/auth/refresh"),
  me: () => request("/auth/me"),
  forgotPassword: (payload) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify(payload) }),
  resetPassword: (payload) =>
    request("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }),
  createProduct: (payload) =>
    request("/products", { method: "POST", body: JSON.stringify(payload) }),
  getCart: () => request("/cart"),
  addToCart: (payload) => request("/cart", { method: "POST", body: JSON.stringify(payload) }),
  updateCartItem: (itemId, payload) =>
    request(`/cart/${itemId}`, { method: "PUT", body: JSON.stringify(payload) }),
  removeCartItem: (itemId) => request(`/cart/${itemId}`, { method: "DELETE" }),
  getWishlist: () => request("/wishlist"),
  addWishlist: (payload) =>
    request("/wishlist", { method: "POST", body: JSON.stringify(payload) }),
  removeWishlist: (productId) => request(`/wishlist/${productId}`, { method: "DELETE" }),
  submitContact: (payload) =>
    request("/contact", { method: "POST", body: JSON.stringify(payload) }),
  getDashboard: () => request("/users/dashboard"),
  updateProfile: (payload) =>
    request("/users/profile", { method: "PUT", body: JSON.stringify(payload) }),
  changePassword: (payload) =>
    request("/users/password", { method: "PUT", body: JSON.stringify(payload) }),
  getNotifications: () => request("/notifications"),
  getExchanges: () => request("/exchange"),
  createExchange: (payload) =>
    request("/exchange", { method: "POST", body: JSON.stringify(payload) }),
  updateExchangeStatus: (id, payload) =>
    request(`/exchange/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  getAdminOverview: () => request("/admin/overview")
};
