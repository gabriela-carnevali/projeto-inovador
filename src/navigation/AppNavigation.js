// Importa o componente que cria a navegação em formato de pilha
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa as telas do nosso aplicativo
import QuerendoLer from '../screens/QuerendoLer';
import Lendo from '../screens/Lendo';
import Lido from '../screens/Lido';
import CadastroLivro from '../screens/CadastroLivro';


// Cria o navegador
// Ele será responsável por controlar a passagem de uma tela para outra.
const Stack = createNativeStackNavigator(); // Stack é uma pilha de telas, onde a tela atual fica no topo da pilha e as telas anteriores ficam abaixo dela. Quando o usuário navega para uma nova tela, ela é empilhada no topo. Quando ele volta, a tela do topo é removida, revelando a tela anterior.


// Função principal da navegação
export default function AppNavigation() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="QuerendoLer"
                component={QuerendoLer}
                options={{
                    title: 'Querendo Ler'
                }}
            />

            <Stack.Screen
                name="Lendo"
                component={Lendo}
                options={{
                    title: 'Lendo'
                }}
            />

            <Stack.Screen
                name="Lido"
                component={Lido}
                options={{
                    title: 'Lido'
                }}
            />
            
            <Stack.Screen
                name="CadastroLivro"
                component={CadastroLivro}
                options={{
                    title: 'Cadastrar Livro'
                }}
            />

        </Stack.Navigator>
    );
}