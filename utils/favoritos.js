import { supabase } from './supabase'

export async function buscarFavoritos() {
  const { data, error } = await supabase
    .from('favoritos')
    .select('jogo_id')

  if (error) return []
  return data.map(f => f.jogo_id)
}

export async function toggleFavorito(jogoId, isFavorito) {
  if (isFavorito) {
    await supabase
      .from('favoritos')
      .delete()
      .eq('jogo_id', jogoId)
  } else {
    await supabase
      .from('favoritos')
      .insert({ jogo_id: jogoId })
  }
}