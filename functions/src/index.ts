import { onRequest } from 'firebase-functions/v2/https';
import { onValueCreated } from 'firebase-functions/v2/database';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import express from 'express';

admin.initializeApp();
const app = express();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'herssimeriem@gmail.com',
    pass: 'Herssi/Meriem25'
  }
});

// Endpoint pour recevoir les réponses emails
app.post('/email-reply', async (req, res) => {
  const { from, to, text } = req.body;
  
  try {
    await admin.database().ref('/emailReplies').push({
      from,
      to,
      text,
      receivedAt: new Date().toISOString()
    });
    res.status(200).send('Email traité');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur de traitement');
  }
});

exports.api = onRequest(app);

exports.sendEmailNotification = onValueCreated(
  'conversations/{conversationId}/messages/{messageId}',
  async (event) => {
    const message = event.data.val();
    const conversationId = event.params.conversationId;

    const convSnapshot = await admin.database()
      .ref(`conversations/${conversationId}`)
      .once('value');
    
    const conv = convSnapshot.val();
    const recipientEmail = conv.participants.external;

    await transporter.sendMail({
      from: '"Responsable Stock" <herssimeriem@gmail.com>',
      to: recipientEmail,
      subject: 'Nouveau message - Gestion Stock',
      text: `Vous avez reçu un nouveau message :\n\n${message.content}\n\nPour répondre, répondez simplement à cet email.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #2c7be5;">Nouveau message</h2>
          <p>${message.content}</p>
          <p><em>Pour répondre, répondez simplement à cet email.</em></p>
        </div>
      `,
      headers: {
        'Reply-To': 'herssimeriem@gmail.com',
        'X-Conversation-ID': conversationId
      }
    });
  }
);