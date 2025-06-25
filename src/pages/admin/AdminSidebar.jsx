import React from "react";
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Flex,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiHome,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiClipboard,
} from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";

const sidebarItems = [
  { label: "Dashboard", icon: FiHome, path: "/admin/dashboard" },
  { label: "Events", icon: FiCalendar, path: "/admin/events" },
  // { label: "Bookings", icon: FiClipboard, path: "/admin/bookings" },
  { label: "Users", icon: FiUsers, path: "/admin/users" },
  { label: "Logout", icon: FiLogOut, path: "/logout" },
];

const SidebarContent = ({ onClose }) => {
  const location = useLocation();
  const activeBg = useColorModeValue("blue.50", "blue.700");
  const activeColor = useColorModeValue("blue.600", "white");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <VStack spacing={1} align="stretch" mt={4} px={4}>
      {sidebarItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <ChakraLink
            as={NavLink}
            to={item.path}
            key={item.label}
            onClick={onClose}
            _hover={{ textDecoration: "none", bg: hoverBg }}
            bg={isActive ? activeBg : "transparent"}
            color={isActive ? activeColor : "inherit"}
            fontWeight={isActive ? "semibold" : "normal"}
            borderRadius="md"
            px={3}
            py={2}
            display="flex"
            alignItems="center"
            gap={3}
          >
            <Icon as={item.icon} boxSize={5} />
            <Text>{item.label}</Text>
          </ChakraLink>
        );
      })}
    </VStack>
  );
};

const AdminSidebar = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sidebarBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box minH="100vh">
      {/* Mobile Nav */}
      <Flex
        display={{ base: "flex", md: "none" }}
        px={4}
        py={3}
        align="center"
        justify="space-between"
        borderBottom="1px"
        borderColor={borderColor}
        bg={sidebarBg}
        position="sticky"
        top={0}
        zIndex={1000}
      >
        <IconButton
          aria-label="Open menu"
          icon={<FiMenu />}
          variant="ghost"
          onClick={onOpen}
        />
        <Text fontSize="xl" fontWeight="bold" color="blue.500">
          EventAdmin
        </Text>
      </Flex>

      {/* Desktop Sidebar */}
      <Box
        w="250px"
        position="fixed"
        h="full"
        bg={sidebarBg}
        borderRight="1px"
        borderColor={borderColor}
        display={{ base: "none", md: "block" }}
      >
        <Flex
          align="center"
          justify="center"
          py="5"
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <Text fontSize="2xl" fontWeight="bold" color="blue.500">
            EventAdmin
          </Text>
        </Flex>
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent bg={sidebarBg}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <SidebarContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Page Content */}
      <Box ml={{ base: 0, md: "250px" }} p={4}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminSidebar;
