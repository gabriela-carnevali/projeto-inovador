// Importa os hooks do React para gerenciar estado e otimizar callbacks
import { useState, useCallback } from "react";

// Importa os componentes visuais essenciais do React Native
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Importa o componente de controle deslizante (Slider) para ajustar o progresso da leitura
import Slider from "@react-native-community/slider";

// Importa o hook 'useFocusEffect' do React Navigation:
// Ele executa uma ação toda vez que esta tela ganha o foco (aparece para o usuário na tela).
// É essencial aqui para atualizar a lista ao voltar da tela de cadastro de livro.
import { useFocusEffect } from "@react-navigation/native";

// Importa as funções do banco de dados relativas à leitura em andamento
import {
  buscarLendo,
  atualizarProgresso,
  concluirLeitura,
} from "../database/livroRepository";

// Importa o contexto para obter as cores do tema (claro/escuro)
import { useTheme } from "../themeContext";

export default function Lendo() {
  const { colors } = useTheme(); // Pega as cores dinâmicas do tema
  const [livros, setLivros] = useState([]); // Estado que armazena a lista de livros sendo lidos

  // Executa o carregamento dos livros sempre que a tela entra em foco no app
  useFocusEffect(
    useCallback(() => {
      carregarLivros();
    }, []),
  );

  // Busca no banco de dados SQLite apenas os livros com status 'lendo'
  async function carregarLivros() {
    try {
      const resultado = await buscarLendo();
      setLivros(resultado); // Salva o resultado no estado para renderizar
    } catch (erro) {
      console.log("Erro ao buscar livros em leitura:", erro);
    }
  }

  // Atualiza o progresso (de 0 a 100%) quando o usuário arrasta o Slider
  async function handleAtualizarProgresso(id, novoProgresso) {
    // Garante que o valor fique estritamente entre 0 e 100 e seja um número inteiro
    const progresso = Math.min(100, Math.max(0, Math.round(novoProgresso)));

    // 1. Atualização Otimista: Atualiza a interface IMEDIATAMENTE antes de responder ao banco
    setLivros((livrosAtuais) =>
      livrosAtuais.map((livro) =>
        livro.id === id ? { ...livro, progresso } : livro,
      ),
    );

    try {
      // 2. Se o Slider chegou em 100%, marca como concluído no banco; senão apenas atualiza a porcentagem
      if (progresso === 100) {
        await concluirLeitura(id);
      } else {
        await atualizarProgresso(id, progresso);
      }

      // 3. Se atingiu 100%, remove o livro da tela "Lendo" (pois agora ele vai para "Lido")
      if (progresso === 100) {
        setLivros((livrosAtuais) =>
          livrosAtuais.filter((livro) => livro.id !== id),
        );
      }
    } catch (erro) {
      console.log("Erro ao salvar progresso:", erro);
    }
  }

  // Ação manual do botão 'Concluir': marca como concluído e remove do estado atual
  async function handleConcluir(id) {
    try {
      await concluirLeitura(id);
      // Filtra o estado local mantendo apenas os livros que NÃO têm esse ID
      setLivros((livrosAtuais) =>
        livrosAtuais.filter((livro) => livro.id !== id),
      );
    } catch (erro) {
      console.log("Erro ao concluir leitura:", erro);
    }
  }

  // Função responsável por renderizar cada item (livro) da FlatList
  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        {/* Renderização condicional da Capa: se houver foto exibe a imagem; caso contrário, exibe um ícone padrão */}
        {item.capa ? (
          <Image source={{ uri: item.capa }} style={styles.capa} />
        ) : (
          <View style={[styles.capa, styles.capaVazia]}>
            <Text style={styles.capaVaziaTexto}>📖</Text>
          </View>
        )}

        {/* Informações de texto e controles de leitura */}
        <View style={styles.info}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.autor}>{item.autor}</Text>

          {/* Controle Deslizante de Progresso */}
          <Slider
            style={styles.slider}
            minimumValue={0} // Valor mínimo
            maximumValue={100} // Valor máximo
            step={1} // Anda de 1 em 1 porcento
            value={item.progresso} // Posição atual baseada no valor do banco
            onSlidingComplete={(valor) =>
              handleAtualizarProgresso(item.id, valor) // Salva no banco só quando o usuário solta o slider
            }
          />
          <Text style={styles.progressoTexto}>{item.progresso}%</Text>

          {/* Botão de atalho para finalizar o livro */}
          <TouchableOpacity
            style={styles.botaoConcluir}
            onPress={() => handleConcluir(item.id)}
          >
            <Text style={styles.botaoConcluirTexto}>✅ Concluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.tituloPagina}>📚 Lendo</Text>
      
      {/* Exibe mensagem de lista vazia caso o usuário não tenha nenhum livro em andamento */}
      {livros.length === 0 ? (
        <Text style={styles.vazio}>
          Você não está lendo nenhum livro no momento.
        </Text>
      ) : (
        /* Lista de alta performance para renderizar os cards dos livros */
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

// Folha de estilos dos componentes
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
    flexDirection: "row", // Posiciona capa à esquerda e dados à direita
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
  slider: {
    width: "100%",
    height: 30,
  },
  progressoTexto: {
    fontSize: 12,
    color: "#444",
    marginBottom: 6,
  },
  botaoConcluir: {
    alignSelf: "flex-start",
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  botaoConcluirTexto: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 13 
  },
});
