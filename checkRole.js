import { initializeApp, credential as _credential, auth } from 'firebase-admin';

// Assure-toi que tu initialises Firebase Admin avec le fichier de clé
import serviceAccount from './firebase-key.json'; // Chemin du fichier de clé

initializeApp({
  credential: _credential.cert(serviceAccount)
});

// Fonction pour ajouter un rôle à un utilisateur
const setUserRole = async (uid, role) => {
  try {
    await auth().setCustomUserClaims(uid, { role });
    console.log(`Rôle "${role}" attribué à l'utilisateur ${uid}`);
  } catch (error) {
    console.error("Erreur lors de l'attribution du rôle :", error);
  }
};

// Remplace "UID_DE_L_UTILISATEUR" par l'UID de l'utilisateur et attribue le rôle
setUserRole("vzZPX6EuLIXyjpiAzIvnyJPlSbb2", "admin"); 


