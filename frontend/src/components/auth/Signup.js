import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, Heading, Input, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(credentials);
      navigate('/'); // Redirect to homepage after successful signup
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading mb={6}>Sign Up</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Name</FormLabel>
          <Input type="text" name="name" value={credentials.name} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={credentials.email} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={credentials.password} onChange={handleChange} required />
        </FormControl>
        {error && <Text color="red.500" mb={4}>{error}</Text>}
        <Button type="submit" colorScheme="teal" width="full">Sign Up</Button>
      </form>
    </Box>
  );
};

export default Signup;