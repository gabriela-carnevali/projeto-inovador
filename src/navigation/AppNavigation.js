// Importa a função do React Navigation responsável por criar a navegação em formato de 'Pilha' (Stack)
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa os componentes de tela que serão exibidos no aplicativo
import QuerendoLer from '../screens/QuerendoLer';
import Lendo from '../screens/Lendo';
import Lido from '../screens/Lido';
import CadastroLivro from '../screens/CadastroLivro';

// Cria o objeto da navegação Stack
// Ele funciona como um "baralho de cartas": a nova tela entra por cima da atual e, ao voltar, a tela do topo é removida
const Stack = createNativeStackNavigator();

// Componente principal que define a estrutura de navegação do app
export default function AppNavigation() {
  return (
    // O Stack.Navigator é o container pai que gerencia todas as telas registradas
    <Stack.Navigator>
      
      {/* 1ª Tela: QuerendoLer
          Por ser a primeira da lista, será a tela inicial carregada ao abrir o app */}
      <Stack.Screen
        name="QuerendoLer" // Nome único usado para navegar até esta tela (ex: navigation.navigate('QuerendoLer'))
        component={QuerendoLer} // Componente visual associado a esta rota
        options={{
          title: 'Querendo Ler' // Título que aparecerá no cabeçalho superior da tela
        }}
      />

      {/* 2ª Tela: Lendo */}
      <Stack.Screen
        name="Lendo"
        component={Lendo}
        options={{
          title: 'Lendo'
        }}
      />

      {/* 3ª Tela: Lido */}
      <Stack.Screen
        name="Lido"
        component={Lido}
        options={{
          title: 'Lido'
        }}
      />
      
      {/* 4ª Tela: CadastroLivro */}
      <Stack.Screen
        name="CadastroLivro"
        component={CadastroLivro}
        options={{
          title: 'Cadastrar Livro' // Título exibido no cabeçalho ao abrir a formulário de cadastro
        }}
      />

    </Stack.Navigator>
  );
}
