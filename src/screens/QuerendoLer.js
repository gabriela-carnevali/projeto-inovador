// O useState será usado para guardar os livros na tela.
import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { buscarQuerendoLer, iniciarLeitura } from "../database/livroRepository";
import { useTheme } from "../themeContext";

export default function QuerendoLer({ navigation }) {
  const { colors } = useTheme();
  const [livros, setLivros] = useState([]);
  const carregarLivros = () => {
    //busca livros no banco de dados e atualiza a tela

    const livrosDoBanco = buscarQuerendoLer();
    setLivros(livrosDoBanco);
  };

  useFocusEffect(
    useCallback(() => {
      carregarLivros();
    }, []),
  );

  const selecionarLivro = (id) => {
    iniciarLeitura(id);

    carregarLivros(); //o livro selecionado não aparece mais na tela "Querendo Ler"

    navigation.navigate("Lendo"); //muda para tela Lendo
  };

  const renderLivro = ({ item }) => {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {/* Capa do livro */}
        {item.capa ? (
          <Image source={{ uri: item.capa }} style={styles.capa} />
        ) : (
          <View style={[styles.capa, styles.capaVazia]}>
            <Text style={styles.capaVaziaTexto}>📖</Text>
          </View>
        )}

        {/* Área com as informações do livro */}
        <View style={styles.informacoes}>
          {/* Título */}
          <Text style={[styles.titulo, { color: colors.text }]}>
            {item.titulo}
          </Text>

          {/* Autor */}
          <Text style={[styles.autor, { color: colors.secondaryText }]}>
            {item.autor}
          </Text>
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
      <Text style={[styles.tituloPagina, { color: colors.text }]}>
        📚 Querendo Ler
      </Text>
      <FlatList
        data={livros}
        renderItem={renderLivro}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={[styles.listaVazia, { color: colors.mutedText }]}>
            Nenhum livro na lista de desejos.
          </Text>
        }
      />
      <TouchableOpacity
        style={styles.botaoNovoLivro}
        onPress={() => navigation.navigate("Cadastrar")}
      >
        <Text style={styles.textoBotaoNovoLivro}>+ Adicionar novo livro</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    flexDirection: "row",
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
