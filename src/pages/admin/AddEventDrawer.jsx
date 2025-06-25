import React, { useState } from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  Select,
  useToast,
  Alert,
  AlertIcon,
  Stack,
  Box,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiMapPin,
  FiTag,
  FiUsers,
  FiDollarSign,
  FiEdit,
  FiInfo,
  FiImage,
} from "react-icons/fi";
import axios from "axios";
import { api_link } from "../../helper/urls";
import { FaRupeeSign } from "react-icons/fa";

const AddEventDrawer = ({ onEventAdded }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getNextMonthDemoDates = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 10, 0);
    const endTime = new Date(nextMonth);
    endTime.setHours(12);
    const formatDate = (date) => date.toISOString().slice(0, 16);
    return {
      startTime: formatDate(nextMonth),
      endTime: formatDate(endTime),
    };
  };

  const defaultDates = getNextMonthDemoDates();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    imgUrl: "",
    startTime: defaultDates.startTime,
    endTime: defaultDates.endTime,
    category: "",
    price: 0,
    maxAttendees: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name, value) => {
    setEventData((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const fillDemoValues = () => {
    const { startTime, endTime } = getNextMonthDemoDates();
    setEventData({
      title: "Tech Conference 2025",
      description: "A conference about emerging tech trends.",
      location: "Chennai Trade Centre",
      imgUrl:
        "https://img.freepik.com/premium-vector/digital-marketing-isometric-illustration-template_9209-2935.jpg",
      startTime,
      endTime,
      category: "education",
      price: 1500,
      maxAttendees: 200,
    });
  };

  const validateForm = () => {
    const {
      title,
      description,
      location,
      imgUrl,
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
      !imgUrl ||
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
    console.log(eventData);
    try {
      await axios.post(`${api_link}/admin/event`, eventData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onClose();
      onEventAdded?.();
      toast({
        title: "Event Created",
        description: `"${eventData.title}" has been added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setEventData({
        title: "",
        description: "",
        location: "",
        imgUrl: "",
        ...getNextMonthDemoDates(),
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
      <Box display="flex" gap={4} flexWrap="wrap">
        <Button colorScheme="blue" onClick={onOpen}>
          Add New Event
        </Button>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add New Event</DrawerHeader>

          <DrawerBody>
            <Stack spacing={4}>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiEdit />
                  </InputLeftElement>
                  <Input
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    placeholder="Event title"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiInfo />
                  </InputLeftElement>
                  <Input
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    placeholder="Event description"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiMapPin />
                  </InputLeftElement>
                  <Input
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    placeholder="Event location"
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Event Image URL</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiImage />
                  </InputLeftElement>
                  <Input
                    name="imgUrl"
                    value={eventData.imgUrl}
                    onChange={handleChange}
                    placeholder="URL (Ex: https://www.site.com/image.jpg)"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Start Time</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiCalendar />
                  </InputLeftElement>
                  <Input
                    type="datetime-local"
                    name="startTime"
                    value={eventData.startTime}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>End Time</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiCalendar />
                  </InputLeftElement>
                  <Input
                    type="datetime-local"
                    name="endTime"
                    value={eventData.endTime}
                    onChange={handleChange}
                  />
                </InputGroup>
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
                  <option value="sports">Sports</option>
                  <option value="concert">Concert</option>
                  <option value="festival">Festivals</option>
                  <option value="workshop">Workshop</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FaRupeeSign />
                  </InputLeftElement>
                  <NumberInput
                    min={0}
                    value={eventData.price}
                    onChange={(val) => handleNumberChange("price", val)}
                  >
                    <NumberInputField pl={"2rem"} />
                  </NumberInput>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Max Attendees</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiUsers />
                  </InputLeftElement>
                  <NumberInput
                    min={1}
                    value={eventData.maxAttendees}
                    onChange={(val) => handleNumberChange("maxAttendees", val)}
                  >
                    <NumberInputField pl={"2rem"} />
                  </NumberInput>
                </InputGroup>
              </FormControl>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Submitting"
            >
              Create Event
            </Button>
            <Button
              onClick={fillDemoValues}
              mr={3}
              variant={"outline"}
              colorScheme="blue"
            >
              Demo Fill
            </Button>
            <Button variant="outline" onClick={onClose} colorScheme="yellow">
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddEventDrawer;
