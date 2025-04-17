import * as admin from 'firebase-admin';

// Initialise Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-key.json'))
});

async function setUserRole(uid: string, role: 'admin' | 'responsable') {
  await admin.auth().setCustomUserClaims(uid, { role });
  console.log(`✅ Rôle "${role}" attribué à l'utilisateur ${uid}`);
}

// Remplace par l'UID de l'utilisateur (trouve-le dans Firebase Authentication)
const userId = "vzZPX6EuLIXyjpiAzIvnyJPlSbb2";
setUserRole(userId, "admin"); // Ou "responsable"
