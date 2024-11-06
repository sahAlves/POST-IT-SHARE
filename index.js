/**
 * Importa o framework de aplicações web Express.js
 */
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/note/:id', (req, res) => {
    res.sendFile(__dirname + '/public/note.html');
})

// Define a porta do servidor
const PORT = 3000;
/// Define a rota raiz da aplicação
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
