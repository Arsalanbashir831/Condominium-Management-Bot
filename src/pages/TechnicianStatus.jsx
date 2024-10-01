import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Select, useToast } from '@chakra-ui/react';
import { BACKEND_URL } from '../Constant';
import { Box, Heading, Text, Icon } from '@chakra-ui/react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';


const TechnicianStatus = () => {
  const { ticketId, statusId: initialStatusId } = useParams(); // Get ticketId and statusId from the route
  const [statusId, setStatusId] = useState(initialStatusId); // Store selected statusId
  const [isUpdating, setIsUpdating] = useState(false); // Loading state
  const toast = useToast(); // For showing notifications


  const sendMailForRejection = async ()=>{
    try {
      const response = await fetch (`${BACKEND_URL}/api/ticket/rejectTicket/${ticketId}`,{
        method:'POST',
      })
      if (response.ok){
        console.log('rejection mail sended');
        
      }
    } catch (error) {
      console.log('got some issues');
      
    }
  }
  // Function to update ticket status
  const updateTicketStatus = async (status) => {
    setIsUpdating(true); // Set loading state to true

    try {
      const token = localStorage.getItem('authToken'); // Get token if required

      const response = await fetch(`${BACKEND_URL}/api/ticket/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statusId: status }), // Pass statusId in request body
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Successo',
          description: 'Stato del ticket aggiornato con successo',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        if (statusId==='3' || statusId===3) {
          await sendMailForRejection()
        }
        
      } else {
        toast({
          title: 'Errore',
          description: data.message || 'Impossibile aggiornare lo stato del ticket',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante l\'aggiornamento dello stato del ticket',
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
    <Box
      maxW="md"
      mx="auto"
      mt={8}
      p={6}
      bg="gray.50"
      borderRadius="lg"
      shadow="md"
      textAlign="center"
    >
      {statusId === "2" ? (
        <Icon as={AiOutlineCheckCircle} w={16} h={16} color="green.500" />
      ) : (
        <Icon as={AiOutlineCloseCircle} w={16} h={16} color="red.500" />
      )}

      <Heading as="h1" size="lg" mt={4}>
        {statusId === "2" ? 'Ticket Approvato' : 'Ticket Rifiutato'}
      </Heading>

      <Text mt={2} color="gray.600">
        {statusId === "2"
          ? 'La tua richiesta di approvazione del ticket è stata accettata con successo.'
          : 'La tua richiesta di rifiuto è stata accettata.'}
      </Text>
    </Box>
  );
};

export default TechnicianStatus;
