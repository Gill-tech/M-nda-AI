-- Create farms table with serial number support
CREATE TABLE public.farms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  serial_number VARCHAR(20) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  region TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  size_hectares DECIMAL(10, 2),
  soil_type TEXT,
  irrigation_type TEXT,
  is_registered BOOLEAN DEFAULT false,
  registered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own farms
CREATE POLICY "Users can view their own farms"
ON public.farms
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can claim unregistered farms by serial number
CREATE POLICY "Users can claim unregistered farms"
ON public.farms
FOR UPDATE
USING (user_id IS NULL OR auth.uid() = user_id);

-- Policy: Users can insert farms (for manual entry)
CREATE POLICY "Users can create farms"
ON public.farms
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create crops table
CREATE TABLE public.crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  variety TEXT,
  planted_date DATE,
  expected_harvest_date DATE,
  area_hectares DECIMAL(10, 2),
  status TEXT DEFAULT 'planted',
  health_score INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on crops
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage crops on their farms
CREATE POLICY "Users can view crops on their farms"
ON public.crops
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.farms 
    WHERE farms.id = crops.farm_id 
    AND farms.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create crops on their farms"
ON public.crops
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.farms 
    WHERE farms.id = crops.farm_id 
    AND farms.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update crops on their farms"
ON public.crops
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.farms 
    WHERE farms.id = crops.farm_id 
    AND farms.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete crops on their farms"
ON public.crops
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.farms 
    WHERE farms.id = crops.farm_id 
    AND farms.user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_farms_updated_at
BEFORE UPDATE ON public.farms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crops_updated_at
BEFORE UPDATE ON public.crops
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to lookup and claim farm by serial number
CREATE OR REPLACE FUNCTION public.claim_farm_by_serial(
  p_serial_number VARCHAR(20),
  p_user_id UUID
)
RETURNS public.farms
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_farm public.farms;
BEGIN
  -- Find farm by serial number
  SELECT * INTO v_farm
  FROM public.farms
  WHERE serial_number = p_serial_number;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Farm with serial number % not found', p_serial_number;
  END IF;
  
  IF v_farm.user_id IS NOT NULL AND v_farm.user_id != p_user_id THEN
    RAISE EXCEPTION 'This farm is already registered to another user';
  END IF;
  
  -- Claim the farm
  UPDATE public.farms
  SET user_id = p_user_id,
      is_registered = true,
      registered_at = now()
  WHERE serial_number = p_serial_number
  RETURNING * INTO v_farm;
  
  RETURN v_farm;
END;
$$;