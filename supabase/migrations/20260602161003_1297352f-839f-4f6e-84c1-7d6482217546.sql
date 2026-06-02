
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  email TEXT NOT NULL,
  icp_location TEXT,
  icp_job_function TEXT,
  icp_seniority TEXT,
  icp_employee_size TEXT,
  icp_industry TEXT,
  icp_other_details TEXT,
  monthly_outreach_volume TEXT,
  plan_interest TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
