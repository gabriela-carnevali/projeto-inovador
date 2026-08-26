import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';

import { useFocusEffect } from '@react-navigation/native'; //useFocusEffect utilizamos porque o usuário pode voltar da tela de cadastro e queremos que a lista seja atualizada automaticamente.

import {
  buscarLendo,
  atualizarProgresso,
  concluirLeitura,
} from './livroRepository';

export default function Lendo() {
  const [livros, setLivros] = useState([]);

  // Recarrega a lista sempre que a tela ganha foco
  // (ex: depois de voltar da tela de Cadastrar Livro)
  useFocusEffect(
    useCallback(() => {
      carregarLivros();
    }, [])
  );

  async function carregarLivros() {
    try {
      const resultado = await buscarLendo();
      setLivros(resultado);
    } catch (erro) {
      console.log('Erro ao buscar livros em leitura:', erro);
    }
  }

  // Atualiza o progresso no estado local (feedback imediato)
  // e persiste no SQLite
  async function handleAtualizarProgresso(id, novoProgresso) {
    setLivros((livrosAtuais) =>
      livrosAtuais.map((livro) =>
        livro.id === id ? { ...livro, progresso: novoProgresso } : livro
      )
    );

    try {
      await atualizarProgresso(id, novoProgresso);
    } catch (erro) {
      console.log('Erro ao salvar progresso:', erro);
    }
  }

  // Marca o livro como concluído (status = "lido", progresso = 100)
  // e remove ele da lista local, já que não pertence mais a "Lendo"
  async function handleConcluir(id) {
    try {
      await concluirLeitura(id);
      setLivros((livrosAtuais) => livrosAtuais.filter((livro) => livro.id !== id));
    } catch (erro) {
      console.log('Erro ao concluir leitura:', erro);
    }
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        {item.capa ? (
          <Image source={{ uri: item.capa }} style={styles.capa} />
        ) : (
          <View style={[styles.capa, styles.capaVazia]}>
            <Text style={styles.capaVaziaTexto}>📖</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.autor}>{item.autor}</Text>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={item.progresso}
            onSlidingComplete={(valor) =>
              handleAtualizarProgresso(item.id, valor)
            }
          />
          <Text style={styles.progressoTexto}>{item.progresso}%</Text>

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
    <View style={styles.container}>
      {livros.length === 0 ? (
        <Text style={styles.vazio}>Você não está lendo nenhum livro no momento.</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  lista: { padding: 16 },
  vazio: { textAlign: 'center', marginTop: 40, color: '#888', fontSize: 16 },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  capa: { width: 70, height: 100, borderRadius: 6, backgroundColor: '#ddd' },
  capaVazia: { justifyContent: 'center', alignItems: 'center' },
  capaVaziaTexto: { fontSize: 24 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  titulo: { fontSize: 16, fontWeight: 'bold' },
  autor: { fontSize: 14, color: '#666', marginBottom: 4 },
  slider: { width: '100%', height: 30 },
  progressoTexto: { fontSize: 12, color: '#444', marginBottom: 6 },
  botaoConcluir: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  botaoConcluirTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});