import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text, Image, Spinner } from '@chakra-ui/react';

const PostList = ({ posts }) => {
  return (
    <Box p={5}>
    <Text fontSize="2xl" fontWeight="bold" textAlign="center">
      Popular Dishes
    </Text>
    <Flex wrap="wrap" justify="center" gap={5} mt={5}>
      {posts.map((post) => (
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
        >
          <Image
            src={post.VideoURL} 
            alt={post.title}
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