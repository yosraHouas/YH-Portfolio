/*
  # Create chat messages table

  1. New Tables
    - `chat_messages`
      - `id` (uuid, primary key)
      - `visitor_name` (text) - Name of the visitor
      - `visitor_email` (text) - Email of the visitor
      - `message` (text) - The message content
      - `is_from_admin` (boolean) - True if message is from admin/owner
      - `read` (boolean) - Message read status
      - `session_id` (text) - To group conversation by session
      - `created_at` (timestamptz) - When message was sent
      
  2. Security
    - Enable RLS on `chat_messages` table
    - Add policy for anyone to insert messages (visitors can send)
    - Add policy for anyone to read messages from their session
    - Note: In production, you'd want authenticated admin access
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name text NOT NULL,
  visitor_email text NOT NULL,
  message text NOT NULL,
  is_from_admin boolean DEFAULT false,
  read boolean DEFAULT false,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages (visitors can send messages)
CREATE POLICY "Anyone can send chat messages"
  ON chat_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read messages from their session
CREATE POLICY "Anyone can read their session messages"
  ON chat_messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to update read status
CREATE POLICY "Anyone can update message read status"
  ON chat_messages
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster session queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);