import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Box, Heading } from '@chakra-ui/react';
import PostList from '../components/posts/PostList';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Box p="6">
      <Heading mb="4">Welcome!</Heading>
      <PostList posts={posts} />
    </Box>
  );
};

export default Home;