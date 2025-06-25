import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Heading,
  useToast,
  Button,
  Flex,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { api_link } from "../../helper/urls";

const AdminBookingsList = () => {
  const { eventId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const [confirmed, setConfirmed] = useState(0);
  const [pending, setPending] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const toast = useToast();
  const navTo = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${api_link}/admin/event/${eventId}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage["token"]}`,
          },
        }
      );
      const data = res.data.data;
      setBookings(data.bookings);
      setPending(data.pendingCount);
      setCancelled(data.cancelledCount);
      setConfirmed(data.confirmedCount);
      setTotalBookings(data.totalBookings);
      setTotalRevenue(data.totalRevenue);
    } catch (err) {
      toast({
        title: "Error fetching bookings",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [page]);

  const totalPages = Math.ceil(totalBookings / limit);

  return (
    <Box maxW="7xl" mx="auto" mt={10} px={{ base: 4, md: 6 }} py={5}>
      <Flex gap={1}>
        <IoIosArrowRoundBack
          cursor={"pointer"}
          fontSize={"40px"}
          onClick={() => {
            navTo(-1);
          }}
        />
        <Heading size="lg" mb={6}>
          Booking Summary
        </Heading>
      </Flex>

      {/* Summary Cards */}
      <Box
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
        mb={8}
        bg="gray.50"
      >
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={4}>
          {[
            { label: "Total Bookings", value: totalBookings, color: "#3182ce" },
            { label: "Confirmed", value: confirmed, color: "#38a169" },
            { label: "Pending", value: pending, color: "#d69e2e" },
            { label: "Cancelled", value: cancelled, color: "#e53e3e" },
            {
              label: "Total Revenue",
              value: `₹${totalRevenue}`,
              color: "#805ad5",
            },
          ].map((item, index) => (
            <Box
              key={index}
              p={4}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              borderLeft={`5px solid ${item.color}`}
            >
              <Text fontSize="sm" color="gray.500">
                {item.label}
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                {item.value}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Bookings Table */}
      <Box overflowX="auto">
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Attendee</Th>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>Booked At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr key={booking.id}>
                <Td>{booking.attendeeName}</Td>
                <Td>{booking.attendeeEmail}</Td>
                <Td>{booking.status}</Td>
                <Td>{new Date(booking.bookedAt).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {loading && (
        <Box textAlign="center" mt={4}>
          <Spinner />
        </Box>
      )}

      {/* Pagination */}
      <Flex
        justifyContent="center"
        mt={6}
        gap={4}
        flexWrap="wrap"
        alignItems="center"
      >
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          isDisabled={page === 0 || loading}
        >
          Previous
        </Button>
        <Text>
          Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
        </Text>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          isDisabled={page >= totalPages - 1 || loading}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default AdminBookingsList;
