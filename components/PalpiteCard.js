import { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import { salvarPalpite } from '../utils/palpites'

export default function PalpiteCard({ jogo, palpiteAtual }) {
  const [golsCasa, setGolsCasa] = useState(
    palpiteAtual ? String(palpiteAtual.gols_casa) : ''
  )
  const [golsFora, setGolsFora] = useState(
    palpiteAtual ? String(palpiteAtual.gols_fora) : ''
  )
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')

  const jogoPassou = new Date() > new Date(`${jogo.data_brasilia}T${jogo.hora_brasilia}`)

  async function handleSalvar() {
    if (golsCasa === '' || golsFora === '') {
      setMsg('Preencha os dois placares.')
      return
    }

    setSalvando(true)
    setMsg('')

    const { error } = await salvarPalpite(jogo.id, parseInt(golsCasa), parseInt(golsFora))

    setSalvando(false)
    setMsg(error ? 'Erro ao salvar.' : 'Palpite salvo!')
  }

  return (
    <View style={styles.card}>
      <Text style={styles.confronto}>{jogo.confronto}</Text>
      <Text style={styles.data}>{jogo.data_brasilia} às {jogo.hora_brasilia}</Text>

      {jogoPassou ? (
        <Text style={styles.bloqueado}>⛔ Jogo encerrado para palpites</Text>
      ) : (
        <View style={styles.placar}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
            value={golsCasa}
            onChangeText={setGolsCasa}
            placeholder="0"
            placeholderTextColor="#8fa3b8"
            editable={!jogoPassou}
          />
          <Text style={styles.x}>x</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
            value={golsFora}
            onChangeText={setGolsFora}
            placeholder="0"
            placeholderTextColor="#8fa3b8"
            editable={!jogoPassou}
          />
        </View>
      )}

      {!jogoPassou && (
        <TouchableOpacity style={styles.botao} onPress={handleSalvar} disabled={salvando}>
          <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'Salvar palpite'}</Text>
        </TouchableOpacity>
      )}

      {msg ? <Text style={styles.msg}>{msg}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0c1b2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: 320,
  },
  confronto: { color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  data: { color: '#8fa3b8', fontSize: 12, marginBottom: 12 },
  bloqueado: { color: '#ff4d4d', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  placar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  input: {
    backgroundColor: '#1e2d3d', color: 'white',
    borderRadius: 8, padding: 10, fontSize: 20,
    fontWeight: 'bold', textAlign: 'center', width: 60,
  },
  x: { color: 'white', fontSize: 20, fontWeight: 'bold', marginHorizontal: 12 },
  botao: { backgroundColor: '#f2cc2f', borderRadius: 8, padding: 10, alignItems: 'center' },
  botaoTexto: { color: '#040b13', fontWeight: 'bold' },
  msg: { color: '#f2cc2f', textAlign: 'center', marginTop: 8, fontSize: 13 },
})