import React from 'react';
import { Flex, Box, Button, Spacer, Heading, Link, Text, Spinner} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, loading } = useAuth();

  return (
    <Flex bg="teal.500" p="4" color="white" align="center">
      <Box>
        <Heading size="md">
          <Link as={RouterLink} to="/">
            UrCuisine
          </Link>
        </Heading>
      </Box>
      <Spacer />
      {loading ? (
        <Spinner color="white" />
      ) : user ? (
        <Flex alignItems="center">
          <Button as={RouterLink} to="/create" colorScheme="green" mr="4">
            Create Post
          </Button>
         <Text mr={4}>Welcome, {user.name}!</Text>
         <Button colorScheme="red" onClick={logout}>
           Logout
         </Button>
       </Flex>
      ) : (
        <>
          <Button as={RouterLink} to="/login" colorScheme="teal" mr="4">
            Login
          </Button>
          <Button as={RouterLink} to="/signup" colorScheme="green">
            Signup
          </Button>
        </>
      )}
    </Flex>
  );
};

export default Header;