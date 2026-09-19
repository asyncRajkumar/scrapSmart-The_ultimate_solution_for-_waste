import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  ChevronDown,
  Clock3,
  MapPin,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  Info,
  Recycle,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./CheckPrice.css";

/*
  ScrapSmart - Check Price Page

  Rates below are seeded from the 19 Sep 2026 India-wide snapshot
  published by Scrapprice.in. Treat them as indicative UI data until
  your backend starts fetching live city/collector rates.

  Source snapshot:
  Copper ₹1229.48/kg
  Aluminium ₹262.09/kg
  Iron ₹38.03/kg
  Brass ₹871.06/kg
  E-waste ₹33.00/kg
  Paper ₹19.25/kg
  Li-ion Battery ₹313.75/kg
  PET Plastic ₹33.80/kg
  Mixed Plastic ₹57.31/kg
*/

const PRICE_DATE = "19 Sep 2026";

const MATERIALS = [
  {
    id: "copper",
    name: "Copper",
    short: "Copper scrap",
    category: "Metal",
    price: 1229.48,
    unit: "kg",
    change: 0.13,
    direction: "up",
    note: "Wire, cable, pipe & motor windings",
    accent: "#d97757",
    art: "copper",
  },
  {
    id: "aluminium",
    name: "Aluminium",
    short: "Aluminium scrap",
    category: "Metal",
    price: 262.09,
    unit: "kg",
    change: 0.34,
    direction: "down",
    note: "Sheets, utensils, cans & extrusions",
    accent: "#73808a",
    art: "aluminium",
  },
  {
    id: "iron",
    name: "Iron / Loha",
    short: "Iron scrap",
    category: "Metal",
    price: 38.03,
    unit: "kg",
    change: 0.44,
    direction: "up",
    note: "HMS, mild steel, cast iron & rebar",
    accent: "#59636b",
    art: "iron",
  },
  {
    id: "brass",
    name: "Brass",
    short: "Brass scrap",
    category: "Metal",
    price: 871.06,
    unit: "kg",
    change: 1.11,
    direction: "down",
    note: "Fittings, valves & decorative items",
    accent: "#c7952e",
    art: "brass",
  },
  {
    id: "paper",
    name: "Paper",
    short: "Paper scrap",
    category: "Paper",
    price: 19.25,
    unit: "kg",
    change: 0,
    direction: "flat",
    note: "Raddi, newspaper, cardboard & books",
    accent: "#a7774c",
    art: "paper",
  },
  {
    id: "pet",
    name: "PET Plastic",
    short: "PET bottles",
    category: "Plastic",
    price: 33.8,
    unit: "kg",
    change: 0,
    direction: "flat",
    note: "PET bottles & clear PET containers",
    accent: "#4d8f8f",
    art: "pet",
  },
  {
    id: "plastic",
    name: "Mixed Plastic",
    short: "Mixed plastic scrap",
    category: "Plastic",
    price: 57.31,
    unit: "kg",
    change: 0,
    direction: "flat",
    note: "Mixed & reprocessed plastic scrap",
    accent: "#4f8a69",
    art: "plastic",
  },
  {
    id: "ewaste",
    name: "E-Waste",
    short: "Electronic scrap",
    category: "E-Waste",
    price: 33.0,
    unit: "kg",
    change: 0.53,
    direction: "up",
    note: "Boards, monitors, cables & components",
    accent: "#516b8f",
    art: "ewaste",
  },
  {
    id: "battery",
    name: "Li-ion Battery",
    short: "Battery scrap",
    category: "E-Waste",
    price: 313.75,
    unit: "kg",
    change: 0,
    direction: "flat",
    note: "EV packs, laptop cells & power tools",
    accent: "#596d4d",
    art: "battery",
  },
];

const CATEGORIES = ["All", "Metal", "Paper", "Plastic", "E-Waste"];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

