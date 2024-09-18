import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import TechnicianCard from './TechnicianCard';
import { BACKEND_URL } from '../Constant';
import { useRecoilState } from 'recoil';
import { refreshState } from '../atoms/refreshState';

const AssignModal = ({ isOpen, onClose, selectedRow }) => {
  const [technicians, setTechnicians] = useState([]);
  const toast = useToast(); // Initialize the toast
const [refresh , setRefresh] = useRecoilState(refreshState)
  const fetchTechnicians = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/technician/swagger`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTechnicians(data);
       
      } else {
        throw new Error('Failed to fetch technicians');
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
      toast({
        title: 'Error fetching technicians',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const [selectedTechnician, setSelectedTechnician] = useState(null);

  const handleModalSubmit = async () => {
    if (!selectedTechnician) {
      toast({
        title: 'No Technician Selected',
        description: 'Please select a technician before assigning.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/ticket/${selectedRow.id}/assign`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ technician_name: selectedTechnician }),
      });

      if (response.ok) {
        toast({
          title: 'Technician Assigned',
          description: `Successfully assigned ${selectedTechnician} to the ticket.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setRefresh(!refresh)
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign technician');
      }
    } catch (error) {
      console.error('Error assigning technician:', error);
      toast({
        title: 'Error Assigning Technician',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Technician</ModalHeader>
        <ModalBody className="overflow-y-auto" style={{ maxHeight: '400px' }}>
          <div className="p-4">
            {technicians.map((tech, index) => (
              <TechnicianCard
                key={index}
                technician={tech}
                isSelected={selectedTechnician === tech.description} 
                onSelect={() => setSelectedTechnician(tech.description)} 
              />
            ))}
          </div>
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
  );
};

export default AssignModal;
