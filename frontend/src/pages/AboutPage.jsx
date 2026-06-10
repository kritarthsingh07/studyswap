import { PageHero } from "../components/Layout";

export function AboutPage() {
  return (
    <>
      <PageHero
        tag="ABOUT STUDYSWAP"
        title="Built For Campus Commerce"
        description="StudySwap helps students buy, sell, and exchange essentials with better trust, better pricing, and cleaner workflows."
      />
      <section className="section">
        <div className="panel-grid">
          <div className="info-card"><h3>Student-first</h3><p>Focused on laptops, books, gadgets, calculators, and hostel needs.</p></div>
          <div className="info-card"><h3>Safer transactions</h3><p>Authentication, protected APIs, and verified profile flows are part of the full-stack upgrade.</p></div>
          <div className="info-card"><h3>Ready to scale</h3><p>The new structure supports MongoDB Atlas, Cloudinary, and Render deployment.</p></div>
        </div>
      </section>
    </>
  );
}
