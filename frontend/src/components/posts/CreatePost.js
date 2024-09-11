import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import TagsInput from '@chakra-ui/tag'; 
import countryList from 'country-list'; 
import axios from 'axios';

const CreatePost = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    recipe: [],
    country: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRecipeChange = (tags) => {
    setFormData({ ...formData, recipe: tags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to create a post');
      return;
    }

    // Convert recipe tags array to a comma-separated string
    const postData = { ...formData, recipe: formData.recipe.join(', ') };

    try {
      await axios.post('/posts', postData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post', error);
    }
  };

  return (
    <Box maxW="lg" mx="auto" mt="10" p="6" borderWidth="1px" borderRadius="lg" boxShadow="md">
      <form onSubmit={handleSubmit}>
        <FormControl id="title" mb="4" isRequired>
          <FormLabel>Title</FormLabel>
          <Input type="text" name="title" value={formData.title} onChange={handleChange} />
        </FormControl>

        <FormControl id="description" mb="4" isRequired>
          <FormLabel>Description</FormLabel>
          <Input type="text" name="description" value={formData.description} onChange={handleChange} />
        </FormControl>

        <FormControl id="video_url" mb="4">
          <FormLabel>Video URL</FormLabel>
          <Input type="url" name="video_url" value={formData.video_url} onChange={handleChange} />
        </FormControl>

        <FormControl id="recipe" mb="4" isRequired>
          <FormLabel>Recipe</FormLabel>
          <TagsInput
            value={formData.recipe}
            onChange={handleRecipeChange}
            placeholder="Add recipe steps or ingredients..."
          />
        </FormControl>

        <FormControl id="country" mb="4" isRequired>
            <FormLabel>Country</FormLabel>
            <Select name="country" value={formData.country} onChange={handleChange}>
                <option value="">Select a country</option>
                {countryList.map((country) => (
                <option key={country} value={country}>
                    {country}
                </option>
                ))}
            </Select>
        </FormControl>

        <Button type="submit" colorScheme="teal" mt="4">
          Create Post
        </Button>
      </form>
    </Box>
  );
};

export default CreatePost;