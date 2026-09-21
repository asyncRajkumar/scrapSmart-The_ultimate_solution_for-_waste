import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  IndianRupee,
  MapPin,
  PackageCheck,
  Phone,
  Recycle,
  Search,
  Truck,
  UserRound,
  X,
  AlertCircle,
  CircleDot,
  History,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./PickupHistory.css";
import { getMyPickups } from "../api/pickup";

const STATUS_STEPS = [
  { key: "submitted", label: "Request submitted" },
  { key: "finding", label: "Finding collector" },
  { key: "scheduled", label: "Pickup scheduled" },
  { key: "onway", label: "Collector on the way" },
  { key: "completed", label: "Pickup completed" },
];

function readStoredPickups() {
  const keys = [
    "scrapSmartPickups",
    "scrapsmartPickups",
    "pickupHistory",
    "scrapSmartPickupHistory",
  ];

  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed)
        ? parsed
        : parsed
          ? [parsed]
          : [];

      if (list.length) return list;
    } catch {
      // Ignore invalid localStorage values and try the next supported key.
    }
  }

  return [];
}

function formatTimeSlot(slot) {
  const slots = {
    morning: "9:00 AM – 12:00 PM",
    afternoon: "12:00 PM – 3:00 PM",
    evening: "4:00 PM – 7:00 PM",
  };

  return slots[slot] || slot || "Time not available";
}

function formatWeight(weight) {
  const weights = {
    "0-5": "0 – 5 kg",
    "5-10": "5 – 10 kg",
    "10-20": "10 – 20 kg",
    "20+": "20+ kg",
  };

  return weights[weight] || weight || "Not specified";
}

function normalizePickup(item) {
  const statusText = String(
    item?.status || "submitted"
  );

  const lower = statusText.toLowerCase();

  let statusKey = "submitted";
  let displayStatus = "Request Submitted";

  if (lower === "finding_collector") {
    statusKey = "finding";
    displayStatus = "Finding Collector";
  } else if (lower === "scheduled") {
    statusKey = "scheduled";
    displayStatus = "Pickup Scheduled";
  } else if (lower === "on_the_way") {
    statusKey = "onway";
    displayStatus = "Collector On The Way";
  } else if (lower === "completed") {
    statusKey = "completed";
    displayStatus = "Completed";
  } else if (lower === "cancelled") {
    statusKey = "cancelled";
    displayStatus = "Cancelled";
  } else if (lower === "submitted") {
    statusKey = "submitted";
    displayStatus = "Request Submitted";
  }

  return {
    id: item?.requestId || item?._id || "Unknown",

    mongoId: item?._id,

    date: item?.pickupDate || "Date not available",

    time: formatTimeSlot(item?.timeSlot),

    createdAt: item?.createdAt
      ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(item.createdAt))
      : "—",

    address: item?.address || "Address not available",

    city: item?.city || "",

    pincode: item?.pincode || "",

    weight: formatWeight(item?.weightRange),

    status: displayStatus,

    statusKey,

    amount:
      item?.finalAmount ??
      null,

    note:
      item?.notes ||
      "No additional notes.",

    collector: {
      name:
        item?.collector?.name ||
        "A collector will be assigned",

      phone:
        item?.collector?.phone ||
        null,
    },
  };
}

function getStatusIndex(statusKey) {
  const index = STATUS_STEPS.findIndex((step) => step.key === statusKey);
  return index >= 0 ? index : 1;
}

function statusIcon(statusKey) {
  if (statusKey === "completed") return <CheckCircle2 size={15} />;
  if (statusKey === "cancelled") return <X size={15} />;
  if (statusKey === "onway") return <Truck size={15} />;
  if (statusKey === "scheduled") return <CalendarDays size={15} />;
  return <CircleDot size={15} />;
}

function StatusPill({ pickup }) {
  return (
    <span className={`ph-status ph-${pickup.statusKey}`}>
      {statusIcon(pickup.statusKey)}
      {pickup.status}
    </span>
  );
}

