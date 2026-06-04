import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { supabase } from '../utils/supabase'

export default function RevisaoPalpites({ jogos, palpites, onConfirmar, onCancelar }) {

  const palpitesPreenchidos = palpites.filter(p =>
    p.gols_casa !== null && p.gols_fora !== null
  )

  async function handleConfirmar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('palpites')
      .update({ confirmado: true })
      .eq('user_id', user.id)

    if (error) {
      onConfirmar(false)
    } else {
      onConfirmar(true)
    }
  }

  function getNomeJogo(jogoId) {
    const jogo = jogos.find(j => j.id === jogoId)
    return jogo ? jogo.confronto : 'Jogo desconhecido'
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.titulo}>Revisar Palpites</Text>

        {palpitesPreenchidos.length === 0 ? (
          <Text style={styles.vazio}>Nenhum palpite preenchido ainda.</Text>
        ) : (
          <ScrollView style={styles.lista}>
            {palpitesPreenchidos.map(p => (
              <View key={p.id} style={styles.item}>
                <Text style={styles.confronto}>{getNomeJogo(p.jogo_id)}</Text>
                <Text style={styles.placar}>{p.gols_casa} x {p.gols_fora}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.botoes}>
          <TouchableOpacity style={styles.btnCancelar} onPress={onCancelar}>
            <Text style={styles.btnCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnConfirmar, palpitesPreenchidos.length === 0 && styles.btnDesabilitado]}
            onPress={handleConfirmar}
            disabled={palpitesPreenchidos.length === 0}>
            <Text style={styles.btnConfirmarTexto}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center', alignItems: 'center', zIndex: 99,
  },
  modal: {
    backgroundColor: '#0c1b2a', borderRadius: 16,
    padding: 24, width: '90%', maxHeight: '80%',
  },
  titulo: { color: '#f2cc2f', fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  vazio: { color: '#8fa3b8', textAlign: 'center', marginBottom: 16 },
  lista: { maxHeight: 300, marginBottom: 16 },
  item: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#1e2d3d',
  },
  confronto: { color: 'white', fontSize: 14, flex: 1 },
  placar: { color: '#f2cc2f', fontWeight: 'bold', fontSize: 16 },
  botoes: { flexDirection: 'row', gap: 12 },
  btnCancelar: {
    flex: 1, borderWidth: 1, borderColor: '#8fa3b8',
    borderRadius: 8, padding: 12, alignItems: 'center',
  },
  btnCancelarTexto: { color: '#8fa3b8', fontWeight: 'bold' },
  btnConfirmar: {
    flex: 1, backgroundColor: '#f2cc2f',
    borderRadius: 8, padding: 12, alignItems: 'center',
  },
  btnDesabilitado: { backgroundColor: '#555' },
  btnConfirmarTexto: { color: '#040b13', fontWeight: 'bold' },
})