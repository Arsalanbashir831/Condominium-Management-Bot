import { Box, Button, Container, FormControl, FormLabel, Input, Stack, Text, useToast, Spinner, Center } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { BACKEND_URL } from '../Constant';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Track loading state

  const onSubmit = async (data) => {
    setLoading(true); // Set loading to true when form is submitted
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();

        toast({
          title: 'Login Effettuato',
          description: 'Accesso eseguito con successo.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem('authToken', responseData.token);
        navigate('/ticketList');
      } else {
        const errorData = await response.json();
        toast({
          title: 'Accesso Fallito',
          description: errorData.message || "Si è verificato un errore durante l'accesso.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore imprevisto. Riprova.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };

  return (
    <Container centerContent>
      <Box
        mt={10}
        p={8}
        borderRadius="md"
        boxShadow="lg"
        bg="white"
        width={'100%'}
        borderWidth="1px"
      >
        <Stack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold" color="#292828" textAlign={'center'}>
            Gestione del Condominio
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email è richiesta' })}
                  borderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password è richiesta' })}
                  borderColor="blue.500"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                disabled={loading} // Disable button and show spinner when loading
                loadingText="Accedendo"
              >
                Accedi
              </Button>
            </Stack>
          </form>
        </Stack>
        {loading && (
          <Center mt={4}>
            <Spinner size="xl" color="blue.500" />
          </Center>
        )}
      </Box>
    </Container>
  );
};

export default Login;
