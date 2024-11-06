/**
 * Importa o framework de aplicações web Express.js
 */
const express = require('express');
const { saveNote, getNote, deleteExpiredNotes, markNoteAsOpened } = require('./db');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/note/:id', (req, res) => {
    res.sendFile(__dirname + '/public/note.html');
})

app.post('/notes', async (req, res) => {
    const { content } = req.body;
    
    if(!content) {
        return res.send('<span class="error">Erro inesperado!</span>');
    }

    const id = crypto.randomUUID();
    await saveNote(id, content)
    res.send(`
        <p>Compartilhe sua nota através do link:
            <br />
            <span>${req.headers.origin}/note/${id}</span>
        </p>
        `)
});

app.get('/share/:id', async (req, res) => {
    await deleteExpiredNotes();
    
    const { id } = req.params;
    const note = await getNote(id);
    if(!note) {
        return res.send('<span class="error">Oops! A fita perdeu a cola e a nota sumiu!</span>');
    }

    if(!note.opened_at) {
        await markNoteAsOpened(id);
    }

    res.send(note.content);
})

// Define a porta do servidor
const PORT = 3000;
/// Define a rota raiz da aplicação
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
