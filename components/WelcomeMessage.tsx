interface WelcomeMessageProps {
  onSuggestionClick: (suggestion: string) => void;
}

export default function WelcomeMessage({
  onSuggestionClick,
}: WelcomeMessageProps) {
  const suggestions = [
    "What's the latest in AI technology?",
    "How do I learn React?",
    "Explain quantum computing",
    "Best practices for web development",
  ];

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white font-bold text-xl">P</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Welcome to Perplexity Clone
      </h3>
      <p className="text-gray-400 mb-6">
        Ask me anything and I&apos;ll help you find the answers.
      </p>

      {/* Quick Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="p-3 text-left bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <div className="text-sm font-medium">{suggestion}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
