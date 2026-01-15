import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  // 1. Manuseio de Preflight Request (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { token } = await req.json()
    console.log("Get Invite request for token:", token)

    if (!token) throw new Error('Token obrigatório')

    // 1. Buscar Convite
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('id, expires_at, event, label, max_guests, allow_plus_one')
      .eq('token', token)
      .single()

    if (inviteError || !invite) {
      console.error("Invite not found for token:", token, inviteError)
      throw new Error('Convite não encontrado')
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      console.error("Invite expired:", token, invite.expires_at)
      throw new Error('Convite expirado')
    }

    // 2. Buscar Convidados vinculados (mantido para exibição de nomes no frontend se necessário)
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('id, name, status, type')
      .eq('invite_id', invite.id)

    if (guestsError) {
       console.error("Error fetching guests for invite:", invite.id, guestsError)
       throw guestsError
    }

    console.log("Found", guests?.length, "guests for invite", invite.id)

    // Resposta de Sucesso com Headers CORS
    return new Response(
      JSON.stringify({ 
        valid: true, 
        invite_id: invite.id,
        label: invite.label,
        max_guests: invite.max_guests,
        allow_plus_one: invite.allow_plus_one,
        event: invite.event,
        guests 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error("Get Invite Function Error:", error.message)
    // Resposta de Erro com Headers CORS
    return new Response(
      JSON.stringify({ valid: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
