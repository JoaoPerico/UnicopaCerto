import { StyleSheet, Text, View, Image, ImageBackground, SectionList, TouchableOpacity } from 'react-native'
import { formatarData } from './utils/DateFormat'
import DiaCard from './components/DiaCard'
import LoginScreen from './components/Login'
import Registro from './components/Registro'
import PalpiteCard from './components/PalpiteCard'
import RevisaoPalpites from './components/RevisaoPalpites'
import MeusPalpites from './components/MeusPalpites'
import { useEffect, useState } from 'react'
import { supabase } from './utils/supabase'
import { buscarFavoritos } from './utils/favoritos'
import { buscarPalpites } from './utils/palpites'

export default function App() {
  const [logado, setLogado] = useState(false)
  const [tela, setTela] = useState('login')
  const [telaPrincipal, setTelaPrincipal] = useState('calendario')
  const [jogos, setJogos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [favoritos, setFavoritos] = useState([])
  const [palpites, setPalpites] = useState([])
  const [mostrarRevisao, setMostrarRevisao] = useState(false)
  const [msgConfirmacao, setMsgConfirmacao] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLogado(!!session)
      if (session) carregarDados()
      else setCarregando(false)
    })
  }, [])

  async function carregarDados() {
    const { data, error } = await supabase
      .from('jogos_copa_2026')
      .select('*')
      .order('data_brasilia', { ascending: true })

    if (!error) setJogos(data)

    const favs = await buscarFavoritos()
    setFavoritos(favs)

    const palps = await buscarPalpites()
    setPalpites(palps)

    setCarregando(false)
  }

  async function atualizarFavoritos() {
    const favs = await buscarFavoritos()
    setFavoritos(favs)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setLogado(false)
    setJogos([])
    setFavoritos([])
    setPalpites([])
  }

  async function handleConfirmar(sucesso) {
    setMostrarRevisao(false)
    if (sucesso) {
      setMsgConfirmacao('✅ Palpites confirmados com sucesso!')
      const palps = await buscarPalpites()
      setPalpites(palps)
    } else {
      setMsgConfirmacao('❌ Erro ao confirmar palpites.')
    }
    setTimeout(() => setMsgConfirmacao(''), 3000)
  }

  if (!logado) {
    if (tela === 'registro') {
      return <Registro onVoltar={() => setTela('login')} />
    }
    return (
      <LoginScreen
        onLogin={() => { setLogado(true); carregarDados() }}
        onRegistro={() => setTela('registro')}
      />
    )
  }

  const agruparPorData = (jogos) => {
    return jogos.reduce((acc, jogo) => {
      const data = formatarData(jogo.data_brasilia)
      if (!acc[data]) acc[data] = []
      acc[data].push(jogo)
      return acc
    }, {})
  }

  const jogosOrdenados = [...jogos].sort((a, b) =>
    new Date(`${a.data_brasilia} ${a.hora_brasilia}`) - new Date(`${b.data_brasilia} ${b.hora_brasilia}`)
  )

  const jogosTratados = Object.keys(agruparPorData(jogosOrdenados)).map(data => ({
    title: data,
    data: agruparPorData(jogosOrdenados)[data]
  }))

  return (
    <ImageBackground style={styles.container} source={require('./assets/bg-overlay.png')}>

      {mostrarRevisao && (
        <RevisaoPalpites
          jogos={jogos}
          palpites={palpites}
          onConfirmar={handleConfirmar}
          onCancelar={() => setMostrarRevisao(false)}
        />
      )}

      <Image style={styles.logo} source={require('./assets/unicopa.png')} />

      <View style={styles.nav}>
        {['calendario', 'palpites', 'meus-palpites'].map(t => (
          <TouchableOpacity key={t} onPress={() => setTelaPrincipal(t)}>
            <Text style={[styles.navItem, telaPrincipal === t && styles.navAtivo]}>
              {t === 'calendario' ? 'Calendário' : t === 'palpites' ? 'Palpites' : 'Meus Palpites'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.btnLogout}>
        <Text style={styles.btnLogoutTexto}>Sair</Text>
      </TouchableOpacity>

      {msgConfirmacao ? <Text style={styles.msgConfirmacao}>{msgConfirmacao}</Text> : null}

      {carregando ? (
        <Text style={styles.msgInfo}>Carregando...</Text>
      ) : telaPrincipal === 'meus-palpites' ? (
        <MeusPalpites jogos={jogos} palpites={palpites} />
      ) : telaPrincipal === 'palpites' ? (
        <>
          <TouchableOpacity style={styles.btnRevisar} onPress={() => setMostrarRevisao(true)}>
            <Text style={styles.btnRevisarTexto}>Revisar e Confirmar Palpites</Text>
          </TouchableOpacity>
          <SectionList
            sections={jogosTratados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={() => null}
            renderSectionHeader={({ section }) => (
              <View>
                <Text style={styles.dataHeader}>{section.title}</Text>
                {section.data.map(jogo => (
                  <PalpiteCard
                    key={jogo.id}
                    jogo={jogo}
                    palpiteAtual={palpites.find(p => p.jogo_id === jogo.id)}
                  />
                ))}
              </View>
            )}
          />
        </>
      ) : jogosTratados.length === 0 ? (
        <View style={styles.cardVazio}>
          <Text style={styles.cardVazioTexto}>Nenhum jogo carregado</Text>
        </View>
      ) : (
        <SectionList
          sections={jogosTratados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={() => null}
          renderSectionHeader={({ section }) => (
            <DiaCard
              data={section.title}
              jogos={section.data}
              favoritos={favoritos}
              onToggleFavorito={atualizarFavoritos}
            />
          )}
        />
      )}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: { height: '100%', width: '100%', backgroundColor: '#040b13', alignItems: 'center' },
  logo: { marginTop: 20, width: 200, height: 50, resizeMode: 'contain' },
  nav: { flexDirection: 'row', gap: 16, marginTop: 10 },
  navItem: { color: '#8fa3b8', fontSize: 14, paddingBottom: 4 },
  navAtivo: { color: '#f2cc2f', borderBottomWidth: 2, borderBottomColor: '#f2cc2f' },
  btnLogout: { marginTop: 8, marginBottom: 4 },
  btnLogoutTexto: { color: '#8fa3b8', fontSize: 13, textDecorationLine: 'underline' },
  btnRevisar: { backgroundColor: '#f2cc2f', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10, marginVertical: 10 },
  btnRevisarTexto: { color: '#040b13', fontWeight: 'bold', fontSize: 14 },
  dataHeader: { color: '#f2cc2f', fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  cardVazio: { marginTop: 40, backgroundColor: '#0c1b2a', width: 300, borderRadius: 12, padding: 20, alignItems: 'center' },
  cardVazioTexto: { color: '#f2cc2f', fontSize: 16, fontWeight: 'bold' },
  msgInfo: { color: 'white', marginTop: 40, fontSize: 16 },
  msgConfirmacao: { color: '#f2cc2f', fontSize: 14, marginTop: 8 },
})