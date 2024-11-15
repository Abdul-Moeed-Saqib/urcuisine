import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, Text, HStack, VStack, Center, Spinner } from '@chakra-ui/react';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import axios from 'axios';

const CountryPosts = () => {
    const { country } = useParams();
    const [posts, setPosts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`/posts/country/${country}`)
            .then((response) => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching country posts", error);
                setLoading(false);
            });
    }, [country]);

    const next = () => setCurrentIndex((prevIndex) => Math.min(prevIndex + 4, posts.length - 4));
    const prev = () => setCurrentIndex((prevIndex) => Math.max(prevIndex - 4, 0));

    if (loading) {
        return (
            <Center height="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <Box p={6} display="flex" flexDirection="column" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                Posts from {country}
            </Text>

            {posts && posts.length > 0 ? (
                <Box position="relative" maxWidth="800px" width="100%">
                    <HStack spacing={4} overflow="hidden" justifyContent="center">
                        {posts.slice(currentIndex, currentIndex + 4).map((post, index) => (
                            <Link to={`/post/${post.ID}`} key={post.ID} style={{ textDecoration: 'none' }}>
                                <VStack p={4} bg="gray.100" borderRadius="md" w="200px" h="150px" boxShadow="md" _hover={{ bg: "gray.200" }}>
                                    <Text fontWeight="bold">{post.Title}</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        by: {post.UserName}
                                    </Text>
                                    <Text fontSize="xs" color="gray.400">
                                        {formatDistanceToNow(fromUnixTime(post.CreatedAt))} ago
                                    </Text>
                                </VStack>
                            </Link>
                        ))}
                    </HStack>

                    {currentIndex > 0 && (
                        <Button
                            onClick={prev}
                            position="absolute"
                            left="0"
                            top="50%"
                            transform="translateY(-50%)"
                            bg="white"
                            boxShadow="md"
                            _hover={{ bg: "gray.200" }}
                            zIndex="1"
                        >
                            {"<"}
                        </Button>
                    )}
                    {currentIndex + 4 < posts.length && (
                        <Button
                            onClick={next}
                            position="absolute"
                            right="0"
                            top="50%"
                            transform="translateY(-50%)"
                            bg="white"
                            boxShadow="md"
                            _hover={{ bg: "gray.200" }}
                            zIndex="1"
                        >
                            {">"}
                        </Button>
                    )}
                </Box>
            ) : (
                <Text>No posts available for this country.</Text>
            )}
        </Box>
    );
};

export default CountryPosts;