# EduAI

A hackathon project that uses AI to enhance educational experiences.

## Features

- AI-powered tutoring assistant
- Personalized learning recommendations
- Study material summarization
- Interactive quizzes with AI feedback

## Tech Stack

- Node.js
- Express.js
- OpenAI API

## Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OpenAI API key to .env

# Run the development server
npm run dev
```

## API Endpoints

- POST /api/tutor - Get AI tutoring on a topic
- POST /api/summarize - Summarize educational material
- POST /api/quiz - Generate interactive quizzes
- POST /api/recommend - Get personalized learning recommendations

## Future Enhancements

- User authentication
- Progress tracking
- Integration with learning management systems
- Mobile app development 