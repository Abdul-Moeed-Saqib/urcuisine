import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Flex,
  Button,
  Input,
  Textarea,
  Heading,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  useToast,
  Text,
  Divider,
} from '@chakra-ui/react';

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [recipeValue, setRecipeValue] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        const { post: postData } = response.data;

        setPost(postData);
        setTags(postData.Recipe ? postData.Recipe.split(',') : []);
      } catch (error) {
        console.error('Error fetching post details', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleRecipeChange = (e) => {
    setRecipeValue(e.target.value);
  };

  const handleRecipeKeyPress = (e) => {
    if (e.key === 'Enter' && recipeValue.trim() !== '') {
      setTags([...tags, recipeValue.trim()]);
      setRecipeValue('');
    }
  };

  const removeRecipeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to create a post');
      return;
    }

    if (tags.length < 3) {
      toast({
        title: 'Please add at least 3 recipes before creating the post.',
        position: "top",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.put(`/posts/${id}`, { ...post, Recipe: tags.join(', ') });
      toast({ title: 'Post updated!', status: 'success', duration: 3000 });
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post', error);
      toast({ title: 'Error updating post!', status: 'error', duration: 3000 });
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Flex justifyContent="center" alignItems="center" minHeight="100vh" bg="gray.100" p={6}>
      <Box
        w={{ base: '95%', md: '90%', lg: '70%' }}
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="2xl"
        display="flex"
        flexDirection={{ base: 'column', lg: 'row' }}
        gap={8}
      >
        <VStack spacing={6} align="stretch" flex="1" p={4}>
          <Heading size="lg" textAlign="center" color="teal.600">
            Edit your post!!!
          </Heading>
          <Divider borderColor="gray.300" />
          <FormControl id="title" isRequired>
            <FormLabel fontWeight="bold">Title</FormLabel>
            <Input
              name="Title"
              value={post.Title || ''}
              onChange={handleInputChange}
              placeholder="Enter the dish title"
              size="lg"
              focusBorderColor="teal.500"
            />
          </FormControl>
          <FormControl id="description" isRequired>
            <FormLabel fontWeight="bold">Description</FormLabel>
            <Textarea
              name="Description"
              value={post.Description || ''}
              onChange={handleInputChange}
              placeholder="Describe your dish"
              size="lg"
              focusBorderColor="teal.500"
              rows={5}
            />
          </FormControl>
          <FormControl id="recipe">
            <FormLabel fontWeight="bold">Recipe</FormLabel>
            <Input
              placeholder="Add ingredients or steps and press Enter..."
              value={recipeValue}
              onChange={handleRecipeChange}
              onKeyPress={handleRecipeKeyPress}
              size="lg"
              focusBorderColor="teal.500"
            />
            <Wrap mt="2">
              {tags.map((tag, index) => (
                <WrapItem key={index}>
                  <Tag size="lg" borderRadius="full" variant="solid" colorScheme="teal">
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => removeRecipeTag(index)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </FormControl>
          <Button onClick={handleUpdatePost} colorScheme="teal" size="lg" width="full">
            Update Post
          </Button>
        </VStack>

        <Box flex="1" p={6} bg="gray.50" borderRadius="md" boxShadow="md">
          <Heading size="md" mb={4} color="teal.600">
            Instructions
          </Heading>
          <Text fontSize="md" color="gray.700" lineHeight="tall">
            <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
              <li>Fill in the Title and Description fields with details about your dish.</li>
              <li>
                Add each ingredient or step for your recipe by typing in the Recipe field and
                pressing Enter.
              </li>
              <li>
                Click on the button to save the changes and update your post details.
              </li>
              <li>Ensure all fields are correctly filled before updating.</li>
            </ul>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default UpdatePost;