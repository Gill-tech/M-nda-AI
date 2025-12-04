-- Create loan_applications table for real loan data
CREATE TABLE public.loan_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  loan_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  term_months INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  application_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insurance_policies table
CREATE TABLE public.insurance_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  policy_type TEXT NOT NULL,
  premium NUMERIC NOT NULL,
  coverage_amount NUMERIC NOT NULL,
  trigger_condition TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_policies ENABLE ROW LEVEL SECURITY;

-- RLS policies for loan_applications
CREATE POLICY "Users can view their own loan applications" 
ON public.loan_applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loan applications" 
ON public.loan_applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loan applications" 
ON public.loan_applications FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for insurance_policies
CREATE POLICY "Users can view their own insurance policies" 
ON public.insurance_policies FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own insurance policies" 
ON public.insurance_policies FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insurance policies" 
ON public.insurance_policies FOR UPDATE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_loan_applications_updated_at
BEFORE UPDATE ON public.loan_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_policies_updated_at
BEFORE UPDATE ON public.insurance_policies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();