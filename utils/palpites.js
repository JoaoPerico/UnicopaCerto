import { supabase } from './supabase'

export async function buscarPalpites() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('palpites')
    .select('*')
    .eq('user_id', user.id)

  if (error) return []
  return data
}

export async function salvarPalpite(jogoId, golsCasa, golsFora) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('palpites')
    .upsert({
      user_id: user.id,
      jogo_id: jogoId,
      gols_casa: golsCasa,
      gols_fora: golsFora,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,jogo_id' })

  return { error }
}