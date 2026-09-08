// Importa todas as funcionalidades do módulo 'expo-sqlite'
import * as SQLite from 'expo-sqlite';

// Abre (ou cria, se não existir) o arquivo de banco de dados 'livros.db' de forma síncrona
export const db = SQLite.openDatabaseSync('livros.db');

// Função encarregada de preparar a estrutura inicial da base de dados
export function initDatabase() {
  // Executa comandos SQL diretamente no banco
  db.execSync(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      titulo TEXT NOT NULL,                
      autor TEXT NOT NULL,                 
      status TEXT NOT NULL,                
      progresso INTEGER DEFAULT 0,         
      capa TEXT                            
    );
  `);

  // Busca na estrutura do banco todas as colunas que a tabela 'livros' possui atualmente
  const colunas = db.getAllSync('PRAGMA table_info(livros);');

  // Verifica se a coluna 'capa' EXISTE na lista obtida acima
  // Se NÃO existir (.some devolve false), adiciona a coluna para manter o banco atualizado (migração)
  if (!colunas.some((coluna) => coluna.name === 'capa')) {
    db.execSync('ALTER TABLE livros ADD COLUMN capa TEXT;');
  }
}
