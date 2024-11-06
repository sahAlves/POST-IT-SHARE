const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./notes.db');

// Cria a tabela se não existir
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                content TEXT,
                opened_at DATE DEFAULT null,
                created_at DATE DEFAULT (datetime('now', 'localtime'))
            )`)
});

/// Salva uma nota
const saveNote = (id, content) => new Promise ((resolve, reject) => {
    db.run(`
            INSERT INTO notes (id, content) VALUES (?, ?)
        `, [id, content], (err) => err ? reject(err) : resolve());
})

// Retorna uma nota específica
const getNote = (id) => new Promise ((resolve, reject) => {
    db.get(`
            SELECT * FROM notes WHERE id = ?
        `, [id], (err, row) => err ? reject(err) : resolve(row));
})

// Atualiza a data de abertura da nota
const markNoteAsOpened = (id) => new Promise ((resolve, reject) => {
    db.run(`
            UPDATE notes SET opened_at = datetime('now', 'localtime') WHERE id = ?
        `, [id], (err) => err ? reject(err) : resolve());
})

// Deleta notas que não foram abertas há 5 minutos ou que não foram abertas há 7 dias
const deleteExpiredNotes = () => new Promise ((resolve, reject) => {
    db.run(`
            DELETE FROM notes 
            WHERE opened_at < datetime('now', 'localtime', '-5 minutes')
            OR opened_at IS NULL AND created_at < datetime('now', 'localtime', '-7 days')
        `, (err) => err ? reject(err) : resolve());
})

// Exporta as funções
module.exports = {
    saveNote,
    getNote,
    markNoteAsOpened,
    deleteExpiredNotes
}
