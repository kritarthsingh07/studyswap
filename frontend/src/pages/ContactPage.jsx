import { useState } from "react";
import { PageHero } from "../components/Layout";
import { Notice } from "../components/Notice";
import { api } from "../services/api";

export function ContactPage() {
  const [notice, setNotice] = useState({ message: "", tone: "success" });

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await api.submitContact({
        name: form.get("name"),
        email: form.get("email"),
        subject: form.get("subject"),
        message: form.get("message")
      });

      setNotice({ message: "Message sent successfully.", tone: "success" });
      event.currentTarget.reset();
    } catch (error) {
      setNotice({ message: error.message, tone: "error" });
    }
  }

  return (
    <>
      <PageHero
        tag="CONTACT FORM"
        title="Get In Touch"
        description="Messages are stored in MongoDB and the backend is ready to send email notifications via Nodemailer."
      />
      <section className="section">
        <div className="two-col">
          <form className="form-card form-grid" onSubmit={handleSubmit}>
            <input className="input" name="name" placeholder="Your name" required />
            <input className="input" name="email" type="email" placeholder="Your email" required />
            <input className="input" name="subject" placeholder="Subject" required />
            <textarea className="textarea" name="message" placeholder="How can we help?" required />
            <button className="btn btn-primary" type="submit">Send Message</button>
            <Notice message={notice.message} tone={notice.tone} />
          </form>
          <div className="info-grid">
            <div className="info-card"><h3>Fast support</h3><p>Ask about listings, exchanges, or seller verification.</p></div>
            <div className="info-card"><h3>Email ready</h3><p>SMTP environment variables enable real notification delivery.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
