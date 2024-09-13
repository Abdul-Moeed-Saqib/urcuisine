import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Flex
      as="footer"
      justifyContent="center"
      alignItems="center"
      p={4}
      bg="teal.500"
      color="white"
      mt="auto" 
      w="100%"
    >
      <Text>© 2024 UrCuisine. All rights reserved. | Developed by SQ Corp</Text>
    </Flex>
  );
};

export default Footer;