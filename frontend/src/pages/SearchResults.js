import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Text, VStack } from '@chakra-ui/react';

const SearchResults = () => {
  const { query } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/posts/search/${query}`);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching search results', error);
      }
    };
    fetchPosts();
  }, [query]);

  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4}>
        Search Results for "{query}"
      </Text>
      <VStack spacing={4} align="stretch">
        {posts.map((post) => (
          <Box key={post.id} p={4} shadow="md" borderWidth="1px" borderRadius="lg">
            <Text fontSize="xl" fontWeight="bold">
              {post.Title}
            </Text>
            <Text mt={2}>{post.Description}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default SearchResults;