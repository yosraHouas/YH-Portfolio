import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const RESEND_API_KEY = "re_SBMspDhM_FL4BfhB9wRfyBtfQ9YR6o2nG";
const OWNER_EMAIL = "houas_yora@hotmail.fr";

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return { success: false, error };
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, subject, message }: ContactData = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const combinedEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <div style="background-color: #fff; border: 2px solid #4F46E5; border-radius: 10px; padding: 25px; margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; margin-top: 0;">📬 Nouveau message de contact</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Nom:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #4F46E5;">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Sujet:</strong> ${subject}</p>
          </div>
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4F46E5; margin: 20px 0;">
            <h3 style="color: #4F46E5; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">Date: ${new Date().toLocaleString("fr-FR")}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #666; font-size: 14px; background-color: #f3f4f6; padding: 10px; border-radius: 5px;">
            📧 <strong>Modèle de réponse automatique</strong> (vous pouvez copier et utiliser cette réponse)
          </p>
        </div>

        <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 10px; padding: 25px;">
          <h2 style="color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; margin-top: 0;">✅ Message reçu !</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Bonjour <strong>${name}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Merci de m'avoir contacté ! J'ai bien reçu votre message concernant <strong>"${subject}"</strong>.
          </p>
          <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
            <p style="margin: 0; color: #1e40af;">
              Je reviendrai vers vous dans les plus brefs délais, généralement sous 24-48 heures.
            </p>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            À très bientôt !<br>
            <strong>Yosra Houas</strong><br>
            <span style="color: #666;">Analyste Programmeuse</span>
          </p>
        </div>

        <div style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 5px;">
          <p style="margin: 0; font-size: 12px; color: #92400e;">
            ⚠️ <strong>Note:</strong> En raison des limitations de l'API Resend en mode développement,
            la confirmation automatique à l'utilisateur ne peut pas être envoyée.
            Vous pouvez répondre manuellement à <a href="mailto:${email}" style="color: #92400e;">${email}</a>
            en utilisant le modèle ci-dessus.
          </p>
        </div>
      </div>
    `;

    const ownerResult = await sendEmail(
      OWNER_EMAIL,
      `📬 Nouveau message: ${subject}`,
      combinedEmailHtml
    );

    console.log("Combined email result:", ownerResult);

    return new Response(
      JSON.stringify({
        success: true,
        emailSent: ownerResult.success,
        message: "Notification envoyée au propriétaire avec modèle de confirmation"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-contact-confirmation:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});