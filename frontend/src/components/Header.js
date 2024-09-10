import React from 'react';
import { Flex, Box, Button, Spacer, Heading, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

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
      {user ? (
        <Button onClick={logout} colorScheme="red">
          Logout
        </Button>
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