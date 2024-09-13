import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Box, Button, Text, Heading, Textarea, VStack, HStack, Divider, Flex, Image } from '@chakra-ui/react';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post details', error);
      }
    };

    const fetchRelatedPosts = async () => {
      try {
        const response = await axios.get(`/posts/${id}/related`);
        setRelatedPosts(response.data);
      } catch (error) {
        console.error('Error fetching related posts', error);
      }
    };

    fetchPost();
    fetchRelatedPosts();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like this post');
      return;
    }
    
  };

  const handleDislike = async () => {
    if (!user) {
      alert('Please log in to dislike this post');
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
    <Flex direction={{ base: 'column', lg: 'row' }} p={8} gap={8}>
      
      <Box flex="3">
        <Heading mb={2}>{post.Title}</Heading>
        <Text fontSize="lg" color="gray.600" mb={4}>{post.Description}</Text>

        
        <Box mt={4}>
          <Heading size="md" mb={2}>Recipe:</Heading>
          <Text>{post.Recipe}</Text>
        </Box>

        
        <HStack spacing={4} mt={6}>
          <Button onClick={handleLike} colorScheme="teal">
            Like {post.Likes}
          </Button>
          <Button onClick={handleDislike} colorScheme="red">
            Dislike {post.Dislikes}
          </Button>
        </HStack>

       
        <Box mt={8}>
          <Heading size="md" mb={4}>Comments:</Heading>

          {user ? (
            <Box as="form" onSubmit={handleComment} mb={4}>
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
            <Text>Please log in to comment</Text>
          )}

          <Divider my={4} />

          {post.Comments != null && post.Comments.length > 0 ? (
            <VStack align="start" spacing={4} mt={2} w="full">
              {post.Comments.map((comment, index) => (
                <Flex
                  key={index}
                  p={3}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="md"
                  w="full"
                  direction="column"
                  alignItems="flex-start" // Ensures details are on the left
                >
                  <Text fontSize="sm" color="gray.600">
                    {comment.Name} - {new Date(comment.Created * 1000).toLocaleString()}
                  </Text>
                  <Text mt={1}>{comment.Text}</Text>
                </Flex>
              ))}
            </VStack>
          ) : (
            <Text>No comments yet. Be the first to comment!</Text>
          )}
        </Box>
      </Box>

      <Box flex="1" pl={{ base: 0, lg: 4 }}>
        <Heading size="md" mb={4}>Related Dishes:</Heading>
        {relatedPosts.length > 0 ? (
          relatedPosts.map((relatedPost) => (
            <HStack
              key={relatedPost.id}
              p={3}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              mb={4}
              cursor="pointer"
              onClick={() => window.location.href = `/post/${relatedPost.ID}`}
            >
              <Image
                src={relatedPost.thumbnailUrl || 'https://via.placeholder.com/100'}
                alt={relatedPost.Title}
                boxSize="100px"
                borderRadius="md"
                objectFit="cover"
              />
              <Box>
                <Text fontWeight="bold">{relatedPost.Title}</Text>
                <Text fontSize="sm" color="gray.600">{relatedPost.Country}</Text>
              </Box>
            </HStack>
          ))
        ) : (
          <Text>No related dishes found.</Text>
        )}
      </Box>
    </Flex>
  );
};

export default PostDetails;