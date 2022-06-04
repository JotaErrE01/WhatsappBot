const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const token = 'EAAto0uhusTsBACqNLBueuxPEZCKpvwBGt4FPulJUbNEKQeoUGIDNrXcCRGzzIK7fSNqvS3gbtX0BjmuOZBWqSD3IZBvn0iWsYxE3gij3bpwKjjBPgkjJXQdWRCRJUTeZBzsQNa6dbZCZAWX9gDY99AUkr3qcJd4efojOJiObZBOmD4lyMWSZCfAjT9bOq6uCFqfU9Pm1ZAFELgAZDZD';

const axiosInstance = axios.create({
  baseURL: 'https://graph.facebook.com/v13.0',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})

const app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
  res.send('hola mundo')
})

// validar servidores
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === 'test_token_cualquier_palabra') {
    res.send(req.query['hub.challenge']);
  } else {
    res.status(401).json({ mdg: 'Denied' });
  }
})

// validar eventos
app.post('/webhook', function (req, res) {
  const data = req.body;
  if (data.object === 'whatsapp_business_account') {
    if (data.entry) {
      data.entry.forEach(function (entry) {
        if (entry.changes?.length && entry.changes[0].value?.messages?.length) {
          const phoneId = entry.changes[0].value.metadata.phone_number_id;
          const recipentWaId = entry.changes[0].value?.messages[0].from;
          // const text = entry.changes[0].value?.messages[0].text.body;
          // console.log(entry.changes[0].value?.messages[0].text.body);
          console.log(entry.changes[0].value);

          // const dataToPost = {
          //   "messaging_product": "whatsapp",
          //   "to": `${recipentWaId}`,
          //   "type": "text",
          //   "text": { body: '*Hola Mundo* 😄' },
          //   // "template": {
          //   //   "name": "hello_world",
          //   //   "language": {
          //   //     "code": "spanish"
          //   //   }
          //   // }
          // }

          // const dataToPost = {
          //   "messaging_product": "whatsapp",
          //   "to": `${recipentWaId}`,
          //   "type": "template",
          //   "template": {
          //     "name": "sample_shipping_confirmation",
          //     "language": {
          //       "code": "en_US",
          //       "policy": "deterministic"
          //     },
          //     "components": [
          //       {
          //         "type": "body",
          //         "parameters": [
          //           {
          //             "type": "text",
          //             "text": "2"
          //           }
          //         ]
          //       }
          //     ]
          //   }

          // }
          // callSendAPI(dataToPost, phoneId);
        }
      });
    }
    res.sendStatus(200);
  }
})

async function callSendAPI(messageData, phoneNumber) {
  try {
    const { data } = await axiosInstance.post(`/${phoneNumber}/messages`, messageData);
    console.log('success', data);
  } catch (error) {
    console.log(error);
  }
}
