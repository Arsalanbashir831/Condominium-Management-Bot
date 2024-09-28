import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Divider,
  useToast, // Import useToast
} from "@chakra-ui/react";
import { BACKEND_URL } from "../../Constant";
import { useRecoilState } from "recoil";
import { refreshState } from "../../atoms/refreshState";

const EditModal = ({ isOpen, onClose, selectedRow }) => {
  const [formData, setFormData] = useState({
    ProblemStatement: "",
    description: "",
    priority: "",
    technicianId: "",
    userId: "",
    contactNumber: "", 
    email: "", 
  status : ""
   
  });
const [refresh , setRefresh] = useRecoilState(refreshState)
const [technicianList , setTechnicianList] = useState([])


  const toast = useToast(); // Initialize toast

console.log(selectedRow);
const fetchTechnicians = async ()=>{
  try {
    const response = await fetch(`${BACKEND_URL}/api/technician/byCondominium?condominiumId=${selectedRow.condominium_id}`,{
      method:"GET"
    })
    if (response.ok) {
      const data = await response.json()
      setTechnicianList(data)
    }
  } catch (error) {
    console.log(error);
    
  }
}


  useEffect(() => {
    fetchTechnicians()
  
    if (selectedRow) {
      setFormData({
        ProblemStatement: selectedRow.problemStatement,
        description: selectedRow.description,
        priority: selectedRow.priority,
        technicianId: selectedRow.technician_id,
        userId: selectedRow.user_id,
        contactNumber: selectedRow.contactNumber || "",
        email: selectedRow.email || "",
        status:selectedRow.status_id,
        condominium_id:selectedRow.condominium_id
        
      });
    }
  }, [selectedRow]);

  const userEditCall = async (email, contactNumber) => {
    if (!email || !contactNumber) {
      console.error("Email and contact number are required.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/user/${selectedRow.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contactNumber }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to update user');
      }

      const data = await response.json();
      console.log("User updated successfully:", data);
      return data;

    } catch (error) {
      console.error("Error updating user:", error.message || error);
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to update user.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/ticket/${selectedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priority: formData.priority,
          ProblemStatement: formData.ProblemStatement,
          description: formData.description,
          statusId:formData.status,  technicianId: formData.technicianId, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating ticket:", errorData.message || "Unknown error");
        // Show error toast
        toast({
          title: "Error",
          description: errorData.message || "Unable to update ticket.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return; 
      }

      await userEditCall(formData.email, formData.contactNumber);

      console.log("Updated Data:", formData);
      toast({
        title: "Success",
        description: "Ticket updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose(); // Close the modal after saving
      setRefresh(!refresh)  
    } catch (error) {
      console.error("Error during save operation:", error);
      // Show error toast
      toast({
        title: "Error",
        description: "An error occurred while saving the ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Modifica Ticket</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl mb={4}>
          <FormLabel>Dichiarazione del Problema</FormLabel>
          <Textarea
            name="ProblemStatement"
            value={formData.ProblemStatement}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Tecnico</FormLabel>
          <Select
            name="technicianId"
            value={formData.technicianId}
            onChange={handleInputChange}
            placeholder="Seleziona Tecnico"
          >
            {technicianList.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.CompanyName}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Descrizione del Ticket</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </FormControl>
  
        <FormControl mb={4}>
          <FormLabel>Priorità</FormLabel>
          <Select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value="">Seleziona priorità</option>
            <option value="urgent">Urgente</option>
            <option value="not urgent">Non urgente</option>
            <option value="fairly urgent">Abbastanza urgente</option>
          </Select>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Stato</FormLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="">Seleziona stato</option>
            <option value="1">In sospeso</option>
            <option value="2">Accettato</option>
            <option value="3">Rifiutato</option>
          </Select>
        </FormControl>
  
        <Divider />
  
        <ModalHeader>Modifica Informazioni Utente</ModalHeader>
  
        <FormControl mb={4}>
          <FormLabel>Numero di Contatto</FormLabel>
          <Input
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="Inserisci numero di contatto"
          />
        </FormControl>
  
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Inserisci email"
          />
        </FormControl>
      </ModalBody>
  
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={handleSave}>
          Salva
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Annulla
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  
  );
};

export default EditModal;
