/*
  # Désactiver le trigger d'email automatique

  Le trigger ne peut pas accéder au réseau via pg_net.
  L'email sera maintenant envoyé directement depuis le frontend.
*/

-- Supprimer le trigger
DROP TRIGGER IF EXISTS trigger_send_confirmation_email ON users_messages;

-- Supprimer la fonction
DROP FUNCTION IF EXISTS send_confirmation_email_on_insert();
