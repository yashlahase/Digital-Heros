// Supabase SQL Migration — Run in Supabase SQL Editor
// Creates all PlayForPurpose tables with relationships and indexes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Charities table
CREATE TABLE IF NOT EXISTS public.charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scores table
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  score_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

-- User charity selections
CREATE TABLE IF NOT EXISTS public.user_charity_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES public.charities(id),
  contribution_percentage INTEGER NOT NULL DEFAULT 10 CHECK (contribution_percentage >= 10 AND contribution_percentage <= 100),
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Draws table
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_month DATE NOT NULL UNIQUE,
  mode TEXT NOT NULL DEFAULT 'random' CHECK (mode IN ('random', 'weighted')),
  prize_pool DECIMAL(12,2) DEFAULT 0,
  jackpot_rollover DECIMAL(12,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'simulated', 'published')),
  winning_numbers INTEGER[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Draw results
CREATE TABLE IF NOT EXISTS public.draw_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  matches INTEGER NOT NULL CHECK (matches IN (3, 4, 5)),
  prize_amount DECIMAL(12,2) DEFAULT 0,
  match_type TEXT NOT NULL CHECK (match_type IN ('3-match', '4-match', '5-match')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Winnings table
CREATE TABLE IF NOT EXISTS public.winnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  draw_result_id UUID NOT NULL REFERENCES public.draw_results(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proof uploads
CREATE TABLE IF NOT EXISTS public.proof_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  winning_id UUID NOT NULL REFERENCES public.winnings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  admin_status TEXT NOT NULL DEFAULT 'pending' CHECK (admin_status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === INDEXES ===
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON public.scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_date ON public.scores(score_date DESC);
CREATE INDEX IF NOT EXISTS idx_draw_results_draw_id ON public.draw_results(draw_id);
CREATE INDEX IF NOT EXISTS idx_draw_results_user_id ON public.draw_results(user_id);
CREATE INDEX IF NOT EXISTS idx_winnings_user_id ON public.winnings(user_id);
CREATE INDEX IF NOT EXISTS idx_proof_uploads_winning_id ON public.proof_uploads(winning_id);
CREATE INDEX IF NOT EXISTS idx_charities_active ON public.charities(is_active);
CREATE INDEX IF NOT EXISTS idx_charities_featured ON public.charities(is_featured);

-- === ROW LEVEL SECURITY ===
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_charity_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_uploads ENABLE ROW LEVEL SECURITY;

-- Users: can read/write own row
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Scores: own rows only
CREATE POLICY "Users manage own scores" ON public.scores FOR ALL USING (auth.uid() = user_id);

-- Subscriptions: own rows only
CREATE POLICY "Users view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Charity selections: own rows
CREATE POLICY "Users manage own charity" ON public.user_charity_selections FOR ALL USING (auth.uid() = user_id);

-- Charities: public read
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read charities" ON public.charities FOR SELECT USING (is_active = true);

-- Draws: public read (published only)
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published draws" ON public.draws FOR SELECT USING (status = 'published');

-- Draw results: own rows
ALTER TABLE public.draw_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own results" ON public.draw_results FOR SELECT USING (auth.uid() = user_id);

-- Winnings: own
CREATE POLICY "Users view own winnings" ON public.winnings FOR SELECT USING (auth.uid() = user_id);

-- Proof uploads: own
CREATE POLICY "Users manage own proofs" ON public.proof_uploads FOR ALL USING (auth.uid() = user_id);

-- === SEED DATA — Charities ===
INSERT INTO public.charities (name, description, logo_url, category, is_featured, is_active) VALUES
  ('St. Jude Children''s Research Hospital', 'Leading the way the world understands, treats and defeats childhood cancer and other life-threatening diseases.', 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=200', 'Healthcare', TRUE, TRUE),
  ('World Wildlife Fund', 'Conserving nature and protecting the future of wildlife and wild places for generations to come.', 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=200', 'Environment', TRUE, TRUE),
  ('Feeding America', 'The nation''s largest domestic hunger-relief organization, working to connect people with food and end hunger.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200', 'Food Security', FALSE, TRUE),
  ('Médecins Sans Frontières', 'An international humanitarian aid organisation providing emergency medical assistance in conflict zones.', 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=200', 'Humanitarian', FALSE, TRUE),
  ('Habitat for Humanity', 'Building homes and communities to provide affordable shelter to those in need worldwide.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200', 'Housing', FALSE, TRUE),
  ('Save the Children', 'Giving children a healthy start in life, the opportunity to learn and protection from harm.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200', 'Children', TRUE, TRUE);

-- === TRIGGER: Auto-create user profile on signup ===
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- === FUNCTION: Enforce max 5 scores per user (replace oldest) ===
CREATE OR REPLACE FUNCTION public.enforce_score_limit()
RETURNS TRIGGER AS $$
DECLARE
  score_count INTEGER;
  oldest_score_id UUID;
BEGIN
  SELECT COUNT(*) INTO score_count FROM public.scores WHERE user_id = NEW.user_id;
  IF score_count >= 5 THEN
    SELECT id INTO oldest_score_id
    FROM public.scores
    WHERE user_id = NEW.user_id
    ORDER BY score_date ASC
    LIMIT 1;
    DELETE FROM public.scores WHERE id = oldest_score_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_scores
  BEFORE INSERT ON public.scores
  FOR EACH ROW EXECUTE FUNCTION public.enforce_score_limit();
