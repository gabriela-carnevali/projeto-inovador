// Importa hooks do React:
// - useState: cria o estado para armazenar a lista de livros
// - useCallback: otimiza funções para não serem recriadas desnecessariamente na memória
import { useCallback, useState } from "react";

// Importa os componentes visuais do React Native
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Importa o hook do React Navigation para detectar quando a tela entra em foco (fica visível)
import { useFocusEffect } from "@react-navigation/native";

// Importa as funções do banco de dados SQLite
import { buscarQuerendoLer, iniciarLeitura } from "../database/livroRepository";

// Importa o hook para acessar as cores do tema (claro ou escuro)
import { useTheme } from "../themeContext";

export default function QuerendoLer({ navigation }) {
  const { colors } = useTheme(); // Extrai as cores estilizadas de acordo com o tema configurado
  const [livros, setLivros] = useState([]); // Estado para guardar o array de livros desejados

  // Busca os livros gravados no SQLite com o status "querendo" e guarda no estado
  const carregarLivros = () => {
    const livrosDoBanco = buscarQuerendoLer();
    setLivros(livrosDoBanco);
  };

  // Executa 'carregarLivros' automaticamente sempre que o usuário abre ou volta para esta tela
  useFocusEffect(
    useCallback(() => {
      carregarLivros();
    }, []),
  );

  // Ação ao clicar no botão 'Selecionar' para dar início à leitura do livro
  const selecionarLivro = (id) => {
    iniciarLeitura(id); // Muda o status do livro no banco de dados para 'lendo'

    carregarLivros(); // Recarrega a lista para remover o livro que agora está sendo lido

    navigation.navigate("Lendo"); // Redireciona a navegação direto para a tela "Lendo"
  };

  // Função responsável por montar o cartão visual de cada livro na lista
  const renderLivro = ({ item }) => {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {/* Capa do livro: exibe a foto caso exista, senão mostra um quadro cinza com emoji */}
        {item.capa ? (
          <Image source={{ uri: item.capa }} style={styles.capa} />
        ) : (
          <View style={[styles.capa, styles.capaVazia]}>
            <Text style={styles.capaVaziaTexto}>📖</Text>
          </View>
        )}

        {/* Informações de texto e botão do livro */}
        <View style={styles.informacoes}>
          {/* Título */}
          <Text style={[styles.titulo, { color: colors.text }]}>
            {item.titulo}
          </Text>

          {/* Autor */}
          <Text style={[styles.autor, { color: colors.secondaryText }]}>
            {item.autor}
          </Text>

          {/* Botão de ação para mover para a lista de leitura atual */}
          <TouchableOpacity
            style={styles.botao}
            onPress={() => selecionarLivro(item.id)}
          >
            <Text style={styles.textoBotao}>Selecionar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Título principal no topo da tela */}
      <Text style={[styles.tituloPagina, { color: colors.text }]}>
        📚 Querendo Ler
      </Text>

      {/* Lista dinamicamente renderizada dos livros */}
      <FlatList
        data={livros} // Fonte dos dados
        renderItem={renderLivro} // Função que cria cada item
        keyExtractor={(item) => item.id.toString()} // Chave única para o React Native identificar cada linha
        ListEmptyComponent={
          // O que aparece quando não existe nenhum livro cadastrado na lista
          <Text style={[styles.listaVazia, { color: colors.mutedText }]}>
            Nenhum livro na lista de desejos.
          </Text>
        }
      />

      {/* Botão fixo na parte inferior para navegar até a tela de cadastro */}
      <TouchableOpacity
        style={styles.botaoNovoLivro}
        onPress={() => navigation.navigate("Cadastrar")}
      >
        <Text style={styles.textoBotaoNovoLivro}>+ Adicionar novo livro</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilização visual dos componentes da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tituloPagina: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 16,
    color: "#2D3748",
  },
  botaoNovoLivro: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#3182CE",
  },
  textoBotaoNovoLivro: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  listaVazia: {
    textAlign: "center",
    marginTop: 40,
    color: "#A0AEC0",
    fontSize: 16,
  },
  card: {
    flexDirection: "row", // Lado a lado (imagem na esquerda, dados na direita)
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  capa: {
    width: 70,
    height: 100,
    borderRadius: 6,
    backgroundColor: "#DDD",
  },
  capaVazia: {
    justifyContent: "center",
    alignItems: "center",
  },
  capaVaziaTexto: {
    fontSize: 24,
  },
  informacoes: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
  },
  autor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  botao: {
    alignSelf: "flex-start",
    backgroundColor: "#3182CE",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
