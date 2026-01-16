/*
  # Create Page Views Tracking System

  1. New Tables
    - `page_views`
      - `id` (uuid, primary key) - Unique identifier for each view
      - `page_path` (text) - The page that was visited (e.g., '/', '/projects')
      - `visitor_ip` (text, nullable) - IP address for unique visitor tracking
      - `user_agent` (text, nullable) - Browser/device information
      - `referrer` (text, nullable) - Where the visitor came from
      - `country` (text, nullable) - Visitor's country (can be added later)
      - `created_at` (timestamptz) - When the visit occurred

  2. Views
    - `daily_stats` - Aggregated daily statistics
    - `page_stats` - Statistics per page

  3. Security
    - Enable RLS on `page_views` table
    - Add policy for anonymous users to insert page views (tracking)
    - Add policy for authenticated users to read page views (admin dashboard)

  4. Notes
    - This system allows tracking visitors without requiring authentication
    - Perfect for GitHub Pages deployment with Supabase backend
    - Can be extended with geographic data, session tracking, etc.
*/

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL DEFAULT '/',
  visitor_ip text,
  user_agent text,
  referrer text,
  country text,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);

-- Create a view for daily statistics
CREATE OR REPLACE VIEW daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_views,
  COUNT(DISTINCT visitor_ip) as unique_visitors,
  COUNT(DISTINCT page_path) as pages_visited
FROM page_views
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Create a view for page statistics
CREATE OR REPLACE VIEW page_stats AS
SELECT 
  page_path,
  COUNT(*) as view_count,
  COUNT(DISTINCT visitor_ip) as unique_visitors,
  MAX(created_at) as last_viewed
FROM page_views
GROUP BY page_path
ORDER BY view_count DESC;

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert page views (for tracking)
CREATE POLICY "Anyone can track page views"
  ON page_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can read all page views (for admin dashboard)
CREATE POLICY "Authenticated users can read page views"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Public read access for statistics (optional - remove if you want to keep stats private)
CREATE POLICY "Public can read page view stats"
  ON page_views
  FOR SELECT
  TO anon
  USING (true);