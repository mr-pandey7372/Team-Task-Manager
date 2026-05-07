import Modal from './Modal';

const ProjectModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </Modal>
  );
};

export default ProjectModal;
