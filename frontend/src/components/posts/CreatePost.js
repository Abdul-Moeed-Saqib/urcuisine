import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Heading,
  Text,
  Flex,
  VStack,
  Divider,
  useToast
} from '@chakra-ui/react';
import countryList from 'country-list';
import axios from 'axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    recipe: [],
    country: '',
  });
  const [recipeValue, setRecipValue] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRecipeChange = (e) => {
    setRecipValue(e.target.value);
  };

  const handleRecipeKeyPress = (e) => {
    if (e.key === 'Enter' && recipeValue.trim() !== '') {
      e.preventDefault();
      setFormData((prevData) => ({
        ...prevData,
        recipe: [...prevData.recipe, recipeValue.trim()],
      }));
      setRecipValue('');
    }
  };

  const removeRecipeTag = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      recipe: prevData.recipe.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to create a post');
      return;
    }

    if (formData.recipe.length < 3) {
      toast({
        title: 'Please add at least 3 recipes before creating the post.',
        position: "top",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const postData = { ...formData, recipe: formData.recipe.join(', ') }; // array to string

    try {
      const response = await axios.post('/posts', postData, { withCredentials: true });
      const createdPostId = response.data.ID; 
      
      toast({
        title: 'Post created successfully!',
        position: "top",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      navigate(`/post/${createdPostId}`); 
    } catch (error) {
      console.error('Error creating post', error);
    }
  };

  return (
    <Flex maxW="6xl" mx="auto" mt="10" p="6" direction={{ base: 'column', lg: 'row' }} gap={8}>
      <Box flex="1" p="6" borderWidth="1px" borderRadius="lg" boxShadow="md">
        <Heading as="h2" size="lg" mb="6" textAlign="center">
          Show your own dish to the world!!!
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="title" mb="4" isRequired>
            <FormLabel>Title</FormLabel>
            <Input type="text" name="title" value={formData.title} onChange={handleChange} />
          </FormControl>

          <FormControl id="description" mb="4" isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea type="text" name="description" value={formData.description} onChange={handleChange} />
          </FormControl>

          <FormControl id="video_url" mb="4">
            <FormLabel>Video URL</FormLabel>
            <Input type="url" name="video_url" value={formData.video_url} onChange={handleChange} />
          </FormControl>

          <FormControl id="recipe" mb="4">
            <FormLabel>Recipe</FormLabel>
            <Input
              placeholder="Add ingredients or steps and press Enter..."
              value={recipeValue}
              onChange={handleRecipeChange}
              onKeyPress={handleRecipeKeyPress}
            />
            <Wrap mt="2">
              {formData.recipe.map((tag, index) => (
                <WrapItem key={index}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="teal">
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => removeRecipeTag(index)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </FormControl>

          <FormControl id="country" mb="4" isRequired>
            <FormLabel>Country</FormLabel>
            <Select name="country" value={formData.country} onChange={handleChange}>
              <option value="">Select a country</option>
              {countryList.getData().map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" colorScheme="teal" mt="4" width="full">
            Create Post
          </Button>
        </form>
      </Box>

      <VStack flex="1" align="start" spacing={4} p="6" borderWidth="1px" borderRadius="lg" boxShadow="md">
        <Heading as="h3" size="md">Create Your Own Dish</Heading>
        <Text>Welcome! Here you can share your own culinary creations with the world.</Text>
        <Divider />
        <Text>Instructions:</Text>
        <Text>- Fill out the details of your dish, including a title, description, and recipe.</Text>
        <Text>- Use the recipe field to enter ingredients or steps, pressing Enter to create a tag.</Text>
        <Text>- Be creative, but keep it clean! Inappropriate content will be removed, and your account will get banned.</Text>
      </VStack>
    </Flex>
  );
};

export default CreatePost;