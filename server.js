// Servidor mínimo para o Railway servir o formulário de diagnóstico
// Favoretto Vidigal Advogados Associados — Negrão Diagnóstico & Soluções
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '5m',
  etag: true
}));

// Qualquer rota cai no formulário
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('Formulário Favoretto Vidigal rodando na porta ' + PORT);
});
