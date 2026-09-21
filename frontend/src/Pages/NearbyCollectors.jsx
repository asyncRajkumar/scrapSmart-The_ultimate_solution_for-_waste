import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Recycle,
  Search,
  ShieldCheck,
  Star,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNearbyCollectors } from "../api/community";
import "./NearbyCollectors.css";

const FALLBACK_LOCATION = {
  latitude: 20.2961,
  longitude: 85.8245,
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function availabilityLabel(status) {
  if (status === "available") return "Available now";
  if (status === "busy") return "Currently busy";
  return "Offline";
}

function availabilityClass(status) {
  return `nc-${status || "offline"}`;
}

function openDirections(latitude, longitude) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function CollectorCard({ collector, onView }) {
  return (
    <motion.article
      className="nc-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4 }}
    >
      <div className="nc-card-top">
        <div className="nc-avatar">
          <Truck size={21} />
        </div>

        <div className="nc-card-heading">
          <div className="nc-name-row">
            <h3>{collector.businessName}</h3>
            {collector.verified && (
              <ShieldCheck size={15} title="Verified collector" />
            )}
          </div>
          <p>{collector.name}</p>
        </div>

        <span className={`nc-status ${availabilityClass(collector.availability)}`}>
          <span />
          {availabilityLabel(collector.availability)}
        </span>
      </div>

      <div className="nc-rating-row">
        <span className="nc-rating">
          <Star size={14} fill="currentColor" />
          {Number(collector.rating || 0).toFixed(1)}
        </span>
        <span>{collector.totalPickups || 0} pickups completed</span>
        <span className="nc-distance">
          <Navigation size={13} />
          {collector.distanceKm} km away
        </span>
      </div>

      <div className="nc-address">
        <MapPin size={16} />
        <span>{collector.address || collector.city}</span>
      </div>

      <div className="nc-materials">
        {collector.materials?.slice(0, 4).map((material) => (
          <span key={material}>{material}</span>
        ))}
      </div>

      <div className="nc-actions">
        <button type="button" className="nc-secondary" onClick={onView}>
          View details
          <ArrowRight size={15} />
        </button>

        <button
          type="button"
          className="nc-primary"
          onClick={() => openDirections(collector.latitude, collector.longitude)}
        >
          <Navigation size={15} />
          Directions
        </button>
      </div>
    </motion.article>
  );
}

function CollectorDetails({ collector, onClose }) {
  if (!collector) return null;

  return (
    <motion.div
      className="nc-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="nc-modal"
        initial={{ opacity: 0, y: 22, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="nc-modal-header">
          <div>
            <span className="nc-small-label">COLLECTOR DETAILS</span>
            <h2>{collector.businessName}</h2>
          </div>
          <button type="button" className="nc-close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        <div className="nc-modal-profile">
          <div className="nc-modal-avatar">
            <Truck size={25} />
          </div>
          <div>
            <strong>{collector.name}</strong>
            <span>{collector.city}</span>
          </div>
        </div>

        <div className="nc-detail-grid">
          <div>
            <Star size={16} />
            <span>Rating</span>
            <strong>{Number(collector.rating || 0).toFixed(1)} / 5</strong>
          </div>
          <div>
            <Recycle size={16} />
            <span>Pickups</span>
            <strong>{collector.totalPickups || 0}</strong>
          </div>
          <div>
            <MapPin size={16} />
            <span>Distance</span>
            <strong>{collector.distanceKm} km</strong>
          </div>
          <div>
            <Clock3 size={16} />
            <span>Status</span>
            <strong>{availabilityLabel(collector.availability)}</strong>
          </div>
        </div>

        <div className="nc-modal-section">
          <span className="nc-section-title">Pickup location</span>
          <p>{collector.address || collector.city}</p>
        </div>

        <div className="nc-modal-section">
          <span className="nc-section-title">Materials handled</span>
          <div className="nc-materials large">
            {collector.materials?.map((material) => (
              <span key={material}>{material}</span>
            ))}
          </div>
        </div>

        <div className="nc-modal-footer">
          {collector.phone ? (
            <a href={`tel:${collector.phone}`} className="nc-secondary">
              <Phone size={15} />
              Call collector
            </a>
          ) : (
            <span className="nc-contact-muted">Contact unavailable</span>
          )}

          <button
            type="button"
            className="nc-primary"
            onClick={() => openDirections(collector.latitude, collector.longitude)}
          >
            <Navigation size={15} />
            Open map
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NearbyCollectors() {
  const navigate = useNavigate();
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState(FALLBACK_LOCATION);
  const [locationMode, setLocationMode] = useState("default");
  const [selectedCollector, setSelectedCollector] = useState(null);

  const user = useMemo(() => getStoredUser(), []);
  const username = user?.username || user?.userName || user?.name || "User";
  const initials = username.slice(0, 1).toUpperCase();

  const loadCollectors = async (coords = location, selectedRadius = radius) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to see nearby collectors.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await getNearbyCollectors({
        latitude: coords.latitude,
        longitude: coords.longitude,
        radius: selectedRadius,
      });

      if (!result.success) {
        throw new Error(result.message || "Unable to load collectors");
      }

      setCollectors(result.collectors || []);
    } catch (err) {
      console.error("Nearby collectors error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load nearby collectors."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      loadCollectors();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        setLocationMode("live");
        loadCollectors(coords, radius);
      },
      () => {
        setLocationMode("default");
        loadCollectors(FALLBACK_LOCATION, radius);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCollectors = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return collectors;

    return collectors.filter((collector) => {
      const haystack = [
        collector.name,
        collector.businessName,
        collector.city,
        collector.address,
        ...(collector.materials || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [collectors, search]);

  const availableCount = collectors.filter(
    (collector) => collector.availability === "available"
  ).length;

  const refreshLocation = () => {
    if (!navigator.geolocation) {
      setLocation(FALLBACK_LOCATION);
      setLocationMode("default");
      loadCollectors(FALLBACK_LOCATION, radius);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        setLocationMode("live");
        loadCollectors(coords, radius);
      },
      () => {
        setLocation(FALLBACK_LOCATION);
        setLocationMode("default");
        loadCollectors(FALLBACK_LOCATION, radius);
      }
    );
  };

  const changeRadius = (value) => {
    const next = Number(value);
    setRadius(next);
    loadCollectors(location, next);
  };

  return (
    <div className="nc-page">
      <div className="nc-bg-orb nc-orb-a" />
      <div className="nc-bg-orb nc-orb-b" />
      <div className="nc-grid-bg" />

      <main className="nc-shell">
        <header className="nc-header">
          <button type="button" className="nc-back" onClick={() => navigate("/home")}>
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="nc-brand">
            <div className="nc-brand-mark">
              <Recycle size={20} />
            </div>
            <div>
              <div className="nc-brand-name">
                Scrap<span>Smart</span>
              </div>
              <div className="nc-brand-sub">NEARBY COLLECTORS</div>
            </div>
          </div>

          <div className="nc-user-pill">
            <div className="nc-user-avatar">{initials}</div>
            <div className="nc-user-copy">
              <span>Hi,</span>
              <strong>{username}</strong>
            </div>
          </div>
        </header>

        <section className="nc-hero">
          <div className="nc-hero-copy">
            <span className="nc-eyebrow">
              <Users size={14} />
              LOCAL COLLECTION NETWORK
            </span>
            <h1>
              Find collectors
              <span>around you.</span>
            </h1>
            <p>
              Explore verified ScrapSmart collectors nearby, see their activity,
              check availability and open directions in one tap.
            </p>
          </div>

          <div className="nc-hero-stat">
            <div className="nc-live-dot" />
            <strong>{availableCount}</strong>
            <span>available now</span>
          </div>
        </section>

        <section className="nc-toolbar-card">
          <div className="nc-toolbar-main">
            <div className="nc-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search collector, area or material..."
              />
            </div>

            <button type="button" className="nc-location-btn" onClick={refreshLocation}>
              <LocateFixed size={16} />
              {locationMode === "live" ? "Update my location" : "Use my location"}
            </button>
          </div>

          <div className="nc-toolbar-bottom">
            <div>
              <span className="nc-filter-label">Search radius</span>
              <div className="nc-radius-pills">
                {[5, 10, 20].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={radius === value ? "active" : ""}
                    onClick={() => changeRadius(value)}
                  >
                    {value} km
                  </button>
                ))}
              </div>
            </div>

            <div className="nc-location-state">
              <MapPin size={15} />
              {locationMode === "live"
                ? "Using your current location"
                : "Showing collectors around Bhubaneswar"}
            </div>
          </div>
        </section>

        <section className="nc-map-panel">
          <div className="nc-map-copy">
            <span className="nc-small-label">MAP VIEW</span>
            <h2>Collection network near you</h2>
            <p>
              The map button on each collector opens turn-by-turn directions in Google Maps.
            </p>

            <div className="nc-map-meta">
              <div>
                <span>Collectors found</span>
                <strong>{collectors.length}</strong>
              </div>
              <div>
                <span>Radius</span>
                <strong>{radius} km</strong>
              </div>
            </div>
          </div>

          <div className="nc-map-preview">
            <div className="nc-map-pattern" />
            <div className="nc-map-road road-one" />
            <div className="nc-map-road road-two" />
            <div className="nc-map-road road-three" />

            <div className="nc-map-center">
              <span className="nc-map-pulse" />
              <LocateFixed size={19} />
            </div>

            {collectors.slice(0, 6).map((collector, index) => (
              <button
                key={collector._id || collector.businessName}
                type="button"
                className="nc-map-marker"
                style={{
                  left: `${18 + ((index * 14) % 64)}%`,
                  top: `${22 + ((index * 19) % 53)}%`,
                }}
                onClick={() => setSelectedCollector(collector)}
                title={collector.businessName}
              >
                <MapPin size={17} />
              </button>
            ))}

            <div className="nc-map-badge">
              <CheckCircle2 size={15} />
              Verified network
            </div>
          </div>
        </section>

        <section className="nc-list-section">
          <div className="nc-section-heading">
            <div>
              <span className="nc-small-label">NEARBY OPTIONS</span>
              <h2>Collectors you can explore</h2>
            </div>
            <button
              type="button"
              className="nc-primary"
              onClick={() => navigate("/schedule-pickup")}
            >
              Schedule pickup
              <ArrowRight size={15} />
            </button>
          </div>

          {loading ? (
            <div className="nc-state-card">
              <Truck size={25} />
              <h3>Finding nearby collectors...</h3>
              <p>We're checking the ScrapSmart collection network.</p>
            </div>
          ) : error ? (
            <div className="nc-state-card error">
              <X size={25} />
              <h3>Unable to load collectors</h3>
              <p>{error}</p>
              <button type="button" className="nc-primary" onClick={() => loadCollectors()}>
                Try again
              </button>
            </div>
          ) : filteredCollectors.length === 0 ? (
            <div className="nc-state-card">
              <Search size={25} />
              <h3>No matching collectors</h3>
              <p>Try another area, material or increase the search radius.</p>
            </div>
          ) : (
            <div className="nc-grid">
              <AnimatePresence mode="popLayout">
                {filteredCollectors.map((collector) => (
                  <CollectorCard
                    key={collector._id || collector.businessName}
                    collector={collector}
                    onView={() => setSelectedCollector(collector)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        <section className="nc-bottom-note">
          <div className="nc-bottom-icon">
            <ShieldCheck size={20} />
          </div>
          <div>
            <strong>Collector information is designed for discovery.</strong>
            <p>
              Availability and distance can change over time. Always confirm the
              collector and pickup details before handing over your scrap.
            </p>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedCollector && (
          <CollectorDetails
            collector={selectedCollector}
            onClose={() => setSelectedCollector(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default NearbyCollectors;
