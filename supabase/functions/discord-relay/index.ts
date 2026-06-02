// Edge Function: discord-relay
// Recibe { channel, name, message } desde el frontend y reenvía el mensaje
// al webhook de Discord correspondiente. Las URLs de webhook se guardan como
// secretos del proyecto (nunca llegan al navegador).
//
// El frontend invoca esta función con supabase.functions.invoke(), que envía
// la anon key automáticamente, por lo que la verificación de JWT por defecto
// se satisface sola. NO hace falta desactivar "Verify JWT".
//
// Despliegue por panel: Edge Functions → crear "discord-relay" → pegar código → Deploy.
//
// Secretos necesarios (pestaña Secrets):
//   DISCORD_WEBHOOK_PETICIONES, DISCORD_WEBHOOK_REPORTES,
//   DISCORD_WEBHOOK_SUGERENCIAS, DISCORD_WEBHOOK_CONTACTO

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const CHANNELS = ['peticiones', 'reportes', 'sugerencias', 'contacto'] as const;
type Channel = (typeof CHANNELS)[number];

const WEBHOOK_ENV: Record<Channel, string> = {
  peticiones: 'DISCORD_WEBHOOK_PETICIONES',
  reportes: 'DISCORD_WEBHOOK_REPORTES',
  sugerencias: 'DISCORD_WEBHOOK_SUGERENCIAS',
  contacto: 'DISCORD_WEBHOOK_CONTACTO',
};

const TITLES: Record<Channel, string> = {
  peticiones: '📩 Nueva petición',
  reportes: '⚠️ Nuevo reporte',
  sugerencias: '💡 Nueva sugerencia',
  contacto: '✉️ Nuevo contacto',
};

// CORS: permite que el frontend invoque la función desde el navegador.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function clamp(s: unknown, max: number): string {
  return String(s ?? '').trim().slice(0, max);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Método no permitido' }, 405);
  }

  let body: { channel?: string; name?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const channel = body.channel as Channel;
  const name = clamp(body.name, 80);
  const message = clamp(body.message, 1500);

  if (!CHANNELS.includes(channel)) {
    return json({ error: 'Canal no válido' }, 400);
  }
  if (!name || !message) {
    return json({ error: 'Faltan nombre o mensaje' }, 400);
  }

  const webhookUrl = Deno.env.get(WEBHOOK_ENV[channel]);
  if (!webhookUrl) {
    return json({ error: 'Webhook no configurado en el servidor' }, 500);
  }

  // Mensaje con formato de "embed" para que se vea bien en Discord.
  const payload = {
    username: 'PokéSearch',
    embeds: [
      {
        title: TITLES[channel],
        color: 0x3b4cca,
        fields: [
          { name: 'De', value: name, inline: true },
          { name: 'Mensaje', value: message, inline: false },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return json({ error: 'Discord rechazó el mensaje' }, 502);
  }

  return json({ ok: true }, 200);
});

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
