import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { BACKEND_URL } from '../../Constant';
import { useRecoilState } from 'recoil';
import { refreshState } from '../../atoms/refreshState';

const CloseTicketModal = ({ isOpen, selectedRow, onClose }) => {
  const toast = useToast(); // Initialize toast
const [refresh , setRefresh] = useRecoilState(refreshState)
  const handleConfirmClose = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/ticket/${selectedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isArchieve: true,
        }),
      });

      if (response.ok) {
        // Show success toast
        toast({
          title: "Ticket Closed.",
          description: "The ticket has been successfully closed.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setRefresh(!refresh)
      } else {
        const errorData = await response.json();
        // Show error toast with the message from the server
        toast({
          title: "Error Closing Ticket.",
          description: errorData.message || "Unable to close the ticket.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      // Show generic error toast
      toast({
        title: "Error.",
        description: "An error occurred while closing the ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    
    console.log("Ticket closed for:", selectedRow);
    onClose(); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Close Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Are you sure you want to close this ticket? This action cannot be undone.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleConfirmClose}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CloseTicketModal;
