// Importa hooks do React para controlar dados (useState) e otimizar funções (useCallback)
import { useState, useCallback } from "react";

// Importa os componentes de interface do React Native
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

// Importa 'useFocusEffect' do React Navigation para recarregar a tela sempre que ela for aberta
import { useFocusEffect } from "@react-navigation/native";

// Importa as funções para buscar os livros concluídos e para deletar um livro do banco
import { buscarLidos, excluirLivro } from "../database/livroRepository";

// Importa o hook para aplicar as cores do tema (claro/escuro)
import { useTheme } from "../themeContext";

export default function Lido() {
  const { colors } = useTheme(); // Recebe os estilos de cor atuais do aplicativo
  const [livros, setLivros] = useState([]); // Guarda a lista de livros concluídos

  // Executa a busca dos livros toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      carregarLivros();
    }, []),
  );

  // Busca no SQLite apenas os livros marcados com status 'lido'
  async function carregarLivros() {
    try {
      const resultado = await buscarLidos();
      setLivros(resultado); // Atualiza a lista na tela
    } catch (erro) {
      console.log("Erro ao buscar livros lidos:", erro);
    }
  }

  // Abre uma caixa de confirmação nativa (Alert) para evitar exclusões acidentais
  function confirmarExclusao(id, titulo) {
    Alert.alert(
      "Excluir livro", // Título da mensagem
      `Tem certeza que deseja excluir "${titulo}" da sua biblioteca?`, // Texto com o nome do livro
      [
        { text: "Cancelar", style: "cancel" }, // Botão para desistir da ação
        {
          text: "Excluir",
          style: "destructive", // Deixa o texto vermelho no iOS
          onPress: () => handleExcluir(id), // Chama a exclusão real ao confirmar
        },
      ],
    );
  }

  // Remove o livro do banco e atualiza a interface
  async function handleExcluir(id) {
    try {
      await excluirLivro(id); // Exclui o livro do banco de dados SQLite
      
      // Filtra e atualiza a lista local removendo o livro com esse ID
      setLivros((livrosAtuais) =>
        livrosAtuais.filter((livro) => livro.id !== id),
      );
    } catch (erro) {
      console.log("Erro ao excluir livro:", erro);
    }
  }

  // Monta o layout de cada cartão de livro concluído na lista
  function renderItem({ item }) {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {/* Mostra a imagem da capa se ela existir, ou o ícone de livro como padrão */}
        {item.capa ? (
          <Image source={{ uri: item.capa }} style={styles.capa} />
        ) : (
          <View style={[styles.capa, styles.capaVazia]}>
            <Text style={styles.capaVaziaTexto}>📖</Text>
          </View>
        )}

        {/* Dados e ações do livro */}
        <View style={styles.info}>
          <Text style={[styles.titulo, { color: colors.text }]}>
            {item.titulo}
          </Text>
          <Text style={[styles.autor, { color: colors.secondaryText }]}>
            {item.autor}
          </Text>
          
          {/* Badge indicativo de leitura concluída */}
          <Text style={styles.concluido}>✅ Concluído</Text>

          {/* Botão de remoção permanente */}
          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => confirmarExclusao(item.id, item.titulo)}
          >
            <Text style={styles.botaoExcluirTexto}>🗑️ Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.tituloPagina, { color: colors.text }]}>📚 Lido</Text>
      
      {/* Exibe mensagem informativa se a lista estiver vazia */}
      {livros.length === 0 ? (
        <Text style={[styles.vazio, { color: colors.mutedText }]}>
          Você ainda não concluiu nenhum livro.
        </Text>
      ) : (
        /* Renderiza a lista de livros de forma otimizada */
        <FlatList
          data={livros}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
        />
      )}
    </View>
  );
}

// Estilização dos componentes da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  lista: {
    padding: 16,
  },
  vazio: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    fontSize: 16,
  },
  card: {
    flexDirection: "row", // Organiza imagem na esquerda e texto/botão na direita
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  tituloPagina: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 16,
    color: "#2D3748",
  },
  capa: {
    width: 70,
    height: 100,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  capaVazia: {
    justifyContent: "center",
    alignItems: "center",
  },
  capaVaziaTexto: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  autor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  concluido: {
    fontSize: 12,
    color: "#4CAF50",
    marginBottom: 8,
  },
  botaoExcluir: {
    alignSelf: "flex-start",
    backgroundColor: "#e53935",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  botaoExcluirTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
