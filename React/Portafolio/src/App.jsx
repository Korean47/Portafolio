import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // ¡Nuevo archivo CSS!

function App() {
  return (
    <Router>
      <div className="app-container"> {/* Contenedor principal */}
        <Navbar />
        <main className="main-content"> {/* Contenedor del contenido */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;