function MiniProgress({ pickup }) {
  if (pickup.statusKey === "cancelled") {
    return (
      <div className="ph-cancelled-track">
        <AlertCircle size={16} />
        <span>This pickup was cancelled.</span>
      </div>
    );
  }

  const activeIndex = getStatusIndex(pickup.statusKey);

  return (
    <div className="ph-progress">
      {STATUS_STEPS.map((step, index) => {
        const done = index <= activeIndex;
        const active = index === activeIndex;

        return (
          <React.Fragment key={step.key}>
            <div className="ph-progress-step">
              <div
                className={`ph-progress-dot ${done ? "done" : ""
                  } ${active ? "active" : ""}`}
              >
                {done ? <CheckCircle2 size={13} /> : <span />}
              </div>
              <span className={done ? "done-label" : ""}>{step.label}</span>
            </div>

            {index !== STATUS_STEPS.length - 1 && (
              <div
                className={`ph-progress-line ${index < activeIndex ? "filled" : ""
                  }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function PickupDetails({ pickup, onClose }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="ph-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="ph-modal"
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ph-modal-header">
          <div>
            <span className="ph-small-label">PICKUP DETAILS</span>
            <h2>{pickup.id}</h2>
          </div>

          <button type="button" className="ph-close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        <div className="ph-modal-status">
          <StatusPill pickup={pickup} />
          <span>Requested on {pickup.createdAt}</span>
        </div>

        <MiniProgress pickup={pickup} />

        <div className="ph-detail-grid">
          <div className="ph-detail-box">
            <div className="ph-detail-icon"><CalendarDays size={17} /></div>
            <div>
              <span>Pickup date</span>
              <strong>{pickup.date}</strong>
            </div>
          </div>

          <div className="ph-detail-box">
            <div className="ph-detail-icon"><Clock3 size={17} /></div>
            <div>
              <span>Time slot</span>
              <strong>{pickup.time}</strong>
            </div>
          </div>

          <div className="ph-detail-box">
            <div className="ph-detail-icon"><PackageCheck size={17} /></div>
            <div>
              <span>Estimated weight</span>
              <strong>{pickup.weight}</strong>
            </div>
          </div>

          <div className="ph-detail-box">
            <div className="ph-detail-icon"><MapPin size={17} /></div>
            <div>
              <span>Pickup address</span>
              <strong>
                {pickup.address}
                {pickup.pincode ? `, ${pickup.pincode}` : ""}
              </strong>
            </div>
          </div>
        </div>

        <div className="ph-collector-box">
          <div className="ph-collector-avatar">
            <UserRound size={20} />
          </div>
          <div className="ph-collector-copy">
            <span>Collector</span>
            <strong>{pickup.collector.name}</strong>
            <small>
              {pickup.collector.phone || "Contact becomes available after assignment."}
            </small>
          </div>

          {pickup.collector.phone && (
            <a href={`tel:${pickup.collector.phone}`} className="ph-call">
              <Phone size={15} />
              Call
            </a>
          )}
        </div>

        <div className="ph-note-box">
          <span>Pickup note</span>
          <p>{pickup.note}</p>
        </div>

        <div className="ph-payment-row">
          <div>
            <span>
              {pickup.statusKey === "completed"
                ? "Final amount"
                : "Expected settlement"}
            </span>
            <strong>
              {pickup.amount !== null && pickup.amount !== undefined
                ? `₹${Number(pickup.amount).toLocaleString("en-IN")}`
                : "Pending"}
            </strong>
          </div>

          <button
            type="button"
            className="ph-modal-primary"
            onClick={() => navigate("/schedule-pickup")}
          >
            Schedule another
            <ArrowRight size={15} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PickupHistory() {
  const navigate = useNavigate();
  const [showCurrentOnly, setShowCurrentOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  const username =
    storedUser?.username ||
    storedUser?.userName ||
    "User";

  useEffect(() => {
    const fetchPickups = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your pickup history.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getMyPickups();

        if (result.success) {
          setPickups(result.pickups || []);
        } else {
          setError(result.message || "Unable to load pickup history.");
        }
      } catch (error) {
        console.error("Pickup history error:", error);

        const message =
          error.response?.data?.message ||
          "Unable to load pickup history.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPickups();
  }, []);
  const allPickups = useMemo(() => {
    return pickups.map(normalizePickup);
  }, [pickups]);

  const currentPickup = useMemo(() => {
    return allPickups.find((pickup) =>
      ["submitted", "finding", "scheduled", "onway"].includes(
        pickup.statusKey
      )
    );
  }, [allPickups]);

  const completedCount = allPickups.filter(
    (pickup) => pickup.statusKey === "completed"
  ).length;

  const totalValue = allPickups.reduce(
    (total, pickup) =>
      pickup.statusKey === "completed" && pickup.amount
        ? total + Number(pickup.amount)
        : total,
    0
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allPickups.filter((pickup) => {
      if (showCurrentOnly && pickup.id !== currentPickup?.id) return false;

      if (!normalizedQuery) return true;

      return (
        pickup.id.toLowerCase().includes(normalizedQuery) ||
        pickup.status.toLowerCase().includes(normalizedQuery) ||
        pickup.address.toLowerCase().includes(normalizedQuery) ||
        pickup.weight.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [allPickups, currentPickup, query, showCurrentOnly]);

  return (
    <div className="ph-page">
      <div className="ph-bg-orb ph-orb-a" />
      <div className="ph-bg-orb ph-orb-b" />
      <div className="ph-grid-bg" />

      <main className="ph-shell">
        <header className="ph-header">
          <button
            type="button"
            className="ph-back"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="ph-brand">
            <div className="ph-brand-mark">
              <Recycle size={20} />
            </div>
            <div>
              <div className="ph-brand-name">
                Scrap<span>Smart</span>
              </div>
              <div className="ph-brand-sub">PICKUP HISTORY</div>
            </div>
          </div>

          <div className="ph-user-pill">
            <div className="ph-user-avatar">
              {username.slice(0, 1).toUpperCase()}
            </div>
            <div className="ph-user-copy">
              <span>Hi,</span>
              <strong>{username}</strong>
            </div>
          </div>
        </header>

        <section className="ph-top">
          <motion.div
            className="ph-intro"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="ph-eyebrow">
              <History size={14} />
              YOUR SCRAP JOURNEY
            </span>

            <h1>
              Track every pickup,
              <span>all in one place.</span>
            </h1>

            <p>
              See your active request, previous pickups, collector details,
              status updates and completed settlement records.
            </p>
          </motion.div>

          <motion.div
            className="ph-summary-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 }}
          >
            <div className="ph-summary-head">
              <span>YOUR SCRAPSMART SUMMARY</span>
              <div className="ph-summary-live">
                <span />
                Updated now
              </div>
            </div>

            <div className="ph-summary-stats">
              <div>
                <strong>{completedCount}</strong>
                <span>Completed pickups</span>
              </div>
              <div>
                <strong>₹{totalValue.toLocaleString("en-IN")}</strong>
                <span>Total recorded value</span>
              </div>
            </div>

            {currentPickup ? (
              <div className="ph-current-mini">
                <div className="ph-current-mini-icon">
                  <Truck size={18} />
                </div>
                <div>
                  <span>Active pickup</span>
                  <strong>{currentPickup.id}</strong>
                </div>
                <StatusPill pickup={currentPickup} />
              </div>
            ) : (
              <div className="ph-current-mini">
                <div className="ph-current-mini-icon">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <span>No active pickup</span>
                  <strong>Ready for your next request</strong>
                </div>
                <button
                  type="button"
                  className="ph-new-mini"
                  onClick={() => navigate("/schedule-pickup")}
                >
                  New
                </button>
              </div>
            )}
          </motion.div>
        </section>

        {currentPickup && (
          <motion.section
            className="ph-current-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="ph-current-header">
              <div>
                <span className="ph-small-label">CURRENT SCHEDULED PICKUP</span>
                <div className="ph-current-title-row">
                  <h2>{currentPickup.id}</h2>
                  <StatusPill pickup={currentPickup} />
                </div>
              </div>

              <button
                type="button"
                className="ph-view-btn"
                onClick={() => setSelectedPickup(currentPickup)}
              >
                <Eye size={15} />
                View details
              </button>
            </div>

            <div className="ph-current-info">
              <div className="ph-current-date">
                <div className="ph-date-box">
                  <span>{currentPickup.date.split(" ")[1]?.replace(",", "") || "—"}</span>
                  <strong>{currentPickup.date.split(" ")[0] || "—"}</strong>
                </div>

                <div>
                  <span className="ph-info-label">Scheduled for</span>
                  <strong>{currentPickup.date}</strong>
                  <p>
                    <Clock3 size={14} />
                    {currentPickup.time}
                  </p>
                </div>
              </div>

              <div className="ph-current-location">
                <span className="ph-info-label">Pickup location</span>
                <strong>{currentPickup.address}</strong>
                <p>
                  <MapPin size={14} />
                  {currentPickup.city || "India"}{" "}
                  {currentPickup.pincode ? `• ${currentPickup.pincode}` : ""}
                </p>
              </div>

              <div className="ph-current-weight">
                <span className="ph-info-label">Estimated scrap</span>
                <strong>{currentPickup.weight}</strong>
                <p>
                  <PackageCheck size={14} />
                  Final weight at pickup
                </p>
              </div>
            </div>

            <MiniProgress pickup={currentPickup} />
          </motion.section>
        )}

        <section className="ph-history-section">
          <div className="ph-section-heading">
            <div>
              <span className="ph-small-label">PICKUP RECORDS</span>
              <h2>Your pickup history</h2>
            </div>

            <button
              type="button"
              className="ph-primary"
              onClick={() => navigate("/schedule-pickup")}
            >
              Schedule Pickup
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="ph-toolbar">
            <label className="ph-search">
              <Search size={17} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by request ID, area, status..."
              />
            </label>

            <div className="ph-filter-wrap">
              <button
                type="button"
                className={`ph-filter-btn ${showCurrentOnly ? "active" : ""}`}
                onClick={() => setOpenFilter((value) => !value)}
              >
                <CircleDot size={14} />
                {showCurrentOnly ? "Current pickup" : "All pickups"}
                <ChevronDown size={14} />
              </button>

              <AnimatePresence>
                {openFilter && (
                  <motion.div
                    className="ph-filter-menu"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowCurrentOnly(false);
                        setOpenFilter(false);
                      }}
                    >
                      All pickups
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCurrentOnly(true);
                        setOpenFilter(false);
                      }}
                    >
                      Current pickup
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {loading ? (
            <div className="ph-empty">
              <Truck size={25} />

              <h3>Loading your pickups...</h3>

              <p>
                We're getting your pickup history from ScrapSmart.
              </p>
            </div>
          ) : error ? (
            <div className="ph-empty">
              <AlertCircle size={25} />

              <h3>Unable to load history</h3>

              <p>{error}</p>

              <button
                type="button"
                className="ph-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="ph-records">
                <AnimatePresence>
                  {filtered.map((pickup, index) => (
                    <motion.article
                      key={pickup.mongoId || pickup.id || index}
                      className="ph-record"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                    >
                      <div className="ph-record-top">
                        <div>
                          <span className="ph-request-id">{pickup.id}</span>
                          <h3>{pickup.date}</h3>
                          <p>
                            <Clock3 size={14} />
                            {pickup.time}
                          </p>
                        </div>

                        <StatusPill pickup={pickup} />
                      </div>

                      <div className="ph-record-info">
                        <div>
                          <MapPin size={16} />
                          <span>
                            {pickup.address}
                            {pickup.city ? `, ${pickup.city}` : ""}
                            {pickup.pincode ? ` - ${pickup.pincode}` : ""}
                          </span>
                        </div>

                        <div>
                          <PackageCheck size={16} />
                          <span>{pickup.weight}</span>
                        </div>
                      </div>

                      <MiniProgress pickup={pickup} />

                      <div className="ph-record-bottom">
                        <span>Requested {pickup.createdAt}</span>

                        <button
                          type="button"
                          className="ph-view-btn"
                          onClick={() => setSelectedPickup(pickup)}
                        >
                          <Eye size={15} />
                          View details
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {filtered.length === 0 && (
                <div className="ph-empty">
                  <Search size={25} />

                  <h3>No pickup records found</h3>

                  <p>
                    Try another search or schedule a new pickup to start
                    building your history.
                  </p>

                  <button
                    type="button"
                    className="ph-primary"
                    onClick={() => navigate("/schedule-pickup")}
                  >
                    Schedule Pickup
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}

        </section>

        <section className="ph-bottom-note">
          <div className="ph-bottom-note-icon">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <strong>Your history stays organized.</strong>
            <p>
              Your pickup records are loaded directly from ScrapSmart and kept
              organized by request, status, date and settlement details.
            </p>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedPickup && (
          <PickupDetails
            pickup={selectedPickup}
            onClose={() => setSelectedPickup(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default PickupHistory;