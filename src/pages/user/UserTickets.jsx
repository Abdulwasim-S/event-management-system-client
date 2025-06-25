import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  SimpleGrid,
  Heading,
  VStack,
  Spinner,
  useToast,
  Flex,
  Badge,
} from "@chakra-ui/react";
import axios from "axios";
import { api_link } from "../../helper/urls";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navTo = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${api_link}/bookings/my-tickets`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTickets(res.data.data);
      } catch (err) {
        toast({
          title: "Failed to load tickets",
          description: err.response?.data?.message || "Server Error",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Box p={6} bg={"purple.50"} minH={"100vh"}>
      <Navbar />
      <Heading mb={6} textAlign="center" mt={5} color={"pink.500"}>
        🎟️ Your Tickets 🎟️
      </Heading>
      <IoIosArrowRoundBack
        size={"50px"}
        cursor={"pointer"}
        onClick={() => {
          navTo(-1);
        }}
      />

      {tickets.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No confirmed tickets found.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={6} mt={5}>
          {tickets.map((ticket) => (
            <Box
              key={ticket.ticketId}
              bg="white"
              borderRadius="md"
              boxShadow="lg"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
            >
              <Image
                src={ticket.imgUrl}
                alt="Event banner"
                height="150px"
                width="100%"
                objectFit="cover"
              />
              <VStack align="start" p={4} spacing={2}>
                <Heading size="md">{ticket.eventTitle}</Heading>
                <Badge colorScheme="teal">Ticket ID: {ticket.ticketId}</Badge>
                <Text fontSize="sm" color="gray.600">
                  Event ID: {ticket.eventId}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Location: {ticket.location}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Start Time: {new Date(ticket.startTime).toLocaleString()}
                </Text>
                <Text fontSize="sm">Name: {ticket.attendeeName}</Text>
                <Text fontSize="sm">Email: {ticket.attendeeEmail}</Text>

                <Image
                  src={ticket.qrCode}
                  alt="QR Code"
                  boxSize="120px"
                  objectFit="contain"
                  border="1px solid #ccc"
                  borderRadius="md"
                />
                <small>
                  Please present this QR code at the entrance. Thank you😇
                </small>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default UserTickets;
