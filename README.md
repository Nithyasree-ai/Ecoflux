# ECOFLUX — Smart Energy Management for Green Campuses

> **“Turn Campus Energy Into Intelligent Action.”**  
> *Monitor energy. Predict demand. Optimize renewables. Build a smarter, greener campus.*

ECOFLUX is a production-grade, full-stack smart energy management web application designed for university and college campuses. It unifies electricity consumption, rooftop solar generation, central battery storage (BESS), occupant density, and AI predictive analytics into an interactive, Bento Box dashboard.

---

## 🌟 Key Architecture & Highlights

- **Bento Box Design System**: Deep obsidian charcoal (`#050a08`), vibrant emerald (`#10b981`), electric lime (`#4ade80`), cyan highlights, and glassmorphism.
- **3D Digital Twin**: Interactive Three.js campus visualizer with 8 campus buildings, solar rooftops, central battery storage hub, and live glowing particle streams tracing energy flow: `Solar → Battery → Buildings → Savings`.
- **20 Complete Routes**: Every page requested is fully implemented, styled, and navigable.
- **Unified Vercel Single-Project Deployment**: Single frontend + Supabase client architecture configured with `vercel.json` SPA rewrites.
- **Dual-Mode Data Layer**:
  - Automatically queries live **Supabase PostgreSQL** when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided.
  - Seamlessly falls back to an offline reactive in-memory / `localStorage` engine for instant presentation and judging with zero setup barriers.
- **AI Forecasting & What-If Simulation**: 24-hour, 7-day, and 30-day demand and solar forecasting with confidence intervals and interactive scenario sliders.
- **Specialized AI Energy Copilot**: Context-aware campus assistant pre-trained with active facility telemetry and actionable recommendation buttons.

---

## 🏛️ Campus Facility Matrix (8 Buildings)

1. **Academic Block (`ACAD`)**: 65,000 sqft • 95 kW Solar • 88.5 kW Demand • 82.5% Occupancy • Score: 88
2. **Computer Science Block (`CS-LAB`)**: 48,000 sqft • 110 kW Solar • 136.2 kW Demand • 91.1% Occupancy • Score: 92 (Platinum)
3. **Central Library (`LIB`)**: 35,000 sqft • 65 kW Solar • 46.8 kW Demand • 74.3% Occupancy • Score: 81
4. **Hostel Block A (`HOST-A`)**: 52,000 sqft • 45 kW Solar • 71.4 kW Demand • 29.5% Occupancy • Score: 67 (Flagged Idle Anomaly)
5. **Hostel Block B (`HOST-B`)**: 54,000 sqft • 50 kW Solar • 52.0 kW Demand • 33.8% Occupancy • Score: 74
6. **Administration Wing (`ADMIN`)**: 28,000 sqft • 35 kW Solar • 39.1 kW Demand • 74.0% Occupancy • Score: 89 (Platinum)
7. **Laboratory Block (`ADV-LAB`)**: 58,000 sqft • 80 kW Solar • 118.0 kW Demand • 76.6% Occupancy • Score: 79
8. **Campus Dining Hub (`CAFE`)**: 22,000 sqft • 40 kW Solar • 61.2 kW Demand • 76.0% Occupancy • Score: 84

---

## 🚀 Quickstart & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🗄️ Supabase Database Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
4. Copy your **Project URL** and **Anon Public Key** from *Project Settings > API*.
5. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

*Note: If environment variables are omitted, EcoFlux automatically defaults to its realistic local dataset and mock authentication so that hackathon judges can immediately evaluate every feature.*

---

## 🌐 20 Routes & Site Map

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing / Hero | 3D Interactive Campus, Metrics & Value Proposition |
| `/features` | Features Bento Grid | 10 modular platform capabilities |
| `/how-it-works` | Process Architecture | 7-stage animated pipeline diagram |
| `/login` | Sign In | Split-screen authentication with 1-click demo login |
| `/signup` | Registration | New user registration with campus affiliation |
| `/auth/callback` | Auth Synchronizer | Animated energy particle loader |
| `/dashboard` | Smart Dashboard | 6 KPI counters, real-time ticker, 6 Bento charts |
| `/energy` | Energy Consumption | Building sub-metering, filters & HVAC states |
| `/solar` | Solar Generation | 318 kW rooftop generation curve & irradiance |
| `/battery` | Battery Storage (BESS) | Large animated liquid battery with AI dispatch logic |
| `/occupancy` | Occupancy Correlator | Heatmap & low-occupancy idle waste detection |
| `/predictions` | AI Forecasts | 24h/7d/30d actual vs predicted demand curve |
| `/recommendations` | AI Recommendations | Prioritized actionable efficiency interventions |
| `/simulator` | What-If Simulator | Interactive sliders with Before vs After financial ROI |
| `/copilot` | AI Energy Copilot | Conversational energy assistant with data cards |
| `/green-score` | Green Building Score | 0–100 gamified leaderboard & campus trophy |
| `/reports` | Reports & Analytics | Audit compiler with live CSV and PDF export |
| `/settings` | Campus Settings | Threshold caps, AI autonomous dispatch toggles |
| `/profile` | Operator Profile | User role details & security audit trail |
| `/404` | Not Found | Custom eco-tech 404 recovery page |

---

## 🚢 Single-Project Vercel Deployment

1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Root Directory: `./`.
5. (Optional) Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Environment Variables.
6. Click **Deploy**. The `vercel.json` will automatically route all SPA traffic to `index.html`.
