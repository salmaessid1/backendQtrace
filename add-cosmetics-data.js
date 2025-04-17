const admin = require("firebase-admin");
const path = require("path");

// 🔥 Charger la clé Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, "firebase-key.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://qtrace-a1302-default-rtdb.firebaseio.com",
});

const db = admin.database();

// Ajouter des catégories
const categoriesRef = db.ref('categories');
const categories = {
  category1: { name: 'Soins de la Peau' },
  category2: { name: 'Maquillage' },
  category3: { name: 'Parfums' }
};

categoriesRef.set(categories)
  .then(() => console.log('Catégories ajoutées avec succès !'))
  .catch((error) => console.error('Erreur lors de l\'ajout des catégories :', error));

// Ajouter des produits
const productsRef = db.ref('products');

productsRef.set(products)
  .then(() => console.log('Produits ajoutés avec succès !'))
  .catch((error) => console.error('Erreur lors de l\'ajout des produits :', error));