/*
  # Trigger automatique pour envoi d'emails de confirmation

  1. Extension
    - Active `pg_net` pour les requêtes HTTP asynchrones

  2. Fonction
    - `trigger_send_contact_confirmation()` : Fonction qui appelle l'Edge Function
    - Récupère les données du nouveau message (nom, email, sujet, message)
    - Fait une requête HTTP POST vers l'Edge Function `send-contact-confirmation`
    - Exécution asynchrone pour ne pas bloquer l'insertion

  3. Trigger
    - `on_contact_message_inserted` : Se déclenche APRÈS chaque INSERT dans `contact_messages`
    - Appelle automatiquement la fonction d'envoi d'emails
    - Garantit que chaque nouveau contact reçoit une confirmation automatique

  4. Notes importantes
    - Le trigger utilise pg_net pour une exécution asynchrone (non-bloquante)
    - Même si l'envoi d'email échoue, l'insertion du message réussit
    - Les logs d'erreur sont disponibles dans les logs Supabase
*/

-- Activer l'extension pg_net pour les requêtes HTTP
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Fonction qui sera appelée par le trigger
CREATE OR REPLACE FUNCTION trigger_send_contact_confirmation()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url TEXT;
  request_id BIGINT;
BEGIN
  -- Récupérer l'URL Supabase depuis les variables d'environnement
  supabase_url := current_setting('app.settings.supabase_url', true);
  
  -- Si la variable n'est pas définie, utiliser une valeur par défaut
  IF supabase_url IS NULL OR supabase_url = '' THEN
    supabase_url := 'https://hvhfsxgcdynuxavunbzc.supabase.co';
  END IF;

  -- Appel asynchrone à l'Edge Function via pg_net
  SELECT net.http_post(
    url := supabase_url || '/functions/v1/send-contact-confirmation',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'name', NEW.name,
      'email', NEW.email,
      'subject', NEW.subject,
      'message', NEW.message
    )
  ) INTO request_id;

  -- Log pour debug (optionnel)
  RAISE LOG 'Contact confirmation trigger fired for email: %, request_id: %', NEW.email, request_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger qui s'exécute APRÈS chaque insertion
DROP TRIGGER IF EXISTS on_contact_message_inserted ON contact_messages;

CREATE TRIGGER on_contact_message_inserted
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_send_contact_confirmation();

-- Commentaire sur le trigger pour documentation
COMMENT ON TRIGGER on_contact_message_inserted ON contact_messages IS 
  'Envoie automatiquement un email de confirmation à l''utilisateur et une notification au propriétaire après chaque nouveau message de contact';