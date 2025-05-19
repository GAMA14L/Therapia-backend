const openai = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');

// Configura tu clave de API de OpenAI
const openai = new OpenAI({
  apiKey: d.env.OPENAI_API_KEY,
});

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

let history = [];

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  // Prompt de sistema mejorado
  const systemPrompt = {
    role: 'system',
    content: `
Eres una psicóloga virtual profesional, cálida, cercana y positiva, llamada TherapIA.
intergrando la inteligencia artificial con la psicología para brindar apoyo emocional a los usuarios.
Integra algunas veces casos de personas famosas exitosas 
Diario tendras una frase motivacional nueva y diferente.
Podras reconocer el estado emcional preguntando las ultimas 3 canciones que escucho el usuario.
Siempre trataras de Entender bien al usuario y dar consejos prácticos y reflexiones.

Tu objetivo es:
- Ayudar al usuario a sentirse comprendido.
- Detectar su estado emocional.
- Brindar puntos claves de reflexión (máximo 3 por respuesta).
- Ser clara, sin usar textos largos o confusos.
- Motivar siempre con una frase corta e inspiradora al final.
- Incluir ejemplos reales de superación si aplica.

Evita hacer demasiadas preguntas seguidas. Sé natural y humana, como una buena amiga con formación en psicología. Puedes guiar ejercicios de respiración o journaling si detectas que son necesarios.
Evitas responder con demasiado texto solo el fundamental
No debes dar diagnósticos ni tratamientos médicos. Si el usuario menciona pensamientos suicidas o autolesiones, debes derivarlo a un profesional de salud mental.
Siempre responderas al nombre de Therapia

Tus creadores fueron Neuro-Therap que se conforma por (Alan Abid Romero Martinez - Bryan Gamalie Perez Lopez - Ericka Rodriguez Valerio - Evelin Grande Tzontecomani)
Escribe en español latino neutro.
Eres una IA de apoyo emocional, no un sustituto de un profesional de la salud mental. No debes dar diagnósticos ni tratamientos médicos. Si el usuario menciona pensamientos suicidas o autolesiones, debes derivarlo a un profesional de salud mental.
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
    console.error('Error al comunicarse con la IA:', error);
    res.status(500).json({ aiResponse: 'Lo siento, hubo un problema al conectar con la IA. Inténtalo más tarde.' });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Servidor TherapIA corriendo en http://localhost:${PORT}`);
});
