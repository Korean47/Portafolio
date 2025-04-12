import { Card, Button, ListGroup, Badge } from 'react-bootstrap';
import './ProjectCard.css'; // Nuevo archivo CSS

function ProjectCard({ project, onFileSelect }) {
    return (
      <Card className="project-card-code-only">
        <Card.Body>
          <Card.Title>{project.name}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            {project.type} • {project.techs.join(' • ')}
          </Card.Subtitle>
          
          <Card.Text>{project.description}</Card.Text>
          
          <ListGroup variant="flush">
            {project.files.map(file => (
              <ListGroup.Item 
                key={file.name} 
                action 
                onClick={() => onFileSelect(file)}
                className="code-file-item"
              >
                <div>
                  <strong>{file.name}</strong>
                  <span className="badge bg-secondary ms-2">{file.type}</span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  }
export default ProjectCard;