import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Text } from '@chakra-ui/react';

const PostList = ({ posts }) => {
  return (
    <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="6">
      {posts.map((post) => (
        <Box key={post.id} p="4" borderWidth="1px" borderRadius="lg" boxShadow="md">
          <Link to={`/post/${post.id}`}>
            <Text fontSize="xl" fontWeight="bold">
              {post.title}
            </Text>
            <Text>Likes: {post.likes}</Text>
            <Text>Dislikes: {post.dislikes}</Text>
          </Link>
        </Box>
      ))}
    </Grid>
  );
};

export default PostList;