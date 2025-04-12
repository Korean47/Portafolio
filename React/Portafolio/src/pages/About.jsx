import { Container, Row, Col, Card, ProgressBar, Tab, Tabs } from 'react-bootstrap';
import { FaLaptopCode, FaServer, FaGraduationCap } from 'react-icons/fa';
import './About.css'; // Archivo para estilos personalizados

function About() {
  const skills = [
    { name: 'C#', level: 65 },
    { name: 'React', level: 15 },
    { name: 'Python', level: 55 },
    { name: 'ASP.NET Core', level: 35 },
    { name: 'SQL', level: 60 },
    { name: 'Redes', level: 50 },
    { name: 'Soporte', level: 85 }
  ];

  return (
    <Container className="about-section">
      {/* Sección: Descripción personal */}
      <Row className="mb-5">
        <Col lg={8} className="mx-auto text-center">
          <h2 className="section-title">Sobre Mí</h2>
          <p className="lead">
            Soy un apasionado por la tecnología con experiencia en desarrollo de software,
            administración de sistemas e IT. Mi objetivo es crear soluciones que impacten 
            positivamente en las personas.
          </p>
        </Col>
      </Row>

      {/* Sección: Experiencia + Habilidades (Tabs) */}
      <Tabs defaultActiveKey="experience" className="custom-tabs mb-4">
        {/* Pestaña 1: Experiencia */}
        <Tab eventKey="experience" title={<span><FaLaptopCode /> Experiencia</span>} >
          <Card className="p-4">
            <h4>Técnico en Sistemas</h4>
            <p className="text-muted">Prysmian · 2024 - Presente</p>
            <ul>
              <li>Soporte técnico a nivel hardware/software</li>
              <li>Administración de redes</li>
              <li>Desarrollo de herramientas internas con C#, Python y VBA</li>
            </ul>
          </Card>
        </Tab>

        {/* Pestaña 2: Habilidades */}
        <Tab eventKey="skills" title={<span><FaServer /> Habilidades</span>} >
          <Card className="p-4">
            {skills.map((skill, index) => (
              <div key={index} className="mb-3">
                <h5>{skill.name}</h5>
                <ProgressBar 
                  now={skill.level} 
                  label={`${skill.level}%`} 
                  visuallyHidden 
                  className="skill-bar"
                />
              </div>
            ))}
          </Card>
        </Tab>
      </Tabs>

      {/* Sección: Educación */}
      <Row className="mt-5">
        <Col md={6} className="mx-auto">
          <Card className="education-card">
            <Card.Body>
              <Card.Title>🎓 Educación</Card.Title>
              <Card.Text>
                <strong>Ingeniería en Sistemas Computacionales</strong><br />
                TecNM | Tecnológico Nacional de México · 2021 - Presente<br />
                <small className="text-muted">Participación en proyecto de Innovatec</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default About;