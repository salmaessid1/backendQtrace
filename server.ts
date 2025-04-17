import express, { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors'; 
import qrRoutes from "./routes/routes";

admin.initializeApp();
const db = admin.database();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/api', qrRoutes);

app.get("/", (req, res) => {
  res.send("Serveur en cours d'exécution !");
});

// ✅ Route pour s'assurer que l'admin est dans la base de données
app.post('/create-admin', async (req: Request, res: Response) => {
  try {
    const email = "salma.essid25@gmail.com"; 
    const password = "salmaessid"; 

    // Vérifie si l'admin existe déjà dans Firebase Auth
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (error) {
      userRecord = await admin.auth().createUser({ email, password });
    }

    // ✅ Vérifier et ajouter l'admin dans la base de données
    const userRef = db.ref(`users/${userRecord.uid}`);
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) {
      await userRef.set({
        email,
        role: "admin",
        status: "approved"
      });
    }

    res.status(201).send(`✅ Admin opérationnel: ${userRecord.uid}`);
  } catch (error) {
    res.status(500).send("❌ Erreur lors de la création de l'admin.");
  }
});

// ✅ Route pour récupérer les utilisateurs en attente
app.get('/pending-users', async (req: Request, res: Response) => {
  try {
    const snapshot = await db.ref('users').orderByChild('status').equalTo('pending').once('value');
    res.status(200).json(snapshot.val() || {});
  } catch (error) {
    res.status(500).send("❌ Erreur lors de la récupération des utilisateurs en attente.");
  }
});

// ✅ Route pour approuver un utilisateur
app.post('/approve-user', async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;
    await db.ref(`users/${uid}`).update({ status: 'approved' });
    res.status(200).send(`✅ Utilisateur ${uid} approuvé.`);
  } catch (error) {
    res.status(500).send("❌ Erreur lors de l'approbation de l'utilisateur.");
  }
});

// ✅ Route pour refuser un utilisateur
app.post('/reject-user', async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;
    await db.ref(`users/${uid}`).remove();
    res.status(200).send(`❌ Utilisateur ${uid} refusé.`);
  } catch (error) {
    res.status(500).send("❌ Erreur lors du refus de l'utilisateur.");
  }
});



// 🚀 Lancer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});