function MaterialArtwork({ type }) {
  const common = {
    width: "100%",
    height: "100%",
    viewBox: "0 0 420 260",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    preserveAspectRatio: "xMidYMid slice",
  };

  if (type === "copper") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="cu-bg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f3d9ce" />
            <stop offset="1" stopColor="#d77b5c" />
          </linearGradient>
          <linearGradient id="cu-metal" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f1a57f" />
            <stop offset=".55" stopColor="#b95d3b" />
            <stop offset="1" stopColor="#8f402c" />
          </linearGradient>
        </defs>
        <rect width="420" height="260" rx="28" fill="url(#cu-bg)" />
        <circle cx="350" cy="55" r="62" fill="white" opacity=".22" />
        <path d="M18 190C88 120 132 122 204 184C270 241 321 238 404 151" stroke="#7b3525" strokeWidth="28" strokeLinecap="round" />
        <path d="M18 190C88 120 132 122 204 184C270 241 321 238 404 151" stroke="url(#cu-metal)" strokeWidth="17" strokeLinecap="round" />
        <path d="M62 218C122 169 163 169 216 214C268 258 313 247 364 198" stroke="#f5c1a7" strokeWidth="8" strokeLinecap="round" opacity=".8" />
        <rect x="32" y="34" width="122" height="40" rx="20" fill="white" opacity=".45" />
        <text x="49" y="60" fill="#623224" fontSize="18" fontFamily="Arial" fontWeight="700">COPPER</text>
      </svg>
    );
  }

  if (type === "aluminium") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="al-bg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#dde5e8" />
            <stop offset="1" stopColor="#7e8c95" />
          </linearGradient>
          <linearGradient id="al-can" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f8fbfc" />
            <stop offset=".5" stopColor="#aab6bd" />
            <stop offset="1" stopColor="#6b767d" />
          </linearGradient>
        </defs>
        <rect width="420" height="260" rx="28" fill="url(#al-bg)" />
        <ellipse cx="210" cy="195" rx="143" ry="24" fill="#48545c" opacity=".3" />
        <path d="M112 72L176 54L230 78L166 98L112 72Z" fill="#f7fafc" opacity=".9" />
        <path d="M115 72L114 166C114 183 139 194 173 192L232 174L229 78L166 98L115 72Z" fill="url(#al-can)" />
        <path d="M232 78L276 95L277 160C276 175 255 188 232 191L232 78Z" fill="#7f8b93" />
        <path d="M151 111L219 91M149 131L218 112M149 151L218 133" stroke="white" strokeWidth="7" opacity=".45" />
        <circle cx="328" cy="72" r="46" fill="white" opacity=".23" />
        <text x="45" y="44" fill="#364149" fontSize="18" fontFamily="Arial" fontWeight="700">ALUMINIUM</text>
      </svg>
    );
  }

  if (type === "iron") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="iron-bg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#cfd4d8" />
            <stop offset="1" stopColor="#5f6a71" />
          </linearGradient>
        </defs>
        <rect width="420" height="260" rx="28" fill="url(#iron-bg)" />
        <g fill="#384147">
          <rect x="58" y="82" width="165" height="30" rx="8" transform="rotate(-14 58 82)" />
          <rect x="122" y="127" width="188" height="31" rx="8" transform="rotate(11 122 127)" />
          <rect x="202" y="58" width="138" height="27" rx="8" transform="rotate(19 202 58)" />
          <path d="M76 182L97 160L131 181L107 204L76 182Z" />
          <path d="M280 188L308 159L350 186L320 210L280 188Z" />
        </g>
        <g stroke="#9aa4aa" strokeWidth="5" opacity=".55">
          <path d="M69 90L194 60M142 142L301 172M215 66L328 104" />
        </g>
        <text x="48" y="44" fill="#eef2f3" fontSize="18" fontFamily="Arial" fontWeight="700">IRON / LOHA</text>
      </svg>
    );
  }

  if (type === "brass") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="br-bg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f7e6b5" />
            <stop offset="1" stopColor="#b37a1c" />
          </linearGradient>
          <linearGradient id="br-metal" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f5d35f" />
            <stop offset=".52" stopColor="#b27b18" />
            <stop offset="1" stopColor="#7d5714" />
          </linearGradient>
        </defs>
        <rect width="420" height="260" rx="28" fill="url(#br-bg)" />
        <ellipse cx="160" cy="154" rx="94" ry="40" fill="#765314" opacity=".2" />
        <circle cx="150" cy="126" r="67" stroke="url(#br-metal)" strokeWidth="24" />
        <circle cx="150" cy="126" r="28" fill="#efddb1" />
        <rect x="230" y="91" width="92" height="69" rx="20" fill="url(#br-metal)" />
        <rect x="245" y="105" width="55" height="39" rx="12" fill="#d3a63a" />
        <circle cx="336" cy="60" r="45" fill="white" opacity=".18" />
        <text x="45" y="44" fill="#63460e" fontSize="18" fontFamily="Arial" fontWeight="700">BRASS</text>
      </svg>
    );
  }

  if (type === "paper") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="pa-bg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#efe2c9" />
            <stop offset="1" stopColor="#a97a4e" />
          </linearGradient>
        </defs>
        <rect width="420" height="260" rx="28" fill="url(#pa-bg)" />
        <path d="M82 70L219 49L265 188L130 211L82 70Z" fill="#fff8e9" />
        <path d="M115 89L227 72L231 100L120 116L115 89ZM123 132L238 113L242 141L129 159L123 132Z" fill="#d9c6a5" />
        <path d="M206 52L254 45L271 95L223 101L206 52Z" fill="#dcc9a5" />
        <path d="M258 86L336 68L348 147L271 165L258 86Z" fill="#ead9bb" />
        <path d="M287 95L331 86" stroke="#b99b72" strokeWidth="9" strokeLinecap="round" />
        <path d="M288 117L339 108" stroke="#b99b72" strokeWidth="9" strokeLinecap="round" />
        <text x="45" y="44" fill="#684523" fontSize="18" fontFamily="Arial" fontWeight="700">PAPER</text>
      </svg>
    );
  }

  if (type === "pet") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="pet-bg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#d3f3ee" />
            <stop offset="1" stopColor="#4b8e8f" />
          </linearGradient>
          <linearGradient id="pet-bottle" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#defbf7" stopOpacity=".92" />
            <stop offset="1" stopColor="#7cc8c1" stopOpacity=".45" />
          </linearGradient>
        </defs>
        <rect width="420" height="260" rx="28" fill="url(#pet-bg)" />
        <ellipse cx="125" cy="195" rx="84" ry="18" fill="#235d5e" opacity=".25" />
        <ellipse cx="255" cy="195" rx="76" ry="17" fill="#235d5e" opacity=".23" />
        <path d="M81 83C79 68 92 60 109 59L132 59C150 60 163 69 160 86L154 188C153 205 139 213 118 213C98 212 86 204 86 188L81 83Z" fill="url(#pet-bottle)" stroke="#d9fff9" strokeWidth="4" />
        <path d="M206 82C206 69 219 60 235 60L257 60C274 60 287 69 286 84L280 188C279 205 265 213 245 213C225 213 212 205 211 188L206 82Z" fill="url(#pet-bottle)" stroke="#d9fff9" strokeWidth="4" />
        <rect x="101" y="45" width="42" height="20" rx="8" fill="#4e7d7e" />
        <rect x="224" y="46" width="43" height="20" rx="8" fill="#4e7d7e" />
        <path d="M90 120H154M216 121H280" stroke="#f8fffd" strokeWidth="7" opacity=".55" />
        <path d="M323 62L351 86L329 97L304 73Z" fill="#d9fff9" opacity=".46" />
        <text x="45" y="44" fill="#215e61" fontSize="18" fontFamily="Arial" fontWeight="700">PET PLASTIC</text>
      </svg>
    );
  }

  if (type === "plastic") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="pl-bg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#d9f3dc" />
            <stop offset="1" stopColor="#4b8b66" />
          </linearGradient>
        </defs>
        <rect width="420" height="260" rx="28" fill="url(#pl-bg)" />
        <g stroke="#eaf9ed" strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M122 178L72 86L178 84L122 178Z" />
          <path d="M178 84L237 184L122 178" />
          <path d="M237 184L302 77L350 157L237 184Z" />
        </g>
        <g fill="#ffffff" opacity=".22">
          <circle cx="80" cy="52" r="30" />
          <circle cx="340" cy="215" r="34" />
        </g>
        <text x="45" y="44" fill="#275f3d" fontSize="18" fontFamily="Arial" fontWeight="700">MIXED PLASTIC</text>
      </svg>
    );
  }

  if (type === "ewaste") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="ew-bg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#d7e5f6" />
            <stop offset="1" stopColor="#4f6787" />
          </linearGradient>
        </defs>
        <rect width="420" height="260" rx="28" fill="url(#ew-bg)" />
        <rect x="74" y="68" width="164" height="104" rx="14" fill="#283743" />
        <rect x="89" y="82" width="134" height="76" rx="8" fill="#8ec5cc" />
        <path d="M104 172H209L222 198H91L104 172Z" fill="#344650" />
        <rect x="262" y="87" width="69" height="99" rx="13" fill="#3d4e59" />
        <rect x="277" y="100" width="40" height="60" rx="7" fill="#6db6c3" />
        <path d="M107 112L131 93L155 112L131 130L107 112Z" fill="#eff7ff" opacity=".5" />
        <text x="45" y="44" fill="#eaf4ff" fontSize="18" fontFamily="Arial" fontWeight="700">E-WASTE</text>
      </svg>
    );
  }

  return (
    <svg {...common}>
      <defs>
        <linearGradient id="bat-bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#e0edcf" />
          <stop offset="1" stopColor="#5b704f" />
        </linearGradient>
      </defs>
      <rect width="420" height="260" rx="28" fill="url(#bat-bg)" />
      <rect x="98" y="65" width="154" height="127" rx="22" fill="#2f3e2a" />
      <rect x="126" y="45" width="42" height="25" rx="8" fill="#3d4c37" />
      <rect x="184" y="45" width="42" height="25" rx="8" fill="#3d4c37" />
      <rect x="122" y="93" width="107" height="71" rx="14" fill="#7aa15f" />
      <path d="M171 102L149 135H167L157 157L198 125H179L191 102H171Z" fill="#f5f0a2" />
      <circle cx="313" cy="72" r="53" fill="#ffffff" opacity=".15" />
      <text x="45" y="44" fill="#edf6df" fontSize="18" fontFamily="Arial" fontWeight="700">LI-ION BATTERY</text>
    </svg>
  );
}

