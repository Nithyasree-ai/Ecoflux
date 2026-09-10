-- ==============================================================================
-- ECOFLUX: SMART ENERGY MANAGEMENT FOR GREEN CAMPUSES
-- Supabase PostgreSQL Database Schema with Row-Level Security & Sample Seed Data
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked with auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'campus_manager', -- 'admin', 'campus_manager', 'energy_analyst', 'student_representative'
    institution TEXT NOT NULL DEFAULT 'Green Valley Institute of Technology',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. BUILDINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Academic', 'Hostel', 'Administrative', 'Laboratory', 'Dining'
    gross_area_sqft NUMERIC NOT NULL,
    designed_occupancy INT NOT NULL,
    solar_installed_kw NUMERIC NOT NULL DEFAULT 0,
    base_load_kw NUMERIC NOT NULL,
    current_green_score NUMERIC NOT NULL DEFAULT 85,
    status TEXT NOT NULL DEFAULT 'optimal', -- 'optimal', 'normal', 'alert', 'warning'
    hvac_status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. ENERGY CONSUMPTION (Time series telemetry)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.energy_consumption (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL,
    demand_kw NUMERIC NOT NULL,
    hvac_kw NUMERIC NOT NULL,
    lighting_kw NUMERIC NOT NULL,
    equipment_kw NUMERIC NOT NULL,
    power_factor NUMERIC NOT NULL DEFAULT 0.96,
    grid_draw_kw NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_energy_building_time ON public.energy_consumption (building_id, timestamp DESC);

-- ------------------------------------------------------------------------------
-- 4. SOLAR GENERATION (Campus rooftop telemetry)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.solar_generation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES public.buildings(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    generation_kw NUMERIC NOT NULL,
    efficiency_pct NUMERIC NOT NULL DEFAULT 94.2,
    irradiance_w_m2 NUMERIC NOT NULL DEFAULT 850,
    ambient_temp_c NUMERIC NOT NULL DEFAULT 28.5,
    cloud_cover_pct NUMERIC NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solar_time ON public.solar_generation (timestamp DESC);

-- ------------------------------------------------------------------------------
-- 5. BATTERY STATUS (Central BESS Hub)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.battery_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    state_of_charge_pct NUMERIC NOT NULL,
    capacity_kwh NUMERIC NOT NULL DEFAULT 1200,
    current_stored_kwh NUMERIC NOT NULL,
    flow_rate_kw NUMERIC NOT NULL, -- Positive for charging, negative for discharging
    operating_mode TEXT NOT NULL, -- 'charging', 'discharging', 'idle'
    ai_decision_reason TEXT NOT NULL,
    cell_health_pct NUMERIC NOT NULL DEFAULT 98.4,
    cell_temp_c NUMERIC NOT NULL DEFAULT 24.2,
    estimated_backup_hours NUMERIC NOT NULL DEFAULT 5.4,
    cycles_completed INT NOT NULL DEFAULT 342,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. OCCUPANCY (Building sensor readings)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.occupancy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL,
    headcount INT NOT NULL,
    occupancy_pct NUMERIC NOT NULL,
    zone_distribution JSONB DEFAULT '{}'::jsonb,
    anomaly_detected BOOLEAN NOT NULL DEFAULT FALSE,
    anomaly_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_occupancy_building_time ON public.occupancy (building_id, timestamp DESC);

-- ------------------------------------------------------------------------------
-- 7. ENERGY PREDICTIONS (AI Forecasts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.energy_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_timestamp TIMESTAMPTZ NOT NULL,
    predicted_demand_kw NUMERIC NOT NULL,
    predicted_solar_kw NUMERIC NOT NULL,
    predicted_net_gap_kw NUMERIC NOT NULL,
    confidence_interval_low NUMERIC NOT NULL,
    confidence_interval_high NUMERIC NOT NULL,
    model_version TEXT NOT NULL DEFAULT 'EcoFlux-XGB-v2.4',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. AI RECOMMENDATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL, -- 'Energy Saving', 'Solar Optimization', 'Battery Optimization', 'Peak Demand Alert', 'Occupancy'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reason TEXT NOT NULL,
    priority TEXT NOT NULL, -- 'critical', 'high', 'medium', 'low'
    estimated_kwh_saving NUMERIC NOT NULL,
    estimated_dollar_saving NUMERIC NOT NULL,
    co2_reduction_kg NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'applied', 'dismissed'
    action_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. WHAT-IF SIMULATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    parameters JSONB NOT NULL,
    projected_cost_usd NUMERIC NOT NULL,
    projected_savings_usd NUMERIC NOT NULL,
    projected_solar_pct NUMERIC NOT NULL,
    projected_co2_reduction_tons NUMERIC NOT NULL,
    ai_recommendation_summary TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. COPILOT CONVERSATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.copilot_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. GREEN BUILDING SCORES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.green_building_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    energy_efficiency_score INT NOT NULL,
    renewable_utilization_score INT NOT NULL,
    occupancy_alignment_score INT NOT NULL,
    peak_shaving_score INT NOT NULL,
    tier TEXT NOT NULL, -- 'Platinum', 'Gold', 'Silver', 'Bronze'
    month DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'alert', 'info', 'success', 'warning'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solar_generation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battery_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occupancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copilot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.green_building_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public read for verified users or authenticated demo access
CREATE POLICY "Public read for buildings" ON public.buildings FOR SELECT USING (true);
CREATE POLICY "Public read for telemetry" ON public.energy_consumption FOR SELECT USING (true);
CREATE POLICY "Public read for solar" ON public.solar_generation FOR SELECT USING (true);
CREATE POLICY "Public read for battery" ON public.battery_status FOR SELECT USING (true);
CREATE POLICY "Public read for occupancy" ON public.occupancy FOR SELECT USING (true);
CREATE POLICY "Public read for predictions" ON public.energy_predictions FOR SELECT USING (true);
CREATE POLICY "Public read for recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Public update for recommendations" ON public.recommendations FOR UPDATE USING (true);
CREATE POLICY "Public read for green scores" ON public.green_building_scores FOR SELECT USING (true);
CREATE POLICY "Public read for notifications" ON public.notifications FOR SELECT USING (true);

-- User-specific access for profiles, simulations, and copilot queries
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own simulations" ON public.simulations FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can view own copilot history" ON public.copilot_conversations FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- ------------------------------------------------------------------------------
-- REALISTIC SEED DATA (8 CAMPUS BUILDINGS)
-- ------------------------------------------------------------------------------
INSERT INTO public.buildings (id, code, name, category, gross_area_sqft, designed_occupancy, solar_installed_kw, base_load_kw, current_green_score, status) VALUES
('b0000001-0000-0000-0000-000000000001', 'ACAD', 'Academic Block', 'Academic', 65000, 600, 95.0, 78.4, 88, 'optimal'),
('b0000002-0000-0000-0000-000000000002', 'CS-LAB', 'Computer Science Block', 'Academic', 48000, 450, 110.0, 124.6, 92, 'optimal'),
('b0000003-0000-0000-0000-000000000003', 'LIB', 'Central Library', 'Academic', 35000, 350, 65.0, 42.1, 81, 'optimal'),
('b0000004-0000-0000-0000-000000000004', 'HOST-A', 'Hostel Block A', 'Hostel', 52000, 380, 45.0, 68.2, 67, 'warning'),
('b0000005-0000-0000-0000-000000000005', 'HOST-B', 'Hostel Block B', 'Hostel', 54000, 400, 50.0, 64.9, 74, 'normal'),
('b0000006-0000-0000-0000-000000000006', 'ADMIN', 'Administration Wing', 'Administrative', 28000, 200, 35.0, 36.5, 89, 'optimal'),
('b0000007-0000-0000-0000-000000000007', 'ADV-LAB', 'Laboratory Block', 'Laboratory', 58000, 320, 80.0, 112.3, 79, 'normal'),
('b0000008-0000-0000-0000-000000000008', 'CAFE', 'Campus Dining Hub', 'Dining', 22000, 500, 40.0, 54.0, 84, 'optimal')
ON CONFLICT (code) DO NOTHING;

-- Initial Battery State
INSERT INTO public.battery_status (state_of_charge_pct, capacity_kwh, current_stored_kwh, flow_rate_kw, operating_mode, ai_decision_reason, estimated_backup_hours)
VALUES (78.5, 1200, 942.0, 84.5, 'charging', 'Solar generation currently exceeds campus base load. Directing surplus 84.5 kW to BESS.', 6.2);

-- Initial AI Recommendations
INSERT INTO public.recommendations (category, title, description, reason, priority, estimated_kwh_saving, estimated_dollar_saving, co2_reduction_kg, status) VALUES
('Energy Saving', 'Reduce HVAC operation in Academic Block', 'Throttle chiller stage 2 in zones 3 & 4 during 12:30 PM - 2:00 PM lecture interval.', 'Occupancy drops below 18% during campus lunch recess while cooling demand remains high.', 'high', 145.0, 26.10, 87.0, 'active'),
('Solar Optimization', 'Shift Lab Heavy Diagnostics to 12 PM - 3 PM', 'Schedule autoclave sterilization and materials stress tests to align with peak solar generation.', 'Campus rooftop solar reaches maximum surplus of 320 kW during this 3-hour solar irradiance window.', 'medium', 220.0, 39.60, 132.0, 'active'),
('Battery Optimization', 'Pre-Charge BESS for 5:30 PM Demand Peak', 'Maintain solar absorption charge until 750 kWh threshold is reached before evening student return.', 'Predicted campus demand spike from 5:30 PM to 8:30 PM as hostel occupancy surges.', 'critical', 310.0, 55.80, 186.0, 'active'),
('Peak Demand Alert', 'Hostel A Energy Discrepancy Detected', 'Hostel A power draw is 24% above normal baseline despite 85% of residents currently in class.', 'Possible unmonitored HVAC or water heating element left active during day cycle.', 'high', 95.0, 17.10, 57.0, 'active');
