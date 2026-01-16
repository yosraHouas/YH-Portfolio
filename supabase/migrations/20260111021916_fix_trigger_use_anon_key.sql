/*
  # Fix trigger to use anon key for edge function call
  
  1. Changes
    - Use SUPABASE_ANON_KEY env variable instead of request headers
    - This works because the edge function has verifyJWT: false
    - The trigger can now successfully call the edge function
*/

-- Update the trigger function to use anon key
CREATE OR REPLACE FUNCTION send_confirmation_email_on_insert()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url text := 'https://uytdpvharkmocmsfxabo.supabase.co';
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dGRwdmhhcmttb2Ntc2Z4YWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MTMzOTAsImV4cCI6MjA4MzA4OTM5MH0.5iNDbnZbabJmi2-IGr2vBFLF5bH-A-CHW1AUsKb9MYc';
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
      'Authorization', 'Bearer ' || anon_key
    ),
    body := jsonb_build_object(
      'name', NEW.name,
      'email', NEW.email,
      'subject', NEW.subject,
      'message', NEW.message
    )
  ) INTO request_id;
  
  -- Log the request (for debugging)
  RAISE LOG 'Confirmation email request sent for message ID: %, request_id: %', NEW.id, request_id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insert
    RAISE WARNING 'Failed to send confirmation email: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;