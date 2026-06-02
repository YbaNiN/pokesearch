import { supabase } from '@/services/supabase';

export type DiscordChannel =
  | 'peticiones'
  | 'reportes'
  | 'sugerencias'
  | 'contacto';

export interface DiscordFormData {
  channel: DiscordChannel;
  name: string;
  message: string;
}

/**
 * Envía el formulario a la Edge Function `dynamic-endpoint`, que guarda las
 * webhooks de forma segura en el servidor y reenvía el mensaje al canal
 * correspondiente. Las URLs de webhook NUNCA llegan al navegador.
 */
export async function sendToDiscord(data: DiscordFormData): Promise<void> {
  const { error } = await supabase.functions.invoke('dynamic-endpoint', {
    body: data,
  });
  if (error) throw error;
}
