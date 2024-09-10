import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Box, Button, Text, Heading } from '@chakra-ui/react';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post details', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like this post');
      return;
    }

  };

  const handleComment = async (comment) => {
    if (!user) {
      alert('Please log in to comment on this post');
      return;
    }

  };

  if (!post) return <div>Loading...</div>;

  return (
    <Box>
      <Heading>{post.title}</Heading>
      <Text>{post.description}</Text>
      <Button onClick={handleLike} colorScheme="teal" mt="4">
        Like
      </Button>
     
      <Box mt="6">
        {user ? (
          <form onSubmit={() => handleComment('Your comment text')}>
            <Button type="submit" colorScheme="blue">
              Comment
            </Button>
          </form>
        ) : (
          <Text>Please log in to comment</Text>
        )}
      </Box>
    </Box>
  );
};

export default PostDetails;