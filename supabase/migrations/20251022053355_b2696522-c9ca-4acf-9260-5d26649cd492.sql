-- Create actions table
CREATE TABLE public.actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL DEFAULT 'Visit Website',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" 
ON public.actions 
FOR SELECT 
USING (true);

-- Allow authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated users to insert" 
ON public.actions 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update" 
ON public.actions 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete" 
ON public.actions 
FOR DELETE 
TO authenticated
USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.actions;

-- Insert sample data
INSERT INTO public.actions (title, link, description, button_text) VALUES
('Bachelor''s Degree in Australia', 'https://campaign.hotcoursesabroad.com/unsw/2026', 'Study in Australia in 2026 - Accelerate your career with a top Australian degree from UNSW. Speak to our experts today! Study at a global top 20 university. Explore outstanding facilities and degree options.', 'Visit Website'),
('100% English - Personal and Individual', 'https://en.ism.de/study+program', 'Study Program - Come study at one of the best business schools in Germany. ISM Berlin: Study in small learning groups with a 7:1 student to teacher ratio. Officially recognised. A strong network.', 'Visit Website'),
('Apply for Anesthesia Course', 'https://www.cgc.ac.in/aott/admission', 'Paramedical Science Admissions - Join our accredited program and gain hands-on experience in cutting-edge laboratories.', 'Visit Website');