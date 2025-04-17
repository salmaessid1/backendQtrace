const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "firebase-key.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://qtrace-a1302-default-rtdb.firebaseio.com", // Ajoute l'URL de ta database
});

// 📌 Fonction pour attribuer un rôle à un utilisateur
const setUserRole = async (uid, role) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(`✅ Rôle "${role}" attribué à l'utilisateur ${uid}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'attribution du rôle :", error);
  }
};


// 🔥 Exécute la fonction avec l'UID du responsable et de l'admin
setUserRole("vzZPX6EuLIXyjpiAzIvnyJPlSbb2", "admin"); 



