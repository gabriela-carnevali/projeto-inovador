import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { buscarLidos, excluirLivro } from "../database/livroRepository";
import { useTheme } from "../theme/ThemeContext";

export default function Lido() {
  const { colors } = useTheme();
  const [livros, setLivros] = useState([]);

  // Recarrega a lista sempre que a tela ganha foco
  // (ex: depois de concluir um livro na tela "Lendo")
  useFocusEffect(
    useCallback(() => {
      carregarLivros();
    }, []),
  );

  async function carregarLivros() {
    try {
      const resultado = await buscarLidos();
      setLivros(resultado);
    } catch (erro) {
      console.log("Erro ao buscar livros lidos:", erro);
    }
  }

  // Confirma antes de excluir, pois é uma ação irreversível
  function confirmarExclusao(id, titulo) {
    Alert.alert(
      "Excluir livro",
      `Tem certeza que deseja excluir "${titulo}" da sua biblioteca?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => handleExcluir(id),
        },
      ],
    );
  }

  async function handleExcluir(id) {
    try {
      await excluirLivro(id);
      // Remove da lista local só depois que o banco confirmar a exclusão,
      // diferente do progresso, que atualiza a tela antes de salvar
      setLivros((livrosAtuais) =>
        livrosAtuais.filter((livro) => livro.id !== id),
      );
    } catch (erro) {
      console.log("Erro ao excluir livro:", erro);
    }
  }

  function renderItem({ item }) {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {item.capa ? (
          <Image source={{ uri: item.capa }} style={styles.capa} />
        ) : (
          <View style={[styles.capa, styles.capaVazia]}>
            <Text style={styles.capaVaziaTexto}>📖</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={[styles.titulo, { color: colors.text }]}>
            {item.titulo}
          </Text>
          <Text style={[styles.autor, { color: colors.secondaryText }]}>
            {item.autor}
          </Text>
          <Text style={styles.concluido}>✅ Concluído</Text>

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
      {livros.length === 0 ? (
        <Text style={[styles.vazio, { color: colors.mutedText }]}>
          Você ainda não concluiu nenhum livro.
        </Text>
      ) : (
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
    flexDirection: "row",
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
