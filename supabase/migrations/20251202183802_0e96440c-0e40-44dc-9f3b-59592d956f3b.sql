-- Add farm_type to farms table
ALTER TABLE public.farms ADD COLUMN farm_type TEXT DEFAULT 'mixed';

-- Create livestock table
CREATE TABLE public.livestock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  animal_type TEXT NOT NULL,
  breed TEXT,
  count INTEGER DEFAULT 1,
  purpose TEXT,
  health_status TEXT DEFAULT 'healthy',
  last_vaccination DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on livestock
ALTER TABLE public.livestock ENABLE ROW LEVEL SECURITY;

-- Policies for livestock
CREATE POLICY "Users can view livestock on their farms"
ON public.livestock
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.farms 
    WHERE farms.id = livestock.farm_id 
    AND farms.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create livestock on their farms"
ON public.livestock
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.farms 
    WHERE farms.id = livestock.farm_id 
    AND farms.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update livestock on their farms"
ON public.livestock
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.farms 
    WHERE farms.id = livestock.farm_id 
    AND farms.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete livestock on their farms"
ON public.livestock
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.farms 
    WHERE farms.id = livestock.farm_id 
    AND farms.user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_livestock_updated_at
BEFORE UPDATE ON public.livestock
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample pre-registered farms with Kenya-style serial numbers
INSERT INTO public.farms (serial_number, name, location, region, size_hectares, soil_type, irrigation_type, farm_type)
VALUES 
  ('KE-NKR-2024-0001', 'Nakuru Highlands Farm', 'Nakuru County', 'Rift Valley', 15.5, 'Volcanic Loam', 'Drip Irrigation', 'mixed'),
  ('KE-KSM-2024-0002', 'Kisumu Lakeside Farm', 'Kisumu County', 'Nyanza', 8.2, 'Alluvial', 'Furrow', 'crops'),
  ('KE-MRU-2024-0003', 'Meru Coffee Estate', 'Meru County', 'Eastern', 12.0, 'Red Volcanic', 'Sprinkler', 'crops'),
  ('KE-KLE-2024-0004', 'Kilifi Coastal Ranch', 'Kilifi County', 'Coast', 45.0, 'Sandy Loam', 'None', 'livestock'),
  ('KE-NYR-2024-0005', 'Nyeri Dairy Farm', 'Nyeri County', 'Central', 6.8, 'Clay Loam', 'Drip Irrigation', 'mixed'),
  ('KE-EMB-2024-0006', 'Embu Mixed Farm', 'Embu County', 'Eastern', 10.5, 'Nitisol', 'Sprinkler', 'mixed'),
  ('KE-UGS-2024-0007', 'Uasin Gishu Grain Farm', 'Uasin Gishu County', 'Rift Valley', 25.0, 'Black Cotton', 'Rainfed', 'crops'),
  ('KE-TRN-2024-0008', 'Trans Nzoia Maize Farm', 'Trans Nzoia County', 'Rift Valley', 18.3, 'Loamy', 'Center Pivot', 'crops'),
  ('KE-KJD-2024-0009', 'Kajiado Pastoral Ranch', 'Kajiado County', 'Rift Valley', 120.0, 'Sandy', 'None', 'livestock'),
  ('KE-LAK-2024-0010', 'Laikipia Wildlife Ranch', 'Laikipia County', 'Rift Valley', 85.0, 'Red Loam', 'Borehole', 'livestock');