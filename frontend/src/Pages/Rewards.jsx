import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Gift,
  Leaf,
  Recycle,
  Sparkles,
  Star,
  Trophy,
  WalletCards,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRewards, redeemReward } from "../api/community";
import "./Rewards.css";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

const couponIcon = {
  leaf: Leaf,
  trophy: Trophy,
  sparkles: Sparkles,
};

function Rewards() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [redeeming, setRedeeming] = useState("");
  const [message, setMessage] = useState("");

  const user = useMemo(() => getStoredUser(), []);
  const username = user?.username || user?.userName || user?.name || "User";
  const initials = username.slice(0, 1).toUpperCase();

  const loadRewards = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view your rewards.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await getRewards();

      if (!result.success) {
        throw new Error(result.message || "Unable to load rewards");
      }

      setData(result);
    } catch (err) {
      console.error("Rewards error:", err);
      setError(
        err.response?.data?.message || err.message || "Unable to load rewards."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  const rewards = data?.rewards;
  const coupons = rewards?.coupons || [];
  const lifetimePoints = rewards?.lifetimePoints || 0;
  const currentPoints = rewards?.points || 0;
  const completedPickups = rewards?.completedPickups || 0;
  const nextCoupon = coupons.find((coupon) => !coupon.claimed);
  const pointsToNext = nextCoupon
    ? Math.max(nextCoupon.points - currentPoints, 0)
    : 0;

  const progress = nextCoupon
    ? Math.min((currentPoints / nextCoupon.points) * 100, 100)
    : 100;

  const handleRedeem = async (code) => {
    try {
      setRedeeming(code);
      setMessage("");

      const result = await redeemReward(code);

      if (!result.success) {
        throw new Error(result.message || "Unable to redeem reward");
      }

      setMessage(`${code} claimed successfully.`);
      await loadRewards();
    } catch (err) {
      console.error("Redeem reward error:", err);
      setMessage(
        err.response?.data?.message || err.message || "Unable to redeem reward."
      );
    } finally {
      setRedeeming("");
    }
  };

  return (
    <div className="rw-page">
      <div className="rw-orb rw-orb-a" />
      <div className="rw-orb rw-orb-b" />
      <div className="rw-grid-bg" />

      <main className="rw-shell">
        <header className="rw-header">
          <button type="button" className="rw-back" onClick={() => navigate("/home")}>
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="rw-brand">
            <div className="rw-brand-mark">
              <Recycle size={20} />
            </div>
            <div>
              <div className="rw-brand-name">
                Scrap<span>Smart</span>
              </div>
              <div className="rw-brand-sub">REWARDS CENTER</div>
            </div>
          </div>

          <div className="rw-user-pill">
            <div className="rw-user-avatar">{initials}</div>
            <div className="rw-user-copy">
              <span>Hi,</span>
              <strong>{username}</strong>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="rw-state-card">
            <Gift size={27} />
            <h2>Loading your rewards...</h2>
            <p>We're calculating your ScrapSmart points and available rewards.</p>
          </div>
        ) : error ? (
          <div className="rw-state-card error">
            <X size={27} />
            <h2>Unable to load rewards</h2>
            <p>{error}</p>
            <button type="button" className="rw-primary" onClick={loadRewards}>
              Try again
            </button>
          </div>
        ) : (
          <>
            <section className="rw-hero">
              <div className="rw-hero-copy">
                <span className="rw-eyebrow">
                  <Sparkles size={14} />
                  SCRAPSMART REWARDS
                </span>
                <h1>
                  Every pickup can move
                  <span>your points forward.</span>
                </h1>
                <p>
                  Earn points from successful scrap pickups and turn your recycling
                  activity into useful reward codes.
                </p>
              </div>

              <div className="rw-points-card">
                <div className="rw-points-icon">
                  <Trophy size={22} />
                </div>
                <span>Available points</span>
                <strong>{currentPoints.toLocaleString("en-IN")}</strong>
                <small>
                  {completedPickups} completed pickup{completedPickups === 1 ? "" : "s"}
                </small>
              </div>
            </section>

            <section className="rw-stats">
              <div className="rw-stat">
                <CircleDollarSign size={18} />
                <span>Lifetime earned</span>
                <strong>{lifetimePoints.toLocaleString("en-IN")}</strong>
              </div>
              <div className="rw-stat">
                <WalletCards size={18} />
                <span>Completed pickups</span>
                <strong>{completedPickups}</strong>
              </div>
              <div className="rw-stat">
                <Gift size={18} />
                <span>Rewards available</span>
                <strong>{coupons.filter((coupon) => !coupon.claimed).length}</strong>
              </div>
            </section>

            <section className="rw-progress-card">
              <div className="rw-progress-copy">
                <div>
                  <span className="rw-small-label">NEXT REWARD</span>
                  <h2>
                    {nextCoupon ? nextCoupon.title : "All rewards claimed"}
                  </h2>
                  <p>
                    {nextCoupon
                      ? pointsToNext > 0
                        ? `Earn ${pointsToNext} more points to unlock ${nextCoupon.code}.`
                        : `${nextCoupon.code} is ready to claim.`
                      : "Keep recycling to grow your reward history."}
                  </p>
                </div>
                <div className="rw-progress-value">
                  {nextCoupon ? `${Math.round(progress)}%` : "100%"}
                </div>
              </div>

              <div className="rw-progress-track">
                <div className="rw-progress-fill" style={{ width: `${progress}%` }} />
              </div>

              {nextCoupon && (
                <div className="rw-progress-bottom">
                  <span>0</span>
                  <strong>{nextCoupon.points} points</strong>
                </div>
              )}
            </section>

            {message && (
              <motion.div
                className="rw-message"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle2 size={16} />
                {message}
              </motion.div>
            )}

            <section className="rw-coupons">
              <div className="rw-section-heading">
                <div>
                  <span className="rw-small-label">REWARD CODES</span>
                  <h2>Turn points into perks</h2>
                </div>
                <button type="button" className="rw-primary" onClick={() => navigate("/schedule-pickup")}>
                  Earn more points
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="rw-coupon-grid">
                <AnimatePresence mode="popLayout">
                  {coupons.map((coupon) => {
                    const Icon = couponIcon[coupon.icon] || Gift;
                    const canRedeem = coupon.canRedeem && !coupon.claimed;

                    return (
                      <motion.article
                        key={coupon.code}
                        className={`rw-coupon ${coupon.claimed ? "claimed" : ""}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.32 }}
                      >
                        <div className="rw-coupon-top">
                          <div className="rw-coupon-icon">
                            <Icon size={20} />
                          </div>
                          {coupon.claimed ? (
                            <span className="rw-claimed-pill">
                              <CheckCircle2 size={13} />
                              Claimed
                            </span>
                          ) : (
                            <span className="rw-cost-pill">{coupon.points} pts</span>
                          )}
                        </div>

                        <h3>{coupon.title}</h3>
                        <p>{coupon.description}</p>

                        <div className="rw-coupon-value">{coupon.value}</div>

                        <div className="rw-code-row">
                          <code>{coupon.code}</code>
                          <button
                            type="button"
                            disabled={!canRedeem || redeeming === coupon.code}
                            onClick={() => handleRedeem(coupon.code)}
                          >
                            {coupon.claimed
                              ? "Claimed"
                              : redeeming === coupon.code
                                ? "Claiming..."
                                : canRedeem
                                  ? "Claim reward"
                                  : `${Math.max(coupon.points - currentPoints, 0)} pts left`}
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>

            <section className="rw-how-card">
              <div className="rw-how-icon">
                <Star size={21} />
              </div>
              <div>
                <span className="rw-small-label">HOW IT WORKS</span>
                <h3>Simple reward logic for the project demo</h3>
                <div className="rw-rule-list">
                  {(data.earningRules || []).map((rule) => (
                    <div key={rule}>
                      <CheckCircle2 size={15} />
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" className="rw-text-btn" onClick={() => navigate("/pickup-history")}>
                View activity
                <ChevronRight size={16} />
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Rewards;
