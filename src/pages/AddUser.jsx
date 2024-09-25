import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [apartment, setApartment] = useState("");
  const [CondominiumId, setCondominiumId] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !email ||
      !name ||
      !surname ||
      !apartment ||
      !CondominiumId ||
      !contactNumber
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace with your actual API call
      const response = await fetch("https://your-api-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          surname,
          apartment,
          CondominiumId,
          contactNumber,
        }),
      });

      if (response.ok) {
        setErrorMessage("");
        toast({
          title: "User Added",
          description: "The user has been successfully added.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        // Clear form fields
        setEmail("");
        setName("");
        setSurname("");
        setApartment("");
        setCondominiumId("");
        setContactNumber("");
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage("An error occurred while creating the user.");
    }

    setIsSubmitting(false);
  };

  return (
    <Box py={10}>
      <Box
        maxW="lg"
        mx="auto"
        p={8}
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
      >
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
          Add User
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user's email"
                focusBorderColor="blue.500"
              />
            </FormControl>

            <SimpleGrid columns={[1, 2]} spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter first name"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Surname</FormLabel>
                <Input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Enter surname"
                  focusBorderColor="blue.500"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl isRequired>
              <FormLabel>Apartment</FormLabel>
              <Input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="Enter apartment number"
                focusBorderColor="blue.500"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Condominium ID</FormLabel>
              <Input
                type="text"
                value={CondominiumId}
                onChange={(e) => setCondominiumId(e.target.value)}
                placeholder="Enter Condominium ID"
                focusBorderColor="blue.500"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Contact Number</FormLabel>
              <Input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter contact number"
                focusBorderColor="blue.500"
              />
            </FormControl>

            {errorMessage && (
              <Text color="red.500" fontSize="sm" textAlign="center">
                {errorMessage}
              </Text>
            )}

            <Button
              type="submit"
              colorScheme="blue"
              w="full"
              isLoading={isSubmitting}
              loadingText="Adding User..."
            >
              Add User
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default AddUser;
