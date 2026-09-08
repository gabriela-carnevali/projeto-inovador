// Importa o hook 'useState' para controlar os dados digitados nos formulários e estados da tela
import { useState } from 'react';

// Importa os componentes de interface do React Native
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

// Importa a biblioteca para acessar a galeria de fotos do dispositivo
import * as ImagePicker from 'expo-image-picker';

// Importa o repositório do banco de dados para salvar os registros
import { livroRepository } from '../database/livroRepository';

// Importa o hook de tema personalizado (Modo Claro / Modo Escuro)
import { useTheme } from '../themeContext';

export default function CadastroLivro({ navigation }) {
  // Pega as cores personalizadas do tema atual (claro/escuro)
  const { colors } = useTheme();

  // Estados locais para guardar temporariamente os dados do formulário
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [status, setStatus] = useState('querendo'); // Status inicial padrão é 'querendo'
  const [progresso, setProgresso] = useState('0');
  const [capa, setCapa] = useState(null); // Guarda a URI (caminho) da imagem da capa

  // Função para abrir a galeria e escolher a imagem da capa do livro
  const selecionarCapa = async () => {
    // Abre a galeria de imagens do celular
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Permite apenas imagens
      allowsEditing: true,    // Permite que o usuário corte/ajuste a imagem
      aspect: [3, 4],         // Proporção de aspecto ideal para capas de livro (3x4)
      quality: 1,             // Qualidade máxima da imagem
    });

    // Se o usuário cancelou a escolha da foto, interrompe a função
    if (resultado.canceled) {
      return;
    }

    // Pega as informações da imagem selecionada
    const imagem = resultado.assets[0];
    const nomeArquivo = imagem.fileName || imagem.uri;

    // Validação extra para garantir que o formato seja PNG ou JPG/JPEG
    const formatoPermitido =
      ['image/png', 'image/jpeg'].includes(imagem.mimeType) ||
      /\.(png|jpe?g)(\?.*)?$/i.test(nomeArquivo);

    if (!formatoPermitido) {
      Alert.alert('Formato inválido', 'Escolha uma imagem PNG, JPG ou JPEG.');
      return;
    }

    // Salva o caminho da imagem no estado
    setCapa(imagem.uri);
  };

  // Função chamada ao clicar no botão "Salvar Livro"
  const handleSalvar = async () => {
    // Valida se os campos obrigatórios foram preenchidos (sem espaços em branco no início/fim)
    if (!titulo.trim() || !autor.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o título e o autor.');
      return;
    }

    // Se o status for 'lido', o progresso passa a ser obrigatoriamente 100%, caso contrário converte o texto para número
    const progressoNum = status === 'lido' ? 100 : parseInt(progresso) || 0;

    try {
      // Salva o novo livro no banco de dados SQLite chamando a função do repositório
      await livroRepository.adicionar(titulo, autor, status, progressoNum, capa);
      
      // Exibe mensagem de sucesso para o usuário
      Alert.alert('Sucesso', 'Livro cadastrado com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Limpa todos os campos do formulário após salvar
            setTitulo('');
            setAutor('');
            setStatus('querendo');
            setProgresso('0');
            setCapa(null);

            // Volta para a tela anterior na pilha de navegação
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
    // ScrollView permite rolar a tela se o formulário for maior que o visor do celular
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.tituloTela, { color: colors.text }]}>Cadastrar Novo Livro</Text>

      {/* Campo Título */}
      <Text style={[styles.label, { color: colors.secondaryText }]}>Título do Livro *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.inputText }]}
        placeholder="Ex: O Pequeno Príncipe"
        value={titulo}
        onChangeText={setTitulo} // Atualiza o estado 'titulo' a cada caractere digitado
      />

      {/* Campo Autor */}
      <Text style={[styles.label, { color: colors.secondaryText }]}>Autor *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.inputText }]}
        placeholder="Ex: Antoine de Saint-Exupéry"
        value={autor}
        onChangeText={setAutor} // Atualiza o estado 'autor'
      />

      {/* Botão de escolha da Capa do Livro */}
      <Text style={[styles.label, { color: colors.secondaryText }]}>Capa do livro</Text>
      <TouchableOpacity style={styles.btnImagem} onPress={selecionarCapa}>
        <Text style={styles.txtImagem}>
          {capa ? 'Trocar imagem' : 'Escolher imagem (PNG, JPG ou JPEG)'}
        </Text>
      </TouchableOpacity>
      
      {/* Exibe uma prévia da imagem escolhida caso ela exista */}
      {capa && <Image source={{ uri: capa }} style={styles.previewCapa} />}

      {/* Botões para selecionar o Status da Leitura */}
      <Text style={[styles.label, { color: colors.secondaryText }]}>Status da Leitura</Text>
      <View style={styles.statusContainer}>
        {/* Opção 1: Querendo */}
        <TouchableOpacity
          style={[styles.btnStatus, { backgroundColor: colors.input, borderColor: colors.border }, status === 'querendo' && styles.btnStatusAtivo]}
          onPress={() => setStatus('querendo')}
        >
          <Text style={[styles.txtStatus, status === 'querendo' && styles.txtStatusAtivo]}>
            Querendo
          </Text>
        </TouchableOpacity>

        {/* Opção 2: Lendo */}
        <TouchableOpacity
          style={[styles.btnStatus, { backgroundColor: colors.input, borderColor: colors.border }, status === 'lendo' && styles.btnStatusAtivo]}
          onPress={() => setStatus('lendo')}
        >
          <Text style={[styles.txtStatus, status === 'lendo' && styles.txtStatusAtivo]}>
            Lendo
          </Text>
        </TouchableOpacity>

        {/* Opção 3: Lido */}
        <TouchableOpacity
          style={[styles.btnStatus, { backgroundColor: colors.input, borderColor: colors.border }, status === 'lido' && styles.btnStatusAtivo]}
          onPress={() => setStatus('lido')}
        >
          <Text style={[styles.txtStatus, status === 'lido' && styles.txtStatusAtivo]}>
            Lido
          </Text>
        </TouchableOpacity>
      </View>

      {/* Exibe o campo 'Progresso' de forma condicional: apenas quando o status for 'lendo' */}
      {status === 'lendo' && (
        <>
          <Text style={[styles.label, { color: colors.secondaryText }]}>Progresso (%)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.inputText }]}
            placeholder="Ex: 50"
            keyboardType="numeric" // Abre o teclado numérico do dispositivo
            value={progresso}
            onChangeText={setProgresso}
          />
        </>
      )}

      {/* Botão para submeter o formulário */}
      <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
        <Text style={styles.txtSalvar}>Salvar Livro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Estilos visuais da tela de cadastro
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
