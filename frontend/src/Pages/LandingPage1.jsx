import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Leaf,
  Menu,
  Recycle,
  ShieldCheck,
  Truck,
  Users,
  WalletCards,
  X,
  House,
  Sparkles,
  MapPin,
  Globe2,
  Trash2,

  // NEW
  Mail,
  Phone,
  LockKeyhole,
  UserRound,
  Building2,
  GraduationCap,
  Eye,
  EyeOff,
} from "lucide-react";

const steps = [
  {
    icon: CalendarDays,
    title: "Schedule a Pickup",
    text: "Choose your preferred date, time slot and approximate scrap quantity.",
  },
  {
    icon: MapPin,
    title: "Find Nearby Collector",
    text: "Your pickup request becomes available to suitable nearby scrap collectors.",
  },
  {
    icon: Truck,
    title: "Collector Arrives",
    text: "A collector accepts your request and visits your home at the scheduled time.",
  },
  {
    icon: WalletCards,
    title: "Sell Your Scrap",
    text: "Hand over your scrap and complete the collection through a simple process.",
  },
];

const benefits = [
  {
    icon: CalendarDays,
    title: "Convenient Pickup",
    text: "No more waiting or searching for a scrap collector. Schedule when it works for you.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Process",
    text: "Know when your pickup is scheduled and keep the process simple and clear.",
  },
  {
    icon: MapPin,
    title: "Nearby Collection",
    text: "Your request is designed around connecting you with nearby pickup opportunities.",
  },
  {
    icon: Leaf,
    title: "Better for the Planet",
    text: "Making scrap collection easier can encourage more responsible recycling habits.",
  },
];

const householdPoints = [
  "Schedule a pickup in a few clicks",
  "Select your preferred date",
  "Choose a convenient time slot",
  "Select approximate quantity",
  "No need to specify scrap type",
];

