import { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native'
import { supabase } from '../utils/supabase'

export default function LoginScreen({ onLogin, onRegistro }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }

  async function handleLogin() {
    setErro('')

    if (!email || !senha) {
      setErro('Preencha e-mail e senha.')
      return
    }
    if (!validarEmail(email)) {
      setErro('E-mail inválido.')
      return
    }

    setCarregando(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    setCarregando(false)

    if (error) {
      setErro('E-mail ou senha incorretos.')
    } else {
      onLogin()
    }
  }

  return (
    <ImageBackground style={styles.container} source={require('../assets/bg-overlay.png')}>
      <Image style={styles.logo} source={require('../assets/unicopa.png')} />
      <Text style={styles.title}>ENTRAR</Text>

      <View style={styles.form}>
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#8fa3b8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#8fa3b8"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.botao} onPress={handleLogin} disabled={carregando}>
          <Text style={styles.botaoTexto}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkRegistro} onPress={onRegistro}>
          <Text style={styles.linkRegistroTexto}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: { height: '100%', width: '100%', backgroundColor: '#040b13', alignItems: 'center', justifyContent: 'center' },
  logo: { width: 200, height: 50, resizeMode: 'contain', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 30 },
  form: { width: '80%' },
  erro: { color: '#ff4d4d', marginBottom: 12, textAlign: 'center', fontSize: 14 },
  input: { backgroundColor: '#0c1b2a', color: 'white', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#1e2d3d' },
  botao: { backgroundColor: '#f2cc2f', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  botaoTexto: { color: '#040b13', fontWeight: 'bold', fontSize: 16 },
  linkRegistro: { marginTop: 16, alignItems: 'center' },
  linkRegistroTexto: { color: '#8fa3b8', fontSize: 14, textDecorationLine: 'underline' },
})