import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeIndianRupee,
  CalendarClock,
  ChevronRight,
  Clock3,
  HelpCircle,
  History,
  Leaf,
  MapPin,
  Menu,
  PackageCheck,
  Recycle,
  Sparkles,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./UserHome.css";

const services = [
  {
    title: "Schedule Pickup",
    description: "Choose a date, time and scrap quantity.",
    icon: CalendarClock,
    path: "/schedule-pickup",
    tone: "green",
    badge: "Quick action",
  },
  {
    title: "Check Scrap Price",
    description: "See today's estimated prices for common scrap.",
    icon: BadgeIndianRupee,
    path: "/check-price",
    tone: "blue",
    badge: "Live rates",
  },
  {
    title: "Rewards",
    description: "Track points earned from every successful sale.",
    icon: Trophy,
    path: "/rewards",
    tone: "amber",
    badge: "Earn points",
  },
  {
    title: "Pickup History",
    description: "View your previous pickup requests and sales.",
    icon: History,
    path: "/pickup-history",
    tone: "purple",
    badge: "Your activity",
  },
  {
    title: "Nearby Collectors",
    description: "Explore available collectors around your area.",
    icon: MapPin,
    path: "/collectors",
    tone: "rose",
    badge: "Nearby",
  },
  {
    title: "Help & Support",
    description: "Get answers for pickup, payment and account issues.",
    icon: HelpCircle,
    path: "/support",
    tone: "teal",
    badge: "Need help?",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

function getStoredUser() {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return null;

    const parsed = JSON.parse(rawUser);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function UserHome() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = useMemo(() => getStoredUser(), []);
  const username = user?.username || user?.userName || user?.name || "User";
  const email = user?.email || "Welcome to ScrapSmart";
  const initials = username
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "U";

  const goTo = (path) => {
    setMobileMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <main className="user-home-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient-grid" />

      <motion.section
        className="user-home-shell"
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="user-home-header">
          <button
            className="brand-mark"
            type="button"
            onClick={() => goTo("/")}
            aria-label="Go to ScrapSmart home"
          >
            <span className="brand-icon">
              <Recycle size={19} strokeWidth={2.5} />
            </span>
            <span>
              <strong>Scrap</strong>Smart
            </span>
          </button>

          <nav className={`user-nav ${mobileMenu ? "is-open" : ""}`}>
            <button type="button" onClick={() => goTo("/home")} className="nav-item active">
              Dashboard
            </button>
            <button type="button" onClick={() => goTo("/pickup-history")} className="nav-item">
              My Activity
            </button>
            <button type="button" onClick={() => goTo("/rewards")} className="nav-item">
              Rewards
            </button>
          </nav>

          <div className="header-actions">
            <div className="profile-wrap">
              <button
                type="button"
                className="profile-chip"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
              >
                <span className="avatar">{initials}</span>
                <span className="profile-copy">
                  <strong>{username}</strong>
                  <small>{email}</small>
                </span>
                <ChevronRight
                  size={16}
                  className={`profile-chevron ${profileOpen ? "rotate" : ""}`}
                />
              </button>

              {profileOpen && (
                <motion.div
                  className="profile-menu"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18 }}
                >
                  <button type="button" onClick={() => goTo("/profile")}>
                    <UserRound size={16} />
                    Profile
                  </button>
                  <button type="button" onClick={handleLogout}>
                    <X size={16} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </div>

            <button
              type="button"
              className="menu-toggle"
              onClick={() => setMobileMenu((open) => !open)}
              aria-label="Toggle navigation"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        <div className="user-home-content">
          <motion.div
            className="welcome-row"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
          >
            <div className="welcome-copy">
              <div className="welcome-kicker">
                <Sparkles size={14} />
                Your ScrapSmart space
              </div>
              <h1>
                Hi, <span>{username}</span>
              </h1>
              <p>
                Turn your scrap into value. Choose a service below and let ScrapSmart handle the next step.
              </p>
            </div>

            <motion.button
              type="button"
              className="primary-cta"
              onClick={() => goTo("/schedule-pickup")}
              whileHover={{ y: -2, boxShadow: "0 16px 36px rgba(27, 140, 88, 0.18)" }}
              whileTap={{ scale: 0.98 }}
            >
              <CalendarClock size={18} />
              Schedule a Pickup
              <ArrowRight size={17} />
            </motion.button>
          </motion.div>

          <div className="dashboard-strip">
            <div className="mini-stat">
              <span className="mini-icon green"><PackageCheck size={16} /></span>
              <span><strong>0</strong><small>Pickups completed</small></span>
            </div>
            <div className="mini-stat">
              <span className="mini-icon amber"><Trophy size={16} /></span>
              <span><strong>0 pts</strong><small>Reward balance</small></span>
            </div>
            <div className="mini-stat">
              <span className="mini-icon blue"><Clock3 size={16} /></span>
              <span><strong>Ready</strong><small>Next pickup</small></span>
            </div>
            <div className="eco-note">
              <Leaf size={16} />
              Every pickup keeps recyclable material in circulation.
            </div>
          </div>

          <div className="services-heading">
            <div>
              <span className="section-label">EXPLORE SERVICES</span>
              <h2>Everything you need, in one place.</h2>
            </div>
            <span className="services-count">{services.length} services</span>
          </div>

          <motion.div
            className="services-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <motion.button
                  key={service.title}
                  type="button"
                  className={`service-card ${service.tone}`}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => goTo(service.path)}
                >
                  <span className="service-icon">
                    <Icon size={21} strokeWidth={2.2} />
                  </span>
                  <span className="service-card-body">
                    <span className="service-topline">
                      <span className="service-badge">{service.badge}</span>
                      <ArrowRight size={15} className="service-arrow" />
                    </span>
                    <strong>{service.title}</strong>
                    <span>{service.description}</span>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.footer
            className="dashboard-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <span>ScrapSmart • Smart recycling starts at home.</span>
            <button type="button" onClick={() => goTo("/support")}>Need help? <ArrowRight size={14} /></button>
          </motion.footer>
        </div>
      </motion.section>
    </main>
  );
}

export default UserHome;
