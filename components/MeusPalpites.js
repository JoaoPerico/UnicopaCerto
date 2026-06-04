import { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'

export default function MeusPalpites({ jogos, palpites }) {
  const [filtro, setFiltro] = useState('todos')

  const jogoPassou = (jogo) =>
    new Date() > new Date(`${jogo.data_brasilia}T${jogo.hora_brasilia}`)

  const palpitesFiltrados = palpites.filter(p => {
    if (filtro === 'confirmados') return p.confirmado
    if (filtro === 'pendentes') return !p.confirmado
    return true
  })

  function getJogo(jogoId) {
    return jogos.find(j => j.id === jogoId)
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtros}>
        {['todos', 'pendentes', 'confirmados'].map(f => (
          <TouchableOpacity key={f} onPress={() => setFiltro(f)}>
            <Text style={[styles.filtroItem, filtro === f && styles.filtroAtivo]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {palpitesFiltrados.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>Você ainda não cadastrou palpites</Text>
        </View>
      ) : (
        <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
          {palpitesFiltrados.map(p => {
            const jogo = getJogo(p.jogo_id)
            if (!jogo) return null
            const encerrado = jogoPassou(jogo)

            return (
              <View key={p.id} style={[styles.card, encerrado && styles.cardEncerrado]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.confronto}>{jogo.confronto}</Text>
                  <View style={styles.badges}>
                    {p.confirmado && (
                      <View style={styles.badgeConfirmado}>
                        <Text style={styles.badgeTexto}>Confirmado</Text>
                      </View>
                    )}
                    {encerrado && (
                      <View style={styles.badgeEncerrado}>
                        <Text style={styles.badgeTexto}>Encerrado</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.data}>
                  {jogo.data_brasilia} às {jogo.hora_brasilia}
                </Text>

                <View style={styles.placarRow}>
                  <Text style={styles.time}>{jogo.sigla_casa}</Text>
                  <View style={styles.placarBox}>
                    <Text style={styles.placar}>{p.gols_casa} x {p.gols_fora}</Text>
                  </View>
                  <Text style={styles.time}>{jogo.sigla_fora}</Text>
                </View>

                <Text style={styles.estadio}>{jogo.estadio} • {jogo.cidade}</Text>
              </View>
            )
          })}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', alignItems: 'center' },
  filtros: { flexDirection: 'row', gap: 12, marginVertical: 12 },
  filtroItem: { color: '#8fa3b8', fontSize: 14, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#1e2d3d' },
  filtroAtivo: { color: '#040b13', backgroundColor: '#f2cc2f', borderColor: '#f2cc2f' },
  vazio: { marginTop: 60, alignItems: 'center' },
  vazioTexto: { color: '#8fa3b8', fontSize: 16 },
  lista: { width: '100%', paddingHorizontal: 16 },
  card: { backgroundColor: '#0c1b2a', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardEncerrado: { opacity: 0.6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  confronto: { color: 'white', fontWeight: 'bold', fontSize: 14, flex: 1 },
  badges: { flexDirection: 'row', gap: 6 },
  badgeConfirmado: { backgroundColor: '#1a5c2a', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeEncerrado: { backgroundColor: '#5c1a1a', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeTexto: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  data: { color: '#8fa3b8', fontSize: 12, marginBottom: 12 },
  placarRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 10 },
  time: { color: '#8fa3b8', fontWeight: 'bold', fontSize: 16, width: 40, textAlign: 'center' },
  placarBox: { backgroundColor: '#1e2d3d', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  placar: { color: '#f2cc2f', fontWeight: 'bold', fontSize: 22 },
  estadio: { color: '#8fa3b8', fontSize: 11, textAlign: 'center' },
})