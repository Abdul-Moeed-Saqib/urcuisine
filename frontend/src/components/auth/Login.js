import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, Heading, Input, FormControl, FormLabel, Text, VStack, FormErrorMessage } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });

    if (!credentials.email || !credentials.password) {
      setErrors({
        email: !credentials.email ? 'Email is required.' : '',
        password: !credentials.password ? 'Password is required.' : ''
      });
      return;
    }

    try {
      await login(credentials);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: 'Failed to log in. Please try again.' });
      }
    }
  };

  return (
    <Box
      minW="500px" 
      maxW="600px" 
      mx="auto"
      mt={10}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white">
      <Heading mb={6} textAlign="center" fontWeight="bold" color="teal.500">
        Log In
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              focusBorderColor="teal.400"
              borderColor="gray.300"
              _hover={{ borderColor: 'teal.500' }}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              focusBorderColor="teal.400"
              borderColor="gray.300"
              _hover={{ borderColor: 'teal.500' }}
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          {errors.general && <Text color="red.500">{errors.general}</Text>}
          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            width="full"
            mt={4}>
            Log In
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;