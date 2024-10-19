import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text, Image, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const PostList = ({ posts }) => {
  const [startIndex, setStartIndex] = useState(0);
  const postsPerPage = 5; 

  const handleNext = () => {
    if (startIndex + postsPerPage < posts.length) {
      setStartIndex(startIndex + postsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - postsPerPage);
    }
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
        Check out these dishes
      </Text>

      <Flex justify="center" mt={4} align="center">
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Previous"
          onClick={handlePrev}
          isDisabled={startIndex === 0}
          mr={2}
        />
        <IconButton
          icon={<ChevronRightIcon />}
          aria-label="Next"
          onClick={handleNext}
          isDisabled={startIndex + postsPerPage >= posts.length}
          ml={2}
        />
      </Flex>

      <Flex wrap="nowrap" overflowX="auto" justify="center" gap={5} mt={5}>
        {posts.slice(startIndex, startIndex + postsPerPage).map((post) => (
          <Box
            key={post.ID}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={3}
            width="200px"
            cursor="pointer"
            as={Link}
            to={`/post/${post.ID}`}
            flex="0 0 auto"
          >
            <Image
              src={post.VideoURL} 
              alt={post.Title}
              fallbackSrc="https://via.placeholder.com/200"
            />
            <Text mt={2} fontWeight="bold" noOfLines={1}>
              {post.Title}
            </Text>
            <Text>Likes: {post.Likes}</Text>
            <Text>Dislikes: {post.Dislikes}</Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default PostList;