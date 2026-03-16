// supabase/functions/admin/index.ts
// Deploy with: supabase functions deploy admin

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, password, payload } = await req.json();

    // ── PASSWORD CHECK ──────────────────────────────────────────────
    // Passwords are stored as Supabase secrets (never in frontend code)
    // Set them with:
    //   supabase secrets set ADMIN_PASSWORD=T2T@Admin2026
    //   supabase secrets set PRESS_PASSWORD=T2TPress2026
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    const PRESS_PASSWORD = Deno.env.get("PRESS_PASSWORD");

    const requiredPassword = action === "verify_press" ? PRESS_PASSWORD : ADMIN_PASSWORD;

    if (!password || password !== requiredPassword) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── SUPABASE CLIENT (service role — full access) ─────────────────
    // SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are automatically
    // available in every Edge Function — no need to set them manually
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ── ACTIONS ──────────────────────────────────────────────────────
    switch (action) {

      // Verify admin password (called on login)
      case "verify_admin": {
        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify press password (called on press portal login)
      case "verify_press": {
        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Load all applications for admin dashboard
      case "get_applications": {
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .order("submitted_at", { ascending: false });

        if (error) throw error;
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Load all press submissions for admin dashboard
      case "get_submissions": {
        const { data, error } = await supabase
          .from("press_submissions")
          .select("*")
          .order("submitted_at", { ascending: false });

        if (error) throw error;
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Load all assessments for admin dashboard
      case "get_assessments": {
        const { data, error } = await supabase
          .from("assessments")
          .select("application_id, category, total_score, submitted_at");

        if (error) throw error;
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update application status (approve / reject)
      case "update_app_status": {
        const { id, status } = payload;
        if (!id || !["approved", "rejected", "pending"].includes(status)) {
          return new Response(
            JSON.stringify({ error: "Invalid payload" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const { error } = await supabase
          .from("applications")
          .update({ status })
          .eq("id", id);

        if (error) throw error;
        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update press submission status (publish / decline)
      case "update_sub_status": {
        const { id, status } = payload;
        if (!id || !["approved", "rejected", "pending"].includes(status)) {
          return new Response(
            JSON.stringify({ error: "Invalid payload" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const { error } = await supabase
          .from("press_submissions")
          .update({ status })
          .eq("id", id);

        if (error) throw error;
        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});