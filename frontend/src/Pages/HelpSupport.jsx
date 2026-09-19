import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Recycle,
  Send,
  UserRound,
  X,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./HelpSupport.css";

// Replace this with your real support email before deployment.
const SUPPORT_EMAIL = "rajkumarsahoo08941@gmail.com";
const SUPPORT_PHONE = "+91 82609 79785";

function HelpSupport() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const username =
    localStorage.getItem("username") ||
    localStorage.getItem("userName") ||
    "";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }

    const subject =
      form.subject.trim() || "ScrapSmart Help & Support Query";

    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "Not provided"}`,
      "",
      "Message:",
      form.message,
    ].join("\n");

    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setSent(false);
    setError("");
  };

  return (
    <div className="hs-page">
      <div className="hs-orb hs-orb-one" />
      <div className="hs-orb hs-orb-two" />
      <div className="hs-grid" />

      <main className="hs-shell">
        <header className="hs-header">
          <button
            type="button"
            className="hs-back"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="hs-brand">
            <div className="hs-brand-mark">
              <Recycle size={20} />
            </div>

            <div>
              <div className="hs-brand-name">
                Scrap<span>Smart</span>
              </div>
              <div className="hs-brand-sub">HELP & SUPPORT</div>
            </div>
          </div>

          <div className="hs-user">
            <div className="hs-user-avatar">
              {(username || "U").slice(0, 1).toUpperCase()}
            </div>
            <div className="hs-user-copy">
              <span>Hi,</span>
              <strong>{username || "User"}</strong>
            </div>
          </div>
        </header>

        <section className="hs-hero">
          <motion.div
            className="hs-hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="hs-eyebrow">
              <HelpCircle size={14} />
              WE ARE HERE TO HELP
            </span>

            <h1>
              Have a question?
              <span>Let&apos;s sort it out.</span>
            </h1>

            <p>
              Need help with a pickup, pricing, account, payment or anything
              else? Reach out to the ScrapSmart team and we&apos;ll get back to
              you.
            </p>

            <div className="hs-quick-note">
              <div className="hs-note-icon">
                <Clock3 size={18} />
              </div>
              <div>
                <strong>Support hours</strong>
                <span>Monday – Saturday • 9:00 AM – 7:00 PM</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hs-contact-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <div className="hs-contact-badge">
              <span className="hs-live-dot" />
              QUICK CONTACT
            </div>

            <div className="hs-contact-icon">
              <Phone size={24} />
            </div>

            <span className="hs-contact-label">Call our support team</span>

            <a className="hs-phone" href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}>
              {SUPPORT_PHONE}
            </a>

            <p>
              Call us directly for help with your pickup, account or ScrapSmart
              service.
            </p>

            <a
              className="hs-call-btn"
              href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
            >
              <Phone size={16} />
              Call Support
              <ArrowRight size={16} />
            </a>

            <div className="hs-mini-contact">
              <div>
                <Mail size={15} />
                <span>Email support</span>
              </div>
              <strong>{SUPPORT_EMAIL}</strong>
            </div>
          </motion.div>
        </section>

        <section className="hs-main">
          <motion.div
            className="hs-form-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <div className="hs-section-title">
              <div className="hs-title-icon">
                <MessageCircle size={19} />
              </div>
              <div>
                <span>CONTACT US</span>
                <h2>Send us your query</h2>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  className="hs-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="hs-success-icon">
                    <CheckCircle2 size={30} />
                  </div>

                  <h3>Your message is ready to send</h3>

                  <p>
                    Your email app should have opened with your ScrapSmart
                    support query. Send the prepared email to complete the
                    request.
                  </p>

                  <div className="hs-success-actions">
                    <button
                      type="button"
                      className="hs-primary"
                      onClick={resetForm}
                    >
                      Send another query
                    </button>

                    <button
                      type="button"
                      className="hs-secondary"
                      onClick={() => navigate("/home")}
                    >
                      Back to dashboard
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="hs-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="hs-field-row">
                    <label className="hs-field">
                      <span>Name *</span>
                      <div className="hs-input-wrap">
                        <UserRound size={16} />
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                        />
                      </div>
                    </label>

                    <label className="hs-field">
                      <span>Email *</span>
                      <div className="hs-input-wrap">
                        <Mail size={16} />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="hs-field-row">
                    <label className="hs-field">
                      <span>Mobile number</span>
                      <div className="hs-input-wrap">
                        <Phone size={16} />
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </label>

                    <label className="hs-field">
                      <span>Subject</span>
                      <div className="hs-input-wrap">
                        <MessageCircle size={16} />
                        <input
                          type="text"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="e.g. Pickup issue"
                        />
                      </div>
                    </label>
                  </div>

                  <label className="hs-field">
                    <span>Your query *</span>
                    <div className="hs-textarea-wrap">
                      <MessageCircle size={16} />
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        rows={6}
                      />
                    </div>
                  </label>

                  {error && (
                    <motion.div
                      className="hs-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="hs-form-footer">
                    <span>
                      <CheckCircle2 size={14} />
                      We&apos;ll use your details only to respond to your query.
                    </span>

                    <button type="submit" className="hs-primary hs-submit">
                      Prepare Email
                      <Send size={16} />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.aside
            className="hs-side"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div className="hs-side-card">
              <div className="hs-side-icon">
                <MapPin size={21} />
              </div>
              <span>Pickup support</span>
              <h3>Need help with a scheduled pickup?</h3>
              <p>
                Keep your pickup request ID ready when contacting support. It
                helps us find your booking faster.
              </p>
            </div>

            <div className="hs-side-card">
              <div className="hs-side-icon">
                <Phone size={21} />
              </div>
              <span>Prefer calling?</span>
              <h3>We&apos;re one call away.</h3>
              <p>
                Call the number below for direct support regarding your
                ScrapSmart request.
              </p>

              <a
                href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                className="hs-side-phone"
              >
                {SUPPORT_PHONE}
              </a>
            </div>

            <div className="hs-side-card hs-location-card">
              <div className="hs-side-icon">
                <Recycle size={21} />
              </div>
              <span>ScrapSmart promise</span>
              <h3>Simple. Transparent. Helpful.</h3>
              <p>
                We want every scrap pickup to feel easy from scheduling to
                settlement.
              </p>
            </div>
          </motion.aside>
        </section>

        <footer className="hs-footer">
          <span>
            <MapPin size={14} />
            ScrapSmart Support
          </span>
          <span>We&apos;re here to help you recycle smarter.</span>
        </footer>
      </main>
    </div>
  );
}

export default HelpSupport;