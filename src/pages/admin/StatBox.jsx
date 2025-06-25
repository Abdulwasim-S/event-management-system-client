import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

const StatBox = ({
  label,
  value,
  icon: IconComponent,
  iconColor = "teal.500",
}) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Stat
      p={5}
      borderRadius="lg"
      boxShadow="lg"
      bg={bg}
      border="1px"
      borderColor={borderColor}
    >
      <Flex align="center" mb={2}>
        <Box
          bg={useColorModeValue("gray.100", "gray.700")}
          borderRadius="full"
          p={3}
          mr={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <IconComponent size={24} color={iconColor} />
        </Box>
        <StatLabel fontSize="md" color="gray.600">
          {label}
        </StatLabel>
      </Flex>
      <StatNumber fontSize="2xl" fontWeight="bold" color="teal.500">
        {value}
      </StatNumber>
    </Stat>
  );
};

export default StatBox;
