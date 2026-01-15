-- 1. Create 'invites' table
CREATE TABLE IF NOT EXISTS public.invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  event TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Create 'guests' table
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id UUID NOT NULL REFERENCES public.invites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'principal',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 3. Create 'rsvps' table
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  attending BOOLEAN NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 4. Enable RLS
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
-- 5. Create Secure Policies (BLOCK Public Access)
CREATE POLICY "No public access to invites" ON public.invites FOR ALL TO public USING (false);
CREATE POLICY "No public access to guests" ON public.guests FOR ALL TO public USING (false);
CREATE POLICY "No public access to rsvps" ON public.rsvps FOR ALL TO public USING (false);
-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_invites_token ON public.invites(token);
CREATE INDEX IF NOT EXISTS idx_guests_invite_id ON public.guests(invite_id);
-- 7. Add Label Column (For Admin)
ALTER TABLE public.invites ADD COLUMN IF NOT EXISTS label TEXT;
-- 8. Fix RLS for Admin (Authenticated Users)
-- Allow authenticated users (Admins) to do EVERYTHING
CREATE POLICY "Allow authenticated full access to invites" ON public.invites FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to guests" ON public.guests FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to rsvps" ON public.rsvps FOR ALL TO authenticated USING (true);