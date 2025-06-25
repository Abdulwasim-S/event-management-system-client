import React, { useState } from "react";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Alert,
  AlertIcon,
  Stack,
  useToast,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { api_link } from "../../helper/urls";

const AddEventButton = ({ onEventAdded }) => {
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    imgUrl: "",
    startTime: "",
    endTime: "",
    category: "",
    price: 0,
    maxAttendees: 1,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name, value) => {
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDemoFill = () => {
    const now = new Date();
    const later = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    const toInputFormat = (date) => date.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm

    setEventData({
      title: "AI Bootcamp 2025",
      description: "A beginner-friendly AI and ML bootcamp with live coding.",
      location: "Chennai Tech Park",
      startTime: toInputFormat(now),
      endTime: toInputFormat(later),
      category: "Workshop",
      price: 499,
      maxAttendees: 100,
    });
  };

  const validateForm = () => {
    const {
      title,
      description,
      location,
      startTime,
      endTime,
      category,
      price,
      maxAttendees,
    } = eventData;

    if (
      !title ||
      !description ||
      !location ||
      !startTime ||
      !endTime ||
      !category ||
      price < 0 ||
      maxAttendees < 1
    ) {
      setError("Please fill all fields correctly.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axios.post(`${api_link}/admin/event`, eventData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onConfirmClose();
      onFormClose();
      onEventAdded?.();
      toast({
        title: "Event Created",
        description: `The event "${eventData.title}" has been added successfully.`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      // Reset form
      setEventData({
        title: "",
        description: "",
        location: "",
        imgUrl: "",
        startTime: "",
        endTime: "",
        category: "",
        price: 0,
        maxAttendees: 1,
      });
    } catch (err) {
      setError("Error creating event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button colorScheme="teal" onClick={onFormOpen}>
        Add Event
      </Button>

      {/* Event Form Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="startTime"
                  value={eventData.startTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="endTime"
                  value={eventData.endTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  value={eventData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="education">Education</option>
                  <option value="workshop">Workshop</option>
                  <option value="education">Seminar</option>
                  <option value="concert">Concert</option>
                  <option value="sports">Sports</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <NumberInput
                  min={0}
                  value={eventData.price}
                  onChange={(value) =>
                    handleNumberChange("price", parseFloat(value))
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Max Attendees</FormLabel>
                <NumberInput
                  min={1}
                  value={eventData.maxAttendees}
                  onChange={(value) =>
                    handleNumberChange("maxAttendees", parseInt(value))
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <HStack>
              <Button colorScheme="blue" onClick={onConfirmOpen}>
                Submit
              </Button>
              <Button variant="outline" onClick={handleDemoFill}>
                Add Demo Values
              </Button>
            </HStack>
            <Button onClick={onFormClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Event Creation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to create the event{" "}
            <strong>{eventData.title}</strong>?
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Submitting"
            >
              Confirm
            </Button>
            <Button onClick={onConfirmClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddEventButton;
