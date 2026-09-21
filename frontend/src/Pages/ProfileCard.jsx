import React from "react";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  Truck,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./ProfileCard.css";

function ProfileCard({ open, onClose }) {
  const navigate = useNavigate();

  const getUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  };

  const user = getUser();

  const username =
    user?.username ||
    user?.userName ||
    "ScrapSmart User";

  const email =
    user?.email ||
    "Email not available";

  const mobile =
    user?.mobile ||
    user?.phone ||
    user?.mobileNumber ||
    "Not added";

  const role =
    user?.role ||
    user?.roles?.[0] ||
    "HOUSEHOLD USER";

  const createdAt =
    user?.createdAt ||
    user?.createdDate ||
    null;

  const memberSince = createdAt
    ? new Intl.DateTimeFormat("en-IN", {
        month: "short",
        year: "numeric",
      }).format(new Date(createdAt))
    : "ScrapSmart Member";

  const firstLetter =
    username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("userName");

    onClose();

    navigate("/");
  };

  const goTo = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="profile-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="profile-card"
            initial={{
              opacity: 0,
              y: -12,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.97,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Header */}
            <div className="profile-card-header">
              <div>
                <span className="profile-eyebrow">
                  SCRAPSMART ACCOUNT
                </span>

                <h2>My Profile</h2>
              </div>

              <button
                type="button"
                className="profile-close"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            {/* User identity */}
            <div className="profile-identity">
              <div className="profile-avatar-large">
                {firstLetter}
              </div>

              <div className="profile-identity-text">
                <h3>{username}</h3>

                <span>
                  <ShieldCheck size={14} />
                  {String(role).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="profile-details">
              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <Mail size={16} />
                </div>

                <div>
                  <span>Email</span>
                  <strong>{email}</strong>
                </div>
              </div>

              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <Phone size={16} />
                </div>

                <div>
                  <span>Mobile number</span>
                  <strong>{mobile}</strong>
                </div>
              </div>

              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <UserRound size={16} />
                </div>

                <div>
                  <span>Account type</span>
                  <strong>Household User</strong>
                </div>
              </div>

              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <CalendarDays size={16} />
                </div>

                <div>
                  <span>Member since</span>
                  <strong>{memberSince}</strong>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="profile-actions">
              <button
                type="button"
                onClick={() =>
                  goTo("/home")
                }
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/pickup-history")
                }
              >
                <Truck size={16} />
                Pickup History
              </button>
            </div>

            {/* Logout */}
            <button
              type="button"
              className="profile-logout"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>

            <p className="profile-footer">
              Your ScrapSmart account keeps your
              pickup activity organized.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProfileCard;