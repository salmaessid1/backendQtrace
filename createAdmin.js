const admin = require("firebase-admin");
const path = require("path");

// 🔥 Charger la clé Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, "firebase-key.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://qtrace-a1302-default-rtdb.firebaseio.com", // Remplace avec ton URL Firebase
});

async function createAdmin() {
  const email = "salma.essid25@gmail.com"; // Change si besoin
  const password = "salmaessid"; // Change si besoin

  try {
    // ✅ Vérifie si l'admin existe déjà
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log("🔵 Admin déjà existant dans Firebase Auth:", userRecord.uid);
    } catch (error) {
      // ✅ Crée l'admin s'il n'existe pas dans Firebase Auth
      userRecord = await admin.auth().createUser({ email, password });
      console.log("🟢 Admin ajouté à Firebase Auth:", userRecord.uid);
    }

    // ✅ Ajouter l'admin dans Firebase Database
    const userRef = admin.database().ref(`users/${userRecord.uid}`);
    const snapshot = await userRef.once("value");

    if (!snapshot.exists()) {
      await userRef.set({
        email,
        role: "admin",
        status: "approved",
      });
      console.log("🟢 Admin ajouté à Firebase Database.");
    } else {
      console.log("🔵 Admin déjà présent en base de données.");
    }

    console.log("✅ L'admin est prêt à se connecter !");
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin :", error);
  }
}

// Exécute la fonction
createAdmin();
