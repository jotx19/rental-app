# 🏠 Rental App

A full-stack rental listing web application built with React and TypeScript. Users can browse, search, and filter rental and sale posts based on various criteria such as price range, post type, and distance.

## 📌 Highlight n Strategy (Geospatial Search)


**The app uses OpenCage API and Mongo GeoSpatial Queries to convert address to coordinates for performance tuning.**

- This enables **efficient geospatial queries** to filter posts by distance from the user's current location. Instead of resolving addresses on every fetch, coordinates are queried directly for speed. The frontend renders a simplified address view for display.
- Uses CI/CD GitHub Action as UPTIME BOT to optimize free-tier.


## ✨ Features

-  User authentication (signup, login, email verification)
-  Search by keyword
-  Filter by:
  - 💰 Price range
  - 🏷️ Post type (rent or sale)
  - 📍 Distance (km-based)
-  View post details
-  Location-aware filtering
-  Responsive UI with mobile drawer filters
-  Zustand for global state
-  Graceful fallback with "No match found" if no results


## 🛠 Technologies

- ⚛️ React + TypeScript
- 🎨 Tailwind CSS
- 🧭 React Router
- ⚙️ Zustand
- 🗺️ MongoDB (with geospatial indexing)
- 🧭 OpenCage Geocoding API
- 🔔 Sonner (toast notifications)

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v18 or newer)
- MongoDB
- OpenCage API

### 📥 Installation

```bash
git clone https://github.com/jotx19/rental-app.git
cd rental-app
npm install
