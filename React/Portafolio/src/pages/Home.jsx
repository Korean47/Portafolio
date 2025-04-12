import { Card, Button, Row, Col } from 'react-bootstrap';
import './Home.css'; // Archivo para estilos personalizados

function Home() {
  return (
    <div className="home-container">
      {/* Sección Hero (tu presentación visual) */}
      <Card className="hero-card text-center mx-auto">
        <Card.Img 
          variant="top" 
          src="./src/yo.jpeg" 
          className="profile-img" 
        />
        <Card.Body>
          <Card.Title className="fw-bold">¡Hola! Soy Daniel Arellano</Card.Title>
          <Card.Text className="tagline">
            Ingeniero en Sistemas | Especialista en IT | Técnico de Sistemas
          </Card.Text>
          <Button variant="primary" href="/about" className="me-2">
            Mi experiencia
          </Button>
          <Button variant="outline-primary" href="/projects">
            Ver proyectos
          </Button>
        </Card.Body>
      </Card>

      {/* Sección de habilidades rápidas (opcional) */}
      <Row className="skills-section justify-content-center mt-5">
        <Col md={8} className="text-center">
          <h4 className="mb-4">Tecnologías que domino</h4>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <span className="skill-badge">C#</span>
            <span className="skill-badge">Python</span>
            <span className="skill-badge">ASP.NET Core</span>
            <span className="skill-badge">React</span>
            <span className="skill-badge">SQL</span>
            <span className="skill-badge">Redes</span>
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default Home;