import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import { livroRepository } from '../database/livroRepository';

export default function CadastroLivro({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [status, setStatus] = useState('querendo'); // Valor padrão
  const [progresso, setProgresso] = useState('0');

  const handleSalvar = async () => {
    // Validação de campos obrigatórios
    if (!titulo.trim() || !autor.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o título e o autor.');
      return;
    }

    const progressoNum = status === 'lido' ? 100 : parseInt(progresso) || 0;

    try {
      // Chama o repositório para salvar no banco
      await livroRepository.adicionar(titulo, autor, status, progressoNum);
      
      Alert.alert('Sucesso', 'Livro cadastrado com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Limpa os campos após salvar
            setTitulo('');
            setAutor('');
            setStatus('querendo');
            setProgresso('0');
            // Retorna ou navega se estiver usando React Navigation
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.tituloTela}>Cadastrar Novo Livro</Text>

      {/* Campo Título */}
      <Text style={styles.label}>Título do Livro *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: O Pequeno Príncipe"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* Campo Autor */}
      <Text style={styles.label}>Autor *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Antoine de Saint-Exupéry"
        value={autor}
        onChangeText={setAutor}
      />

      {/* Seleção do Status */}
      <Text style={styles.label}>Status da Leitura</Text>
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.btnStatus, status === 'querendo' && styles.btnStatusAtivo]}
          onPress={() => setStatus('querendo')}
        >
          <Text style={[styles.txtStatus, status === 'querendo' && styles.txtStatusAtivo]}>
            Querendo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnStatus, status === 'lendo' && styles.btnStatusAtivo]}
          onPress={() => setStatus('lendo')}
        >
          <Text style={[styles.txtStatus, status === 'lendo' && styles.txtStatusAtivo]}>
            Lendo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnStatus, status === 'lido' && styles.btnStatusAtivo]}
          onPress={() => setStatus('lido')}
        >
          <Text style={[styles.txtStatus, status === 'lido' && styles.txtStatusAtivo]}>
            Lido
          </Text>
        </TouchableOpacity>
      </View>

      {/* Campo de Progresso (apenas se status for 'lendo') */}
      {status === 'lendo' && (
        <>
          <Text style={styles.label}>Progresso (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 50"
            keyboardType="numeric"
            value={progresso}
            onChangeText={setProgresso}
          />
        </>
      )}

      {/* Botão Salvar */}
      <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
        <Text style={styles.txtSalvar}>Salvar Livro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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