import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaMagic, FaPalette, FaLightbulb, FaStar } from 'react-icons/fa';

const DesignChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm your AI design assistant. I can help you with creative suggestions for your designs, color combinations, layout ideas, and much more! What would you like to create today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Design suggestions database
  const designSuggestions = {
    colors: [
      "Try using a monochromatic color scheme with different shades of blue for a calming effect",
      "Consider complementary colors like orange and blue for high contrast and visual appeal",
      "Use an analogous color scheme (colors next to each other on the color wheel) for harmony",
      "Try a triadic color scheme - three colors equally spaced on the color wheel for vibrancy"
    ],
    layouts: [
      "Use the rule of thirds to create balanced and visually appealing compositions",
      "Consider the golden ratio (1.618:1) for naturally pleasing proportions",
      "Try asymmetrical layouts for dynamic and modern designs",
      "Use whitespace strategically to guide the viewer's attention"
    ],
    typography: [
      "Pair a serif font for headings with a sans-serif for body text for good readability",
      "Use font sizes that follow a clear hierarchy - headings should be significantly larger",
      "Consider line height (1.4-1.6) for optimal reading experience",
      "Limit your design to 2-3 font families to maintain consistency"
    ],
    general: [
      "Focus on the user's journey and create a clear visual hierarchy",
      "Use consistent spacing and alignment throughout your design",
      "Consider accessibility - ensure good contrast ratios for text",
      "Test your design on different screen sizes for responsive behavior"
    ]
  };

  const getRandomSuggestion = (category) => {
    const suggestions = designSuggestions[category] || designSuggestions.general;
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const generateResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Simple keyword-based responses
    if (message.includes('color') || message.includes('colour')) {
      return {
        text: getRandomSuggestion('colors'),
        suggestions: ['Color Harmony', 'Contrast Tips', 'Brand Colors']
      };
    }

    if (message.includes('layout') || message.includes('arrangement') || message.includes('structure')) {
      return {
        text: getRandomSuggestion('layouts'),
        suggestions: ['Grid Systems', 'Visual Hierarchy', 'Responsive Design']
      };
    }

    if (message.includes('font') || message.includes('text') || message.includes('typography')) {
      return {
        text: getRandomSuggestion('typography'),
        suggestions: ['Font Pairing', 'Readability', 'Font Sizes']
      };
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        text: "Hello! I'm excited to help you with your design project. What specific area would you like suggestions for?",
        suggestions: ['Color Schemes', 'Layout Ideas', 'Typography', 'General Design Tips']
      };
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return {
        text: "You're very welcome! I'm here whenever you need more design inspiration. Feel free to ask about anything!",
        suggestions: ['More Suggestions', 'Specific Elements', 'Design Principles']
      };
    }

    // Default responses for general queries
    const responses = [
      "That's an interesting design challenge! Here are some thoughts to consider...",
      "Great question! Let me share some design principles that might help...",
      "I love exploring creative solutions! Here's what I recommend...",
      "That's a common design consideration. Here's my perspective..."
    ];

    return {
      text: responses[Math.floor(Math.random() * responses.length)] + " " + getRandomSuggestion('general'),
      suggestions: ['Color Theory', 'Layout Principles', 'Typography Basics', 'Design Trends']
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: response.text,
        suggestions: response.suggestions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <FaRobot className="text-2xl text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Design Assistant
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get instant design suggestions, color recommendations, and creative inspiration for your projects
          </p>
        </div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'bot' && (
                        <FaRobot className="text-purple-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        {message.suggestions && (
                          <div className="mt-3 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs bg-white bg-opacity-20 rounded px-2 py-1 hover:bg-opacity-30 transition-colors"
                              >
                                <FaStar className="inline mr-1" />
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl max-w-xs">
                    <div className="flex items-center gap-2">
                      <FaRobot className="text-purple-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="border-t border-gray-100 p-4">
              <p className="text-sm text-gray-600 mb-3">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {['Color combinations', 'Layout ideas', 'Typography tips', 'Design principles'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full transition-colors border border-purple-200"
                  >
                    <FaLightbulb className="inline mr-1" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about design..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>

          {/* Design Tips Section */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaPalette className="text-red-500" />
                </div>
                <h3 className="font-semibold text-gray-800">Color Theory</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Learn about color harmony, contrast, and how colors affect emotions and user behavior in your designs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaMagic className="text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-800">Layout Magic</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Discover composition techniques, grid systems, and visual hierarchy principles for stunning layouts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaStar className="text-green-500" />
                </div>
                <h3 className="font-semibold text-gray-800">Typography</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Master font selection, sizing, spacing, and readability to create impactful text-based designs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignChatPage;
