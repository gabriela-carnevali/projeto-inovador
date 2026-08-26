import * as SQLite from 'expo-sqlite';

// O arquivo 'livros.db' é gerado automaticamente no dispositivo do usuário
export const db = SQLite.openDatabaseAsync('livros-db')
