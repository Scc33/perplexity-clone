# Perplexity Clone

A modern chat interface built with Next.js and Google Gemini AI, inspired by Perplexity's design.

## Features

- 🤖 **AI-Powered Chat**: Powered by Google Gemini Pro
- 💬 **Conversation Management**: Create and manage multiple chat conversations
- 💾 **Persistent Storage**: All conversations and messages are saved locally and persist across browser sessions
- 🗑️ **Conversation Deletion**: Delete conversations you no longer need with a simple click
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Real-time Responses**: Get instant AI responses with loading states
- 🎨 **Modern UI**: Clean, dark theme interface with smooth animations
- 🔄 **Smart Timestamps**: Automatic timestamp updates and relative time display

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
- **View conversations**: All your conversations are saved in the sidebar and persist across browser sessions
- **Delete conversations**: Hover over a conversation in the sidebar and click the trash icon to delete it
- **Mobile navigation**: Use the hamburger menu on mobile devices

## Data Persistence

This application uses **localStorage** to persist your chat data:

- **Conversations**: All your chat conversations are automatically saved
- **Messages**: Complete message history for each conversation is preserved
- **Cross-session**: Data persists even when you close and reopen your browser
- **Privacy**: All data is stored locally on your device - nothing is sent to external servers except for AI API calls
- **Automatic Updates**: Conversation timestamps and titles are automatically updated

### Storage Management

The app includes several storage management features:

- **Automatic Saving**: Data is saved in real-time as you chat
- **Error Handling**: Graceful fallbacks if localStorage is unavailable
- **Storage Info**: Built-in utilities to monitor storage usage
- **Data Cleanup**: Easy conversation deletion to free up space

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI Integration**: Google Gemini Pro via @ai-sdk/google
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React useState
- **Data Persistence**: Browser localStorage with custom utilities

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
│   ├── SideBar.tsx          # Conversation sidebar with delete functionality
│   └── WelcomeMessage.tsx   # Welcome screen
├── types/
│   └── index.ts             # TypeScript type definitions
└── utils/
    ├── ConversationLocalStorage.ts  # Conversation and message storage
    ├── UserProfileLocalStorage.ts   # User profile storage
    └── LocalStorageUtils.ts         # Generic localStorage utilities
```

## Local Storage API

The application includes a modular set of utilities for managing persistent data:

### Conversation Storage (`ConversationLocalStorage.ts`)
- `saveConversations()` / `loadConversations()` - Manage conversation list
- `saveMessages()` / `loadMessages()` - Manage messages for all conversations
- `saveConversation()` - Save individual conversations
- `saveConversationMessages()` - Save messages for specific conversations
- `deleteConversation()` - Remove conversations and their messages
- `updateConversationTimestamp()` - Update conversation timestamps
- `updateConversationTitle()` - Update conversation titles based on content
- `clearConversationData()` - Clear all conversation data
- `getConversationStorageInfo()` - Get conversation storage usage statistics
- `testConversationLocalStorage()` - Test conversation localStorage functionality

### User Profile Storage (`UserProfileLocalStorage.ts`)
- `saveUserProfile()` / `loadUserProfile()` - Manage user profile data

### Generic Utilities (`LocalStorageUtils.ts`)
- `isLocalStorageAvailable()` - Check if localStorage is available
- `saveToLocalStorage()` / `loadFromLocalStorage()` - Generic storage functions
- `removeFromLocalStorage()` - Remove data from localStorage
- `getTimeAgo()` - Get relative time ago string
- `testLocalStorage()` - Test basic localStorage functionality

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Google AI SDK](https://ai.google.dev/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Browser localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Don't forget to add your `GOOGLE_GENERATIVE_AI_API_KEY` environment variable in your Vercel project settings.

## Privacy & Data

- All chat data is stored locally in your browser's localStorage
- No conversation data is sent to external servers except for AI API calls
- You can delete conversations at any time to remove them from local storage
- Data persists across browser sessions but is device-specific
