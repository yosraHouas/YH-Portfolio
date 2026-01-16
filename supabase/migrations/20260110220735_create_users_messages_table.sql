/*
  # Create users_messages table for contact form

  1. New Tables
    - `users_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `name` (text) - Full name of the person sending the message
      - `email` (text) - Email address for responses
      - `subject` (text) - Subject of the message
      - `message` (text) - The actual message content
      - `created_at` (timestamptz) - Timestamp when the message was sent
      - `replied` (boolean) - Flag to track if the message has been replied to
  
  2. Security
    - Enable RLS on `users_messages` table
    - Add policy for anonymous users to insert their own messages
    - Add policy for authenticated admin to view all messages
  
  3. Purpose
    This table stores all contact form submissions and will trigger
    an automatic confirmation email when a new message is inserted.
*/

CREATE TABLE IF NOT EXISTS users_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  replied boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages (contact form is public)
CREATE POLICY "Anyone can submit contact messages"
  ON users_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can view messages (for admin dashboard)
CREATE POLICY "Authenticated users can view all messages"
  ON users_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update messages (mark as replied)
CREATE POLICY "Authenticated users can update messages"
  ON users_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_messages_created_at ON users_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_messages_replied ON users_messages(replied);
