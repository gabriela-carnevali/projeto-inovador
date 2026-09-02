import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { livroRepository } from '../database/livroRepository';
import { useTheme } from '../theme/ThemeContext';

export default function CadastroLivro({ navigation }) {
  const { colors } = useTheme();
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [status, setStatus] = useState('querendo'); // Valor padrão
  const [progresso, setProgresso] = useState('0');
  const [capa, setCapa] = useState(null);

  const selecionarCapa = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (resultado.canceled) {
      return;
    }

    const imagem = resultado.assets[0];
    const nomeArquivo = imagem.fileName || imagem.uri;
    const formatoPermitido =
      ['image/png', 'image/jpeg'].includes(imagem.mimeType) ||
      /\.(png|jpe?g)(\?.*)?$/i.test(nomeArquivo);

    if (!formatoPermitido) {
      Alert.alert('Formato inválido', 'Escolha uma imagem PNG, JPG ou JPEG.');
      return;
    }

    setCapa(imagem.uri);
  };

  const handleSalvar = async () => {
    // Validação de campos obrigatórios
    if (!titulo.trim() || !autor.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o título e o autor.');
      return;
    }

    const progressoNum = status === 'lido' ? 100 : parseInt(progresso) || 0;

    try {
      // Chama o repositório para salvar no banco
      await livroRepository.adicionar(titulo, autor, status, progressoNum, capa);
      
      Alert.alert('Sucesso', 'Livro cadastrado com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Limpa os campos após salvar
            setTitulo('');
            setAutor('');
            setStatus('querendo');
            setProgresso('0');
            setCapa(null);
            // Retorna ou navega se estiver usando React Navigation
            if (navigation) navigation.goBack();
          } 
        }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o livro no banco de dados.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.tituloTela, { color: colors.text }]}>Cadastrar Novo Livro</Text>

      {/* Campo Título */}
      <Text style={[styles.label, { color: colors.secondaryText }]}>Título do Livro *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.inputText }]}
        placeholder="Ex: O Pequeno Príncipe"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* Campo Autor */}
      <Text style={[styles.label, { color: colors.secondaryText }]}>Autor *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.inputText }]}
        placeholder="Ex: Antoine de Saint-Exupéry"
        value={autor}
        onChangeText={setAutor}
      />

      <Text style={[styles.label, { color: colors.secondaryText }]}>Capa do livro</Text>
      <TouchableOpacity style={styles.btnImagem} onPress={selecionarCapa}>
        <Text style={styles.txtImagem}>
          {capa ? 'Trocar imagem' : 'Escolher imagem (PNG, JPG ou JPEG)'}
        </Text>
      </TouchableOpacity>
      {capa && <Image source={{ uri: capa }} style={styles.previewCapa} />}

      {/* Seleção do Status */}
      <Text style={[styles.label, { color: colors.secondaryText }]}>Status da Leitura</Text>
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.btnStatus, { backgroundColor: colors.input, borderColor: colors.border }, status === 'querendo' && styles.btnStatusAtivo]}
          onPress={() => setStatus('querendo')}
        >
          <Text style={[styles.txtStatus, status === 'querendo' && styles.txtStatusAtivo]}>
            Querendo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnStatus, { backgroundColor: colors.input, borderColor: colors.border }, status === 'lendo' && styles.btnStatusAtivo]}
          onPress={() => setStatus('lendo')}
        >
          <Text style={[styles.txtStatus, status === 'lendo' && styles.txtStatusAtivo]}>
            Lendo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnStatus, { backgroundColor: colors.input, borderColor: colors.border }, status === 'lido' && styles.btnStatusAtivo]}
          onPress={() => setStatus('lido')}
        >
          <Text style={[styles.txtStatus, status === 'lido' && styles.txtStatusAtivo]}>
            Lido
          </Text>
        </TouchableOpacity>
      </View>

      {/* Campo de Progresso (apenas se status for 'lendo') */}
      {status === 'lendo' && (
        <>
          <Text style={[styles.label, { color: colors.secondaryText }]}>Progresso (%)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.inputText }]}
            placeholder="Ex: 50"
            keyboardType="numeric"
            value={progresso}
            onChangeText={setProgresso}
          />
        </>
      )}

      {/* Botão Salvar */}
      <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
        <Text style={styles.txtSalvar}>Salvar Livro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F7FAFC',
    flexGrow: 1,
  },
  tituloTela: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2D3748',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 8,
  },
  btnImagem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3182CE',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  txtImagem: {
    color: '#3182CE',
    fontSize: 14,
    fontWeight: '600',
  },
  previewCapa: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'center',
  },
  btnStatus: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  btnStatusAtivo: {
    backgroundColor: '#3182CE',
    borderColor: '#3182CE',
  },
  txtStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  txtStatusAtivo: {
    color: '#FFFFFF',
  },
  btnSalvar: {
    backgroundColor: '#38A169',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 30,
  },
  txtSalvar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});