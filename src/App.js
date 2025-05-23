import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, padding: '2rem' }}>
        {/* 他のコンテンツ */}
      </main>
      <Footer />
    </div>
  );
}

export default App; 
