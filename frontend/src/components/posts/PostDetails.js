import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Box, Button, Text, Heading, Textarea, VStack } from '@chakra-ui/react';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
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

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment on this post');
      return;
    }

    try {
      const response = await axios.post(`/posts/${id}/comments`, {
        text: commentText,
        userID: user.id,
      });
      setPost((prevPost) => ({
        ...prevPost,
        Comments: [...prevPost.Comments, response.data],
      }));
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Box>
      <Heading>{post.Title}</Heading>
      <Text mt={4}>{post.Description}</Text>

      {/* Recipe Section */}
      <Box mt={6}>
        <Heading size="md">Recipe:</Heading>
        <Text mt={2}>{post.Recipe}</Text>
      </Box>

      <Button onClick={handleLike} colorScheme="teal" mt={4}>
        Like
      </Button>

      {/* Comments Section */}

      {user ? (
        <Box as="form" onSubmit={handleComment} mt={4}>
          <Textarea
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            mb={2}
          />
          <Button type="submit" colorScheme="blue">
            Add Comment
          </Button>
        </Box>
      ) : (
        <Text mt={4}>Please log in to comment</Text>
      )}

      <Box mt={6}>
        <Heading size="md">Comments:</Heading>
        {post.Comments.length > 0 ? (
          <VStack align="start" spacing={4} mt={2}>
            {post.Comments.map((comment, index) => (
              <Box key={index} p={3} shadow="md" borderWidth="1px" borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  {comment.Name} - {new Date(comment.Created * 1000).toLocaleString()}
                </Text>
                <Text mt={1}>{comment.Text}</Text>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text>No comments yet. Be the first to comment!</Text>
        )}
      </Box>
    </Box>
  );
};

export default PostDetails;