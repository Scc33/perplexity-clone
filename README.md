# Perplexity Clone

A modern chat interface built with Next.js and Google Gemini AI, inspired by Perplexity's design with intelligent web search integration.

## Future Improvements

The following features are planned for future development:

### 🔐 Authentication & User Management
- User authentication with cloud-based accounts
- Multi-device synchronization
- Team collaboration features

### 🤖 Multi-Model Support
- Support for multiple AI providers (OpenAI, Anthropic, etc.)
- Model comparison and performance tracking
- Custom model integration

### 🎨 Enhanced UI & Experience
- Rich media support (images, videos, interactive content)
- Code syntax highlighting and export options
- Custom themes and UI customization

### 🔍 Advanced Search & Analytics
- Search filters and history management
- Usage analytics and performance monitoring
- Additional search engine support

### 🔧 Developer Features
- API documentation and webhook support
- Plugin system for custom integrations
- User-defined prompts and templates

### Chat Streaming
- Replace the current async / await API model with a streaming approach
- Improve latency on the UI

## Features

- 🤖 **AI-Powered Chat**: Powered by Google Gemini 2.0 Flash
- 🔍 **Intelligent Web Search**: Automatic search integration for current information and facts
- 💬 **Conversation Management**: Create and manage multiple chat conversations
- 💾 **Persistent Storage**: All conversations and messages are saved locally and persist across browser sessions
- 🗑️ **Conversation Deletion**: Delete conversations you no longer need with a simple click
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Real-time Responses**: Get instant AI responses with loading states
- 🎨 **Modern UI**: Clean, dark theme interface with smooth animations
- 🔄 **Smart Timestamps**: Automatic timestamp updates and relative time display
- 📝 **Markdown Support**: Rich text formatting for AI responses
- 👤 **User Profiles**: Manage your profile information

## Getting Started

### Prerequisites

- Node.js 18+ 
- Google Gemini API key
- SerpAPI key (for web search functionality)

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
   
   # SerpAPI Key (for web search functionality)
   # Get your API key from: https://serpapi.com/
   SERP_API_KEY=your_serpapi_key_here
   ```

4. **Get your API keys**
   - **Google Gemini**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and create a new API key
   - **SerpAPI**: Visit [SerpAPI](https://serpapi.com/) to get an API key for web search functionality

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

- **Start a new chat**: Click the "New Chat" button in the sidebar
- **Send messages**: Type your question and press Enter or click the send button
- **Web search integration**: The AI automatically determines when to search the web for current information
- **View conversations**: All your conversations are saved in the sidebar and persist across browser sessions
- **Delete conversations**: Hover over a conversation in the sidebar and click the trash icon to delete it
- **Manage profile**: Access your profile settings from the sidebar
- **Mobile navigation**: Use the hamburger menu on mobile devices

## How It Works

### AI + Search Integration

The application intelligently combines AI responses with web search:

1. **Search Analysis**: When you send a message, the AI analyzes whether current information would be helpful
2. **Automatic Search**: If needed, the system performs a Google search using SerpAPI
3. **Enhanced Responses**: The AI incorporates search results to provide up-to-date, accurate information
4. **Smart Fallbacks**: If search fails, the AI still provides helpful responses

### Search Triggers

The system automatically searches when your question involves:
- Current events or recent information
- Time-sensitive data or statistics
- Product reviews or recommendations
- Information about specific people, places, or events
- Facts that might be outdated

## Data Persistence

This application uses **localStorage** to persist your chat data:

- **Conversations**: All your chat conversations are automatically saved
- **Messages**: Complete message history for each conversation is preserved
- **User Profiles**: Your profile information is stored locally
- **Cross-session**: Data persists even when you close and reopen your browser
- **Privacy**: All data is stored locally on your device - nothing is sent to external servers except for AI API calls and web searches
- **Automatic Updates**: Conversation timestamps and titles are automatically updated

### Storage Management

The app includes several storage management features:

- **Automatic Saving**: Data is saved in real-time as you chat
- **Error Handling**: Graceful fallbacks if localStorage is unavailable
- **Storage Info**: Built-in utilities to monitor storage usage
- **Data Cleanup**: Easy conversation deletion to free up space

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **AI Integration**: Google Gemini 2.0 Flash via @ai-sdk/google
- **Web Search**: SerpAPI for Google search integration
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **State Management**: React useState
- **Data Persistence**: Browser localStorage with custom utilities
- **Markdown Rendering**: react-markdown for rich text display

## Project Structure

```
perplexity-clone/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts           # Gemini API endpoint
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Main chat interface
│   │   └── profile/
│   │       └── page.tsx               # User profile page
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatClient.tsx         # Main chat component with search integration
│   │   │   ├── ChatHeader.tsx         # Chat header with title
│   │   │   ├── ChatHistory.tsx        # Message history container
│   │   │   ├── ChatInput.tsx          # Message input component
│   │   │   ├── ChatMessage.tsx        # Individual message component
│   │   │   ├── ChatSkeleton.tsx       # Loading skeleton for messages
│   │   │   ├── MarkdownResponse.tsx   # Markdown rendering for AI responses
│   │   │   └── WelcomeMessage.tsx     # Welcome screen
│   │   ├── ProfilePage/
│   │   │   ├── AdditionalInfo.tsx     # Additional profile information
│   │   │   ├── ProfileForm.tsx        # Profile form component
│   │   │   ├── ProfileHeader.tsx      # Profile page header
│   │   │   └── SubmitButton.tsx       # Profile form submit button
│   │   └── Sidebar/
│   │       ├── NewChatButton.tsx      # New chat button
│   │       ├── SideBar.tsx            # Main sidebar component
│   │       ├── SidebarConversationsList.tsx  # Conversations list
│   │       ├── SidebarFooter.tsx      # Sidebar footer
│   │       └── SidebarHeader.tsx      # Sidebar header
│   ├── services/
│   │   ├── AiRequestService.ts        # AI service with search integration
│   │   └── SearchService.ts           # Web search service using SerpAPI
│   ├── prompts/
│   │   └── Prompts.ts                 # AI prompts for search analysis and enhancement
│   └── types/
│       └── index.ts                   # TypeScript type definitions
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
- [SerpAPI Documentation](https://serpapi.com/docs)
- [Vercal AI](https://github.com/vercel/ai)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Browser localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Don't forget to add your environment variables in your Vercel project settings:
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `SERP_API_KEY`

## Privacy & Data

- All chat data is stored locally in your browser's localStorage
- No conversation data is sent to external servers except for AI API calls and web searches
- Web searches are performed through SerpAPI and are not stored locally
- You can delete conversations at any time to remove them from local storage
- Data persists across browser sessions but is device-specific
