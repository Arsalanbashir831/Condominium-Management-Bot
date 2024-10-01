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
  Input,
  Textarea,
  useDisclosure,
  Box,
  VStack,
  useToast,
  List,
  ListItem, Select, Checkbox
} from '@chakra-ui/react';
import { BACKEND_URL } from '../../Constant';
import { useRecoilState } from 'recoil';
import { refreshState } from '../../atoms/refreshState';

const AddNewTicketModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [priority, setPriority] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [allowAutomation, setAllowAutomation] = useState(false);
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [technicianList, setTechnicianList] = useState([]);
  const [refresh, setRefresh] = useRecoilState(refreshState);
  const [isLoading, setLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [condominiumList, setCondominiumList] = useState([]);
  const [condominiumSearch, setCondominiumSearch] = useState('');
  const [filteredCondominium, setFilteredCondominium] = useState([]);
  const [condo, setCondo] = useState('');

  useEffect(() => {
    const fetchCondominium = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/condominium/`, {
          method: 'GET'
        });
        if (response.ok) {
          const data = await response.json();
          setCondominiumList(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUsers = async () => {
      if (condo?.id) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/user/condo/${condo.id}`, {
            method: 'GET',
          });
          if (response.ok) {
            const data = await response.json();
            setUserList(data);
            setFilteredUsers(data);  // Initially set filtered users to the entire list
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    const fetchAllTechnicians = async () => {
      if (user?.condominium?.id) {
        try {
          setLoading(true);
          const response = await fetch(`${BACKEND_URL}/api/technician/byCondominium?condominiumId=${user.condominium.id}`, {
            method: 'GET',
          });
          if (response.ok) {
            const data = await response.json();
            setTechnicianList(data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCondominium();
    fetchUsers();
    fetchAllTechnicians();
  }, [condo, user?.condominium?.id]);

  const handleCondominiumSearch = (e) => {
    const query = e.target.value;
    setCondominiumSearch(query);

    if (query.length > 0) {
      const filtered = condominiumList.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCondominium(filtered);
    } else {
      setFilteredCondominium([]);
    }
  };

  const handleUserSearch = (e) => {
    const query = e.target.value;
    setUserSearch(query);

    if (query.length > 0) {
      const filtered = userList.filter((u) =>
        `${u.name} ${u.surname}`.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(userList); // Show all users if search query is cleared
    }
  };

  const handleCondoSelect = (selectedCondo) => {
    setCondo(selectedCondo);
    setCondominiumSearch(`${selectedCondo.name}`);
    setFilteredCondominium([]);  // Hide dropdown after selection
  };

  const handleUserSelect = (selectedUser) => {
    setUser(selectedUser);
    setUserSearch(`${selectedUser.name} ${selectedUser.surname}`);
    setFilteredUsers([]);  // Hide dropdown after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/ticket/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        toast({
          title: 'Ticket Created.',
          description: 'Your ticket has been submitted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Submission Failed.',
          description: 'There was an error submitting your ticket.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      setRefresh(!refresh);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Occurred.',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUser(null);
      setTechnician(null);
      setPriority('');
      setAllowAutomation(false);
      setProblemStatement('');
      setUserSearch('');
      onClose();
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
      apri un ticket
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Aggiungi un nuovo biglietto</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Selezionare il condominio</FormLabel>
                  <Input
                    placeholder="Selezionare il condominio"
                    value={condominiumSearch}
                    onChange={handleCondominiumSearch}
                  />
                  {filteredCondominium.length > 0 && (
                    <Box
                      border="1px solid #e2e8f0"
                      borderRadius="md"
                      mt={2}
                      maxHeight="150px"
                      overflowY="auto"
                      zIndex={1000}
                    >
                      <List>
                        {filteredCondominium.map((condo) => (
                          <ListItem
                            key={condo.id}
                            p={2}
                            _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                            onClick={() => handleCondoSelect(condo)}
                          >
                            {condo.name}
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </FormControl>

                {condo && (
                  <FormControl isRequired>
                    <FormLabel>Selezionare l'utente</FormLabel>
                    <Input
                      placeholder="Ricerca di un utente per nome"
                      value={userSearch}
                      onChange={handleUserSearch}
                    />
                    {filteredUsers.length > 0 && (
                      <Box
                        border="1px solid #e2e8f0"
                        borderRadius="md"
                        mt={2}
                        maxHeight="150px"
                        overflowY="auto"
                        zIndex={1000}
                      >
                        <List>
                          {filteredUsers.map((user) => (
                            <ListItem
                              key={user.id}
                              p={2}
                              _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                              onClick={() => handleUserSelect(user)}
                            >
                              {user.name} {user.surname}
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </FormControl>
                )}

                <FormControl isRequired>
                  <FormLabel>Seleziona il tecnico</FormLabel>
                  <Select
                    placeholder="Seleziona il tecnico"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                  >
                    {technicianList.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.CompanyName} 
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Priorità</FormLabel>
                  <Select
                    placeholder="Selezionare la priorità"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Basso</option>
                    <option value="Medium">Medio</option>
                    <option value="High">Alto</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Descrizione del problema</FormLabel>
                  <Textarea
                    placeholder="  ⁠Descrivi il problema "
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <Checkbox
                    isChecked={allowAutomation}
                    onChange={(e) => setAllowAutomation(e.target.checked)}
                  />
                  <FormLabel ml={2}>⁠Contatta il tecnico automaticamente</FormLabel>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading}>
              Invia
              </Button>
              <Button variant="ghost" onClick={onClose}>
              Annulla
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddNewTicketModal;
