import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Crosshair,
  Home,
  Leaf,
  MapPin,
  PackageCheck,
  Phone,
  Recycle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SchedulePickup.css";
import { createPickup } from "../api/pickup";

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "9:00 AM – 12:00 PM", icon: "☀" },
  { id: "afternoon", label: "Afternoon", time: "12:00 PM – 3:00 PM", icon: "◐" },
  { id: "evening", label: "Evening", time: "4:00 PM – 7:00 PM", icon: "◒" },
];

const WEIGHT_RANGES = [
  { id: "0-5", label: "0 – 5 kg", helper: "Small household load" },
  { id: "5-10", label: "5 – 10 kg", helper: "Regular pickup" },
  { id: "10-20", label: "10 – 20 kg", helper: "Larger load" },
  { id: "20+", label: "20+ kg", helper: "Bulk scrap" },
];

const STATUS_STEPS = [
  { title: "Request submitted", text: "Your pickup request has been received.", icon: CheckCircle2 },
  { title: "Finding a collector", text: "Nearby collectors can now see your request.", icon: MapPin },
  { title: "Pickup scheduled", text: "The confirmed collector and timing will appear here.", icon: CalendarDays },
  { title: "Pickup completed", text: "Your sale will be recorded and rewards updated.", icon: PackageCheck },
];

