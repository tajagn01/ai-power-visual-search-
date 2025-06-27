import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import productQuestions from './productQuestions';

const BACKEND_URL = 'https://ai-power-visual-search.onrender.com/api/search';

function parseQuery(query) {
  const q = query.toLowerCase();
  let min = 0, max = Infinity;
  const between = q.match(/between\s*(\d+)\s*(and|to)\s*(\d+)/);
  if (between) {
    min = parseInt(between[1]);
    max = parseInt(between[3]);
  } else {
    const under = q.match(/under\s*[₹rs\.]?\s*(\d+)/);
    if (under) {
      max = parseInt(under[1]);
    }
    const above = q.match(/above\s*[₹rs\.]?\s*(\d+)/);
    if (above) {
      min = parseInt(above[1]);
    }
  }
  // Extract main keyword for search
  const keywordMatch = query.match(/(?:give me|show me|find|search for)?\s*([\w\s-]+)/i);
  let keyword = query;
  if (keywordMatch && keywordMatch[1]) {
    keyword = keywordMatch[1].trim();
  }
  return { min, max, search: keyword };
}

async function fetchProductsFromBackend({ search, min, max }) {
  try {
    const url = `${BACKEND_URL}?q=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    const data = await res.json();
    let products = [];
    if (data.data) {
      products = [
        ...(data.data.amazon || []),
        ...(data.data.newApi || [])
      ];
    }
    // Only filter by price
    products = products.filter(p => {
      const price = parseFloat((p.product_price || p.price || '').toString().replace(/[^\d.]/g, '')) || 0;
      if (price < min || price > max) return false;
      return true;
    });
    // Always show up to 5 products
    return products.slice(0, 5);
  } catch (e) {
    return [];
  }
}

// Build a natural language query from questions and answers
function buildNaturalQuery(category, answers) {
  const questions = productQuestions[category];
  let query = category;
  answers.forEach((ans, i) => {
    if (ans && questions[i]) {
      // Add answer as a phrase, e.g., "Dell (Which company are you interested in?)"
      query += `, ${ans} (${questions[i]})`;
    }
  });
  return query;
}

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionState, setQuestionState] = useState({ category: null, index: 0, answers: [] });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { sender: 'user', text: input }]);
    setInput('');

    // If in the middle of a question flow
    if (questionState.category) {
      const nextIndex = questionState.index + 1;
      const newAnswers = [...questionState.answers, input];
      const questions = productQuestions[questionState.category];
      if (nextIndex < questions.length) {
        setQuestionState({ category: questionState.category, index: nextIndex, answers: newAnswers });
        setMessages(msgs => [...msgs, { sender: 'ai', text: questions[nextIndex] }]);
        setLoading(false);
        return;
      } else {
        // All questions answered, do product search
        setQuestionState({ category: null, index: 0, answers: [] });
        setLoading(true);
        // Combine category and answers for a detailed search query (now natural language)
        const searchQuery = buildNaturalQuery(questionState.category, newAnswers);
        const parsed = parseQuery(searchQuery);
        const products = await fetchProductsFromBackend(parsed);
        setLoading(false);
        if (products && products.length > 0) {
          setMessages(msgs => [...msgs, { sender: 'ai', type: 'products', products }]);
        } else {
          setMessages(msgs => [...msgs, { sender: 'ai', text: "Sorry, I couldn't find any matching products." }]);
        }
        return;
      }
    }

    // Check if input matches a product category
    const lowerInput = input.trim().toLowerCase();
    const matchedCategory = Object.keys(productQuestions).find(cat => lowerInput.includes(cat));
    if (matchedCategory) {
      setQuestionState({ category: matchedCategory, index: 0, answers: [] });
      setMessages(msgs => [...msgs, { sender: 'ai', text: productQuestions[matchedCategory][0] }]);
      setLoading(false);
      return;
    }

    // Fallback: original product search logic
    setLoading(true);
    if (/t-?shirt|phone|bag|sling|polo|tote|watch|samsung|black|white|under|above|between|price|₹|rs\./i.test(input)) {
      const parsed = parseQuery(input);
      const products = await fetchProductsFromBackend(parsed);
      setLoading(false);
      if (products && products.length > 0) {
        setMessages(msgs => [...msgs, { sender: 'ai', type: 'products', products }]);
      } else {
        setMessages(msgs => [...msgs, { sender: 'ai', text: "Sorry, I couldn't find any matching products." }]);
      }
    } else {
      setLoading(false);
      setMessages(msgs => [...msgs, { sender: 'ai', text: "I'm just a demo AI for now!" }]);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-purple-950">
      {/* Header */}
      <header className="flex items-center justify-center py-6 bg-black/70 border-b border-purple-900 w-full shadow-sm">
        <FaRobot className="h-9 w-9 text-purple-400 mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Chat with AI</h1>
      </header>
      {/* Main chat area */}
      <main className="flex-1 flex flex-col w-full h-full">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 bg-black/40">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'} mb-3`}>
              <div className={`px-5 py-3 rounded-2xl max-w-[80%] shadow text-base md:text-sm whitespace-pre-line ${msg.sender === 'ai' ? 'bg-gradient-to-br from-purple-800 to-purple-900 text-white' : 'bg-purple-950 text-purple-100 border border-purple-800'}`}>
                {msg.type === 'products' ? (
                  <div>
                    <div className="mb-2 text-sm text-purple-200">Here are some products I found for you:</div>
                    <ul className="space-y-3">
                      {msg.products.map((p, i) => (
                        <li key={i} className="bg-black/70 rounded-lg p-3 flex flex-col gap-1 border border-purple-900">
                          <div className="font-semibold text-purple-100">{p.title || p.product_title || p.name}</div>
                          <div className="text-xs text-purple-300">{p.description || (p.features ? p.features.join(' ') : 'No description available.')}</div>
                          <div className="text-xs text-purple-400">Brand: {p.brand || p.source || 'Unknown'} | Price: ₹{(p.product_price || p.price || '').toString().replace(/[^\d.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Platform: {p.source || p.brand || 'Amazon'}</div>
                          <a href={p.amazonUrl || p.url || p.product_url || '#'} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-300 underline">View Product</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-center text-purple-300">Searching for products...</div>}
          <div ref={messagesEndRef} />
        </div>
        {/* Input bar */}
        <form onSubmit={handleSend} className="w-full flex items-center gap-2 p-4 bg-black/70 sticky bottom-0 z-10 border-t border-purple-900">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg px-4 py-3 bg-black/80 text-purple-100 border border-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700 text-base md:text-sm shadow-sm"
            autoFocus
          />
          <button type="submit" className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors duration-150 shadow">
            <FaPaperPlane className="h-5 w-5" />
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatPage; 