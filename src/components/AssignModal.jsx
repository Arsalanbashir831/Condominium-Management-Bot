import { Button,  Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from '@chakra-ui/react'

import React from 'react'

const AssignModal = ({isOpen , onClose , selectedRow }) => {

    const handleModalSubmit = () => {
        console.log('Assigning technician to:', selectedRow);
        onClose();
      };
    
  return (
   <>

<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Technician</ModalHeader>
          <ModalBody>
          
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleModalSubmit}>
              Assign
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
   </>
  )
}

export default AssignModal