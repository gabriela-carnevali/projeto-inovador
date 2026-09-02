// Abre o arquivo de banco de dados 'livros.db' no dispositivo
import * as SQLite from 'expo-sqlite';
export const db = SQLite.openDatabaseSync('livros.db');

// Garante que a tabela exista ao iniciar
export function initDatabase() {
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

  const colunas = db.getAllSync('PRAGMA table_info(livros);');
  if (!colunas.some((coluna) => coluna.name === 'capa')) {
    db.execSync('ALTER TABLE livros ADD COLUMN capa TEXT;');
  }
}