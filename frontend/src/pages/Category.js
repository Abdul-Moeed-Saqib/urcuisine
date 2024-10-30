import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Box, Text } from '@chakra-ui/react';

// World Map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const Category = () => {
  const navigate = useNavigate();
  const [hoveredCountry, setHoveredCountry] = React.useState('');

  return (
    <Box p={6} position="relative">
      <Text fontSize="xx-large" fontWeight="bold" mb={4}>
        Select a Country
      </Text>

      {hoveredCountry && (
        <Box
          position="fixed"
          bottom="65px"
          left="50px"
          p={6}
          bg="teal.500"
          color="white"
          borderRadius="md"
          boxShadow="lg"
          fontSize="2xl"
          fontWeight="bold"
          zIndex="10"
        >
          {hoveredCountry}
        </Box>
      )}

      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => {
                  const { name } = geo.properties;
                  setHoveredCountry(name);
                }}
                onMouseLeave={() => {
                  setHoveredCountry('');
                }}
                onClick={() => navigate(`/posts/country/${geo.properties.name}`)}
                style={{
                  default: { fill: "#D6D6DA", outline: "none" },
                  hover: { fill: "#F53", outline: "none" },
                  pressed: { fill: "#E42", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </Box>
  );
};

export default Category;