import { db } from './database';

export const livroRepository = {
  // READ: Busca os livros de acordo com a aba/tela, status (Querendo ler, Lendo, Lido,)
  buscarPorStatus: (status) => {
    return db.getAllSync('SELECT * FROM livros WHERE status = ?;', [status]); 
  },

  // CREATE: Insere um novo livro cadastrado
  adicionar: (titulo, autor, status) => {
    return db.runSync(
      'INSERT INTO livros (titulo, autor, status, progresso) VALUES (?, ?, ?, 0);',
      [titulo, autor, status]
    );
  }
};