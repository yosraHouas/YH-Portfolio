/*
  # Disable automatic email trigger
  
  1. Changes
    - Drop the trigger that automatically calls the email Edge Function
    - Keep the trigger function for potential future use
  
  2. Reason
    - pg_net cannot resolve Edge Function URLs from within the database
    - Email sending will be handled directly from the frontend for better control
*/

DROP TRIGGER IF EXISTS on_contact_message_inserted ON contact_messages;
