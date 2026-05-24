// Servidor mínimo para Railway servir o formulário do Empório dos Animais
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos da pasta /public
app.use(express.static(path.join(__dirname, 'public'), {
  // Cache curto durante atualizações; ajuste se quiser
  maxAge: '5m',
  etag: true
}));

// Qualquer rota cai no formulário (index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Formulário do Empório dos Animais rodando na porta ${PORT}`);
});
