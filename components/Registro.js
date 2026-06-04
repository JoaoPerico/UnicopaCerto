import { useState } from 'react'
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, ImageBackground, Image
} from 'react-native'
import { supabase } from '../utils/supabase'

export default function Registro({ onVoltar }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }

  async function handleRegistro() {
    setErro('')

    if (!email || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }
    if (!validarEmail(email)) {
      setErro('E-mail inválido.')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.')
      return
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome }
      }
    })

    setCarregando(false)

    if (error) {
      setErro('Erro ao criar conta. Tente novamente.')
    } else {
      setSucesso(true)
    }
  }

  if (sucesso) {
    return (
      <ImageBackground
        style={styles.container}
        source={require('../assets/bg-overlay.png')}>
        <Image style={styles.logo} source={require('../assets/unicopa.png')} />
        <View style={styles.form}>
          <Text style={styles.sucessoTexto}>
            ✅ Conta criada com sucesso!{'\n\n'}
            Verifique seu e-mail para confirmar o cadastro.
          </Text>
          <TouchableOpacity style={styles.botao} onPress={onVoltar}>
            <Text style={styles.botaoTexto}>Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    )
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/bg-overlay.png')}>

      <Image style={styles.logo} source={require('../assets/unicopa.png')} />
      <Text style={styles.title}>REGISTRAR-SE</Text>

      <View style={styles.form}>
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Nome (opcional)"
          placeholderTextColor="#8fa3b8"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail *"
          placeholderTextColor="#8fa3b8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha * (mín. 6 caracteres)"
          placeholderTextColor="#8fa3b8"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha *"
          placeholderTextColor="#8fa3b8"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={handleRegistro}
          disabled={carregando}>
          <Text style={styles.botaoTexto}>
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkVoltar} onPress={onVoltar}>
          <Text style={styles.linkVoltarTexto}>Já tenho conta</Text>
        </TouchableOpacity>
      </View>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%', width: '100%',
    backgroundColor: '#040b13',
    alignItems: 'center', justifyContent: 'center',
  },
  logo: { width: 200, height: 50, resizeMode: 'contain', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 20 },
  form: { width: '80%' },
  erro: { color: '#ff4d4d', marginBottom: 12, textAlign: 'center', fontSize: 14 },
  sucessoTexto: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 24, lineHeight: 24 },
  input: {
    backgroundColor: '#0c1b2a', color: 'white',
    borderRadius: 8, padding: 14, marginBottom: 16,
    fontSize: 16, borderWidth: 1, borderColor: '#1e2d3d',
  },
  botao: {
    backgroundColor: '#f2cc2f', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 8,
  },
  botaoTexto: { color: '#040b13', fontWeight: 'bold', fontSize: 16 },
  linkVoltar: { marginTop: 16, alignItems: 'center' },
  linkVoltarTexto: { color: '#8fa3b8', fontSize: 14, textDecorationLine: 'underline' },
})