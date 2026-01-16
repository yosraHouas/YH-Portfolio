import { Mail, Github, Linkedin, Send, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import bgImage from '../assets/ales-nesetril-im7lzjxelhg-unsplash.jpg';

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/submit-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
      }

      // Afficher le popup de succès
      setSubmitStatus('success');
      setShowSuccessModal(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setShowSuccessModal(false);
        setSubmitStatus('idle');
      }, 6000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/yosrahouas',
      label: 'GitHub',
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/yosra-houas',
      label: 'LinkedIn',
    },
    {
      icon: Mail,
      href: 'mailto:houas_yora@hotmail.fr',
      label: 'Email',
    },
  ];

  return (
    <section id="contact" className="py-24 scroll-mt-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-0">
            <div className="lg:col-span-2 lg:pr-12">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
                  {t('contact.title')}
                  <span className="text-teal-600">.</span>
                </h2>
                <div className="w-20 h-0.5 bg-gradient-to-r from-teal-500 to-blue-400 mb-8"></div>

                <h3 className="text-xl font-semibold mb-3 text-slate-700">
                  {t('contact.heading')}
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {t('contact.description')}
                </p>

                <div className="space-y-4 mb-12">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                    <p className="text-slate-700">
                      <span className="font-medium text-slate-800">{t('contact.info.email')}:</span>{' '}
                      <a href="mailto:houas_yora@hotmail.fr" className="text-teal-600 hover:text-teal-700 transition-colors">
                        houas_yora@hotmail.fr
                      </a>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                    <p className="text-slate-700">
                      <span className="font-medium text-slate-800">{t('contact.info.location')}:</span> Montréal, QC
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-4 font-medium">{t('contact.followMe')}</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md hover:scale-105 transition-all duration-300 border border-slate-200"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5 text-slate-600" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-slate-100">
                <h3 className="text-2xl font-bold mb-8 text-slate-800">
                  {t('contact.sendMessage')}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all"
                        placeholder={t('contact.name')}
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all"
                        placeholder={t('contact.email')}
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all"
                      placeholder={t('contact.subject')}
                    />
                  </div>

                  <div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all resize-none"
                      placeholder={t('contact.message')}
                    ></textarea>
                  </div>

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-3.5 px-10 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? t('contact.sending') || 'Envoi en cours...' : t('contact.send')}
                      <Send className="w-5 h-5" />
                    </button>

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        {t('contact.error') || 'Une erreur est survenue. Veuillez réessayer.'}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-scaleIn"
            style={{ animation: 'scaleIn 0.4s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                {t('contact.successTitle') || 'Message Envoyé!'}
              </h3>

              <p className="text-slate-600 leading-relaxed mb-6">
                {t('contact.success')}
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              >
                {t('contact.close') || 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </section>
  );
}
