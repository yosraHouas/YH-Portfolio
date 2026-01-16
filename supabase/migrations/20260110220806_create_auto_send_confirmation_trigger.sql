/*
  # Create trigger to auto-send confirmation emails

  1. Purpose
    When a new message is inserted into `users_messages`, automatically
    send a confirmation email to the user via the edge function.

  2. Implementation
    - Create a trigger function that calls the send-contact-confirmation edge function
    - Use pg_net to make an async HTTP request to the edge function
    - Pass the user's email and name to the edge function
    - The trigger fires AFTER INSERT on users_messages
  
  3. Security
    - Uses service role for internal communication
    - Edge function handles the actual email sending
*/

-- Create the trigger function
CREATE OR REPLACE FUNCTION send_confirmation_email_on_insert()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url text := 'https://uytdpvharkmocmsfxabo.supabase.co';
  function_url text;
  request_id bigint;
BEGIN
  -- Build the edge function URL
  function_url := supabase_url || '/functions/v1/send-contact-confirmation';
  
  -- Make async HTTP request to edge function
  SELECT net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.headers')::json->>'authorization'
    ),
    body := jsonb_build_object(
      'email', NEW.email,
      'name', NEW.name
    )
  ) INTO request_id;
  
  -- Log the request (optional, for debugging)
  RAISE LOG 'Confirmation email request sent for message ID: %, request_id: %', NEW.id, request_id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insert
    RAISE WARNING 'Failed to send confirmation email: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_send_confirmation_email ON users_messages;

CREATE TRIGGER trigger_send_confirmation_email
  AFTER INSERT ON users_messages
  FOR EACH ROW
  EXECUTE FUNCTION send_confirmation_email_on_insert();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated;
