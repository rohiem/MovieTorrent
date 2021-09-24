import { Modal } from "react-bootstrap";

function Modals({ props, children }) {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Login </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">{children}</Modal.Body>
    </Modal>
  );
}
export default Modals;
