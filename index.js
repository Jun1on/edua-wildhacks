const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// AI Tutoring endpoint
app.post('/api/tutor', async (req, res) => {
  try {
    const { topic, question } = req.body;
    
    if (!topic || !question) {
      return res.status(400).json({ error: 'Topic and question are required' });
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are an expert tutor in ${topic}. Provide clear, concise explanations with examples.` },
        { role: "user", content: question }
      ],
    });
    
    res.json({ 
      answer: response.choices[0].message.content,
      topic
    });
  } catch (error) {
    console.error('Tutoring error:', error);
    res.status(500).json({ error: 'Failed to get tutoring response' });
  }
});

// Summarize content endpoint
app.post('/api/summarize', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an educational assistant that summarizes complex material into clear, concise points." },
        { role: "user", content: `Summarize the following educational content: ${content}` }
      ],
    });
    
    res.json({ summary: response.choices[0].message.content });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Failed to summarize content' });
  }
});

// Quiz generation endpoint
app.post('/api/quiz', async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    
    const level = difficulty || 'medium';
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an educational quiz creator. Create 5 multiple choice questions with answers." },
        { role: "user", content: `Create a ${level} difficulty quiz about ${topic}. Format as a JSON array with 'question', 'options', and 'answer' fields.` }
      ],
    });
    
    // Parse the response to ensure it's valid JSON
    try {
      const quizContent = JSON.parse(response.choices[0].message.content);
      res.json({ quiz: quizContent });
    } catch (parseError) {
      res.json({ rawQuiz: response.choices[0].message.content });
    }
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// Learning recommendations endpoint
app.post('/api/recommend', async (req, res) => {
  try {
    const { interests, level } = req.body;
    
    if (!interests || !level) {
      return res.status(400).json({ error: 'Interests and level are required' });
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an educational expert that provides personalized learning recommendations." },
        { role: "user", content: `Recommend learning resources for someone interested in ${interests} at a ${level} level. Provide specific resources like books, courses, websites, and videos.` }
      ],
    });
    
    res.json({ recommendations: response.choices[0].message.content });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`EduAI server running on port ${PORT}`);
}); 