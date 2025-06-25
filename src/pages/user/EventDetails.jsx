import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  Stack,
  Image,
  Spinner,
  useToast,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BookingForm from "./BookingForm";
import { api_link } from "../../helper/urls";
import { IoIosArrowRoundBack } from "react-icons/io";

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const navTo = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${api_link}/public/user/data/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage["token"]}`,
          },
        });
        setEvent(res.data.data);
      } catch (error) {
        toast({
          title: "Error fetching event",
          description: error.response?.data?.message || "Something went wrong",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, toast]);

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="xl" color="red.400">
          Event not found.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      w={"100%"}
      minH={"100vh"}
      bgGradient="linear(to-br,orange.500, purple.500, green.500)"
      bgImage={"/background.jpg"}
      bgBlendMode={"lighten"}
    >
      <Box maxW="6xl" mx="auto" p={5}>
        <Stack
          direction={["column", "row"]}
          spacing={10}
          bg={"white"}
          mt={10}
          borderRadius={"md"}
          overflow={"hidden"}
        >
          <Image
            src={event.imgUrl}
            alt={event.title}
            objectFit="cover"
            w="100%"
            maxW="500px"
          />
          <Box p={3} h={"100%"} w={"100%"}>
            <IoIosArrowRoundBack
              cursor={"pointer"}
              size={"40px"}
              onClick={() => {
                navTo(-1);
              }}
            />
            <Heading my={3} color={"teal"}>
              {event.title}
            </Heading>
            <Text fontSize="md" fontStyle={"italic"} mb={2}>
              <strong>Start :</strong>{" "}
              {new Date(event.startTime).toLocaleString("en-IN")}
            </Text>
            <Text fontSize="md" fontStyle={"italic"} mb={2}>
              <strong>End :</strong>{" "}
              {new Date(event.endTime).toLocaleString("en-IN")}
            </Text>
            <Text fontSize="md" fontStyle={"italic"} mb={2}>
              <strong>Location :</strong> {event.location}
            </Text>
            <Text fontSize="md" fontStyle={"italic"} mb={4}>
              <strong>Price :</strong> ₹{event.price}
            </Text>
            <Text fontStyle={"italic"} color={"gray.500"}>
              {event.description}
            </Text>
            <BookingForm eventId={event.id} eventPrice={event.price} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default EventDetail;
