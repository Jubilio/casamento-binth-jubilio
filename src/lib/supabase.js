import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey.includes('VITE_') || supabaseAnonKey.startsWith('sb_')) {
  const isStripeKey = supabaseAnonKey?.startsWith('sb_');
  console.error(
    'ERRO: Variáveis do Supabase não configuradas corretamente no arquivo .env!\n' +
    (isStripeKey 
      ? 'AVISO: Você parece estar usando uma chave do STRIPE (sb_...) no lugar da chave do SUPABASE.\n' 
      : '') +
    'Certifique-se de definir VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.\n' +
    'A Anon Key do Supabase geralmente começa com "eyJ...".'
  );
}

// Initialize Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

// Auth helper functions
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};
