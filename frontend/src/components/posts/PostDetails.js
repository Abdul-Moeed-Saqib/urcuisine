import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Box, Button, Text, Heading, Textarea, VStack, HStack, Divider, Flex, Image, useToast } from '@chakra-ui/react';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        const { post: postData, likesList, dislikeList } = response.data;

        if (user) {
          const liked = likesList?.includes(id);
          const disliked = dislikeList?.includes(id);

          setLiked(liked);
          setDisliked(disliked);

          postData.Comments = postData.Comments?.sort((a, b) => {
            if (a.UserID === user.id) return -1;
            if (b.UserID === user.id) return 1;
    
            return new Date(b.Created * 1000) - new Date(a.Created * 1000);
          });

          setPost(postData)
        } else {
          setPost(response.data);
        }
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
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'Like this post?',
        description: "Please log in to like this post.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return;
    }

    const wasLiked = liked;
    const wasDisliked = disliked;
    setLiked(!liked);
    setDisliked(false);
    setPost((prevPost) => ({
      ...prevPost,
      Likes: liked ? prevPost.Likes - 1 : prevPost.Likes + 1,
      Dislikes: disliked ? prevPost.Dislikes - 1 : prevPost.Dislikes,
    }));

    try {
      const response = await axios.post(`/posts/${id}/like`, {}, { withCredentials: true });

      setLiked(!liked);
      setDisliked(false);
      setPost((prevPost) => ({
        ...prevPost,
        Likes: response.data.likes,
        Dislikes: response.data.dislikes,
      }));
    } catch (error) {
      console.error('Error liking post', error);

      setLiked(wasLiked);
      setDisliked(wasDisliked);
      setPost((prevPost) => ({
        ...prevPost,
        Likes: wasLiked ? prevPost.Likes + 1 : prevPost.Likes - 1,
        Dislikes: wasDisliked ? prevPost.Dislikes + 1 : prevPost.Dislikes,
      }));
    }
  };

  const handleDislike = async () => {
    if (!user) {
      toast({
        title: 'Dislike this post?',
        description: "Please log in to dislike this post.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return;
    }

    const wasLiked = liked;
    const wasDisliked = disliked;
    setDisliked(!disliked);
    setLiked(false);
    setPost((prevPost) => ({
      ...prevPost,
      Dislikes: disliked ? prevPost.Dislikes - 1 : prevPost.Dislikes + 1,
      Likes: liked ? prevPost.Likes - 1 : prevPost.Likes,
    }));

    try {
      const response = await axios.post(`/posts/${id}/dislike`, {}, { withCredentials: true });

      setPost((prevPost) => ({
        ...prevPost,
        Likes: response.data.likes,
        Dislikes: response.data.dislikes,
      }));
    } catch (error) {
      console.error('Error disliking post', error);

      setDisliked(wasDisliked);
      setLiked(wasLiked);
      setPost((prevPost) => ({
        ...prevPost,
        Dislikes: wasDisliked ? prevPost.Dislikes + 1 : prevPost.Dislikes - 1,
        Likes: wasLiked ? prevPost.Likes + 1 : prevPost.Likes - 1,
      }));
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
        text: commentText
      }, {
        withCredentials: true
      });

      setPost((prevPost) => ({
        ...prevPost,
        Comments: [response.data, ...(prevPost.Comments || [])],
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
          <Button onClick={handleLike} colorScheme={liked ? 'teal' : 'gray'}>
            {liked ? 'Liked' : 'Like'} {post.Likes}
          </Button>
          <Button onClick={handleDislike} colorScheme={disliked ? 'red' : 'gray'}>
            {disliked ? 'Disliked' : 'Dislike'} {post.Dislikes}
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
              <Button type="submit" colorScheme="blue"  isDisabled={!commentText}>
                Add Comment
              </Button>
            </Box>
          ) : (
            <Text>Please log in to comment</Text>
          )}

          <Divider my={4} />

          {post.Comments && post.Comments.length > 0 ? (
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
                  alignItems="flex-start"
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
        {relatedPosts && relatedPosts.length > 0 ? (
          relatedPosts.map((relatedPost) => (
            <HStack
              key={relatedPost.ID}
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