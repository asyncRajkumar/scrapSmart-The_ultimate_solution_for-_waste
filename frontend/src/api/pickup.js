import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createPickup = async (pickupData) => {
  const token = localStorage.getItem("token");

  const response = await API.post(
    "/pickups",
    pickupData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getMyPickups = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get(
    "/pickups",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getPickupById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await API.get(
    `/pickups/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};