function LandingPage1() {

  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // =====================================================
// AUTH MODAL STATES
// =====================================================

const [authModal, setAuthModal] = useState(false);
const [authMode, setAuthMode] = useState("login");
const [showPassword, setShowPassword] = useState(false);
const [authLoading, setAuthLoading] = useState(false);

const [authForm, setAuthForm] = useState({
  username: "",
  mobile: "",
  email: "",
  password: "",
  userType: "Household",
});

  const { scrollYProgress } = useScroll();

  const heroY = useTransform(
    scrollYProgress,
    [0, 0.25],
    [0, 70]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // =====================================================
// OPEN AUTH MODAL
// =====================================================

const openAuth = (mode) => {
  setAuthMode(mode);
  setAuthModal(true);
  setShowPassword(false);

  setAuthForm({
    username: "",
    mobile: "",
    email: "",
    password: "",
    userType: "Household",
  });

  document.body.style.overflow = "hidden";
};


// =====================================================
// CLOSE AUTH MODAL
// =====================================================

const closeAuth = () => {
  setAuthModal(false);
  setShowPassword(false);
  setAuthLoading(false);

  document.body.style.overflow = "auto";
};


// =====================================================
// INPUT CHANGE
// =====================================================

const handleAuthChange = (e) => {
  const { name, value } = e.target;

  setAuthForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};


// =====================================================
// AUTH SUBMIT
// =====================================================

const handleAuthSubmit = async (e) => {
  e.preventDefault();

  setAuthLoading(true);

  /*
    For now this is frontend-only.

    Later you can replace this with:

    axios.post(
      "http://localhost:5000/api/auth/login",
      authForm
    )

    or

    axios.post(
      "http://localhost:5000/api/auth/register",
      authForm
    )
  */

  setTimeout(() => {
    setAuthLoading(false);

    closeAuth();

    // Redirect to landing/home section
    navigate("/home");
  }, 1200);
};

  return (
    <div className="scrap-app">

      {/* =====================================================
          GLOBAL CSS
      ====================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: Inter, Arial, sans-serif;
          color: #10231a;
          background: #ffffff;
          line-height: 1.6;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          font-family: inherit;
        }

        .scrap-app {
          overflow: hidden;
          background: #ffffff;
        }

        .container {
          width: min(1180px, calc(100% - 40px));
          margin: auto;
        }

        .section {
          padding: 105px 0;
        }

        /* =====================================================
           NAVBAR
        ====================================================== */

        .navbar {
          height: 80px;

          padding: 0 max(
            20px,
            calc((100vw - 1180px) / 2)
          );

          display: flex;
          align-items: center;
          justify-content: space-between;

          position: fixed;

          top: 0;
          left: 0;
          right: 0;

          z-index: 1000;

          transition: all 0.3s ease;
        }

        .navbar.scrolled {
          background: rgba(255,255,255,0.93);

          backdrop-filter: blur(16px);

          box-shadow:
            0 5px 30px rgba(0,0,0,0.06);
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 11px;
        }

        .brand-icon {
          width: 47px;
          height: 47px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          color: #159447;

          background: #e9f8ee;
        }

        .brand-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .brand-name span {
          color: #159447;
        }

        .brand-tagline {
          display: block;

          margin-top: 3px;

          color: #75827c;

          font-size: 9px;
        }

        .nav-links {
          display: flex;
          align-items: center;

          gap: 34px;

          margin-left: auto;
          margin-right: 38px;
        }

        .nav-links a {
          color: #52635a;

          font-size: 13px;

          transition: 0.2s;
        }

        .nav-links a:hover {
          color: #159447;
        }

        .nav-buttons {
          display: flex;
          gap: 10px;
        }

        .btn {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          padding: 13px 22px;

          border: 1px solid transparent;

          border-radius: 11px;

          font-size: 13px;
          font-weight: 700;

          transition: all 0.25s ease;

          cursor: pointer;
        }

        .btn-primary {
          color: white;

          background: #159447;

          box-shadow:
            0 8px 22px rgba(
              21,
              148,
              71,
              0.18
            );
        }

        .btn-primary:hover {
          background: #0b7135;

          transform: translateY(-2px);
        }

        .btn-outline {
          color: #126b36;

          border-color: #a9d5b8;

          background: transparent;
        }

        .btn-outline:hover {
          background: #eaf8ee;
        }

        .btn-large {
          padding: 15px 27px;

          font-size: 14px;
        }

        .menu-btn {
          display: none;

          border: none;

          color: #10231a;

          background: transparent;

          cursor: pointer;
        }

        /* =====================================================
           HERO
        ====================================================== */

        .hero {
          min-height: 780px;

          padding-top: 155px;
          padding-bottom: 90px;

          position: relative;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 78% 38%,
              rgba(191,240,204,0.62),
              transparent 33%
            ),
            linear-gradient(
              120deg,
              #ffffff,
              #f4fbf6
            );
        }

        .hero-grid {
          display: grid;

          grid-template-columns:
            0.92fr
            1.08fr;

          gap: 40px;

          align-items: center;
        }

        .hero-copy {
          position: relative;
          z-index: 3;
        }

        .eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding: 8px 14px;

          border-radius: 50px;

          background: #e8f8ed;

          color: #116b36;

          font-size: 12px;

          font-weight: 700;
        }

        .hero-title {
          margin-top: 23px;

          font-size: clamp(
            52px,
            5.4vw,
            76px
          );

          line-height: 1.02;

          letter-spacing: -3.5px;

          font-weight: 800;
        }

        .hero-title span {
          display: block;

          color: #159447;
        }

        .hero-description {
          max-width: 590px;

          margin-top: 25px;

          color: #5b6d63;

          font-size: 18px;

          line-height: 1.7;
        }

        .hero-buttons {
          display: flex;

          gap: 13px;

          margin-top: 32px;
        }

        .trust-row {
          display: flex;

          gap: 27px;

          margin-top: 38px;

          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;

          align-items: center;

          gap: 8px;

          color: #4e6258;

          font-size: 12px;
        }

        .trust-item svg {
          color: #159447;
        }

        /* =====================================================
           HERO VISUAL
        ====================================================== */

        .hero-visual {
          position: relative;
        }

        .hero-card {
          min-height: 500px;

          position: relative;

          overflow: hidden;

          border-radius: 40px;

          background:
            linear-gradient(
              145deg,
              #dff5e4,
              #bce8c8
            );

          box-shadow:
            0 30px 80px rgba(
              15,
              100,
              48,
              0.15
            );
        }

        .hero-house {
          position: absolute;

          right: 7%;
          bottom: 0;

          width: 72%;
          height: 72%;

          border-radius: 18px 18px 0 0;

          background:
            linear-gradient(
              145deg,
              #ffffff,
              #eef8f1
            );

          box-shadow:
            0 20px 50px rgba(
              0,
              0,
              0,
              0.10
            );
        }

        .hero-roof {
          position: absolute;

          top: -110px;

          left: -30px;

          width: 115%;

          height: 175px;

          background: #80b989;

          clip-path: polygon(
            50% 0,
            100% 100%,
            0 100%
          );
        }

        .hero-window {
          position: absolute;

          top: 125px;

          width: 90px;
          height: 105px;

          border-radius: 9px;

          background: #b8e2c6;

          border: 7px solid white;
        }

        .window-left {
          left: 45px;
        }

        .window-right {
          right: 45px;
        }

        .hero-door {
          position: absolute;

          bottom: 0;
          left: calc(50% - 40px);

          width: 80px;
          height: 150px;

          border-radius:
            12px 12px 0 0;

          background: #17723c;
        }

        /* COLLECTOR ILLUSTRATION */

        .collector {
          position: absolute;

          right: 7%;
          bottom: 0;

          width: 150px;

          height: 290px;

          display: flex;

          flex-direction: column;

          align-items: center;
        }

        .collector-head {
          width: 67px;
          height: 67px;

          border-radius: 50%;

          background: #d6a079;

          position: relative;

          z-index: 2;
        }

        .collector-cap {
          position: absolute;

          top: -5px;
          left: -4px;

          width: 75px;
          height: 26px;

          border-radius:
            50px 50px 10px 10px;

          background: #12803d;
        }

        .collector-body {
          width: 108px;
          height: 175px;

          margin-top: -3px;

          border-radius:
            30px 30px 10px 10px;

          background: #159447;
        }

        .collector-box {
          position: absolute;

          left: -108px;
          bottom: 56px;

          width: 128px;
          height: 88px;

          border-radius: 8px;

          background: #b98350;

          transform: rotate(-4deg);

          box-shadow:
            0 12px 30px rgba(
              0,
              0,
              0,
              0.1
            );
        }

        .bottle {
          position: absolute;

          bottom: 25px;

          width: 16px;
          height: 40px;

          border-radius: 5px;

          background: #64b985;
        }

        .bottle.one {
          left: 25px;
        }

        .bottle.two {
          left: 53px;

          height: 33px;

          background: #e3c75e;
        }

        .bottle.three {
          left: 80px;

          height: 46px;

          background: #8bc5de;
        }

        /* FLOATING CARDS */

        .floating-card {
          position: absolute;

          display: flex;

          align-items: center;

          gap: 10px;

          padding: 14px 17px;

          border-radius: 16px;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          box-shadow:
            0 15px 45px rgba(
              0,
              0,
              0,
              0.11
            );

          backdrop-filter: blur(10px);
        }

        .floating-card svg {
          color: #159447;
        }

        .floating-card strong {
          display: block;

          font-size: 12px;
        }

        .floating-card small {
          display: block;

          color: #708078;

          font-size: 10px;
        }

        .floating-top {
          top: 12%;
          right: -12px;
        }

        .floating-bottom {
          left: -12px;
          bottom: 12%;
        }

        /* =====================================================
           COMMON SECTION HEADER
        ====================================================== */

        .section-heading {
          max-width: 720px;

          margin:
            0 auto
            58px;

          text-align: center;
        }

        .section-label {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          color: #159447;

          font-size: 12px;

          font-weight: 700;
        }

        .section-title {
          margin-top: 11px;

          font-size: 42px;

          line-height: 1.15;

          letter-spacing: -1.6px;

          font-weight: 800;
        }

        .section-description {
          margin-top: 12px;

          color: #66766e;

          font-size: 15px;

          line-height: 1.7;
        }

        /* =====================================================
           HOW IT WORKS
        ====================================================== */

        .process {
          background: white;
        }

        .steps-grid {
          display: grid;

          grid-template-columns:
            1fr 35px
            1fr 35px
            1fr 35px
            1fr;

          align-items: center;
        }

        .step {
          text-align: center;
        }

        .step-icon {
          width: 82px;
          height: 82px;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: #159447;

          background: #e7f8ed;
        }

        .step-number {
          display: block;

          margin-top: 14px;

          color: #9da9a3;

          font-size: 11px;

          font-weight: 700;
        }

        .step-title {
          margin-top: 5px;

          font-size: 16px;

          font-weight: 800;
        }

        .step-text {
          max-width: 200px;

          margin: 8px auto 0;

          color: #718078;

          font-size: 13px;

          line-height: 1.6;
        }

        .step-arrow {
          color: #aab9b1;
        }

        /* =====================================================
           WASTE FACTS
        ====================================================== */

        .waste-section {
          background:
            linear-gradient(
              145deg,
              #f1faf4,
              #f9fcfa
            );
        }

        .facts-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 18px;
        }

        .fact-card {
          min-height: 280px;

          padding: 30px;

          position: relative;

          overflow: hidden;

          border: 1px solid #e1ece5;

          border-radius: 22px;

          background: white;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .fact-card:hover {
          transform: translateY(-5px);

          box-shadow:
            0 20px 50px rgba(
              10,
              80,
              40,
              0.08
            );
        }

        .fact-icon {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          color: #159447;

          background: #e8f8ed;
        }

        .fact-card h3 {
          margin-top: 20px;

          font-size: 16px;

          font-weight: 800;
        }

        .fact-number {
          margin-top: 7px;

          color: #159447;

          font-size: 34px;

          line-height: 1;

          letter-spacing: -1px;

          font-weight: 800;
        }

        .fact-text {
          margin-top: 12px;

          color: #687970;

          font-size: 12px;

          line-height: 1.65;
        }

        .fact-source {
          position: absolute;

          bottom: 20px;
          left: 30px;

          color: #9aa69f;

          font-size: 9px;
        }

        .facts-note {
          max-width: 850px;

          margin:
            30px auto
            0;

          text-align: center;

          color: #7b8881;

          font-size: 10px;

          line-height: 1.6;
        }

        /* =====================================================
           WHY SCRAPSMART
        ====================================================== */

        .benefits {
          background: white;
        }

        .benefits-grid {
          display: grid;

          grid-template-columns:
            1.5fr
            0.8fr;

          gap: 45px;

          align-items: center;
        }

        .benefit-cards {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 16px;
        }

        .benefit-card {
          padding: 28px;

          border: 1px solid #e5eee8;

          border-radius: 18px;

          background: white;

          transition: 0.25s;
        }

        .benefit-card:hover {
          transform: translateY(-5px);

          box-shadow:
            0 18px 45px rgba(
              12,
              85,
              40,
              0.08
            );
        }

        .benefit-icon {
          width: 48px;
          height: 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          color: #159447;

          background: #e8f8ed;

          margin-bottom: 17px;
        }

        .benefit-title {
          font-size: 16px;

          font-weight: 800;
        }

        .benefit-text {
          margin-top: 7px;

          color: #718078;

          font-size: 12px;

          line-height: 1.65;
        }

        .impact-visual {
          min-height: 320px;

          position: relative;

          display: flex;

          align-items: center;
          justify-content: center;
        }

        .earth {
          width: 250px;
          height: 250px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: #159447;

          background:
            radial-gradient(
              circle,
              #dcf5e4,
              #c0e9cd
            );

          box-shadow:
            inset
            0 0 0 18px
            rgba(
              255,
              255,
              255,
              0.45
            );
        }

        .impact-note {
          position: absolute;

          left: 0;
          bottom: 20px;

          color: #486357;

          font-size: 18px;

          font-weight: 700;

          transform: rotate(-6deg);
        }

        /* =====================================================
           HOUSEHOLD SECTION
        ====================================================== */

        .household-section {
          background: #f7fbf8;
        }

        .household-card {
          padding: 45px;

          border-radius: 27px;

          display: grid;

          grid-template-columns:
            1.1fr
            0.9fr;

          gap: 50px;

          align-items: center;

          background:
            linear-gradient(
              120deg,
              #e6f8eb,
              #f2fbf5
            );

          border:
            1px solid #dcece1;
        }

        .household-icon {
          width: 54px;
          height: 54px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 15px;

          color: #159447;

          background: white;
        }

        .household-title {
          margin-top: 17px;

          font-size: 30px;

          letter-spacing: -1px;

          font-weight: 800;
        }

        .household-subtitle {
          margin-top: 7px;

          color: #617068;

          font-size: 14px;
        }

        .household-list {
          list-style: none;

          margin-top: 22px;

          display: grid;

          gap: 11px;
        }

        .household-list li {
          display: flex;

          align-items: center;

          gap: 9px;

          font-size: 13px;

          color: #456055;
        }

        .household-list svg {
          color: #159447;

          flex-shrink: 0;
        }

        .household-art {
          min-height: 300px;

          display: flex;

          align-items: center;

          justify-content: center;

          position: relative;
        }

        .house-icon-circle {
          width: 220px;
          height: 220px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: #159447;

          background: white;

          box-shadow:
            0 20px 50px rgba(
              15,
              100,
              48,
              0.10
            );
        }

        .easy-badge {
          position: absolute;

          right: 0;
          bottom: 25px;

          display: flex;

          align-items: center;

          gap: 7px;

          padding: 12px 15px;

          border-radius: 13px;

          background: white;

          box-shadow:
            0 12px 30px rgba(
              0,
              0,
              0,
              0.08
            );

          font-size: 11px;

          font-weight: 700;
        }

        .easy-badge svg {
          color: #159447;
        }

        /* =====================================================
           BOOKING PREVIEW
        ====================================================== */

        .booking-section {
          background: white;
        }

        .booking-box {
          max-width: 900px;

          margin: auto;

          padding: 38px;

          border: 1px solid #e3ece6;

          border-radius: 23px;

          background: white;

          box-shadow:
            0 20px 55px rgba(
              10,
              80,
              40,
              0.07
            );
        }

        .booking-top {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 27px;
        }

        .booking-top h3 {
          font-size: 21px;

          font-weight: 800;
        }

        .booking-status {
          padding: 8px 12px;

          border-radius: 30px;

          color: #159447;

          background: #e8f8ed;

          font-size: 10px;

          font-weight: 700;
        }

        .booking-fields {
          display: grid;

          grid-template-columns:
            1fr
            1fr
            1.5fr;

          gap: 15px;
        }

        .booking-field {
          padding: 20px;

          border: 1px solid #e4ece7;

          border-radius: 14px;

          background: #f8fbf9;
        }

        .booking-field label {
          display: block;

          margin-bottom: 8px;

          color: #84918a;

          font-size: 10px;

          font-weight: 600;
        }

        .booking-field strong {
          font-size: 14px;
        }

        .quantity-options {
          display: flex;

          gap: 7px;

          flex-wrap: wrap;
        }

        .quantity {
          padding: 7px 10px;

          border: 1px solid #cfe3d5;

          border-radius: 8px;

          color: #4e6459;

          background: white;

          font-size: 10px;
        }

        .quantity.active {
          color: white;

          border-color: #159447;

          background: #159447;
        }

        /* =====================================================
           CTA
        ====================================================== */

        .cta-section {
          padding-top: 35px;

          background: #f7fbf8;
        }

        .cta {
          min-height: 330px;

          padding: 55px;

          border-radius: 28px;

          position: relative;

          overflow: hidden;

          display: flex;

          align-items: center;
          justify-content: center;

          text-align: center;

          color: white;

          background:
            linear-gradient(
              120deg,
              #064b27,
              #0d7138
            );
        }

        .cta-content {
          max-width: 720px;

          position: relative;

          z-index: 2;
        }

        .cta-badge {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          padding: 8px 13px;

          border-radius: 50px;

          background:
            rgba(
              255,
              255,
              255,
              0.12
            );

          font-size: 10px;

          font-weight: 700;
        }

        .cta h2 {
          margin-top: 16px;

          font-size: 37px;

          letter-spacing: -1.2px;

          line-height: 1.2;
        }

        .cta p {
          margin-top: 10px;

          color: #d4ebdc;

          font-size: 14px;
        }

        .cta-buttons {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 12px;

          margin-top: 27px;
        }

        .btn-white {
          color: #0b6733;

          background: white;
        }

        .btn-white:hover {
          transform: translateY(-2px);
        }

        .btn-transparent {
          color: white;

          border-color:
            rgba(
              255,
              255,
              255,
              0.5
            );
        }

        .btn-transparent:hover {
          background:
            rgba(
              255,
              255,
              255,
              0.1
            );
        }

        .cta-leaf {
          position: absolute;

          color:
            rgba(
              255,
              255,
              255,
              0.055
            );
        }

        .cta-leaf-left {
          left: -25px;
          bottom: -40px;

          transform: rotate(-25deg);
        }

        .cta-leaf-right {
          right: -25px;
          top: -35px;

          transform: rotate(30deg);
        }

        /* =====================================================
           FOOTER
        ====================================================== */

        .footer {
          padding: 50px 0;

          background: white;

          border-top:
            1px solid #e7eee9;
        }

        .footer-grid {
          display: grid;

          grid-template-columns:
            1fr
            2fr
            auto;

          align-items: center;

          gap: 30px;
        }

        .footer-links {
          display: flex;

          justify-content: center;

          gap: 24px;

          flex-wrap: wrap;
        }

        .footer-links a {
          color: #687870;

          font-size: 11px;
        }

        .copyright {
          color: #8a9690;

          font-size: 10px;

          white-space: nowrap;
        }

        .source-line {
          margin-top: 8px;

          text-align: center;

          color: #9aa69f;

          font-size: 9px;
        }

        /* =====================================================
           FOOTER AUTH BUTTON
        ====================================================== */

        .footer-auth-button {
          padding: 0;
          border: none;
          background: transparent;
          color: #687870;
          font-size: 11px;
          cursor: pointer;
          font-family: inherit;
        }

        .footer-auth-button:hover {
          color: #159447;
        }

        /* =====================================================
           AUTH MODAL
        ====================================================== */

        .auth-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(4, 28, 16, 0.58);
          backdrop-filter: blur(9px);
          overflow-y: auto;
        }

        .auth-modal {
          width: min(520px, 100%);
          max-height: 92vh;
          overflow-y: auto;
          position: relative;
          padding: 35px;
          border-radius: 25px;
          background: #ffffff;
          box-shadow: 0 35px 100px rgba(0, 0, 0, 0.25);
          scrollbar-width: thin;
        }

        .auth-close {
          position: absolute;
          top: 17px;
          right: 17px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 50%;
          color: #5e6d65;
          background: #f3f7f4;
          cursor: pointer;
          transition: 0.2s;
        }

        .auth-close:hover {
          color: #159447;
          background: #e7f8ed;
          transform: rotate(90deg);
        }

        .auth-header {
          padding: 5px 35px 25px;
          text-align: center;
        }

        .auth-logo {
          width: 55px;
          height: 55px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 17px;
          color: #159447;
          background: #e8f8ed;
        }

        .auth-header h2 {
          margin-top: 17px;
          font-size: 27px;
          letter-spacing: -0.7px;
          font-weight: 800;
        }

        .auth-header p {
          margin-top: 7px;
          color: #77847e;
          font-size: 12px;
          line-height: 1.6;
        }

        .auth-form {
          display: grid;
          gap: 17px;
        }

        .auth-field {
          display: grid;
          gap: 7px;
        }

        .auth-field > label {
          color: #394b42;
          font-size: 11px;
          font-weight: 700;
        }

        .input-wrapper {
          height: 52px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 15px;
          border: 1px solid #dce7e0;
          border-radius: 12px;
          background: #fbfdfb;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-wrapper:focus-within {
          border-color: #159447;
          box-shadow: 0 0 0 3px rgba(21, 148, 71, 0.09);
        }

        .input-wrapper > svg {
          color: #8a9991;
          flex-shrink: 0;
        }

        .input-wrapper input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          color: #14251c;
          background: transparent;
          font-family: inherit;
          font-size: 13px;
        }

        .input-wrapper input::placeholder {
          color: #a2ada7;
        }

        .password-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          background: transparent;
          color: #8a9991;
          cursor: pointer;
        }

        .password-toggle:hover {
          color: #159447;
        }

        .user-type-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .user-type-option {
          min-height: 92px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 12px;
          border: 1px solid #dce7e0;
          border-radius: 13px;
          color: #63736b;
          background: #fbfdfb;
          cursor: pointer;
          text-align: center;
          transition: 0.2s ease;
        }

        .user-type-option:hover {
          transform: translateY(-2px);
          border-color: #9bd0ac;
        }

        .user-type-option.selected {
          color: #116b36;
          border-color: #159447;
          background: #eaf8ee;
          box-shadow: 0 6px 18px rgba(21, 148, 71, 0.08);
        }

        .user-type-option svg {
          width: 22px;
          height: 22px;
        }

        .user-type-option span {
          font-size: 10px;
          font-weight: 700;
        }

        .user-type-option input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .auth-submit {
          width: 100%;
          min-height: 52px;
          margin-top: 4px;
        }

        .auth-submit:disabled {
          cursor: not-allowed;
          opacity: 0.7;
          transform: none;
        }

        .auth-spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: authSpin 0.7s linear infinite;
        }

        @keyframes authSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .auth-switch {
          margin-top: 20px;
          text-align: center;
          color: #78857f;
          font-size: 11px;
        }

        .auth-switch button {
          margin-left: 5px;
          padding: 0;
          border: none;
          color: #159447;
          background: transparent;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .auth-switch button:hover {
          text-decoration: underline;
        }

        .auth-security {
          margin-top: 18px;
          padding-top: 15px;
          border-top: 1px solid #edf1ee;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #929d97;
          font-size: 9px;
          text-align: center;
        }

        .auth-security svg {
          color: #159447;
        }

        /* =====================================================
           TABLET
        ====================================================== */

        @media (max-width: 950px) {

          .nav-links {
            gap: 18px;

            margin-right: 18px;
          }

          .hero-grid {
            grid-template-columns: 1fr;
          }

          .hero-copy {
            text-align: center;
          }

          .hero-description {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-buttons,
          .trust-row {
            justify-content: center;
          }

          .hero-visual {
            max-width: 720px;

            width: 100%;

            margin: 20px auto 0;
          }

          .steps-grid {
            grid-template-columns:
              1fr 1fr;

            gap: 50px 25px;
          }

          .step-arrow {
            display: none;
          }

          .facts-grid {
            grid-template-columns:
              1fr 1fr;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .impact-visual {
            min-height: 260px;
          }

          .household-card {
            grid-template-columns: 1fr;
          }

          .household-art {
            display: none;
          }

          .booking-fields {
            grid-template-columns: 1fr;
          }

          .footer-grid {
            grid-template-columns: 1fr;

            text-align: center;
          }

          .footer-brand {
            justify-content: center;
          }

          .copyright {
            white-space: normal;
          }
        }

        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 700px) {

          .container {
            width: calc(100% - 30px);
          }

          .navbar {
            height: 70px;

            padding: 0 15px;
          }

          .nav-buttons {
            display: none;
          }

          .menu-btn {
            display: flex;
          }

          .nav-links {
            display: none;

            position: absolute;

            top: 70px;

            left: 12px;
            right: 12px;

            padding: 16px;

            margin: 0;

            border-radius: 17px;

            background: white;

            box-shadow:
              0 20px 55px rgba(
                0,
                0,
                0,
                0.10
              );

            flex-direction: column;

            align-items: stretch;

            gap: 0;
          }

          .nav-links.mobile-open {
            display: flex;
          }

          .nav-links a {
            padding: 12px;
          }

          .mobile-buttons {
            display: flex;

            gap: 8px;

            padding-top: 8px;
          }

          .hero {
            min-height: auto;

            padding-top: 110px;
            padding-bottom: 80px;
          }

          .hero-title {
            font-size: 45px;

            letter-spacing: -2.4px;
          }

          .hero-description {
            font-size: 15px;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .trust-row {
            gap: 13px;
          }

          .hero-card {
            min-height: 380px;

            border-radius: 27px;
          }

          .hero-house {
            width: 78%;
            height: 65%;
          }

          .hero-window {
            width: 58px;
            height: 70px;

            top: 83px;

            border-width: 5px;
          }

          .window-left {
            left: 25px;
          }

          .window-right {
            right: 25px;
          }

          .hero-door {
            width: 58px;

            height: 105px;

            left:
              calc(50% - 29px);
          }

          .collector {
            transform: scale(0.75);

            right: -8%;
          }

          .collector-box {
            left: -80px;
          }

          .floating-card {
            display: none;
          }

          .section {
            padding: 78px 0;
          }

          .section-heading {
            margin-bottom: 40px;
          }

          .section-title {
            font-size: 32px;
          }

          .section-description {
            font-size: 14px;
          }

          .steps-grid {
            grid-template-columns: 1fr;
          }

          .facts-grid {
            grid-template-columns: 1fr;
          }

          .fact-card {
            min-height: 255px;
          }

          .benefit-cards {
            grid-template-columns: 1fr;
          }

          .audience {
            display: none;
          }

          .household-card {
            padding: 30px;
          }

          .household-title {
            font-size: 27px;
          }

          .booking-box {
            padding: 23px;
          }

          .booking-top {
            align-items: flex-start;

            gap: 10px;
          }

          .cta {
            padding: 45px 20px;
          }

          .cta h2 {
            font-size: 28px;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .footer-links {
            gap: 14px;
          }

          .brand-name {
            font-size: 19px;
          }

          .auth-overlay {
            padding: 10px;
          }

          .auth-modal {
            max-height: 95vh;
            padding: 27px 20px;
            border-radius: 21px;
          }

          .auth-header {
            padding: 0 25px 22px;
          }

          .auth-header h2 {
            font-size: 24px;
          }

          .user-type-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .user-type-option {
            min-height: 84px;
          }

          .user-type-option span {
            font-size: 9px;
          }

        }

      `}</style>


      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header
        className={`navbar ${
          scrolled ? "scrolled" : ""
        }`}
      >

        <a
          href="#home"
          className="brand"
          onClick={closeMenu}
        >

          <div className="brand-icon">
            <Leaf
              size={26}
              fill="currentColor"
            />
          </div>

          <div>

            <div className="brand-name">
              Scrap<span>Smart</span>
            </div>

            <span className="brand-tagline">
              Recycle Today, Better Tomorrow
            </span>

          </div>

        </a>


        <nav
          className={`nav-links ${
            menuOpen ? "mobile-open" : ""
          }`}
        >

          <a
            href="#home"
            onClick={closeMenu}
          >
            Home
          </a>

          <a
            href="#how-it-works"
            onClick={closeMenu}
          >
            How It Works
          </a>

          <a
            href="#why"
            onClick={closeMenu}
          >
            Why ScrapSmart
          </a>

          <a
            href="#waste"
            onClick={closeMenu}
          >
            Waste Challenge
          </a>

          <a
            href="#about"
            onClick={closeMenu}
          >
            About
          </a>


          {/* <div className="mobile-buttons">

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                closeMenu();
                openAuth("login");
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                closeMenu();
                openAuth("signup");
              }}
            >
              Sign Up
            </button>

          </div> */}

        </nav>


        <div className="nav-buttons">

          <button
  type="button"
  className="btn btn-outline"
  onClick={() => openAuth("login")}
>
  Sign In
</button>

          <button
  type="button"
  className="btn btn-primary"
  onClick={() => openAuth("signup")}
>
  Sign Up
</button>

        </div>


        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >

          {menuOpen ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}

        </button>

      </header>


      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="hero"
        id="home"
      >

        <div className="container hero-grid">

          <div className="hero-copy">

            <motion.div
              className="eyebrow"

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                duration: 0.6
              }}
            >

              <Leaf size={16} />

              A smarter way to sell your scrap

            </motion.div>


            <motion.h1
              className="hero-title"

              initial={{
                opacity: 0,
                y: 35
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                duration: 0.7,
                delay: 0.1
              }}
            >

              Turn Your Scrap

              <span>
                Into Value.
              </span>

            </motion.h1>


            <motion.p
              className="hero-description"

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                duration: 0.7,
                delay: 0.2
              }}
            >

              Schedule a scrap pickup from your home,
              choose when you want it collected, and let
              ScrapSmart connect you with a nearby collector.

            </motion.p>


            <motion.div
              className="hero-buttons"

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                duration: 0.7,
                delay: 0.3
              }}
            >

              <button
                type="button"
                className="btn btn-primary btn-large"
                onClick={() => openAuth("signup")}
              >

                Schedule a Pickup

                <ArrowRight size={18} />

              </button>


              <a
                href="#how-it-works"
                className="btn btn-outline btn-large"
              >

                See How It Works

              </a>

            </motion.div>


            <motion.div
              className="trust-row"

              initial={{
                opacity: 0
              }}

              animate={{
                opacity: 1
              }}

              transition={{
                duration: 0.7,
                delay: 0.5
              }}
            >

              <div className="trust-item">

                <Leaf size={19} />

                Convenient

              </div>

              <div className="trust-item">

                <ShieldCheck size={19} />

                Simple & Transparent

              </div>

              <div className="trust-item">

                <MapPin size={19} />

                Nearby Pickup

              </div>

            </motion.div>

          </div>


          {/* HERO VISUAL */}

          <motion.div
            className="hero-visual"

            style={{
              y: heroY
            }}

            initial={{
              opacity: 0,
              x: 50
            }}

            animate={{
              opacity: 1,
              x: 0
            }}

            transition={{
              duration: 0.9
            }}
          >

            <div className="hero-card">

              <div className="hero-house">

                <div className="hero-roof"></div>

                <div
                  className="
                    hero-window
                    window-left
                  "
                ></div>

                <div
                  className="
                    hero-window
                    window-right
                  "
                ></div>

                <div className="hero-door"></div>

              </div>


              {/* Collector Illustration */}

              <motion.div
                className="collector"

                animate={{
                  y: [0, -7, 0]
                }}

                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              >

                <div className="collector-head">

                  <div className="collector-cap"></div>

                </div>

                <div className="collector-body"></div>

                <div className="collector-box">

                  <div className="bottle one"></div>

                  <div className="bottle two"></div>

                  <div className="bottle three"></div>

                </div>

              </motion.div>


              {/* Floating Card */}

              <motion.div
                className="
                  floating-card
                  floating-top
                "

                animate={{
                  y: [0, -9, 0]
                }}

                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              >

                <Recycle size={24} />

                <div>

                  <strong>
                    Recycle
                  </strong>

                  <small>
                    Reduce · Reuse · Recover
                  </small>

                </div>

              </motion.div>


              <motion.div
                className="
                  floating-card
                  floating-bottom
                "

                animate={{
                  y: [0, 8, 0]
                }}

                transition={{
                  duration: 3.5,
                  repeat: Infinity
                }}
              >

                <CalendarDays size={23} />

                <div>

                  <strong>
                    Easy Pickup
                  </strong>

                  <small>
                    Schedule when you need
                  </small>

                </div>

              </motion.div>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section
        className="section process"
        id="how-it-works"
      >

        <div className="container">

          <SectionHeading
            label="Simple Process"
            title="How ScrapSmart Works"
            description="From your home to your nearby scrap collector in just a few simple steps."
          />


          <div className="steps-grid">

            {steps.map(
              (step, index) => {

                const Icon = step.icon;

                return (
                  <React.Fragment
                    key={step.title}
                  >

                    <motion.div
                      className="step"

                      initial={{
                        opacity: 0,
                        y: 30
                      }}

                      whileInView={{
                        opacity: 1,
                        y: 0
                      }}

                      viewport={{
                        once: true
                      }}

                      transition={{
                        duration: 0.55,

                        delay:
                          index * 0.1
                      }}
                    >

                      <div className="step-icon">

                        <Icon size={30} />

                      </div>


                      <span className="step-number">

                        0{index + 1}

                      </span>


                      <h3 className="step-title">

                        {step.title}

                      </h3>


                      <p className="step-text">

                        {step.text}

                      </p>

                    </motion.div>


                    {index <
                      steps.length - 1 && (

                      <ChevronRight
                        className="step-arrow"
                        size={27}
                      />

                    )}

                  </React.Fragment>
                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          WASTE CHALLENGE
      ====================================================== */}

      <section
        className="section waste-section"
        id="waste"
      >

        <div className="container">

          <SectionHeading
            label="The Bigger Picture"
            title="Why smarter scrap collection matters."
            description="Waste is growing globally and India faces a significant waste-management challenge. ScrapSmart is designed to make one part of that system — household scrap collection — simpler."
          />


          <div className="facts-grid">


            {/* INDIA SOLID WASTE */}

            <motion.div
              className="fact-card"

              initial={{
                opacity: 0,
                y: 30
              }}

              whileInView={{
                opacity: 1,
                y: 0
              }}

              viewport={{
                once: true
              }}
            >

              <div className="fact-icon">

                <Trash2 size={25} />

              </div>


              <h3>
                India's Solid Waste
              </h3>


              <div className="fact-number">
                1.70 Lakh
              </div>


              <p className="fact-text">

                tonnes of solid waste were
                reported as generated per day
                in India in CPCB's 2021–22
                assessment.

              </p>


              <span className="fact-source">

                Source: CPCB, 2021–22

              </span>

            </motion.div>


            {/* PLASTIC WASTE */}

            <motion.div
              className="fact-card"

              initial={{
                opacity: 0,
                y: 30
              }}

              whileInView={{
                opacity: 1,
                y: 0
              }}

              viewport={{
                once: true
              }}

              transition={{
                delay: 0.1
              }}
            >

              <div className="fact-icon">

                <Recycle size={25} />

              </div>


              <h3>
                India's Plastic Waste
              </h3>


              <div className="fact-number">
                41.36 Lakh
              </div>


              <p className="fact-text">

                tonnes of plastic waste were
                reported as generated in
                India during FY 2022–23,
                based on information supplied
                by State Pollution Control
                Boards and PCCs to CPCB.

              </p>


              <span className="fact-source">

                Source: MoEFCC / CPCB, FY 2022–23

              </span>

            </motion.div>


            {/* GLOBAL */}

            <motion.div
              className="fact-card"

              initial={{
                opacity: 0,
                y: 30
              }}

              whileInView={{
                opacity: 1,
                y: 0
              }}

              viewport={{
                once: true
              }}

              transition={{
                delay: 0.2
              }}
            >

              <div className="fact-icon">

                <Globe2 size={25} />

              </div>


              <h3>
                Global Waste
              </h3>


              <div className="fact-number">
                3.8 Billion
              </div>


              <p className="fact-text">

                tonnes of municipal solid
                waste per year could be
                generated globally by 2050
                if current trends continue.
                UNEP estimates 2.1 billion
                tonnes were generated in 2023.

              </p>


              <span className="fact-source">

                Source: UNEP, GWMO 2024

              </span>

            </motion.div>

          </div>


          <p className="facts-note">

            These figures provide environmental context and
            are not ScrapSmart performance metrics. Data and
            years are shown according to the cited official
            reports.

          </p>

        </div>

      </section>


      {/* =====================================================
          WHY SCRAPSMART
      ====================================================== */}

      <section
        className="section benefits"
        id="why"
      >

        <div className="container">

          <SectionHeading
            label="Why ScrapSmart?"
            title="Scrap collection, made smarter."
            description="We focus on making the household side of scrap collection convenient, predictable and easy to use."
          />


          <div className="benefits-grid">

            <div className="benefit-cards">

              {benefits.map(
                (benefit, index) => {

                  const Icon =
                    benefit.icon;

                  return (
                    <motion.div
                      className="benefit-card"

                      key={
                        benefit.title
                      }

                      initial={{
                        opacity: 0,
                        y: 25
                      }}

                      whileInView={{
                        opacity: 1,
                        y: 0
                      }}

                      viewport={{
                        once: true
                      }}

                      transition={{
                        delay:
                          index * 0.08
                      }}
                    >

                      <div className="benefit-icon">

                        <Icon size={23} />

                      </div>


                      <h3 className="benefit-title">

                        {benefit.title}

                      </h3>


                      <p className="benefit-text">

                        {benefit.text}

                      </p>

                    </motion.div>
                  );
                }
              )}

            </div>


            <motion.div
              className="impact-visual"

              initial={{
                opacity: 0,
                scale: 0.9
              }}

              whileInView={{
                opacity: 1,
                scale: 1
              }}

              viewport={{
                once: true
              }}
            >

              <motion.div
                className="earth"

                animate={{
                  rotate: [
                    0,
                    3,
                    -3,
                    0
                  ]
                }}

                transition={{
                  duration: 6,
                  repeat: Infinity
                }}
              >

                <Recycle
                  size={105}
                  strokeWidth={1.5}
                />

              </motion.div>


              <div className="impact-note">

                Small Actions.

                <br />

                <strong>
                  Big Impact.
                </strong>

              </div>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOUSEHOLD SECTION
      ====================================================== */}

      <section
        className="section household-section"
        id="about"
      >

        <div className="container">

          <motion.div
            className="household-card"

            initial={{
              opacity: 0,
              y: 35
            }}

            whileInView={{
              opacity: 1,
              y: 0
            }}

            viewport={{
              once: true
            }}
          >

            <div>

              <div className="household-icon">

                <House size={29} />

              </div>


              <h2 className="household-title">

                Your scrap.
                <br />

                Your schedule.
                <br />

                Your convenience.

              </h2>


              <p className="household-subtitle">

                ScrapSmart puts the pickup process
                in your hands.

              </p>


              <ul className="household-list">

                {householdPoints.map(
                  (point) => (

                    <li key={point}>

                      <CheckCircle2
                        size={18}
                      />

                      {point}

                    </li>

                  )
                )}

              </ul>

            </div>


            <div className="household-art">

              <motion.div
                className="
                  house-icon-circle
                "

                animate={{
                  y: [0, -7, 0]
                }}

                transition={{
                  duration: 3.2,
                  repeat: Infinity
                }}
              >

                <House size={105} />

              </motion.div>


              <div className="easy-badge">

                <Clock3 size={17} />

                Flexible Pickup

              </div>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          BOOKING PREVIEW
      ====================================================== */}

      <section
        className="
          section
          booking-section
        "
        id="booking"
      >

        <div className="container">

          <SectionHeading
            label="Simple Scheduling"
            title="Tell us when. We'll handle the rest."
            description="You don't have to identify every type of scrap. Just provide your preferred date, time slot and an approximate quantity."
          />


          <motion.div
            className="booking-box"

            initial={{
              opacity: 0,
              y: 30
            }}

            whileInView={{
              opacity: 1,
              y: 0
            }}

            viewport={{
              once: true
            }}
          >

            <div className="booking-top">

              <h3>
                Schedule a Pickup
              </h3>


              <span className="booking-status">

                Simple & Flexible

              </span>

            </div>


            <div className="booking-fields">


              {/* DATE */}

              <div className="booking-field">

                <label>
                  PICKUP DATE
                </label>

                <strong>
                  📅 Select Date
                </strong>

              </div>


              {/* TIME */}

              <div className="booking-field">

                <label>
                  TIME SLOT
                </label>

                <strong>
                  🕐 Choose Time Slot
                </strong>

              </div>


              {/* QUANTITY */}

              <div className="booking-field">

                <label>
                  APPROXIMATE QUANTITY
                </label>


                <div className="quantity-options">

                  <span
                    className="
                      quantity
                      active
                    "
                  >
                    0–5 kg
                  </span>

                  <span className="quantity">
                    5–10 kg
                  </span>

                  <span className="quantity">
                    10–20 kg
                  </span>

                  <span className="quantity">
                    20+ kg
                  </span>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ====================================================== */}

      <section
        className="
          section
          cta-section
        "
      >

        <div className="container">

          <motion.div
            className="cta"

            initial={{
              opacity: 0,
              y: 30
            }}

            whileInView={{
              opacity: 1,
              y: 0
            }}

            viewport={{
              once: true
            }}
          >

            <Leaf
              className="
                cta-leaf
                cta-leaf-left
              "

              size={170}

              fill="currentColor"
            />


            <Leaf
              className="
                cta-leaf
                cta-leaf-right
              "

              size={140}

              fill="currentColor"
            />


            <div className="cta-content">

              <div className="cta-badge">

                <Sparkles size={14} />

                Make Scrap Smarter

              </div>


              <h2>

                Ready to turn your
                scrap into value?

              </h2>


              <p>

                Schedule your first pickup
                with ScrapSmart.

              </p>


              <div className="cta-buttons">

                <button
                  type="button"
                  className="btn btn-white btn-large"
                  onClick={() => openAuth("signup")}
                >

                  Schedule a Pickup

                  <ArrowRight
                    size={18}
                  />

                </button>


                <button
                  type="button"
                  className="btn btn-transparent btn-large"
                  onClick={() => openAuth("login")}
                >
                  Sign In
                </button>

              </div>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">

        <div className="container footer-grid">


          <a
            href="#home"
            className="
              brand
              footer-brand
            "
          >

            <div className="brand-icon">

              <Leaf
                size={25}
                fill="currentColor"
              />

            </div>


            <div>

              <div className="brand-name">

                Scrap<span>Smart</span>

              </div>

              <span className="brand-tagline">

                Recycle Today, Better Tomorrow

              </span>

            </div>

          </a>


          <div className="footer-links">

            <a href="#home">
              Home
            </a>

            <a href="#how-it-works">
              How It Works
            </a>

            <a href="#why">
              Why ScrapSmart
            </a>

            <a href="#waste">
              Waste Challenge
            </a>

            <a href="#booking">
              Schedule
            </a>

            <button
              type="button"
              className="footer-auth-button"
              onClick={() => openAuth("login")}
            >
              Sign In
            </button>

          </div>


          <p className="copyright">

            © 2026 ScrapSmart.
            All rights reserved.

          </p>

        </div>


        <div className="container">

          <p className="source-line">

            Environmental context:
            CPCB / MoEFCC and UNEP reports.

          </p>

        </div>

      </footer>


      {/* =====================================================
          AUTH MODAL
      ====================================================== */}

      {authModal && (
        <motion.div
          className="auth-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuth}
        >

          <motion.div
            className="auth-modal"
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="auth-close"
              type="button"
              aria-label="Close authentication modal"
              onClick={closeAuth}
            >
              <X size={20} />
            </button>


            <div className="auth-header">

              <div className="auth-logo">
                <Leaf
                  size={25}
                  fill="currentColor"
                />
              </div>

              <h2>
                {authMode === "login"
                  ? "Welcome Back"
                  : "Create Your Account"}
              </h2>

              <p>
                {authMode === "login"
                  ? "Sign in to manage your ScrapSmart pickups."
                  : "Join ScrapSmart and make scrap selling easier."}
              </p>

            </div>


            <form
              className="auth-form"
              onSubmit={handleAuthSubmit}
            >

              {authMode === "signup" && (
                <>

                  <div className="auth-field">
                    <label>
                      Username
                    </label>

                    <div className="input-wrapper">
                      <UserRound size={18} />

                      <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={authForm.username}
                        onChange={handleAuthChange}
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>


                  <div className="auth-field">
                    <label>
                      Mobile Number
                    </label>

                    <div className="input-wrapper">
                      <Phone size={18} />

                      <input
                        type="tel"
                        name="mobile"
                        placeholder="Enter your 10-digit mobile number"
                        value={authForm.mobile}
                        onChange={handleAuthChange}
                        autoComplete="tel"
                        inputMode="numeric"
                        maxLength="10"
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                  </div>


                  <div className="auth-field">
                    <label>
                      Email Address
                    </label>

                    <div className="input-wrapper">
                      <Mail size={18} />

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={authForm.email}
                        onChange={handleAuthChange}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>


                  <div className="auth-field">
                    <label>
                      Where do you generate scrap?
                    </label>

                    <div className="user-type-grid">

                      <label
                        className={`user-type-option ${
                          authForm.userType === "Household"
                            ? "selected"
                            : ""
                        }`}
                      >

                        <input
                          type="radio"
                          name="userType"
                          value="Household"
                          checked={
                            authForm.userType === "Household"
                          }
                          onChange={handleAuthChange}
                        />

                        <House size={20} />

                        <span>
                          Household
                        </span>

                      </label>


                      <label
                        className={`user-type-option ${
                          authForm.userType === "Business / Industry"
                            ? "selected"
                            : ""
                        }`}
                      >

                        <input
                          type="radio"
                          name="userType"
                          value="Business / Industry"
                          checked={
                            authForm.userType === "Business / Industry"
                          }
                          onChange={handleAuthChange}
                        />

                        <Building2 size={20} />

                        <span>
                          Business / Industry
                        </span>

                      </label>


                      <label
                        className={`user-type-option ${
                          authForm.userType === "College / Institution"
                            ? "selected"
                            : ""
                        }`}
                      >

                        <input
                          type="radio"
                          name="userType"
                          value="College / Institution"
                          checked={
                            authForm.userType === "College / Institution"
                          }
                          onChange={handleAuthChange}
                        />

                        <GraduationCap size={20} />

                        <span>
                          College / Institution
                        </span>

                      </label>


                      <label
                        className={`user-type-option ${
                          authForm.userType === "Other"
                            ? "selected"
                            : ""
                        }`}
                      >

                        <input
                          type="radio"
                          name="userType"
                          value="Other"
                          checked={
                            authForm.userType === "Other"
                          }
                          onChange={handleAuthChange}
                        />

                        <Recycle size={20} />

                        <span>
                          Other
                        </span>

                      </label>

                    </div>
                  </div>

                </>
              )}


              {authMode === "login" && (
                <div className="auth-field">
                  <label>
                    Email or Mobile Number
                  </label>

                  <div className="input-wrapper">
                    <UserRound size={18} />

                    <input
                      type="text"
                      name="email"
                      placeholder="Enter email or mobile number"
                      value={authForm.email}
                      onChange={handleAuthChange}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>
              )}


              <div className="auth-field">
                <label>
                  Password
                </label>

                <div className="input-wrapper">

                  <LockKeyhole size={18} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={authForm.password}
                    onChange={handleAuthChange}
                    autoComplete={
                      authMode === "login"
                        ? "current-password"
                        : "new-password"
                    }
                    minLength="6"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>
              </div>


              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={authLoading}
              >

                {authLoading ? (
                  <>
                    <span className="auth-spinner"></span>
                    Please wait...
                  </>
                ) : (
                  <>
                    {authMode === "login"
                      ? "Sign In"
                      : "Create Account"}

                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>


            <div className="auth-switch">

              {authMode === "login" ? (
                <>
                  Don't have an account?

                  <button
                    type="button"
                    onClick={() => openAuth("signup")}
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?

                  <button
                    type="button"
                    onClick={() => openAuth("login")}
                  >
                    Sign in
                  </button>
                </>
              )}

            </div>


            <div className="auth-security">
              <ShieldCheck size={15} />
              Your information stays private and secure.
            </div>

          </motion.div>

        </motion.div>
      )}

    </div>
  );
}


/* ============================================================
   SECTION HEADING
============================================================ */

function SectionHeading({
  label,
  title,
  description,
}) {
  return (
    <div className="section-heading">

      <div className="section-label">

        <Leaf size={15} />

        {label}

      </div>


      <h2 className="section-title">

        {title}

      </h2>


      <p className="section-description">

        {description}

      </p>

    </div>
  );
}


export default LandingPage1;