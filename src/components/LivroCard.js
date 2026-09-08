import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Este é o componente `LivroCard`. Ele recebe como parâmetro (props):
// - `livro`: objeto contendo os dados do livro (título, autor, status, progresso)
// - `onMudarStatus`: função chamada quando o usuário quer mudar o status do livro
// - `onExcluir`: função chamada para deletar o livro
export default function LivroCard({ livro, onMudarStatus, onExcluir }) {
  return (
    // Container Principal do Card que envolve todas as informações e botões
    <View style={styles.card}>
      
      {/* Container da esquerda: exibe o texto com as informações do livro */}
      <View style={styles.infoContainer}>
        {/* Exibe o título do livro em destaque */}
        <Text style={styles.titulo}>{livro.titulo}</Text>
        
        {/* Exibe o nome do autor */}
        <Text style={styles.autor}>Autor: {livro.autor}</Text>
        
        {/* Renderização condicional: SE o status for 'lendo', exibe a porcentagem lida. 
            Se for outro status, esta linha simplesmente é ignorada */}
        {livro.status === 'lendo' && (
          <Text style={styles.progresso}>Progresso: {livro.progresso}%</Text>
        )}
      </View>

      {/* Container da direita: guarda os botões de ação */}
      <View style={styles.acoesContainer}>
        
        {/* SE o livro está na lista 'querendo' (Quero Ler):
            Exibe o botão para iniciar a leitura e avisa o componente pai sobre a mudança */}
        {livro.status === 'querendo' && (
          <TouchableOpacity 
            style={[styles.botao, styles.botaoLendo]} 
            onPress={() => onMudarStatus(livro.id, 'lendo')}
          >
            <Text style={styles.textoBotao}>Começar a Ler</Text>
          </TouchableOpacity>
        )}

        {/* SE o livro está 'lendo':
            Exibe o botão para finalizar e mudar o status para 'lido' */}
        {livro.status === 'lendo' && (
          <TouchableOpacity 
            style={[styles.botao, styles.botaoLido]} 
            onPress={() => onMudarStatus(livro.id, 'lido')}
          >
            <Text style={styles.textoBotao}>Concluir</Text>
          </TouchableOpacity>
        )}

        {/* Botão de Excluir: acionado ao clicar no ícone do lixo,
            disparando a função `onExcluir` passando o id deste livro */}
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

// Estilização do componente usando o StyleSheet (similar ao CSS)
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', // Fundo branco
    padding: 16, // Espaçamento interno em volta do conteúdo
    borderRadius: 8, // Bordan arredondadas
    marginVertical: 8, // Espaço em cima e embaixo entre outros cards
    marginHorizontal: 16, // Espaço nas laterais em relação à tela
    flexDirection: 'row', // Alinha os filhos (infoContainer e acoesContainer) lado a lado em linha
    justifyContent: 'space-between', // Coloca o texto na esquerda e os botões totalmente na direita
    alignItems: 'center', // Centraliza o conteúdo verticalmente
    
    // Efeitos de sombra para dar a sensação de cartão elevado
    elevation: 3, // Sombra específica para o Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContainer: {
    flex: 1, // Faz esta parte ocupar todo o espaço disponível na esquerda
    marginRight: 8, // Evita que o texto encoste nos botões
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold', // Deixa o título em negrito
    color: '#333333',
  },
  autor: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4, // Afasta um pouco do título
  },
  progresso: {
    fontSize: 12,
    color: '#2B6CB0', // Azul para destacar o progresso
    fontWeight: '600',
    marginTop: 4,
  },
  acoesContainer: {
    flexDirection: 'row', // Coloca os botões um ao lado do outro
    alignItems: 'center',
    gap: 8, // Espaçamento entre os botões de ação
  },
  botao: {
    paddingVertical: 6, // Altura interna do botão
    paddingHorizontal: 12, // Largura interna do botão
    borderRadius: 6, // Arredondamento do botão
  },
  botaoLendo: {
    backgroundColor: '#3182CE', // Azul
  },
  botaoLido: {
    backgroundColor: '#38A169', // Verde
  },
  botaoExcluir: {
    backgroundColor: '#E53E3E', // Vermelho
  },
  textoBotao: {
    color: '#FFFFFF', // Texto branco
    fontWeight: 'bold',
    fontSize: 12,
  },
});
