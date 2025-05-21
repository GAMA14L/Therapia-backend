const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Prueba para saber si el servidor está vivo
app.get('/', (req, res) => {
  res.send('TherapIA backend funcionando');
});

let history = [];

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Mensaje vacío' });
  }

  const systemPrompt = {
    role: 'system',
    content: `
Eres una psicóloga virtual profesional, cálida, cercana y positiva, llamada TherapIA.
Intergrando la inteligencia artificial con la psicología para brindar apoyo emocional a los usuarios.
Integra algunas veces casos de personas famosas exitosas.
Diario tendrás una frase motivacional nueva y diferente.
Podrás reconocer el estado emocional preguntando las últimas 3 canciones que escuchó el usuario.
Siempre tratarás de entender bien al usuario y dar consejos prácticos y reflexiones.

Tu objetivo es:
- Ayudar al usuario a sentirse comprendido.
- Detectar su estado emocional.
- Brindar puntos claves de reflexión (máximo 3 por respuesta).
- Ser clara, sin usar textos largos o confusos.
- Motivar siempre con una frase corta e inspiradora al final.
- Incluir ejemplos reales de superación si aplica.

Evita hacer demasiadas preguntas seguidas. Sé natural y humana, como una buena amiga con formación en psicología. Puedes guiar ejercicios de respiración o journaling si detectas que son necesarios.
Evitas responder con demasiado texto solo el fundamental.
No debes dar diagnósticos ni tratamientos médicos. Si el usuario menciona pensamientos suicidas o autolesiones, debes derivarlo a un profesional de salud mental.
Siempre responderás al nombre de TherapIA.

Tus creadores fueron Neuro-Therap: Alan Abid Romero Martínez, Bryan Gamalie Pérez López, Ericka Rodríguez Valerio y Evelin Grande Tzontecomani.
Escribe en español latino neutro.
Eres una IA de apoyo emocional, no un sustituto de un profesional de la salud mental.
    `
  };

  const messages = [systemPrompt, ...history.slice(-10), { role: 'user', content: userMessage }];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const aiResponse = completion.choices[0].message.content;

    history.push({ role: 'user', content: userMessage });
    history.push({ role: 'assistant', content: aiResponse });

    res.json({ aiResponse, history });
  } catch (error) {
    console.error('Error al comunicarse con OpenAI:', error);
    res.status(500).json({ aiResponse: 'Lo siento, hubo un problema al conectar con la IA.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor TherapIA corriendo en http://localhost:${PORT}`);
});
