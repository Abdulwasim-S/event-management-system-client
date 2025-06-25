import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
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
  Flex,
  Stack,
  useDisclosure,
  Spinner,
  Center,
  useToast,
  Textarea,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Alert,
  AlertIcon,
  NumberInput,
  NumberInputField,
  Select,
  InputGroup,
  InputLeftElement,
  Text, // Added Text for showing total elements
} from "@chakra-ui/react";
import {
  FaEdit,
  FaTrash,
  FaTag,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaUsers,
  FaFileAlt,
  FaImage,
  FaStream,
  FaList,
  FaRupeeSign,
} from "react-icons/fa";
import dayjs from "dayjs";
import axios from "axios";
import AddEventDrawer from "./AddEventDrawer";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce"; // New import for debouncing search input
import { api_link } from "../../helper/urls";

const AdminEventList = () => {
  const [events, setEvents] = useState([]);
  // We no longer need filteredEvents state as filtering is done on the backend
  // const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({ name: "", location: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const toast = useToast();
  const [eventToDelete, setEventToDelete] = useState(null);
  const navTo = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Debounced filter values for search
  // This helps prevent too many API calls while the user is typing
  const [debouncedName] = useDebounce(filters.name, 500);
  const [debouncedLocation] = useDebounce(filters.location, 500);
  const [debouncedDate] = useDebounce(filters.date, 500);

  // useEffect to fetch events based on pagination and filter changes
  useEffect(() => {
    // We pass currentPage (0-indexed) and itemsPerPage (size) to the backend
    fetchEvents(
      currentPage,
      itemsPerPage,
      debouncedName,
      debouncedLocation,
      debouncedDate
    );
  }, [
    currentPage,
    itemsPerPage,
    debouncedName,
    debouncedLocation,
    debouncedDate,
  ]); // Dependencies for refetching

  // No longer need applyFilters or the useEffects related to it
  // useEffect(() => {
  //   applyFilters();
  // }, [filters, events]);

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [filters, events]);

  const fetchEvents = useCallback(
    async (page, size, name, location, date) => {
      try {
        setLoading(true);
        // Construct query parameters for the backend
        const params = new URLSearchParams({
          page: page,
          size: size,
        });

        if (name) params.append("name", name);
        if (location) params.append("location", location);
        if (date) params.append("date", date);

        const res = await axios.get(
          `${api_link}/admin/event?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Update state with data from the backend's Page object
        setEvents(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
        // Ensure currentPage state is aligned with the backend's returned page number
        // This is important if backend adjusts page number (e.g., if requesting page 10 but only 5 exist)
        setCurrentPage(res.data.number);
      } catch (error) {
        console.error("Error fetching events:", error);
        if (error.response?.status === 401) {
          toast({
            title: "Login Required",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          navTo("/admin/login");
        } else {
          toast({
            title: "Error fetching events.",
            description:
              error.response?.data?.message || "Please try again later.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [api_link, navTo, toast] // Dependencies for useCallback
  );

  // Removed client-side applyFilters as it's now handled by the backend
  // const applyFilters = () => {
  //   const filtered = events.filter((event) => {
  //     const nameMatch = event.title
  //       .toLowerCase()
  //       .includes(filters.name.toLowerCase());
  //     const locationMatch = event.location
  //       .toLowerCase()
  //       .includes(filters.location.toLowerCase());
  //     const dateMatch = filters.date
  //       ? dayjs(event.startTime).format("YYYY-MM-DD") === filters.date
  //       : true;
  //     return nameMatch && locationMatch && dateMatch;
  //   });
  //   setFilteredEvents(filtered);
  // };

  const isPastEvent = (startTime) => dayjs(startTime).isBefore(dayjs());

  const handleEditClick = (event) => {
    console.log(event);
    setSelectedEvent({
      ...event,
      description: event.description || "",
      imgUrl: event.imgUrl || "",
      category: event.category || "",
      price: event.price || 0,
      maxAttendees: event.maxAttendees || 1,
      // Format to "YYYY-MM-DDTHH:mm" for datetime-local input
      startTime: dayjs(event.startTime).format("YYYY-MM-DDTHH:mm"),
      endTime: dayjs(event.endTime).format("YYYY-MM-DDTHH:mm"),
    });
    setEditError("");
    onEditOpen();
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    try {
      setActionLoading(true);
      await axios.delete(`${api_link}/admin/event/${eventToDelete.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast({
        title: "Event deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      // After deleting, refetch events to update the list, staying on the current page
      // The backend will re-calculate total elements and pages.
      fetchEvents(
        currentPage,
        itemsPerPage,
        debouncedName,
        debouncedLocation,
        debouncedDate
      );
    } catch (error) {
      toast({
        title: "Delete failed.",
        description:
          error.response?.data?.message || "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const validateEditForm = () => {
    if (!selectedEvent) {
      setEditError("No event selected for editing.");
      return false;
    }
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
    } = selectedEvent;
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
      setEditError("Please fill all required fields correctly.");
      return false;
    }
    if (dayjs(startTime).isAfter(dayjs(endTime))) {
      setEditError("End time cannot be before start time.");
      return false;
    }
    setEditError("");
    return true;
  };

  const handleUpdate = async () => {
    if (!validateEditForm()) return;
    try {
      setActionLoading(true);

      const updatedEventData = {
        ...selectedEvent,
        startTime: new Date(selectedEvent.startTime).toISOString(),
        endTime: new Date(selectedEvent.endTime).toISOString(),
        price: parseFloat(selectedEvent.price),
        maxAttendees: parseInt(selectedEvent.maxAttendees, 10),
      };
      await axios.put(`${api_link}/admin/event`, updatedEventData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast({
        title: "Event updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onEditClose();
      // After updating, refetch events
      fetchEvents(
        currentPage,
        itemsPerPage,
        debouncedName,
        debouncedLocation,
        debouncedDate
      );
    } catch (error) {
      setEditError(
        error.response?.data?.message ||
          "An unexpected error occurred during update."
      );
      toast({
        title: "Update failed.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleChange = (e) => {
    setSelectedEvent({ ...selectedEvent, [e.target.name]: e.target.value });
  };

  const handleNumberChange = (name, value) => {
    setSelectedEvent((prev) => ({ ...prev, [name]: value }));
  };

  // When a filter changes, we reset the page to 0 (first page)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(0); // Reset to first page on filter change
  };

  // Pagination controls
  const goToPage = (page) => {
    // Ensure the page is within valid bounds (0 to totalPages - 1)
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Box p={[4, 6, 8]}>
      <Heading mb={6} fontSize={["2xl", "3xl", "4xl"]}>
        Admin - Event Management
      </Heading>

      {/* Filters */}
      <Flex
        mb={6}
        gap={4}
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex gap={5} flexWrap="wrap">
          <InputGroup maxW="200px">
            <InputLeftElement
              pointerEvents="none"
              children={<FaTag color="gray" />}
            />
            <Input
              placeholder="Search by Name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </InputGroup>

          <InputGroup maxW="200px">
            <InputLeftElement
              pointerEvents="none"
              children={<FaMapMarkerAlt color="gray" />}
            />
            <Input
              placeholder="Search by Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </InputGroup>

          <InputGroup maxW="200px">
            <InputLeftElement
              pointerEvents="none"
              children={<FaCalendarAlt color="gray" />}
            />
            <Input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </InputGroup>
        </Flex>

        <AddEventDrawer
          onEventAdded={() =>
            fetchEvents(
              currentPage,
              itemsPerPage,
              debouncedName,
              debouncedLocation,
              debouncedDate
            )
          }
        />
      </Flex>

      {loading ? (
        <Center>
          <Spinner size="xl" color="blue.500" />
        </Center>
      ) : (
        <Box
          overflowX="auto"
          borderRadius="md"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
        >
          <Table variant="striped" size={{ base: "sm", md: "md" }}>
            <Thead bg="gray.100">
              <Tr>
                <Th>Title</Th>
                <Th>Location</Th>
                <Th>Start</Th>
                <Th>End</Th>
                <Th>Category</Th>
                <Th isNumeric>Price</Th>
                <Th isNumeric>Max Attendees</Th>
                <Th>Actions</Th>
                <Th>Bookings</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.length === 0 ? (
                <Tr>
                  <Td
                    colSpan={8}
                    textAlign="center"
                    py={6}
                    fontStyle="italic"
                    color="gray.600"
                  >
                    No events found.
                  </Td>
                </Tr>
              ) : (
                events.map((event) => {
                  const disabled = isPastEvent(event.startTime);
                  return (
                    <Tr key={event.id}>
                      <Td>{event.title}</Td>
                      <Td>{event.location}</Td>
                      <Td>
                        {dayjs(event.startTime).format("YYYY-MM-DD HH:mm")}
                      </Td>
                      <Td>{dayjs(event.endTime).format("YYYY-MM-DD HH:mm")}</Td>
                      <Td>{event.category}</Td>
                      <Td isNumeric>
                        {event.price ? `₹${event.price.toFixed(2)}` : "Free"}
                      </Td>
                      <Td isNumeric>{event.maxAttendees}</Td>
                      <Td minW="140px" gap={2} h={"100%"}>
                        <Flex justifyContent={"space-evenly"} gap={3}>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleEditClick(event)}
                            isDisabled={disabled || actionLoading}
                            leftIcon={<FaEdit />}
                            flex={1}
                            _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                            _hover={{ bg: disabled ? undefined : "blue.600" }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDeleteClick(event)}
                            isDisabled={disabled || actionLoading}
                            leftIcon={<FaTrash />}
                            flex={1}
                            _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                            _hover={{ bg: disabled ? undefined : "red.600" }}
                          >
                            Delete
                          </Button>
                        </Flex>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="teal"
                          onClick={() => navTo(`/admin/event/${event.id}`)}
                          isDisabled={disabled || actionLoading}
                          leftIcon={<FaList />}
                          flex={1}
                          _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                          _hover={{ bg: disabled ? undefined : "teal.600" }}
                        >
                          View
                        </Button>
                      </Td>
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>

          {/* Pagination Controls */}
          {totalElements > 0 && (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              px={4}
              py={3}
              borderTop="1px solid"
              borderColor="gray.200"
            >
              <Text fontSize="sm" color="gray.600">
                Showing {events.length} of {totalElements} results
              </Text>
              <Flex gap={2}>
                <Button
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  isDisabled={currentPage === 0 || loading} // Disable if on first page or loading
                >
                  Previous
                </Button>
                {/* Render page numbers dynamically */}
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    size="sm"
                    onClick={() => goToPage(i)}
                    colorScheme={currentPage === i ? "blue" : "gray"}
                    isDisabled={loading}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  isDisabled={currentPage === totalPages - 1 || loading} // Disable if on last page or loading
                >
                  Next
                </Button>
              </Flex>
            </Flex>
          )}
        </Box>
      )}

      {/* Edit Drawer (No changes needed here as it only handles a single event) */}
      {selectedEvent && (
        <Drawer
          isOpen={isEditOpen}
          placement="left"
          onClose={onEditClose}
          size="lg"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Edit Event</DrawerHeader>
            <DrawerBody>
              <Stack spacing={5}>
                {editError && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {editError}
                  </Alert>
                )}
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<FaTag color="gray" />}
                    />
                    <Input
                      name="title"
                      value={selectedEvent.title}
                      onChange={handleChange}
                      placeholder="Event Title"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<FaFileAlt color="gray" />}
                    />
                    <Textarea
                      name="description"
                      value={selectedEvent.description}
                      onChange={handleChange}
                      placeholder="Event Description"
                      resize="vertical"
                      minH="100px"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<FaMapMarkerAlt color="gray" />}
                    />
                    <Input
                      name="location"
                      value={selectedEvent.location}
                      onChange={handleChange}
                      placeholder="Event Location"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Image URL</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<FaImage color="gray" />}
                    />
                    <Input
                      name="imgUrl"
                      value={selectedEvent.imgUrl}
                      onChange={handleChange}
                      placeholder="Image URL"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Start Time</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<FaCalendarAlt color="gray" />}
                    />
                    <Input
                      name="startTime"
                      type="datetime-local"
                      value={selectedEvent.startTime}
                      onChange={handleChange}
                      placeholder="Start Time"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>End Time</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<FaClock color="gray" />}
                    />
                    <Input
                      name="endTime"
                      type="datetime-local"
                      value={selectedEvent.endTime}
                      onChange={handleChange}
                      placeholder="End Time"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<FaStream color="gray" />}
                    />
                    <Select
                      name="category"
                      value={selectedEvent.category}
                      onChange={handleChange}
                      placeholder="Select Category"
                    >
                      <option value="">Select Category</option>
                      <option value="education">Education</option>
                      <option value="workshop">Workshop</option>
                      <option value="education">Seminar</option>
                      <option value="concert">Concert</option>
                      <option value="sports">Sports</option>
                    </Select>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<FaRupeeSign color="gray" />}
                    />
                    <NumberInput
                      min={0}
                      value={selectedEvent.price}
                      onChange={(valueString) =>
                        handleNumberChange("price", parseFloat(valueString))
                      }
                      precision={2}
                      step={0.5}
                      clampValueOnBlur={false}
                    >
                      <NumberInputField placeholder="Price" />
                    </NumberInput>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Max Attendees</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<FaUsers color="gray" />}
                    />
                    <NumberInput
                      min={1}
                      value={selectedEvent.maxAttendees}
                      onChange={(valueString) =>
                        handleNumberChange(
                          "maxAttendees",
                          parseInt(valueString)
                        )
                      }
                      step={1}
                      clampValueOnBlur={false}
                    >
                      <NumberInputField placeholder="Max Attendees" />
                    </NumberInput>
                  </InputGroup>
                </FormControl>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px" gap={3}>
              <Button
                variant="outline"
                onClick={onEditClose}
                isDisabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleUpdate}
                isLoading={actionLoading}
              >
                Update
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* Delete Confirmation Modal (No changes needed here) */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the event{" "}
            <Text as="span" fontWeight="bold">
              {eventToDelete?.title}
            </Text>
            ?
          </ModalBody>

          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={onDeleteClose}
              isDisabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={confirmDelete}
              isLoading={actionLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminEventList;
