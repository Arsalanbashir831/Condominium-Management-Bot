import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Select, useToast } from '@chakra-ui/react';
import { BACKEND_URL } from '../Constant';

const TechnicianStatus = () => {
  const { ticketId, statusId: initialStatusId } = useParams(); // Get ticketId and statusId from the route
  const [statusId, setStatusId] = useState(initialStatusId); // Store selected statusId
  const [isUpdating, setIsUpdating] = useState(false); // Loading state
  const toast = useToast(); // For showing notifications


  // Function to update ticket status
  const updateTicketStatus = async (status) => {
    setIsUpdating(true); // Set loading state to true

    try {
      const token = localStorage.getItem('authToken'); // Get token if required

      const response = await fetch(`${BACKEND_URL}/api/ticket/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        //   'Authorization': `Bearer ${token}`, // Pass token if needed
        },
        body: JSON.stringify({ statusId: status }), // Pass statusId in request body
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Ticket status updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to update ticket status',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating ticket status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false); // Set loading state to false
    }
  };

  // useEffect to update status when component mounts
  useEffect(() => {
    if (initialStatusId) {
      updateTicketStatus(initialStatusId); 
    }
  }, [initialStatusId]); 

  return (
    <div>
    <h1>Status Updated</h1>
    </div>
  );
};

export default TechnicianStatus;
