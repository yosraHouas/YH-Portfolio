import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import AdminDashboard from './components/AdminDashboard';
import { usePageViewTracker } from './hooks/usePageViewTracker';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  usePageViewTracker();

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

    const checkInterval = setInterval(() => {
      if (window.location.pathname !== currentPath) {
        setCurrentPath(window.location.pathname);
      }
    }, 100);

    setTimeout(() => clearInterval(checkInterval), 2000);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(checkInterval);
    };
  }, [currentPath]);

  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  let normalizedPath = currentPath;
  if (basePath && currentPath.startsWith(basePath)) {
    normalizedPath = currentPath.slice(basePath.length);
  }
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }
  normalizedPath = normalizedPath.replace(/\/$/, '') || '/';

  if (normalizedPath === '/admin' || normalizedPath.startsWith('/admin')) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default App;
