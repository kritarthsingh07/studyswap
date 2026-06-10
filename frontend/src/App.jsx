import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { AuthPage } from "./pages/AuthPage";
import { CartPage } from "./pages/CartPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ContactPage } from "./pages/ContactPage";
import { ExchangePage } from "./pages/ExchangePage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SellPage } from "./pages/SellPage";
import { StorePage } from "./pages/StorePage";
import { WishlistPage } from "./pages/WishlistPage";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/exchange" element={<ExchangePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
