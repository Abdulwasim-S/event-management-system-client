import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  useToast,
  VStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api_link } from "../../helper/urls";

const BookingForm = ({ eventId, eventPrice }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ attendeeName: "", attendeeEmail: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    if (!form.attendeeName || !form.attendeeEmail) {
      setLoading(false);
      toast({
        title: "Missing Fields",
        description: "Please fill in both Name and Email to proceed.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${api_link}/bookings/create`,
        {
          eventId,
          attendeeName: form.attendeeName,
          attendeeEmail: form.attendeeEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { message, data } = response.data;
      const orderDetails = JSON.parse(data); // Razorpay order

      const res = await loadRazorpayScript();
      if (!res) {
        setLoading(false);
        toast({
          title: "Razorpay SDK failed to load",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const options = {
        key: "rzp_test_F66suPajOfS7iH", // Replace with your public Razorpay key
        amount: orderDetails.amount,
        currency: "INR",
        name: "Event Booking",
        description: "Ticket Purchase",
        order_id: orderDetails.id,
        prefill: {
          name: form.attendeeName,
          email: form.attendeeEmail,
        },
        theme: {
          color: "#319795", // Chakra UI teal
        },
        handler: async function (response) {
          try {
            toast({
              title: "Confirming your payment, please wait...",
              description: `Payment ID: ${response.razorpay_payment_id}`,
              status: "info",
              duration: 3000,
              isClosable: true,
            });
            await axios.post(
              `${api_link}/bookings/confirm`,
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                attendeeEmail: form.attendeeEmail,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            toast({
              title: "Payment Successful",
              description: `Booking confirmed. Payment ID: ${response.razorpay_payment_id}. Please check your email for the ticket.`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });

            navigate("/user/home");
          } catch (error) {
            toast({
              title: "Booking Confirm Failed",
              description:
                error.response?.data?.message ||
                "Payment done, but confirmation failed.",
              status: "error",
              duration: 4000,
              isClosable: true,
            });
          }
        },
        modal: {
          ondismiss: async function () {
            // Mark booking as cancelled on backend
            try {
              await axios.post(
                `${api_link}/bookings/cancel`,
                {
                  orderId: orderDetails.id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              setLoading(false);
              toast({
                title: "Payment Cancelled",
                description: "Your booking was cancelled.",
                status: "info",
                duration: 3000,
                isClosable: true,
              });
            } catch (err) {
              toast({
                title: "Cancellation Failed",
                description: "Something went wrong cancelling the booking.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setLoading(false);
      toast({
        title: "Booking Failed",
        description: err.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w={"100%"} mt={10} p={6}>
      <Heading size="md" mb={6} textAlign="center">
        Book Your Event
      </Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name="attendeeName"
            placeholder="Your Name"
            value={form.attendeeName}
            onChange={handleChange}
            isRequired
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            name="attendeeEmail"
            type="email"
            placeholder="Your Email"
            value={form.attendeeEmail}
            onChange={handleChange}
            isRequired
          />
        </FormControl>
        <Button
          colorScheme="teal"
          width="full"
          onClick={handleBooking}
          isDisabled={loading}
        >
          {loading ? <Spinner /> : "Book Now"}
        </Button>
      </VStack>
    </Box>
  );
};

export default BookingForm;
