import { Modal, Button } from 'react-bootstrap';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeViewer.css'; 

function CodeViewer({ file, onClose }) {
  return (
    <Modal 
      show={!!file} 
      onHide={onClose} 
      dialogClassName="modal-90w" // Clase personalizada
      centered
    >
      <Modal.Header closeButton closeVariant="white" className="bg-dark text-white">
        <Modal.Title>{file?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {file && (
          <SyntaxHighlighter 
            language={file.language} 
            style={atomDark}
            showLineNumbers
            lineNumberStyle={{ minWidth: '2.5em' }}
            customStyle={{ 
              margin: 0,
              height: '70vh',
              borderRadius: '0 0 0.3rem 0.3rem'
            }}
          >
            {file.content}
          </SyntaxHighlighter>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-dark">
        <Button variant="outline-light" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default CodeViewer;