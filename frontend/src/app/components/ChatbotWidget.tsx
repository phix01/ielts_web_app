import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { assistantService } from '../services/assistantService';
import { helpService } from '../services/helpService';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'user' | 'assistant'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    assistantService
      .status()
      .then((s) => {
        if (mounted) setConfigured(s.configured);
      })
      .catch(() => {
        if (mounted) setConfigured(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      if (configured === false) {
        // Use local help fallback when assistant is not configured
        const reply = await helpService.ask(text);
        setMessages((m) => [...m, { from: 'assistant', text: reply }]);
      } else {
        try {
          const reply = await assistantService.chat(text);
          setMessages((m) => [...m, { from: 'assistant', text: reply }]);
        } catch (e: any) {
          // fallback to help service
          const reply = await helpService.ask(text);
          setMessages((m) => [...m, { from: 'assistant', text: reply }]);
        }
      }
    } catch (e: any) {
      setError('Assistant failed to respond');
      setMessages((m) => [...m, { from: 'assistant', text: 'Assistant failed to respond' }]);
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || configured === false;

  return (
    <div>
      <div className="fixed right-6 bottom-6 z-50">
        {open && (
          <div className="w-80 bg-white rounded-lg shadow-lg border p-3 mb-2">
            {configured === false && <div className="text-xs text-yellow-600 mb-2">Assistant is not configured on the server. Please set <code>HF_API_KEY</code> in the server environment.</div>}
            <div className="max-h-72 overflow-auto space-y-2 mb-2">
              {messages.length === 0 && <div className="text-sm text-gray-500">Ask me how to use the app.</div>}
              {messages.map((m, idx) => (
                <div key={idx} className={m.from === 'user' ? 'text-right' : 'text-left'}>
                  <div className={m.from === 'user' ? 'inline-block bg-blue-50 text-sm p-2 rounded' : 'inline-block bg-gray-100 text-sm p-2 rounded'}>{m.text}</div>
                </div>
              ))}
            </div>
            {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
            <div className="flex items-center space-x-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about the app..." disabled={disabled} />
              <Button onClick={send} disabled={disabled}>{loading ? '...' : 'Send'}</Button>
            </div>
          </div>
        )}
        <Button onClick={() => setOpen((o) => !o)}>{open ? 'Close Assistant' : 'Help'}</Button>
      </div>
    </div>
  );
}
