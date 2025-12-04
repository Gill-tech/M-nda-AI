-- Create table for crop yield data (from crop_yield_dataset.csv)
CREATE TABLE public.crop_yield_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_type TEXT NOT NULL,
  region TEXT,
  soil_type TEXT,
  soil_ph DECIMAL(4,2),
  nitrogen_level DECIMAL(6,2),
  phosphorus_level DECIMAL(6,2),
  potassium_level DECIMAL(6,2),
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  rainfall DECIMAL(6,2),
  yield_per_hectare DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for fertilizer recommendations (from fertilizer_recommendation_dataset.csv)
CREATE TABLE public.fertilizer_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  soil_type TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  nitrogen_level DECIMAL(6,2),
  phosphorus_level DECIMAL(6,2),
  potassium_level DECIMAL(6,2),
  soil_ph DECIMAL(4,2),
  moisture_level DECIMAL(5,2),
  recommended_fertilizer TEXT NOT NULL,
  application_rate TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for soil analysis readings from kit
CREATE TABLE public.soil_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  nitrogen_level DECIMAL(6,2),
  phosphorus_level DECIMAL(6,2),
  potassium_level DECIMAL(6,2),
  soil_ph DECIMAL(4,2),
  humidity DECIMAL(5,2),
  temperature DECIMAL(5,2),
  moisture_level DECIMAL(5,2),
  wind_speed DECIMAL(5,2),
  reading_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  location_lat DECIMAL(10,6),
  location_lng DECIMAL(10,6),
  section_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for market data
CREATE TABLE public.markets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  distance_km DECIMAL(6,2),
  road_condition TEXT,
  market_type TEXT,
  operating_days TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for market prices
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID REFERENCES public.markets(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  price_per_kg DECIMAL(10,2) NOT NULL,
  unit TEXT DEFAULT 'KES',
  demand_level TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for credit scores
CREATE TABLE public.credit_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 850),
  climate_resilience_score INTEGER,
  predicted_yield_score INTEGER,
  farm_efficiency_score INTEGER,
  payment_history_score INTEGER,
  farm_assets_score INTEGER,
  risk_level TEXT,
  last_calculated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for qualified lenders
CREATE TABLE public.qualified_lenders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  min_credit_score INTEGER NOT NULL,
  max_loan_amount DECIMAL(12,2) NOT NULL,
  min_loan_amount DECIMAL(12,2) NOT NULL,
  interest_rate_min DECIMAL(5,2) NOT NULL,
  interest_rate_max DECIMAL(5,2) NOT NULL,
  max_term_months INTEGER NOT NULL,
  requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for insurance providers
CREATE TABLE public.insurance_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  min_credit_score INTEGER NOT NULL,
  policy_types TEXT[],
  premium_range_min DECIMAL(10,2),
  premium_range_max DECIMAL(10,2),
  risks_covered TEXT[],
  payout_triggers TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crop_yield_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualified_lenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;

-- Public read access for reference data
CREATE POLICY "Public read access for crop yield data" ON public.crop_yield_data FOR SELECT USING (true);
CREATE POLICY "Public read access for fertilizer recommendations" ON public.fertilizer_recommendations FOR SELECT USING (true);
CREATE POLICY "Public read access for markets" ON public.markets FOR SELECT USING (true);
CREATE POLICY "Public read access for market prices" ON public.market_prices FOR SELECT USING (true);
CREATE POLICY "Public read access for lenders" ON public.qualified_lenders FOR SELECT USING (true);
CREATE POLICY "Public read access for insurance providers" ON public.insurance_providers FOR SELECT USING (true);

-- User-specific access for soil readings
CREATE POLICY "Users can view own soil readings" ON public.soil_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own soil readings" ON public.soil_readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own soil readings" ON public.soil_readings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own soil readings" ON public.soil_readings FOR DELETE USING (auth.uid() = user_id);

-- User-specific access for credit scores
CREATE POLICY "Users can view own credit score" ON public.credit_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own credit score" ON public.credit_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own credit score" ON public.credit_scores FOR UPDATE USING (auth.uid() = user_id);