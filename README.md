# ♻️ ScrapSmart

### Smart Household Scrap Pickup & Recycling Platform

> A full-stack web application that makes household scrap collection simple, organized, and technology-driven.

---

## 🌱 Overview

**ScrapSmart** is a web-based household scrap pickup platform designed to simplify the process of disposing and recycling recyclable household materials.

Instead of relying on manual phone calls or unorganized coordination with scrap collectors, users can use ScrapSmart to schedule a pickup by providing their preferred:

- 📅 Pickup date
- 🕐 Time slot
- ⚖️ Approximate scrap quantity
- 📍 Address / location
- 📱 Contact information
- 📝 Optional pickup notes

The request is securely sent to the backend and stored in **MongoDB**, allowing users to view their pickup history and follow the pickup workflow.

ScrapSmart also provides nearby collector discovery, pickup status management, rewards, coupon redemption, user profiles, and support functionality.

---

## 🎯 Problem Statement

Household scrap disposal is often handled through informal and unorganized methods.

Common problems include:

- Difficulty finding suitable scrap collectors
- Manual phone-based coordination
- Uncertain pickup schedules
- Lack of organized pickup records
- Limited visibility into pickup status
- Little incentive for households to recycle regularly

ScrapSmart addresses these problems by bringing the household scrap pickup workflow into a single digital platform.

---

## 💡 Our Solution

ScrapSmart creates a simple digital workflow:

```text
Household User
      ↓
   Login
      ↓
Dashboard
      ↓
Schedule Pickup
      ↓
Pickup Request
      ↓
Backend API
      ↓
MongoDB
      ↓
Pickup History
      ↓
Collector / Status Workflow
      ↓
Completed Pickup
      ↓
Reward Points
