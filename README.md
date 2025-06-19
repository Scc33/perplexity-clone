# Perplexity Clone

A modern chat interface built with Next.js and Google Gemini AI, inspired by Perplexity's design.

## Features

- 🤖 **AI-Powered Chat**: Powered by Google Gemini Pro
- 💬 **Conversation Management**: Create and manage multiple chat conversations
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Real-time Responses**: Get instant AI responses with loading states
- 🎨 **Modern UI**: Clean, dark theme interface with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- Google Gemini API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd perplexity-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # Google Gemini API Key
   # Get your API key from: https://makersuite.google.com/app/apikey
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

4. **Get your Google Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key and paste it in your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

- **Start a new chat**: Click the "New Chat" button in the sidebar
- **Send messages**: Type your question and press Enter or click the send button
- **View conversations**: All your conversations are saved in the sidebar
- **Mobile navigation**: Use the hamburger menu on mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI Integration**: Google Gemini Pro via @ai-sdk/google
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React useState

## Project Structure

```
perplexity-clone/
├── app/
│   ├── api/chat/route.ts    # Gemini API endpoint
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main chat interface
├── components/
│   ├── ChatHeader.tsx       # Chat header with title
│   ├── ChatHistory.tsx      # Message history container
│   ├── ChatInput.tsx        # Message input component
│   ├── ChatMessage.tsx      # Individual message component
│   ├── SideBar.tsx          # Conversation sidebar
│   └── WelcomeMessage.tsx   # Welcome screen
└── types/
    └── index.ts             # TypeScript type definitions
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Google AI SDK](https://ai.google.dev/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Don't forget to add your `GOOGLE_GENERATIVE_AI_API_KEY` environment variable in your Vercel project settings.
