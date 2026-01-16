/*
  # Fix trigger to send all contact fields
  
  1. Changes
    - Update trigger function to send all fields (name, email, subject, message)
    - This ensures the edge function receives complete data to send emails
*/

-- Update the trigger function to send all fields
CREATE OR REPLACE FUNCTION send_confirmation_email_on_insert()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url text := 'https://uytdpvharkmocmsfxabo.supabase.co';
  function_url text;
  request_id bigint;
BEGIN
  -- Build the edge function URL
  function_url := supabase_url || '/functions/v1/send-contact-confirmation';
  
  -- Make async HTTP request to edge function with ALL fields
  SELECT net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.headers')::json->>'authorization'
    ),
    body := jsonb_build_object(
      'name', NEW.name,
      'email', NEW.email,
      'subject', NEW.subject,
      'message', NEW.message
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