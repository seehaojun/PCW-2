-- PCW2 Trip App — Neon Postgres Schema

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('family', 'ck', 'hj'))
);

CREATE TABLE trip_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  day_label text NOT NULL,
  city text NOT NULL,
  accom_name text,
  accom_checkin text,
  accom_checkout text,
  accom_address text,
  accom_lat double precision,
  accom_lng double precision,
  family_activity text,
  boys_activity text,
  ck_site_name text,
  ck_site_address text,
  ck_site_lat double precision,
  ck_site_lng double precision,
  hj_networking text,
  remarks text,
  transit_note text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE ck_research_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_day_id uuid REFERENCES trip_days(id),
  site_name text NOT NULL,
  site_city text NOT NULL,
  site_country text NOT NULL,
  lat double precision,
  lng double precision,
  text_notes text,
  voice_clip_urls text[] DEFAULT '{}',
  photo_urls text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'curated', 'published')),
  published_at timestamptz,
  visit_date text,
  region text,
  subtopic text,
  description text,
  readings jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ck_research_entries_updated_at
  BEFORE UPDATE ON ck_research_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
