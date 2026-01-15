import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    console.log("Submit RSVP Payload received:", JSON.stringify(payload, null, 2))
    
    const { invite_id, guest_name, attending, guests_count, phone, message } = payload

    if (!invite_id) throw new Error('ID do convite ausente.')
    if (!guest_name) throw new Error('Nome do convidado ausente.')
    if (attending === undefined) throw new Error('Status de presença ausente.')

    // 1. Buscar Convite e Regras
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('id, expires_at, max_guests')
      .eq('id', invite_id)
      .single()

    if (inviteError || !invite) {
      console.error("Invite not found for ID:", invite_id, inviteError)
      throw new Error('Convite inválido ou não encontrado.')
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        throw new Error('Este convite expirou.')
    }

    // 2. Validar Limite de Convidados (Camada extra de segurança antes do Trigger)
    const finalGuestsCount = attending === false ? 0 : (isNaN(parseInt(guests_count)) ? 1 : Math.max(1, parseInt(guests_count)));
    
    if (attending && finalGuestsCount > invite.max_guests) {
      throw new Error(`O número de convidados (${finalGuestsCount}) excede o permitido (${invite.max_guests}).`)
    }

    // 3. Inserir/Atualizar RSVP
    const rsvpData = {
      invite_id: invite.id,
      guest_name: guest_name.trim(),
      attending: !!attending,
      guests_count: finalGuestsCount,
      phone: phone?.trim() || null,
      message: message?.trim() || null
    };

    console.log("RSVP data to upsert:", JSON.stringify(rsvpData));

    const { data: rsvp, error: rsvpError } = await supabase
      .from('rsvps')
      .upsert(rsvpData, { onConflict: 'invite_id' })
      .select()
      .single()

    if (rsvpError) {
      console.error("RSVP Upsert Error:", rsvpError)
      // Se o erro vier do trigger de banco
      if (rsvpError.code === 'P0001') {
        throw new Error(rsvpError.message);
      }
      throw rsvpError
    }

    console.log("RSVP saved successfully:", rsvp.id)

    // 4. Marcar convidados vinculados como respondidos (apenas se existirem na tabela guests)
    await supabase
      .from('guests')
      .update({ status: 'responded' })
      .eq('invite_id', invite.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'RSVP confirmado com sucesso!', 
        rsvpId: rsvp.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error("Submit RSVP Function Error:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
