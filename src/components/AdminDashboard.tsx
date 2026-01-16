import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, Users, Eye, Calendar, ArrowLeft, MessageSquare, Mail, User, CheckCircle2 } from 'lucide-react';

interface DailyStat {
  date: string;
  total_views: number;
  unique_visitors: number;
  pages_visited: number;
}

interface PageStat {
  page_path: string;
  view_count: number;
  unique_visitors: number;
  last_viewed: string;
}

interface TotalStats {
  total_views: number;
  total_unique_visitors: number;
  today_views: number;
}

interface ChatMessage {
  id: string;
  visitor_name: string;
  visitor_email: string;
  message: string;
  created_at: string;
  read: boolean;
  session_id: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  replied: boolean;
}

export default function AdminDashboard() {
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [pageStats, setPageStats] = useState<PageStat[]>([]);
  const [totalStats, setTotalStats] = useState<TotalStats>({
    total_views: 0,
    total_unique_visitors: 0,
    today_views: 0,
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchMessages();
    fetchContactMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const { data } = await supabase
        .from('users_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setContactMessages(data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('id', messageId);

      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const markAsReplied = async (messageId: string) => {
    try {
      await supabase
        .from('users_messages')
        .update({ replied: true })
        .eq('id', messageId);

      setContactMessages(contactMessages.map(msg =>
        msg.id === messageId ? { ...msg, replied: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as replied:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: daily } = await supabase
        .from('daily_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      const { data: pages } = await supabase
        .from('page_stats')
        .select('*');

      const { data: allViews } = await supabase
        .from('page_views')
        .select('visitor_ip, created_at');

      if (daily) setDailyStats(daily);
      if (pages) setPageStats(pages);

      if (allViews) {
        const uniqueVisitors = new Set(allViews.map(v => v.visitor_ip)).size;
        const today = new Date().toISOString().split('T')[0];
        const todayViews = allViews.filter(v =>
          v.created_at.startsWith(today)
        ).length;

        setTotalStats({
          total_views: allViews.length,
          total_unique_visitors: uniqueVisitors,
          today_views: todayViews,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => window.location.href = '/'}
          className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Portfolio
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 size={40} className="text-purple-400" />
            Portfolio Analytics
          </h1>
          <p className="text-gray-400">Track your portfolio's performance and visitor engagement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="text-blue-400" size={28} />
              <h3 className="text-lg font-semibold">Total Views</h3>
            </div>
            <p className="text-4xl font-bold text-blue-400">{totalStats.total_views}</p>
            <p className="text-sm text-gray-400 mt-2">All time page views</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Users className="text-green-400" size={28} />
              <h3 className="text-lg font-semibold">Unique Visitors</h3>
            </div>
            <p className="text-4xl font-bold text-green-400">{totalStats.total_unique_visitors}</p>
            <p className="text-sm text-gray-400 mt-2">Individual visitors</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-purple-400" size={28} />
              <h3 className="text-lg font-semibold">Today's Views</h3>
            </div>
            <p className="text-4xl font-bold text-purple-400">{totalStats.today_views}</p>
            <p className="text-sm text-gray-400 mt-2">Views in last 24 hours</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="text-orange-400" size={28} />
              <h3 className="text-lg font-semibold">Chat Messages</h3>
            </div>
            <p className="text-4xl font-bold text-orange-400">{messages.length}</p>
            <p className="text-sm text-gray-400 mt-2">{messages.filter(m => !m.read).length} unread</p>
          </div>
        </div>

        <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Mail className="text-teal-400" />
            Contact Form Messages ({contactMessages.length})
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {contactMessages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No contact messages yet</p>
            ) : (
              contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-white/5 rounded-lg p-5 hover:bg-white/10 transition-colors ${
                    !msg.replied ? 'border-l-4 border-teal-400' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-full p-2">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{msg.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail size={14} />
                          <a href={`mailto:${msg.email}`} className="hover:text-teal-400 transition-colors">
                            {msg.email}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-gray-400 font-semibold mb-1">Subject:</p>
                    <p className="text-white">{msg.subject}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 mb-3">
                    <p className="text-gray-200 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  {!msg.replied && (
                    <button
                      onClick={() => markAsReplied(msg.id)}
                      className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      Mark as replied
                    </button>
                  )}
                  {msg.replied && (
                    <span className="text-sm text-green-400 flex items-center gap-1">
                      <CheckCircle2 size={16} />
                      Replied
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="text-orange-400" />
            Chat Widget Messages
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No messages yet</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-white/5 rounded-lg p-5 hover:bg-white/10 transition-colors ${
                    !msg.read ? 'border-l-4 border-orange-400' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-full p-2">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{msg.visitor_name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail size={14} />
                          <a href={`mailto:${msg.visitor_email}`} className="hover:text-orange-400 transition-colors">
                            {msg.visitor_email}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 mb-3">
                    <p className="text-gray-200 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  {!msg.read && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="text-purple-400" />
              Daily Statistics
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dailyStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg p-4 flex justify-between items-center hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{new Date(stat.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-400">{stat.pages_visited} pages visited</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-400">{stat.total_views}</p>
                    <p className="text-sm text-gray-400">{stat.unique_visitors} unique</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="text-blue-400" />
              Page Performance
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pageStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-lg">{stat.page_path || '/'}</p>
                    <span className="text-2xl font-bold text-blue-400">{stat.view_count}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{stat.unique_visitors} unique visitors</span>
                    <span>Last: {new Date(stat.last_viewed).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                      style={{
                        width: `${Math.min((stat.view_count / Math.max(...pageStats.map(p => p.view_count))) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
