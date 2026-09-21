import axios from "axios";


/* =========================================================
   API INSTANCE
   ========================================================= */

const API = axios.create({
  baseURL: "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});


/* =========================================================
   AUTH CONFIG
   ========================================================= */

function authConfig() {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}


/* =========================================================
   NEARBY COLLECTORS
   ========================================================= */

export const getNearbyCollectors = async ({
  latitude,
  longitude,
  radius = 10,
}) => {
  const response =
    await API.get(
      "/community/collectors",
      {
        ...authConfig(),

        params: {
          lat: latitude,
          lng: longitude,
          radius,
        },
      }
    );

  return response.data;
};


/* =========================================================
   REWARDS
   ========================================================= */

export const getRewards =
  async () => {
    const response =
      await API.get(
        "/community/rewards",
        authConfig()
      );

    return response.data;
  };


/* =========================================================
   REDEEM REWARD
   ========================================================= */

export const redeemReward =
  async (couponCode) => {
    const response =
      await API.post(
        "/community/rewards/redeem",

        {
          couponCode,
        },

        authConfig()
      );

    return response.data;
  };