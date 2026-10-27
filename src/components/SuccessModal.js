
import React from 'react';
import { Modal, ModalHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const PaymentSuccessModal = ({ isOpen }) => {
  return (
    <Modal isOpen={isOpen}  centered={true} >
      <ModalHeader className="bg-dark text-white" style={{ border: 'none' }}>
        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />  Form submitted successfully
      </ModalHeader>

    </Modal>
  );
};

export default PaymentSuccessModal;
