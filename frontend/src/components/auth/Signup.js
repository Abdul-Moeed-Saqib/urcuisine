import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, Heading, Input, FormControl, FormLabel, Text, VStack, FormErrorMessage } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ name: '', email: '', password: '' });

    if (!credentials.name) {
      setErrors((prev) => ({ ...prev, name: 'Name is required.' }));
    }
    if (!credentials.email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required.' }));
    }
    if (!credentials.password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required.' }));
    }

    if (!credentials.name || !credentials.email || !credentials.password) {
      return;
    }

    try {
      await signup(credentials);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        const { email, password, name } = err.response.data;
        setErrors({
          name: name || '',
          email: email || '',
          password: password || '',
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          general: 'Failed to sign up. Please try again.'
        }));
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
        Sign Up
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={credentials.name}
              onChange={handleChange}
              focusBorderColor="teal.400"
              borderColor="gray.300"
              _hover={{ borderColor: 'teal.500' }}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
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
          {errors.form && <Text color="red.500">{errors.form}</Text>}
          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            _hover={{ bg: 'teal.600' }}
            _active={{ bg: 'teal.700' }}
            isDisabled={!credentials.name || !credentials.email || !credentials.password}
          >
            Sign Up
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Signup;