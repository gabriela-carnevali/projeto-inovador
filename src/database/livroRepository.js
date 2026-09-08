// Importa a instância do banco de dados configurada no arquivo 'database'
import { db } from './database';

// Busca no banco todos os livros que possuem um determinado 'status'
export function buscarPorStatus(status) {
  // O sinal '?' é um parâmetro de segurança (evita SQL Injection) que é substituído pelo valor da variável 'status'
  return db.getAllSync('SELECT * FROM livros WHERE status = ?;', [status]);
}

// Adiciona um novo livro no banco de dados
export function adicionar(titulo, autor, status, progresso = 0, capa = null) {
  //Insere o registro limpando os espaços extras no início e fim do texto com `.trim()`
  return db.runSync(
    'INSERT INTO livros (titulo, autor, status, progresso, capa) VALUES (?, ?, ?, ?, ?);',
    [titulo.trim(), autor.trim(), status, progresso, capa]
  );
}

// Busca apenas os livros com status 'querendo' (Quero Ler)
export function buscarQuerendoLer() {
  return buscarPorStatus('querendo');
}

// Busca apenas os livros que estão sendo lidos atualmente
export function buscarLendo() {
  return buscarPorStatus('lendo');
}

// Busca apenas os livros que já foram concluídos
export function buscarLidos() {
  return buscarPorStatus('lido');
}

// Altera o status de um livro específico (pelo ID) para 'lendo'
export function iniciarLeitura(id) {
  return db.runSync(
    'UPDATE livros SET status = ? WHERE id = ?;',
    ['lendo', id]
  );
}

// Atualiza a porcentagem de progresso de leitura do livro
export function atualizarProgresso(id, progresso) {
  // Atualiza o progresso e usa a cláusula 'CASE' do SQL para mudar automaticamente o status para 'lido' caso o progresso chegue a 100%
  return db.runSync(
    'UPDATE livros SET progresso = ?, status = CASE WHEN ? >= 100 THEN ? ELSE status END WHERE id = ?;',
    [progresso, progresso, 'lido', id]
  );
}

// Marca o livro como totalmente concluído (status = 'lido' e progresso = 100)
export function concluirLeitura(id) {
  return db.runSync(
    'UPDATE livros SET status = ?, progresso = ? WHERE id = ?;',
    ['lido', 100, id]
  );
}

// Remove permanentemente o livro do banco de dados usando o seu ID
export function excluirLivro(id) {
  return db.runSync('DELETE FROM livros WHERE id = ?;', [id]);
}

// Agrupa todas as funções acima em um único objeto de repositório para facilitar o uso em outras partes do app
export const livroRepository = {
  buscarPorStatus,
  adicionar,
  buscarQuerendoLer,
  buscarLendo,
  buscarLidos,
  iniciarLeitura,
  atualizarProgresso,
  concluirLeitura,
  excluirLivro,
};
