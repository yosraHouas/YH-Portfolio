/*
  # Mise à jour du trigger avec les nouvelles clés Supabase

  1. Met à jour la fonction trigger avec les nouvelles URL/clés
  2. Utilise le nouveau projet: izsnncmxamscqpiiezom
  3. Garantit que pg_net fonctionne correctement
*/

-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS send_confirmation_email_on_insert() CASCADE;

-- Créer la nouvelle fonction avec les bonnes clés
CREATE OR REPLACE FUNCTION send_confirmation_email_on_insert()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url text := 'https://izsnncmxamscqpiiezom.supabase.co';
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6c25uY214YW1zY3FwaWllem9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NTEwODEsImV4cCI6MjA4MzIyNzA4MX0.OwH8xBkkvKRzb8F6wsX_WkMMNGXhnIwogMyCHNQf2qE';
  function_url text;
  request_id bigint;
BEGIN
  -- Construire l'URL de l'edge function
  function_url := supabase_url || '/functions/v1/send-contact-confirmation';

  -- Faire une requête HTTP POST vers l'edge function
  SELECT public.net.http_post(
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

  -- Logger pour debug
  RAISE LOG 'Email notification envoyée pour message ID: %, request_id: %', NEW.id, request_id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, logger mais ne pas bloquer l'insertion
    RAISE WARNING 'Échec envoi email: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger
DROP TRIGGER IF EXISTS trigger_send_confirmation_email ON users_messages;

CREATE TRIGGER trigger_send_confirmation_email
  AFTER INSERT ON users_messages
  FOR EACH ROW
  EXECUTE FUNCTION send_confirmation_email_on_insert();

-- S'assurer que les permissions sont bonnes
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
GRANT EXECUTE ON FUNCTION send_confirmation_email_on_insert() TO postgres, anon, authenticated;
