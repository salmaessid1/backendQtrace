import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Sert les fichiers Angular
const frontendPath = path.join(__dirname, '../../Qtrace/dist/Qtrace');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
