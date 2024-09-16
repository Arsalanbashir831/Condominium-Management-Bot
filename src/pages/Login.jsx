import { Box, Button, Container, FormControl, FormLabel, Input, Stack, Text, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { BACKEND_URL } from '../Constant';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
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
          title: 'Login Successful',
          description: 'You have successfully logged in.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem('authToken' , responseData.token)
        navigate('/ticketList'); 
      } else {
   
        const errorData = await response.json();
        toast({
          title: 'Login Failed',
          description: errorData.message || 'An error occurred during login.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    console.log(data);
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
           Condomium Management 
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  borderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  borderColor="blue.500"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
