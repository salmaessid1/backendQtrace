const Imap = require('imap');
const { inspect } = require('util');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialisation Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://qtrace-a1302-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Configuration IMAP (Gmail)
const imap = new Imap({
  user: 'herssimeriem@gmail.com',
  password: 'Herssi/Meriem25',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
});

// Traitement des nouveaux emails
function processNewEmails() {
  imap.once('ready', () => {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) throw err;

      // Recherche des emails non lus
      imap.search(['UNSEEN', ['SUBJECT', 'Re:']], (err, results) => {
        if (err || !results.length) return;

        const fetch = imap.fetch(results, { bodies: '' });
        
        fetch.on('message', (msg) => {
          let emailContent = '';

          msg.on('body', (stream) => {
            stream.on('data', (chunk) => {
              emailContent += chunk.toString('utf8');
            });
          });

          msg.once('end', async () => {
            // Extraction de l'expéditeur et du contenu
            const fromMatch = emailContent.match(/From: (.+)/i);
            const contentMatch = emailContent.match(/\n\n(.+)/s);

            if (fromMatch && contentMatch) {
              const senderEmail = fromMatch[1].trim();
              const messageContent = contentMatch[1].trim();

              // Extraction de l'ID de conversation (si présent)
              const convIdMatch = emailContent.match(/Conversation ID: (.+)/);
              const conversationId = convIdMatch ? convIdMatch[1].trim() : null;

              if (conversationId) {
                // Enregistrement dans Firebase
                await db.ref(`conversations/${conversationId}/messages`).push({
                  senderEmail,
                  content: messageContent,
                  timestamp: Date.now(),
                  isEmailReply: true,
                  read: false
                });

                console.log(`Réponse enregistrée pour la conversation ${conversationId}`);
              }
            }
          });
        });
      });
    });
  });

  imap.connect();
}

// Vérification toutes les 5 minutes
setInterval(processNewEmails, 5 * 60 * 1000);
processNewEmails(); // Première exécution