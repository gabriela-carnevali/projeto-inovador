import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LivroCard({ livro, onMudarStatus, onExcluir }) { // Recebe o livro e as funções de callback como props
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.titulo}>{livro.titulo}</Text>
        <Text style={styles.autor}>Autor: {livro.autor}</Text>
        
        {/* Exibe o progresso apenas se o livro estiver em leitura */}
        {livro.status === 'lendo' && (
          <Text style={styles.progresso}>Progresso: {livro.progresso}%</Text>
        )}
      </View>

      <View style={styles.acoesContainer}>
        {/* Botão de transição de status dependendo da tela atual */}
        {livro.status === 'querendo' && (
          <TouchableOpacity 
            style={[styles.botao, styles.botaoLendo]} 
            onPress={() => onMudarStatus(livro.id, 'lendo')}
          >
            <Text style={styles.textoBotao}>Começar a Ler</Text>
          </TouchableOpacity>
        )}

        {/* Botão de transição de status para concluir a leitura */}
        {livro.status === 'lendo' && (
          <TouchableOpacity 
            style={[styles.botao, styles.botaoLido]} 
            onPress={() => onMudarStatus(livro.id, 'lido')}
          >
            <Text style={styles.textoBotao}>Concluir</Text>
          </TouchableOpacity>
        )}

        {/* Botão de Excluir */}
        <TouchableOpacity 
          style={[styles.botao, styles.botaoExcluir]} 
          onPress={() => onExcluir(livro.id)}
        >
          <Text style={styles.textoBotao}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  autor: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  progresso: {
    fontSize: 12,
    color: '#2B6CB0',
    fontWeight: '600',
    marginTop: 4,
  },
  acoesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botao: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  botaoLendo: {
    backgroundColor: '#3182CE',
  },
  botaoLido: {
    backgroundColor: '#38A169',
  },
  botaoExcluir: {
    backgroundColor: '#E53E3E',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});