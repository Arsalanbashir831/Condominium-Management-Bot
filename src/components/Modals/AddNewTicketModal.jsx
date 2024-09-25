import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  Textarea,
  useDisclosure,
  Box,
  VStack,
  useToast,
  Spinner, // Import useToast
} from '@chakra-ui/react';
import { BACKEND_URL } from '../../Constant';
import { useRecoilState, useRecoilValue } from 'recoil';
import { refreshState } from '../../atoms/refreshState';

const AddNewTicketModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast(); // Initialize toast
  const [user, setUser] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [priority, setPriority] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [allowAutomation, setAllowAutomation] = useState(false);
  const [userList, setUserList] = useState([]);
  const [technicianList, setTechnicianList] = useState([]);
 const [refresh , setRefresh] = useRecoilState(refreshState)
 const [isLoading , setLoading] = useState(false)


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/`, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setUserList(data);
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAllTechnicians = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BACKEND_URL}/api/technician/byCondominium?condominiumId=${user?.condominium?.id}`, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setTechnicianList(data);
        }
      } catch (error) {
        console.log(error);
      } finally{
        setLoading(false)
      }
    };
    fetchAllTechnicians();
    fetchUsers();
  }, [technicianList , user?.condominium?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/ticket/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set content type for JSON
        },
        body: JSON.stringify({
          userId: user.id,
          priority: priority,
          ProblemStatement: problemStatement,
          technicianId: technician,
          IsPermitToAutoMail: allowAutomation,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast({
          title: "Ticket Created.",
          description: "Your ticket has been submitted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Submission Failed.",
          description: "There was an error submitting your ticket.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setRefresh(!refresh)
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Occurred.",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // Reset form
      setUser(null);
      setTechnician(null);
      setPriority('');
      setAllowAutomation(false);
      setProblemStatement('');
      onClose();
    }
  };
console.log(user);

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Add New Ticket
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Ticket</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                {/* Select box for Users */}
                <FormControl isRequired>
                  <FormLabel>Select User</FormLabel>
                  <Select
                    placeholder="Select user"
                    value={JSON.stringify(user)}
                    onChange={(e) => setUser(JSON.parse(e.target.value))}
                  >
                 
                    {userList?.map((data) => (
                      <option key={data.id} value={JSON.stringify(data)}>
                        {data.name} {data.surname}
                      </option>
                    ))}
            
                   
                  </Select>
                </FormControl>

                {/* Select box for Technicians */}
                <FormControl isRequired>
                  <FormLabel>Select Technician</FormLabel>
                  <Select
                    placeholder="Select technician"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                  >
                    {technicianList?.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.CompanyName}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Checkbox for automation permission */}
                <FormControl>
                  <Checkbox
                    isChecked={allowAutomation}
                    onChange={(e) => setAllowAutomation(e.target.checked)}
                  >
                    Allow email automation
                  </Checkbox>
                </FormControl>

                {/* Priority selection box */}
                <FormControl isRequired>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    placeholder="Select priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="urgent">Urgent</option>
                    <option value="not urgent">Not Urgent</option>
                    <option value="fairly urgent">Fairly Urgent</option>
                  </Select>
                </FormControl>

                {/* Problem Statement */}
                <FormControl isRequired>
                  <FormLabel>Problem Statement</FormLabel>
                  <Textarea
                    placeholder="Describe the problem..."
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit" ml={3}>
                Submit Ticket
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddNewTicketModal;
