import { connectDb } from "../config/db.js";
import { env } from "../config/env.js";
import { Category } from "../models/Category.js";

const categories = [
  { name: "Books", slug: "books", image: "/assets/category-books.webp" },
  { name: "Laptops", slug: "laptops", image: "/assets/category-laptop.png" },
  { name: "Phones", slug: "phones", image: "/assets/category-phone.webp" },
  { name: "Earbuds", slug: "earbuds", image: "/assets/category-earbuds.webp" },
  { name: "Smart Watches", slug: "smart-watches", image: "/assets/category-watch.webp" },
  { name: "Calculators", slug: "calculators", image: "/assets/category-calculator.webp" },
  { name: "Hostel Essentials", slug: "hostel-essentials", image: "/assets/category-hostel.webp" },
  { name: "Student Essentials", slug: "student-essentials", image: "/assets/category-books.webp" }
];

async function seed() {
  await connectDb(env.mongoUri);

  for (const category of categories) {
    await Category.updateOne({ slug: category.slug }, category, { upsert: true });
  }

  console.log("Seeded categories.");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
