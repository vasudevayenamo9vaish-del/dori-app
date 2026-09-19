const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

// Initialize Firebase Admin with the downloaded JSON
const serviceAccount = require('/Users/vaishalimahajan/Downloads/mydori-5d8d3-firebase-adminsdk-fbsvc-583c717f04.json');

initializeApp({
  credential: cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

app.post('/notify', async (req, res) => {
  try {
    const { token, title, body } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Missing device token' });
    }

    const message = {
      notification: { title, body },
      token: token,
      android: {
        priority: 'high'
      }
    };

    const response = await getMessaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Local Firebase Notification Server running on port ${PORT}`);
});