function PriceChange({ material }) {
  if (material.direction === "flat") {
    return <span className="cp-change cp-flat">— Stable</span>;
  }

  const isUp = material.direction === "up";
  return (
    <span className={`cp-change ${isUp ? "cp-up" : "cp-down"}`}>
      {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
      {isUp ? "+" : "-"}{Math.abs(material.change).toFixed(2)}%
    </span>
  );
}

function CheckPrice() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("India");
  const [showInfo, setShowInfo] = useState(false);

  const username =
    localStorage.getItem("username") ||
    localStorage.getItem("userName") ||
    "User";

  const filteredMaterials = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return MATERIALS.filter((material) => {
      const categoryMatch =
        category === "All" || material.category === category;

      const searchMatch =
        !normalized ||
        material.name.toLowerCase().includes(normalized) ||
        material.short.toLowerCase().includes(normalized) ||
        material.note.toLowerCase().includes(normalized);

      return categoryMatch && searchMatch;
    });
  }, [category, query]);

  const scrollToRates = () => {
    document
      .getElementById("scrap-price-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="cp-page">
      <div className="cp-orb cp-orb-one" />
      <div className="cp-orb cp-orb-two" />
      <div className="cp-grid" />

      <main className="cp-shell">
        <header className="cp-header">
          <button
            type="button"
            className="cp-back"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="cp-brand">
            <div className="cp-brand-mark">
              <Recycle size={20} />
            </div>
            <div>
              <div className="cp-brand-name">Scrap<span>Smart</span></div>
              <div className="cp-brand-sub">PRICE CENTER</div>
            </div>
          </div>

          <div className="cp-user-pill">
            <div className="cp-user-avatar">{username.slice(0, 1).toUpperCase()}</div>
            <div className="cp-user-copy">
              <span>Hi,</span>
              <strong>{username}</strong>
            </div>
          </div>
        </header>

        <section className="cp-hero">
          <motion.div
            className="cp-hero-copy"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="cp-eyebrow">
              <span className="cp-live-dot" />
              LIVE MARKET REFERENCE
            </div>

            <h1>
              Know what your scrap
              <span> is worth today.</span>
            </h1>

            <p>
              Check today's indicative scrap rates before you schedule a
              pickup. See the material, current reference price, movement,
              and what it usually includes.
            </p>

            <div className="cp-hero-actions">
              <button type="button" className="cp-primary" onClick={scrollToRates}>
                View Today's Rates <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="cp-secondary"
                onClick={() => setShowInfo((value) => !value)}
              >
                <Info size={17} />
                How pricing works
              </button>
            </div>
          </motion.div>

          <motion.div
            className="cp-hero-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <div className="cp-hero-card-top">
              <div>
                <span className="cp-mini-label">MARKET SNAPSHOT</span>
                <strong>{PRICE_DATE}</strong>
              </div>
              <div className="cp-live-badge">
                <span className="cp-live-dot" />
                Updated daily
              </div>
            </div>

            <div className="cp-highlight-rate">
              <div className="cp-highlight-icon">
                <IndianRupee size={23} />
              </div>
              <div>
                <span>Top reference rate</span>
                <strong>₹{formatPrice(MATERIALS[0].price)}<small>/kg</small></strong>
                <PriceChange material={MATERIALS[0]} />
              </div>
            </div>

            <div className="cp-city-select">
              <MapPin size={16} />
              <span>Showing reference prices for</span>
              <div className="cp-select-wrap">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-label="Select city"
                >
                  <option>India</option>
                  <option>Bhubaneswar</option>
                  <option>Delhi</option>
                  <option>Mumbai</option>
                  <option>Bengaluru</option>
                  <option>Hyderabad</option>
                  <option>Kolkata</option>
                </select>
                <ChevronDown size={14} />
              </div>
            </div>
          </motion.div>
        </section>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              className="cp-info-panel"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
            >
              <div className="cp-info-icon">
                <Info size={18} />
              </div>
              <div>
                <strong>Reference prices, not guaranteed pickup quotes.</strong>
                <p>
                  Actual payout can change with city, material grade,
                  cleanliness, quantity, contamination, and weighment at
                  pickup. Your collector confirms the final amount.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="cp-toolbar" aria-label="Price filters">
          <div className="cp-tabs">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="cp-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search copper, paper, e-waste..."
              aria-label="Search scrap material"
            />
          </label>
        </section>

        <section id="scrap-price-grid" className="cp-rates-section">
          <div className="cp-section-heading">
            <div>
              <span className="cp-mini-label">SCRAP RATE BOARD</span>
              <h2>Today's material prices</h2>
            </div>
            <div className="cp-updated">
              <Clock3 size={15} />
              <span>Last updated {PRICE_DATE}</span>
            </div>
          </div>

          <div className="cp-grid-cards">
            <AnimatePresence mode="popLayout">
              {filteredMaterials.map((material, index) => (
                <motion.article
                  key={material.id}
                  layout
                  className="cp-card"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="cp-art">
                    <MaterialArtwork type={material.art} />
                    <div className="cp-art-overlay">
                      <span>{material.category}</span>
                    </div>
                  </div>

                  <div className="cp-card-body">
                    <div className="cp-card-title-row">
                      <div>
                        <h3>{material.name}</h3>
                        <p>{material.note}</p>
                      </div>
                      <PriceChange material={material} />
                    </div>

                    <div className="cp-rate-line">
                      <span>₹</span>
                      <strong>{formatPrice(material.price)}</strong>
                      <em>/{material.unit}</em>
                    </div>

                    <button
                      type="button"
                      className="cp-book-btn"
                      onClick={() => navigate("/schedule-pickup")}
                    >
                      Sell this scrap <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {filteredMaterials.length === 0 && (
            <div className="cp-empty">
              <Search size={24} />
              <h3>No material found</h3>
              <p>Try another scrap name or change the category filter.</p>
            </div>
          )}
        </section>

        <section className="cp-footer-note">
          <div className="cp-footer-note-icon">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <strong>Check the rate. Schedule the pickup.</strong>
            <p>
              These prices are presented as a daily market reference. ScrapSmart
              can later replace this data with your own backend's city-wise
              collector rates.
            </p>
          </div>

          <button
            type="button"
            className="cp-footer-cta"
            onClick={() => navigate("/schedule-pickup")}
          >
            Schedule Pickup
            <ArrowRight size={16} />
          </button>
        </section>
      </main>

      <div className="cp-refresh-hint">
        <RefreshCw size={13} />
        <span>Prices refresh with the latest data source</span>
      </div>
    </div>
  );
}

export default CheckPrice;