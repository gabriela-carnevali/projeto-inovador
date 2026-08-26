// Importa o React
import React from 'react';

// Importa o componente que cria a navegação em formato de pilha
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa as telas do nosso aplicativo
import QuerendoLer from '../screens/QuerendoLer';
import Lendo from '../screens/Lendo';
import Lido from '../screens/Lido';
import CadastroLivro from '../screens/CadastroLivro';


// Cria o navegador
// Ele será responsável por controlar a passagem de uma tela para outra.
const Stack = createNativeStackNavigator();


// Função principal da navegação
export default function AppNavigation() {

    return (

        // NavigationContainer é necessário para controlar a navegação.
        // Ele será colocado no App.js.
        <Stack.Navigator>

            {/* 
                Tela "Querendo Ler"

                initialRouteName define qual tela será aberta
                primeiro quando o aplicativo iniciar.
            */}
            <Stack.Screen
                name="QuerendoLer"
                component={QuerendoLer}
                options={{
                    title: 'Querendo Ler'
                }}
            />


            {/* 
                Tela "Lendo"

                Será acessada quando o usuário selecionar
                um livro para começar a leitura.
            */}
            <Stack.Screen
                name="Lendo"
                component={Lendo}
                options={{
                    title: 'Lendo'
                }}
            />


            {/* 
                Tela "Lido"

                Será acessada depois que o usuário
                concluir a leitura.
            */}
            <Stack.Screen
                name="Lido"
                component={Lido}
                options={{
                    title: 'Lido'
                }}
            />


            {/* 
                Tela de cadastro

                Permite adicionar um novo livro ao banco de dados.
            */}
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