function getToday() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateString}T12:00:00`));
}

function SchedulePickup() {
  const navigate = useNavigate();
  const today = getToday();
  const storedUser = useMemo(() => getStoredUser(), []);
  const username = storedUser?.username || storedUser?.userName || storedUser?.name || "User";
  const defaultMobile = storedUser?.mobile || storedUser?.phone || "";

  const [step, setStep] = useState(1);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [booking, setBooking] = useState(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    address: "",
    city: "",
    pincode: "",
    mobile: defaultMobile,
    location: "",
    latitude: "",
    longitude: "",
    pickupDate: today,
    timeSlot: "",
    weightRange: "",
    notes: "",
  });

  const updateField = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const validateStep = () => {
    const nextErrors = {};

    if (step === 1) {
      if (!form.address.trim()) nextErrors.address = "Please enter your pickup address.";
      if (!form.city.trim()) nextErrors.city = "Please enter your city or area.";
      if (!/^\d{6}$/.test(form.pincode.trim())) nextErrors.pincode = "Enter a valid 6-digit pincode.";
      if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) nextErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (step === 2) {
      if (!form.pickupDate) nextErrors.pickupDate = "Choose a pickup date.";
      if (!form.timeSlot) nextErrors.timeSlot = "Choose a time slot.";
      if (!form.weightRange) nextErrors.weightRange = "Choose an approximate scrap weight.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setStep((current) => Math.max(1, current - 1));
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setErrors((previous) => ({
        ...previous,
        location: "Location services are not supported by this browser.",
      }));
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateField("latitude", latitude.toFixed(6));
        updateField("longitude", longitude.toFixed(6));
        updateField("location", `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        setErrors((previous) => ({
          ...previous,
          location: "We could not access your location. You can continue with the address above.",
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleConfirm = async () => {
    if (!validateStep()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before scheduling a pickup.");
      navigate("/");
      return;
    }

    setSubmitLoading(true);

    try {
      const result = await createPickup({
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        mobile: form.mobile,
        location: form.location,
        latitude: form.latitude,
        longitude: form.longitude,
        pickupDate: form.pickupDate,
        timeSlot: form.timeSlot,
        weightRange: form.weightRange,
        notes: form.notes,
      });

      if (!result.success) {
        throw new Error(result.message || "Unable to create pickup");
      }

      const savedPickup = result.pickup;

      // Save latest server response locally
      localStorage.setItem(
        "scrapsmart_last_pickup",
        JSON.stringify(savedPickup)
      );

      // Keep a local copy for the current frontend history
      const existingHistory = JSON.parse(
        localStorage.getItem("scrapSmartPickups") || "[]"
      );

      localStorage.setItem(
        "scrapSmartPickups",
        JSON.stringify([
          savedPickup,
          ...existingHistory,
        ])
      );

      setBooking(savedPickup);
      setStep(3);

    } catch (error) {
      console.error("Pickup submission error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to schedule pickup. Please try again.";

      alert(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const copyRequestId = async () => {
    if (!booking?.requestId) return;
    try {
      await navigator.clipboard.writeText(booking.requestId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const resetBooking = () => {
    setBooking(null);
    setErrors({});
    setStep(1);
    setForm((previous) => ({
      ...previous,
      address: "",
      city: "",
      pincode: "",
      location: "",
      latitude: "",
      longitude: "",
      pickupDate: today,
      timeSlot: "",
      weightRange: "",
      notes: "",
    }));
  };

  const selectedTime = TIME_SLOTS.find((item) => item.id === form.timeSlot);
  const selectedWeight = WEIGHT_RANGES.find((item) => item.id === form.weightRange);
  const userInitials = username
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  return (
    <main className="schedule-page">
      <div className="schedule-orb schedule-orb-one" />
      <div className="schedule-orb schedule-orb-two" />
      <div className="schedule-grid" />

      <motion.section
        className="schedule-shell"
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="schedule-header">
          <button className="schedule-brand" type="button" onClick={() => navigate("/home")}>
            <span className="schedule-brand-icon"><Recycle size={18} /></span>
            <span><strong>Scrap</strong>Smart</span>
          </button>

          <div className="schedule-title-group">
            <span>HOUSEHOLD PICKUP</span>
            <strong>Schedule a Pickup</strong>
          </div>

          <button className="schedule-profile" type="button" onClick={() => navigate("/profile")}>
            <span className="schedule-avatar">{userInitials}</span>
            <span className="schedule-profile-name">{username}</span>
            <UserRound size={15} />
          </button>
        </header>

        <div className="schedule-body">
          <aside className="schedule-side">
            <div className="side-heading">
              <span className="side-kicker"><Sparkles size={13} /> Simple pickup flow</span>
              <h1>Let us collect your scrap.</h1>
              <p>Tell us where, when, and approximately how much scrap you have. You do not need to sort every item in advance.</p>
            </div>

            <div className="stepper">
              {[
                [1, "Pickup details", "Where should we come?"],
                [2, "Date & quantity", "When and how much?"],
                [3, "Confirmation", "Track the request"],
              ].map(([number, title, subtitle]) => {
                const active = step === number;
                const complete = step > number;
                return (
                  <div key={number} className={`stepper-item ${active ? "active" : ""} ${complete ? "complete" : ""}`}>
                    <span className="stepper-number">
                      {complete ? <Check size={14} /> : number}
                    </span>
                    <span className="stepper-copy">
                      <strong>{title}</strong>
                      <small>{subtitle}</small>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="side-trust">
              <span><ShieldCheck size={16} /></span>
              <div>
                <strong>Your request stays with ScrapSmart.</strong>
                <small>We use these details to coordinate your pickup and keep your activity history.</small>
              </div>
            </div>
          </aside>

          <section className="schedule-main">
            {step < 3 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  className="schedule-step-panel"
                  initial={{ opacity: 0, x: step === 1 ? -18 : 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: step === 1 ? 18 : -18 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="panel-heading">
                    <div>
                      <span className="panel-kicker">STEP {step} OF 2</span>
                      <h2>{step === 1 ? "Where should we pick it up?" : "Choose your pickup window"}</h2>
                      <p>{step === 1 ? "We need a clear address and contact number so the collector can reach you easily." : "Choose a preferred date, time slot and approximate scrap weight."}</p>
                    </div>
                    <span className="panel-icon">
                      {step === 1 ? <Home size={20} /> : <CalendarDays size={20} />}
                    </span>
                  </div>

                  {step === 1 ? (
                    <div className="form-grid">
                      <label className="field field-full">
                        <span>Pickup address <em>*</em></span>
                        <div className="input-wrap textarea-wrap">
                          <Home size={17} />
                          <textarea
                            value={form.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            placeholder="House / flat, street, locality"
                            rows={3}
                          />
                        </div>
                        {errors.address && <small className="field-error">{errors.address}</small>}
                      </label>

                      <label className="field">
                        <span>City / area <em>*</em></span>
                        <div className="input-wrap">
                          <MapPin size={17} />
                          <input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="e.g. Bhubaneswar" />
                        </div>
                        {errors.city && <small className="field-error">{errors.city}</small>}
                      </label>

                      <label className="field">
                        <span>Pincode <em>*</em></span>
                        <div className="input-wrap">
                          <Crosshair size={17} />
                          <input value={form.pincode} onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="751001" inputMode="numeric" />
                        </div>
                        {errors.pincode && <small className="field-error">{errors.pincode}</small>}
                      </label>

                      <label className="field">
                        <span>Mobile number <em>*</em></span>
                        <div className="input-wrap">
                          <Phone size={17} />
                          <input value={form.mobile} onChange={(e) => updateField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" inputMode="tel" />
                        </div>
                        {errors.mobile && <small className="field-error">{errors.mobile}</small>}
                      </label>

                      <div className="field location-field">
                        <span>Location pin <small>(optional but useful)</small></span>
                        <div className="location-row">
                          <div className={`location-display ${form.location ? "has-location" : ""}`}>
                            <MapPin size={16} />
                            <span>{form.location || "Location not captured yet"}</span>
                          </div>
                          <button type="button" className="location-btn" onClick={captureLocation} disabled={locationLoading}>
                            <Crosshair size={15} />
                            {locationLoading ? "Getting…" : "Use current location"}
                          </button>
                        </div>
                        {errors.location && <small className="field-error">{errors.location}</small>}
                      </div>
                    </div>
                  ) : (
                    <div className="form-grid">
                      <div className="field field-full">
                        <span>Pickup date <em>*</em></span>
                        <div className="date-input-row">
                          <div className="input-wrap">
                            <CalendarDays size={17} />
                            <input type="date" min={today} value={form.pickupDate} onChange={(e) => updateField("pickupDate", e.target.value)} />
                          </div>
                          <span className="date-hint">Preferred date — you can change this later.</span>
                        </div>
                        {errors.pickupDate && <small className="field-error">{errors.pickupDate}</small>}
                      </div>

                      <div className="field field-full">
                        <span>Preferred time slot <em>*</em></span>
                        <div className="option-grid time-options">
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot.id}
                              type="button"
                              className={`option-card ${form.timeSlot === slot.id ? "selected" : ""}`}
                              onClick={() => updateField("timeSlot", slot.id)}
                            >
                              <span className="option-icon"><Clock3 size={17} /></span>
                              <span><strong>{slot.label}</strong><small>{slot.time}</small></span>
                              <span className="radio-dot">{form.timeSlot === slot.id && <span />}</span>
                            </button>
                          ))}
                        </div>
                        {errors.timeSlot && <small className="field-error">{errors.timeSlot}</small>}
                      </div>

                      <div className="field field-full">
                        <span>Approximate scrap weight <em>*</em></span>
                        <div className="option-grid weight-options">
                          {WEIGHT_RANGES.map((range) => (
                            <button
                              key={range.id}
                              type="button"
                              className={`option-card weight-card ${form.weightRange === range.id ? "selected" : ""}`}
                              onClick={() => updateField("weightRange", range.id)}
                            >
                              <span className="option-icon"><PackageCheck size={17} /></span>
                              <span><strong>{range.label}</strong><small>{range.helper}</small></span>
                              <span className="radio-dot">{form.weightRange === range.id && <span />}</span>
                            </button>
                          ))}
                        </div>
                        {errors.weightRange && <small className="field-error">{errors.weightRange}</small>}
                        <div className="inline-note"><Leaf size={14} /> Scrap type is not required for this request. The collector can assess it during pickup.</div>
                      </div>

                      <label className="field field-full">
                        <span>Additional note <small>(optional)</small></span>
                        <div className="input-wrap textarea-wrap compact-textarea">
                          <Sparkles size={17} />
                          <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Anything the collector should know? Gate number, landmark, bulky items, etc." rows={2} />
                        </div>
                      </label>
                    </div>
                  )}

                  <div className="form-footer">
                    <button type="button" className="ghost-btn" onClick={() => navigate("/home")}>
                      <ArrowLeft size={16} /> Back to dashboard
                    </button>
                    {step === 1 ? (
                      <button type="button" className="next-btn" onClick={handleNext}>
                        Continue <ArrowRight size={16} />
                      </button>
                    ) : (
                      <div className="action-pair">
                        <button type="button" className="ghost-btn bordered" onClick={handleBack}>
                          <ChevronLeft size={16} /> Back
                        </button>
                        <button
                          type="button"
                          className="next-btn"
                          onClick={handleConfirm}
                          disabled={submitLoading}
                        >
                          {submitLoading ? (
                            <>
                              Saving pickup...
                            </>
                          ) : (
                            <>
                              Confirm pickup <CheckCircle2 size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                className="confirmation-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <div className="success-hero">
                  <motion.div
                    className="success-ring"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 180, damping: 13, delay: 0.08 }}
                  >
                    <CheckCircle2 size={34} />
                  </motion.div>
                  <span className="panel-kicker">REQUEST CONFIRMED</span>
                  <h2>Your pickup is in motion.</h2>
                  <p>Your request has been sent to ScrapSmart. Nearby collectors can now respond to your preferred pickup window.</p>
                </div>

                <div className="booking-meta">
                  <div>
                    <span>REQUEST ID</span>
                    <strong>{booking?.requestId}</strong>
                  </div>
                  <button type="button" onClick={copyRequestId} className="copy-id-btn">
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? "Copied" : "Copy ID"}
                  </button>
                </div>

                <div className="confirmation-grid">
                  <div className="summary-card">
                    <span className="summary-icon"><CalendarDays size={16} /></span>
                    <div><small>Pickup window</small><strong>{formatDate(booking?.pickupDate)}</strong><span>{selectedTime?.time || "—"}</span></div>
                  </div>
                  <div className="summary-card">
                    <span className="summary-icon"><PackageCheck size={16} /></span>
                    <div><small>Estimated scrap</small><strong>{selectedWeight?.label || "—"}</strong><span>Approximate quantity</span></div>
                  </div>
                  <div className="summary-card wide">
                    <span className="summary-icon"><MapPin size={16} /></span>
                    <div><small>Pickup address</small><strong>{booking?.address}</strong><span>{booking?.city} • {booking?.pincode}</span></div>
                  </div>
                </div>

                <div className="status-card">
                  <div className="status-header">
                    <div>
                      <span className="panel-kicker">LIVE REQUEST STATUS</span>
                      <h3>Pickup journey</h3>
                    </div>
                    <span className="status-live"><span /> Request received</span>
                  </div>

                  <div className="status-timeline">
                    {STATUS_STEPS.map((status, index) => {
                      const Icon = status.icon;
                      const complete = index === 0;
                      const active = index === 1;
                      return (
                        <div className={`status-step ${complete ? "done" : ""} ${active ? "active" : ""}`} key={status.title}>
                          <div className="status-node">
                            <Icon size={15} />
                          </div>
                          <div className="status-step-copy">
                            <strong>{status.title}</strong>
                            <span>{status.text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="status-message">
                    <Truck size={17} />
                    <span><strong>What happens next?</strong> We’ll use your pickup details to match the request with a nearby collector. Once a collector accepts, this status area can be updated from your backend.</span>
                  </div>
                </div>

                <div className="confirmation-actions">
                  <button type="button" className="ghost-btn bordered" onClick={() => navigate("/pickup-history")}>
                    View My Activity <ArrowRight size={15} />
                  </button>
                  <button type="button" className="next-btn" onClick={resetBooking}>
                    <RotateCcw size={15} /> Schedule another pickup
                  </button>
                </div>
              </motion.div>
            )}
          </section>
        </div>
      </motion.section>
    </main>
  );
}

export default SchedulePickup;
