import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';

const ContactModal = ({ isOpen, onClose, technician }) => {
  if (!technician) return null; 

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Contact Technician</ModalHeader>
        <ModalBody>
          <Text mb={2}>
            <strong>Description:</strong> {technician.description}
          </Text>
          <Text mb={2}>
            <strong>Contact Number:</strong> {technician.contactNumber}
          </Text>
          <Text mb={2}>
            <strong>Email:</strong> {technician.email || 'Not provided'}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ContactModal;
