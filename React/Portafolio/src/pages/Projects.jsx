import { useState } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import ProjectCard from './Projects/ProjectCard';
import CodeViewer from './Projects/CodeViewer';
import { projects } from './Projects/data';

function Projects() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <Container className="projects-page py-5"> {/* Añade padding vertical */}
      <h2 className="text-center mb-5">Mis Proyectos</h2>
      
      <Row className="justify-content-center">
        {projects.map(project => (
          <Col key={project.id} xs={12} className="mb-4">
            <ProjectCard project={project} onFileSelect={setSelectedFile} />
          </Col>
        ))}
      </Row>
       {/* Modal para ver código */}
      <CodeViewer 
        file={selectedFile} 
        onClose={() => setSelectedFile(null)} 
      />
    </Container>
  );
}
export default Projects;