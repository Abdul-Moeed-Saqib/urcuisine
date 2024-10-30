import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Spacer,
  VStack,
  Input,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  DrawerCloseButton,
  Spinner,
} from '@chakra-ui/react';
import { SearchIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, loading } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
    }
  };

  return (
    <Box bg="teal.600" p={4} color="white">
      <Flex as="header" alignItems="center">
        <IconButton
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          size="lg"
          colorScheme="teal"
          mr={4}
          onClick={onOpen}
        />

        <Heading as="h1" size="lg" color="white">
        <RouterLink to="/">UrCuisine</RouterLink>
        </Heading>

        <Spacer />
        <Input
          placeholder="Search recipes..."
          maxW="500px"
          bg="white"
          color="black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <IconButton
          icon={<SearchIcon />}
          aria-label="Search"
          colorScheme="teal"
          onClick={handleSearch}
          ml={2}
        />

        <Spacer />
        {loading ? (
          <Spinner color="white" />
        ) : user ? (
          <Flex alignItems="center">
            <Button as={RouterLink} to="/create" colorScheme="green" mr={4}>
              Create Post
            </Button>
            <Text mr={4}>Welcome, {user.name}!</Text>
            <Button colorScheme="red" onClick={logout}>
              Logout
            </Button>
          </Flex>
        ) : (
          <>
            <Button as={RouterLink} to="/login" colorScheme="teal" mr={4}>
              Login
            </Button>
            <Button as={RouterLink} to="/signup" colorScheme="green">
              Signup
            </Button>
          </>
        )}
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize="2xl" fontWeight="bold">
            Menu
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              <Button variant="ghost" width="100%" justifyContent="flex-start" onClick={() => navigate('/category')}>
                Category
              </Button>
              <Button variant="ghost" width="100%" justifyContent="flex-start">
                Another Option
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;