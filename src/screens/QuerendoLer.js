// O useState será usado para guardar os livros na tela.
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import { buscarQuerendoLer, iniciarLeitura } from "../database/livroRepository";

export default function QuerendoLer({ navigation }) {
  const [livros, setLivros] = useState([]);
  const carregarLivros = () => {
    //busca livros no banco de dados e atualiza a tela

    const livrosDoBanco = buscarQuerendoLer();
    setLivros(livrosDoBanco);
  };

  useEffect(() => {
    carregarLivros();
  }, []);

  const selecionarLivro = (id) => {
    iniciarLeitura(id);

    carregarLivros(); //o livro selecionado não aparece mais na tela "Querendo Ler"

    navigation.navigate("Lendo"); //muda para tela Lendo
  };

  const renderLivro = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* Capa do livro */}
        <Image source={{ uri: item.capa }} style={styles.capa} />

        {/* Área com as informações do livro */}
        <View style={styles.informacoes}>
          {/* Título */}
          <Text style={styles.titulo}>{item.titulo}</Text>

          {/* Autor */}
          <Text style={styles.autor}>{item.autor}</Text>
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
    <View style={styles.container}>
      <Text style={styles.tituloPagina}>📚 Querendo Ler</Text>
      <FlatList
        data={livros}
        renderItem={renderLivro}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
