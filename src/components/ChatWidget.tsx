import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase, ChatMessage } from '../lib/supabase';

export default function ChatWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const storedSessionId = localStorage.getItem('chat_session_id');
    const storedName = localStorage.getItem('visitor_name');
    const storedEmail = localStorage.getItem('visitor_email');

    if (storedSessionId && storedName && storedEmail) {
      setSessionId(storedSessionId);
      setVisitorName(storedName);
      setVisitorEmail(storedEmail);
      setHasStartedChat(true);
      loadMessages(storedSessionId);
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      localStorage.setItem('chat_session_id', newSessionId);
    }
  }, []);

  useEffect(() => {
    if (hasStartedChat && sessionId) {
      const channel = supabase
        .channel('chat_messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `session_id=eq.${sessionId}`,
          },
          (payload) => {
            const newMsg = payload.new as ChatMessage;
            setMessages((prev) => [...prev, newMsg]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [hasStartedChat, sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (sid: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sid)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const startChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (visitorName.trim() && visitorEmail.trim()) {
      localStorage.setItem('visitor_name', visitorName);
      localStorage.setItem('visitor_email', visitorEmail);
      setHasStartedChat(true);
      loadMessages(sessionId);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { data, error } = await supabase.from('chat_messages').insert({
      visitor_name: visitorName,
      visitor_email: visitorEmail,
      message: newMessage,
      is_from_admin: false,
      session_id: sessionId,
    }).select();

    if (!error && data && data[0]) {
      setMessages((prev) => [...prev, data[0]]);
      setNewMessage('');
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
          aria-label={t('chat.openChat')}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white border border-slate-200 rounded-lg shadow-2xl flex flex-col z-50">
          <div className="bg-slate-900 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold">{t('chat.title')}</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-slate-800 p-1 rounded transition-colors"
              aria-label={t('chat.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!hasStartedChat ? (
            <div className="flex-1 p-6">
              <p className="text-slate-600 mb-4">{t('chat.welcome')}</p>
              <form onSubmit={startChat} className="space-y-4">
                <div>
                  <label htmlFor="chat-name" className="block text-sm font-medium text-slate-900 mb-2">
                    {t('chat.name')}
                  </label>
                  <input
                    type="text"
                    id="chat-name"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    placeholder={t('chat.namePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="chat-email" className="block text-sm font-medium text-slate-900 mb-2">
                    {t('chat.email')}
                  </label>
                  <input
                    type="email"
                    id="chat-email"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    placeholder={t('chat.emailPlaceholder')}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  {t('chat.startChat')}
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-slate-500 text-sm">{t('chat.noMessages')}</p>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.is_from_admin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.is_from_admin
                          ? 'bg-slate-100 text-slate-900'
                          : 'bg-cyan-500 text-slate-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('chat.messagePlaceholder')}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 p-2 rounded-lg transition-colors"
                    aria-label={t('chat.send')}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
