import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from 'utilities/constants';
const ConfirmModal = (props) => {
  const { title, show, content, onAction } = props;
  return (
    <Modal
      show={show}
      onHide={() => onAction(MODAL_ACTION_CLOSE)}
      backdrop="static"
      keyboard={false}
      animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => onAction(MODAL_ACTION_CONFIRM)}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => onAction(MODAL_ACTION_CONFIRM)}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
