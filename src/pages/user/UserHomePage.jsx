import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Text,
  HStack,
  VStack,
  useBreakpointValue,
  Spinner,
  Flex,
  Image,
  Skeleton,
} from "@chakra-ui/react";

import {
  MdSearch,
  MdEvent,
  MdMovie,
  MdMusicNote,
  MdSportsSoccer,
  MdLocalOffer,
  MdEngineering,
} from "react-icons/md";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api_link } from "../../helper/urls";
import NavbarComponent from "./NavbarComponent";

const categories = [
  { label: "All", icon: MdLocalOffer, value: "all" },
  { label: "Education", icon: MdMovie, value: "education" },
  { label: "Concerts", icon: MdMusicNote, value: "concert" },
  { label: "Sports", icon: MdSportsSoccer, value: "sports" },
  { label: "Festivals", icon: MdEvent, value: "festival" },
  { label: "Workshops", icon: MdEngineering, value: "workshop" },
];

const bannerImages = ["/banner1.jpg", "/banner2.png", "/banner3.png"];

const UserHomePage = () => {
  const navTo = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const debounceRef = useRef(null);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const getBannerUrl = (url) => {
    if (typeof url === "string" && url.startsWith("http")) return url;
    if (typeof url === "string" && url.startsWith("/")) return url;
    return "/fallback-event.jpg";
  };

  const fetchEvents = async (
    pageNumber = 0,
    reset = false,
    search = "",
    category = ""
  ) => {
    try {
      if (pageNumber === 0) setInitialLoading(true);
      setIsFetchingMore(true);

      const res = await axios.get(`${api_link}/public/user/event`, {
        params: {
          page: pageNumber,
          size: 5,
          search: search.trim(),
          category: category === "all" ? "" : category,
        },
        headers: {
          Authorization: `Bearer ${localStorage["token"]}`,
        },
      });

      const newEvents = res.data.content || [];
      setEvents((prev) => (reset ? newEvents : [...prev, ...newEvents]));
      setPage(res.data.number + 1);
      setHasMore(!res.data.last);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      navTo("/user/login");
    } finally {
      setIsFetchingMore(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(0, true, searchTerm, selectedCategory);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPage(0);
      setHasMore(true);
      fetchEvents(0, true, searchTerm, selectedCategory);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;

      if (bottom && hasMore && !isFetchingMore) {
        fetchEvents(page, false, searchTerm, selectedCategory);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, isFetchingMore, searchTerm, selectedCategory]);

  const bannerSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: !isMobile,
    adaptiveHeight: true,
  };

  return (
    <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={6} bg={"white"}>
      <NavbarComponent />
      <Heading
        my={6}
        fontWeight="extrabold"
        fontSize={{ base: "2xl", md: "4xl" }}
        textAlign="center"
      >
        Welcome to EventHub
      </Heading>

      {/* Banner Carousel */}
      <Box
        mb={10}
        borderRadius="md"
        overflow="hidden"
        boxShadow="xl"
        maxH={{ base: "220px", md: "420px" }}
      >
        <Slider {...bannerSettings}>
          {bannerImages.map((img, idx) => (
            <Box key={idx} height={{ base: "220px", md: "420px" }}>
              <Image
                src={img}
                alt={`Banner ${idx + 1}`}
                objectFit="cover"
                width="100%"
                height="100%"
                loading="lazy"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
                fallbackSrc="/fallback-event.jpg"
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Search & Filter */}
      <HStack
        spacing={4}
        mb={8}
        flexDir={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
        justifyContent="center"
      >
        <InputGroup maxW={{ base: "100%", md: "400px" }}>
          <InputLeftElement pointerEvents="none" children={<MdSearch />} />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            bg="white"
            borderRadius="md"
          />
        </InputGroup>

        <Select
          maxW={{ base: "100%", md: "220px" }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          size="md"
          bg="white"
          borderRadius="md"
        >
          {categories.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </HStack>

      {/* Categories */}
      <Flex
        mb={8}
        overflowX="auto"
        css={{ "&::-webkit-scrollbar": { display: "none" } }}
        py={2}
        gap={6}
        justifyContent="center"
      >
        {categories.map(({ label, icon: Icon, value }) => (
          <VStack
            key={value}
            minW="80px"
            cursor="pointer"
            color={selectedCategory === value ? "teal.500" : "gray.600"}
            onClick={() => setSelectedCategory(value)}
            _hover={{ color: "teal.600" }}
          >
            <Icon size={28} />
            <Text fontSize="sm" fontWeight="semibold">
              {label}
            </Text>
          </VStack>
        ))}
      </Flex>

      {/* Events Grid */}
      {initialLoading ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} mb={8}>
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              p={4}
              borderRadius="md"
              boxShadow="md"
              bg="white"
              height="320px"
            >
              <Skeleton height="180px" mb={4} borderRadius="md" />
              <Skeleton height="24px" width="70%" mb={2} />
              <Skeleton height="18px" width="50%" />
            </Box>
          ))}
        </SimpleGrid>
      ) : events.length === 0 ? (
        <Text textAlign="center" fontSize="xl" color="gray.500" my={10}>
          No events found.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} mb={4}>
          {events.map((event) => (
            <Box
              key={event.id}
              p={4}
              borderRadius="md"
              boxShadow="md"
              bg="white"
              _hover={{ boxShadow: "xl" }}
              cursor="pointer"
              transition="box-shadow 0.3s"
              onClick={() => {
                navTo(`/event/${event.id}`);
              }}
            >
              <Box height="180px" mb={4} overflow="hidden" borderRadius="md">
                <Image
                  src={getBannerUrl(event.imgUrl)}
                  alt={event.title || "Event banner"}
                  objectFit="cover"
                  width="100%"
                  height="100%"
                  fallbackSrc="/fallback-event.jpg"
                  loading="lazy"
                  transition="transform 0.3s"
                  _hover={{ transform: "scale(1.05)" }}
                />
              </Box>
              <Heading fontSize="xl" mb={2} noOfLines={1} color="teal.600">
                {event.title || "Unnamed Event"}
              </Heading>
              <Text fontSize="sm" color="gray.600" noOfLines={2}>
                {event.description || "No description available."}
              </Text>
              <Text fontSize="sm" mt={2} color="gray.500" fontWeight="medium">
                {event.startTime
                  ? new Date(event.startTime).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Date not set"}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Infinite Scroll Loading Spinner */}
      {isFetchingMore && !initialLoading && (
        <Flex justify="center" my={6}>
          <Spinner size="lg" color="teal.500" thickness="4px" />
        </Flex>
      )}
    </Box>
  );
};

export default UserHomePage;
