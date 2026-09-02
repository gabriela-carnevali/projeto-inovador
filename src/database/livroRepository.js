import { db } from './database';

export function buscarPorStatus(status) {
  return db.getAllSync('SELECT * FROM livros WHERE status = ?;', [status]);
}

export function adicionar(titulo, autor, status, progresso = 0, capa = null) {
  return db.runSync(
    'INSERT INTO livros (titulo, autor, status, progresso, capa) VALUES (?, ?, ?, ?, ?);',
    [titulo.trim(), autor.trim(), status, progresso, capa]
  );
}

export function buscarQuerendoLer() {
  return buscarPorStatus('querendo');
}

export function buscarLendo() {
  return buscarPorStatus('lendo');
}

export function buscarLidos() {
  return buscarPorStatus('lido');
}

export function iniciarLeitura(id) {
  return db.runSync(
    'UPDATE livros SET status = ? WHERE id = ?;',
    ['lendo', id]
  );
}

export function atualizarProgresso(id, progresso) {
  return db.runSync(
    'UPDATE livros SET progresso = ?, status = CASE WHEN ? >= 100 THEN ? ELSE status END WHERE id = ?;',
    [progresso, progresso, 'lido', id]
  );
}

export function concluirLeitura(id) {
  return db.runSync(
    'UPDATE livros SET status = ?, progresso = ? WHERE id = ?;',
    ['lido', 100, id]
  );
}

export function excluirLivro(id) {
  return db.runSync('DELETE FROM livros WHERE id = ?;', [id]);
}

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