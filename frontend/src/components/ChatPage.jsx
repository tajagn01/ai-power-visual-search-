import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';

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
  return { min, max, search: query };
}

async function fetchProductsFromAPI({ search, min, max }) {
  try {
    const url = `/api/search?q=${encodeURIComponent(search)}`;
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
      const price = parseFloat(p.price?.toString().replace(/[^\d.]/g, '')) || 0;
      if (price < min || price > max) return false;
      return true;
    });
    // Always show up to 5 products
    return products.slice(0, 5);
  } catch (e) {
    return [];
  }
}

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    setLoading(true);
    // For any product-related query, reply with products
    if (/t-?shirt|phone|bag|sling|polo|tote|watch|samsung|black|white|under|above|between|price|₹|rs\./i.test(input)) {
      const parsed = parseQuery(input);
      const products = await fetchProductsFromAPI(parsed);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-purple-950">
      <header className="flex items-center justify-center py-8 bg-black/40 border-b border-purple-500/20">
        <FaRobot className="h-10 w-10 text-purple-400 mr-3" />
        <h1 className="text-3xl font-bold text-white">Chat with AI</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-2">
        <div className="w-full max-w-xl flex flex-col bg-black/40 rounded-2xl shadow-lg p-4 mt-8 mb-4 min-h-[400px] max-h-[70vh] overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'} mb-2`}>
              <div className={`px-4 py-2 rounded-xl max-w-[80%] text-sm ${msg.sender === 'ai' ? 'bg-purple-700/80 text-white' : 'bg-purple-300 text-black'}`}>
                {msg.type === 'products' ? (
                  <div>
                    <div className="mb-2 text-sm text-gray-200">Here are some products I found for you:</div>
                    <ul className="space-y-3">
                      {msg.products.map((p, i) => (
                        <li key={i} className="bg-gray-800/70 rounded-lg p-3 flex flex-col gap-1 border border-purple-500/20">
                          <div className="font-semibold text-white">{p.title || p.name}</div>
                          <div className="text-xs text-gray-300">{p.description || ''}</div>
                          <div className="text-xs text-purple-300">Brand: {p.brand || p.source || 'Unknown'} | Price: ₹{(p.price || '').toString().replace(/[^\d.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Platform: {p.source || p.brand || 'Unknown'}</div>
                          <a href={p.amazonUrl || p.url || '#'} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 underline">View Product</a>
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
        <form onSubmit={handleSend} className="w-full max-w-xl flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg px-4 py-3 bg-black/60 text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            autoFocus
          />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center">
            <FaPaperPlane className="h-5 w-5" />
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatPage; 