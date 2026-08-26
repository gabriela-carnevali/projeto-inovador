// Abre o arquivo de banco de dados 'livros.db' no dispositivo
export const db = SQLite.openDatabaseSync('livros.db');

// Garante que a tabela exista ao iniciar
export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      status TEXT NOT NULL,
      progresso INTEGER DEFAULT 0
    );
  `);
}