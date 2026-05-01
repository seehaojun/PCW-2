ALTER TABLE ck_research_entries
  ADD COLUMN IF NOT EXISTS voice_clip_transcriptions text[] DEFAULT '{}';
